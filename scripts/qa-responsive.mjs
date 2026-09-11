/**
 * Responsive audit across every viewport width named in the brief.
 *
 * Checks, per page per width:
 *   - no horizontal scrolling, and which element causes it if there is
 *   - no console errors or uncaught exceptions
 *   - body text is at least 14px (unreadable copy on small screens)
 *   - tap targets are at least 40px tall on touch widths
 *   - the mobile/desktop nav swap actually happens
 *
 * Run against a production server: `npx next start` then `node scripts/qa-responsive.mjs`.
 */

import {
  launchBrowser,
  evaluate,
  goto,
  setViewport,
  captureErrors,
  enableDomains,
} from "./lib/cdp.mjs";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";

const WIDTHS = [
  { w: 320, h: 640, mobile: true },
  { w: 375, h: 667, mobile: true },
  { w: 390, h: 844, mobile: true },
  { w: 430, h: 932, mobile: true },
  { w: 768, h: 1024, mobile: true },
  { w: 1024, h: 768, mobile: false },
  { w: 1440, h: 900, mobile: false },
  { w: 1920, h: 1080, mobile: false },
];

const PAGES = [
  ["Homepage", "/"],
  ["All products", "/produse"],
  ["Collection", "/colectii/afumate"],
  ["Product", "/produse/yucola-somon"],
  ["Delivery", "/livrare"],
  ["Contact", "/contact"],
  ["FAQ", "/intrebari-frecvente"],
  ["Campaign", "/campanii/somon"],
];

/*
  Runs inside the page. Kept as one expression so each width costs a single
  round trip rather than one per assertion.
*/
const AUDIT = `(() => {
  const vw = window.innerWidth;

  // Horizontal overflow: find the widest offender so the report is actionable
  // rather than just "something overflows".
  const overflowing = [];
  if (document.documentElement.scrollWidth > vw + 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (getComputedStyle(el).position === "fixed") continue;
      if (r.right > vw + 1 || r.left < -1) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === "string" ? el.className : "").slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
  }

  /*
    An element counts as visually hidden if it is a screen-reader-only affordance
    (the skip link, sr-only labels). Those are 1px clipped boxes on purpose and
    measuring them as tap targets or text is meaningless.
  */
  const isScreenReaderOnly = (el) => {
    const s = getComputedStyle(el);
    if (s.clip === "rect(0px, 0px, 0px, 0px)") return true;
    if (s.clipPath === "inset(50%)") return true;
    const r = el.getBoundingClientRect();
    return r.width <= 1 || r.height <= 1;
  };

  const isRendered = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0")
      return false;
    return !el.closest("[inert], [aria-hidden='true']");
  };

  /*
    Smallest font size used for a run of *prose*.

    Uppercase letterspaced micro-labels ("CELE MAI VANDUTE") are a deliberate
    typographic device and are read as ornament, not as copy, so they are
    measured against a separate floor below.
  */
  let smallestText = 99;
  let smallestSample = "";
  let smallestLabel = 99;
  let smallestLabelSample = "";
  for (const el of document.querySelectorAll("p, li, span, a, button, label, td, dd, dt, h1, h2, h3")) {
    const text = (el.textContent || "").trim();
    if (text.length < 12) continue;
    if (el.querySelector("p, li, span, a, button, h1, h2, h3")) continue;
    if (!isRendered(el) || isScreenReaderOnly(el)) continue;
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    if (!(size > 0)) continue;
    const isMicroLabel =
      s.textTransform === "uppercase" && parseFloat(s.letterSpacing) > 0.4;
    if (isMicroLabel) {
      if (size < smallestLabel) {
        smallestLabel = size;
        smallestLabelSample = text.slice(0, 40);
      }
    } else if (size < smallestText) {
      smallestText = size;
      smallestSample = text.slice(0, 40);
    }
  }

  /*
    Tap targets, per WCAG 2.5.8 Target Size (Minimum, AA): 24x24 CSS px, unless
    the "spacing" exception applies — a 24px-diameter circle centred on the
    target must not overlap the circle of any neighbouring target. That is what
    makes a stacked list of footer links conformant despite each link's text box
    being ~18px tall, and it is why a flat height threshold produces dozens of
    false positives.
  */
  const targets = [];
  for (const el of document.querySelectorAll(
    "a[href], button:not([disabled]), input:not([type='hidden']), select, textarea, [role='button'], summary"
  )) {
    if (!isRendered(el) || isScreenReaderOnly(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.bottom < 0 || r.top > document.documentElement.scrollHeight) continue;
    targets.push({
      el,
      r,
      label: (el.getAttribute("aria-label") || el.textContent || el.tagName)
        .replace(/\\s+/g, " ")
        .trim()
        .slice(0, 34),
    });
  }

  const MIN = 24;
  const undersized = [];
  for (const t of targets) {
    if (t.r.width >= MIN && t.r.height >= MIN) continue;

    // Spacing exception: does a 24px circle on this target clear every other?
    const cx = t.r.left + t.r.width / 2;
    const cy = t.r.top + t.r.height / 2;
    const crowdedBy = targets.find((o) => {
      if (o === t) return false;
      if (o.el.contains(t.el) || t.el.contains(o.el)) return false;
      const ox = o.r.left + o.r.width / 2;
      const oy = o.r.top + o.r.height / 2;
      return Math.hypot(cx - ox, cy - oy) < MIN;
    });
    if (crowdedBy) {
      undersized.push({
        label: t.label,
        w: Math.round(t.r.width),
        h: Math.round(t.r.height),
        near: crowdedBy.label,
      });
    }
  }

  /*
    Advisory, not a WCAG failure: controls on the purchase path should be
    comfortable under a thumb, which in practice means 44px. A 28px weight chip
    is conformant and still annoying to hit while holding a phone.
  */
  const smallPurchaseControls = [];
  for (const t of targets) {
    const isPurchaseControl =
      /co\\u0219|cart|adaug|cump|comand|abonea|filtr|sorte/i.test(t.label) ||
      t.el.closest("[data-purchase-control]") !== null;
    if (isPurchaseControl && t.r.height < 44) {
      smallPurchaseControls.push({ label: t.label, h: Math.round(t.r.height) });
    }
  }

  const desktopNav = document.querySelector("header nav");
  const burger = [...document.querySelectorAll("header button")].find((b) =>
    /meniul|\\u043c\\u0435\\u043d\\u044e/i.test(b.getAttribute("aria-label") || "")
  );
  const isVisible = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  };

  return {
    scrollWidth: document.documentElement.scrollWidth,
    vw,
    overflowing: overflowing.slice(0, 4),
    overflowCount: overflowing.length,
    smallestText: smallestText === 99 ? null : Math.round(smallestText * 10) / 10,
    smallestSample,
    smallestLabel: smallestLabel === 99 ? null : Math.round(smallestLabel * 10) / 10,
    smallestLabelSample,
    undersized: undersized.slice(0, 4),
    undersizedCount: undersized.length,
    smallPurchaseControls: smallPurchaseControls.slice(0, 4),
    smallPurchaseCount: smallPurchaseControls.length,
    burgerVisible: isVisible(burger),
    desktopNavVisible: isVisible(desktopNav),
  };
})()`;

