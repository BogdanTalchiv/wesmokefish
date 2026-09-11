/**
 * Measures the real transfer weight of a page: the HTML plus every script it
 * references, gzipped, as the browser would receive it.
 *
 * Turbopack builds do not print a per-route JS table, and the size of
 * .next/static is misleading because it contains every route's chunks. This
 * reads the actual <script src> list out of the prerendered HTML.
 *
 * Run with: node scripts/qa-weight.mjs
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const APP = path.join(process.cwd(), ".next/server/app");
const STATIC = path.join(process.cwd(), ".next");

const PAGES = [
  ["Homepage", "ro.html"],
  ["All products", "ro/produse.html"],
  ["Collection", "ro/colectii/peste-si-fructe-de-mare-afumate.html"],
  ["Product", "ro/produse/yucola-somon.html"],
  ["Delivery", "ro/livrare.html"],
  ["Contact", "ro/contact.html"],
  ["Campaign", "ro/campanii/somon.html"],
];

function gz(buffer) {
  return zlib.gzipSync(buffer, { level: 9 }).length;
}

const rows = [];

for (const [label, file] of PAGES) {
  const full = path.join(APP, file);
  if (!fs.existsSync(full)) continue;

  const html = fs.readFileSync(full);
  const srcs = new Set(
    [...html.toString("utf8").matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1])
  );

  let js = 0;
  let missing = 0;
  for (const src of srcs) {
    const asset = path.join(STATIC, src.replace(/^\/_next\//, ""));
    if (fs.existsSync(asset)) js += gz(fs.readFileSync(asset));
    else missing += 1;
  }

  rows.push({
    label,
    htmlKb: +(gz(html) / 1024).toFixed(1),
    jsKb: +(js / 1024).toFixed(1),
    scripts: srcs.size,
    missing,
  });
}

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log("\nTransfer weight, gzipped (excludes images and fonts)\n");
console.log(`${pad("Page", 16)}${num("HTML", 9)}${num("JS", 9)}${num("Total", 9)}   scripts`);
console.log("-".repeat(60));

for (const r of rows) {
  const total = +(r.htmlKb + r.jsKb).toFixed(1);
  console.log(
    `${pad(r.label, 16)}${num(r.htmlKb + " KB", 9)}${num(r.jsKb + " KB", 9)}${num(total + " KB", 9)}   ${r.scripts}${r.missing ? `  (${r.missing} not found)` : ""}`
  );
}

/*
  Budget context.

  About 150 KB gzipped of the JS is the React 19 + Next App Router runtime,
  which is a fixed floor. The number worth watching is what the application
  adds on top of that, and whether any single route spikes.

  The contact page is deliberately heavier: it is the only route that loads
  React Hook Form and Zod, for a four-field validated form. Those libraries
  were removed from the footer newsletter precisely so they are not paid for
  site-wide.
*/
const FRAMEWORK_FLOOR_KB = 150;

const typical = rows.filter((r) => r.label !== "Contact");
const worst = Math.max(...typical.map((r) => r.htmlKb + r.jsKb));
const appCode = worst - FRAMEWORK_FLOOR_KB;

console.log(
  `\nHeaviest non-form page: ${worst.toFixed(1)} KB gzipped` +
    ` (~${FRAMEWORK_FLOOR_KB} KB React/Next runtime + ~${appCode.toFixed(0)} KB app).`
);
console.log(
  appCode < 130
    ? "App payload is within budget."
    : "App payload is over budget — run scripts/qa-bundle.mjs to attribute it."
);
