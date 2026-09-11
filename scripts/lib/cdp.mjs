/**
 * Minimal Chrome DevTools Protocol driver.
 *
 * Zero dependencies on purpose. The QA scripts need to drive a real browser at
 * eight viewport widths, and adding Puppeteer to devDependencies for that would
 * pull a ~170 MB Chromium download into a project that already has Chrome
 * installed. Node 25 ships a global `WebSocket`, which is the only piece that
 * was ever missing.
 *
 * Covers exactly what the audits need: launch, one page target, evaluate,
 * navigate with a load wait, viewport override, and console/error capture.
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

function findChrome() {
  const { existsSync } = require("node:fs");
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) throw new Error("Could not find a Chrome binary.");
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      /* browser not up yet */
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

export async function launchBrowser({ port = 9222 } = {}) {
  const { createRequire } = await import("node:module");
  globalThis.require ??= createRequire(import.meta.url);

  const profile = mkdtempSync(join(tmpdir(), "wsf-qa-"));
  const child = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--hide-scrollbars",
    ],
    { stdio: "ignore", detached: false },
  );

  const { webSocketDebuggerUrl } = await fetchJson(
    `http://127.0.0.1:${port}/json/version`,
  );
  const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find((t) => t.type === "page") ?? targets[0];

  const session = await connect(page.webSocketDebuggerUrl);

  return {
    session,
    async close() {
      session.socket.close();
      try {
        await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`);
      } catch {
        /* already gone */
      }
      child.kill();
      await sleep(300);
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {
        /* Windows sometimes holds the lock briefly */
      }
    },
    browserWsUrl: webSocketDebuggerUrl,
  };
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Map();

    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: ok, reject: fail } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) fail(new Error(msg.error.message));
        else ok(msg.result);
        return;
      }
      const handlers = listeners.get(msg.method);
      if (handlers) for (const h of handlers) h(msg.params);
    });

    socket.addEventListener("error", reject);

    socket.addEventListener("open", () => {
      const send = (method, params = {}) =>
        new Promise((ok, fail) => {
          const id = nextId++;
          pending.set(id, { resolve: ok, reject: fail });
          socket.send(JSON.stringify({ id, method, params }));
        });

      const on = (method, handler) => {
        if (!listeners.has(method)) listeners.set(method, []);
        listeners.get(method).push(handler);
      };

      resolve({ socket, send, on });
    });
  });
}

/** Evaluates an expression in the page and returns the value. */
export async function evaluate(session, expression) {
  const { result, exceptionDetails } = await session.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(
      exceptionDetails.exception?.description ?? exceptionDetails.text,
    );
  }
  return result.value;
}

/** Navigates and resolves once the load event has fired and the page is idle. */
export async function goto(session, url, { settleMs = 500 } = {}) {
  const loaded = new Promise((resolve) => {
    const off = (params) => {
      if (params.name === "load") resolve();
    };
    session.on("Page.lifecycleEvent", off);
  });
  await session.send("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
  await sleep(settleMs);
}

export async function setViewport(session, width, height, mobile) {
  await session.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
}

/**
 * Starts collecting console errors and uncaught exceptions.
 * Returns a function that drains everything captured so far.
 */
export async function captureErrors(session) {
  const found = [];
  session.on("Runtime.consoleAPICalled", ({ type, args }) => {
    if (type !== "error" && type !== "warning") return;
    const text = args
      .map((a) => a.value ?? a.description ?? a.unserializableValue ?? "")
      .join(" ");
    found.push({ level: type, text });
  });
  session.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    found.push({
      level: "exception",
      text:
        exceptionDetails.exception?.description ??
        exceptionDetails.text ??
        "unknown",
    });
  });
  session.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error") {
      found.push({ level: `log:${entry.source}`, text: entry.text });
    }
  });
  return () => found.splice(0, found.length);
}

export async function enableDomains(session) {
  await session.send("Page.enable");
  await session.send("Runtime.enable");
  await session.send("Log.enable");
  await session.send("Page.setLifecycleEventsEnabled", { enabled: true });
}