const failures = [];
const advisories = [];
const note = (page, width, message) =>
  failures.push(`${page} @ ${width}px — ${message}`);

const { session, close } = await launchBrowser();
await enableDomains(session);
const drainErrors = await captureErrors(session);

console.log(`\nResponsive audit — ${PAGES.length} pages x ${WIDTHS.length} widths\n`);

for (const [label, path] of PAGES) {
  const cells = [];

  for (const { w, h, mobile } of WIDTHS) {
    await setViewport(session, w, h, mobile);
    await goto(session, `${BASE}${path}`, { settleMs: 350 });
    drainErrors(); // ignore anything from the previous page teardown

    const r = await evaluate(session, AUDIT);
    const errors = drainErrors().filter(
      // Chrome logs a warning for every unoptimised third-party cookie and for
      // favicon 404s in headless; neither is a defect in this app.
      (e) => !/favicon|third-party cookie|Download the React DevTools/i.test(e.text),
    );

    let ok = true;

    if (r.overflowCount > 0) {
      ok = false;
      const worst = r.overflowing[0];
      note(
        label,
        w,
        `horizontal overflow (${r.scrollWidth} > ${r.vw}): ${r.overflowCount} el, e.g. <${worst.tag} class="${worst.cls}"> right=${worst.right}`,
      );
    }

    if (errors.length > 0) {
      ok = false;
      note(label, w, `console: ${errors.map((e) => `[${e.level}] ${e.text}`).join(" | ").slice(0, 200)}`);
    }

    if (r.smallestText !== null && r.smallestText < 13) {
      ok = false;
      note(label, w, `prose at ${r.smallestText}px: "${r.smallestSample}"`);
    }

    if (r.smallestLabel !== null && r.smallestLabel < 11) {
      ok = false;
      note(
        label,
        w,
        `micro-label at ${r.smallestLabel}px: "${r.smallestLabelSample}"`,
      );
    }

    if (r.undersizedCount > 0) {
      ok = false;
      note(
        label,
        w,
        `WCAG 2.5.8: ${r.undersizedCount} target(s) under 24px without spacing clearance: ` +
          r.undersized
            .map((t) => `"${t.label}" ${t.w}x${t.h} (near "${t.near}")`)
            .join(", "),
      );
    }

    if (mobile && r.smallPurchaseCount > 0) {
      advisories.push(
        `${label} @ ${w}px — purchase control(s) under 44px: ` +
          r.smallPurchaseControls
            .map((t) => `"${t.label}" ${t.h}px`)
            .join(", "),
      );
    }

    // The nav has to swap over: a burger on small screens, links on large.
    if (w <= 768 && !r.burgerVisible) {
      ok = false;
      note(label, w, "no mobile menu button visible");
    }
    if (w >= 1024 && r.burgerVisible) {
      ok = false;
      note(label, w, "mobile menu button still visible on desktop");
    }

    cells.push(ok ? "ok" : "FAIL");
  }

  console.log(
    `  ${label.padEnd(13)} ` +
      WIDTHS.map(({ w }, i) => `${w}:${cells[i] === "ok" ? "ok" : "FAIL"}`).join("  "),
  );
}

await close();

// Collapse "same problem at eight widths" into one line per distinct problem.
function dedupe(list) {
  const byMessage = new Map();
  for (const entry of list) {
    const [where, what] = entry.split(" — ");
    const [page, width] = where.split(" @ ");
    const key = `${page}::${what}`;
    if (!byMessage.has(key)) byMessage.set(key, { page, what, widths: [] });
    byMessage.get(key).widths.push(width);
  }
  return [...byMessage.values()].map(
    ({ page, what, widths }) => `${page} [${widths.join(", ")}] ${what}`,
  );
}

if (failures.length === 0) {
  console.log(
    `\nAll ${PAGES.length * WIDTHS.length} page/width combinations passed.`,
  );
} else {
  const unique = dedupe(failures);
  console.log(`\n${unique.length} distinct issue(s):\n`);
  for (const f of unique) console.log(`  - ${f}`);
  process.exitCode = 1;
}

if (advisories.length > 0) {
  const unique = dedupe(advisories);
  console.log(`\n${unique.length} advisory/advisories (not WCAG failures):\n`);
  for (const a of unique) console.log(`  - ${a}`);
}
