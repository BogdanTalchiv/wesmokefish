/**
 * Post-build HTML audit.
 *
 * Reads the prerendered HTML straight off disk and asserts the things that
 * have to be in the *static* markup rather than added by client JavaScript:
 * headings, canonical, hreflang, structured data, and actual product content.
 *
 * Run with: node scripts/qa-html.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".next/server/app");

const PAGES = [
  "ro.html",
  "ru.html",
  "ro/produse.html",
  "ro/produse/yucola-somon.html",
  "ro/colectii/bere.html",
  "ro/colectii/peste-si-fructe-de-mare-afumate.html",
  "ro/livrare.html",
  "ro/contact.html",
  "ro/intrebari-frecvente.html",
  "ro/despre-noi.html",
  "ro/campanii/somon.html",
  "ro/politica-de-confidentialitate.html",
];

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  return blocks.map((m) => {
    try {
      const parsed = JSON.parse(m[1].replaceAll("\\u003c", "<"));
      return parsed["@type"] ?? "?";
    } catch {
      return "PARSE-FAIL";
    }
  });
}

function textOf(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
}

let failures = 0;
function check(label, condition, detail = "") {
  if (!condition) {
    failures += 1;
    console.log(`    FAIL  ${label} ${detail}`);
  }
}

for (const page of PAGES) {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) {
    console.log(`\nMISSING  ${page}`);
    failures += 1;
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  const h1 = textOf(html, "h1");
  const lang = (html.match(/<html lang="([^"]+)"/) || [])[1];
  const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const title = textOf(html, "title");
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1];
  const og = (html.match(/property="og:image" content="([^"]*)"/) || [])[1];
  // Next serialises the attribute as `hrefLang`; HTML attribute names are
  // case-insensitive, so match either spelling.
  const hreflang = [...html.matchAll(/hreflang="([^"]+)"/gi)].map((m) => m[1]);
  const types = jsonLdTypes(html);
  const productLinks = new Set(
    [...html.matchAll(/href="\/(?:ru\/)?produse\/([a-z0-9-]+)"/g)].map((m) => m[1])
  );

  console.log(`\n${page}  (${kb} KB)`);
  console.log(`  h1:        ${h1?.slice(0, 64) ?? "— NONE —"}`);
  console.log(`  lang:      ${lang}`);
  console.log(`  title:     ${title?.slice(0, 64)}`);
  console.log(`  canonical: ${canonical}`);
  console.log(`  json-ld:   ${types.join(", ") || "none"}`);
  console.log(`  hreflang:  ${hreflang.join(", ") || "none"}`);
  console.log(`  products:  ${productLinks.size} distinct linked`);

  // Universal expectations.
  check("has exactly one h1", (html.match(/<h1[^>]*>/g) || []).length === 1);
  check("html lang set", Boolean(lang));
  check("canonical is absolute https", canonical?.startsWith("https://"));
  check("title present", Boolean(title && title.length > 10));
  check("meta description present", Boolean(desc && desc.length > 40));
  check("og:image absolute", Boolean(og && og.startsWith("https://")), `got ${og}`);
  check("hreflang ro-MD + ru-MD + x-default", ["ro-MD", "ru-MD", "x-default"].every((h) => hreflang.includes(h)));
  check("no json-ld parse failures", !types.includes("PARSE-FAIL"));
  check("no literal placeholder tokens", !/\{[a-zA-Z]+\}/.test(html.replace(/<script[\s\S]*?<\/script>/g, "")));
  check("no NEEDS_OWNER_INPUT leaked to page", !html.includes("NEEDS_OWNER_INPUT"));
  check("no lorem ipsum", !/lorem ipsum/i.test(html));

  // Page-specific expectations.
  if (page === "ro/produse.html") {
    check("all 39 products in static HTML", productLinks.size === 39, `got ${productLinks.size}`);
    check("ItemList schema", types.includes("ItemList"));
    check("Breadcrumb schema", types.includes("BreadcrumbList"));
  }

  if (page.startsWith("ro/produse/") && page !== "ro/produse.html") {
    check("Product schema", types.includes("Product"));
    check("Breadcrumb schema", types.includes("BreadcrumbList"));
    check("price in HTML", /MDL/.test(html));
    check("add-to-cart button", /Adaug/.test(html));
    check("no AggregateRating (no real reviews yet)", !html.includes("aggregateRating"));
  }

  if (page.startsWith("ro/colectii/")) {
    check("ItemList schema", types.includes("ItemList"));
    check("products in static HTML", productLinks.size > 0, `got ${productLinks.size}`);
  }

  if (page === "ro/livrare.html" || page === "ro/intrebari-frecvente.html") {
    check("FAQPage schema", types.includes("FAQPage"));
  }

  if (page === "ro/politica-de-confidentialitate.html") {
    check("noindex", /name="robots" content="[^"]*noindex/.test(html));
  }

  if (page === "ro.html") {
    check("Organization schema", types.includes("Organization"));
    check("WebSite schema", types.includes("WebSite"));
    check("Store schema", types.includes("Store"));
    check("consent default before tags", html.indexOf("gtag('consent','default'") > -1);
    check("phone present", html.includes("+373"));
  }
}

console.log(
  failures === 0
    ? `\n\nAll checks passed across ${PAGES.length} pages.`
    : `\n\n${failures} check(s) failed.`
);
process.exit(failures === 0 ? 0 : 1);
