/**
 * Attributes the client bundle to its sources, so bloat can be found.
 *
 * Run with: node scripts/qa-bundle.mjs
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const STATIC = path.join(process.cwd(), ".next");
const html = fs.readFileSync(path.join(STATIC, "server/app/ro.html"), "utf8");

const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))];

// Fingerprints for the libraries and data we care about.
const PROBES = [
  ["framer-motion", /framer-motion|useReducedMotion|AnimatePresence/],
  ["react-hook-form", /react-hook-form|shouldUnregister|handleSubmit/],
  ["zod", /ZodError|invalid_string|too_small/],
  ["react-dom", /react-dom|Minified React error/],
  ["catalog data", /yucola-somon|shopifyHandle/],
  ["dictionaries RO", /Fum adev/],
  ["dictionaries RU", /Настоящий дым/],
  ["lucide icons", /lucide|stroke-linecap/],
];

console.log("\nHomepage client scripts, gzipped\n");

const rows = srcs
  .map((src) => {
    const asset = path.join(STATIC, src.replace(/^\/_next\//, ""));
    if (!fs.existsSync(asset)) return null;
    const buf = fs.readFileSync(asset);
    const text = buf.toString("utf8");
    return {
      src: src.split("/").pop(),
      kb: +(zlib.gzipSync(buf, { level: 9 }).length / 1024).toFixed(1),
      hits: PROBES.filter(([, re]) => re.test(text)).map(([name]) => name),
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.kb - a.kb);

for (const row of rows) {
  console.log(`${String(row.kb).padStart(7)} KB  ${row.src}`);
  if (row.hits.length) console.log(`            contains: ${row.hits.join(", ")}`);
}

console.log(`\nTotal: ${rows.reduce((n, r) => n + r.kb, 0).toFixed(1)} KB gzipped`);

// Is the whole catalogue being shipped to the browser?
const catalogSize = fs.statSync(path.join(process.cwd(), "src/data/catalog.json")).size;
console.log(`\ncatalog.json on disk: ${(catalogSize / 1024).toFixed(1)} KB raw`);
const inBundle = rows.filter((r) => r.hits.includes("catalog data"));
console.log(
  inBundle.length
    ? `catalog data found in: ${inBundle.map((r) => `${r.src} (${r.kb} KB)`).join(", ")}`
    : "catalog data not found in any client chunk"
);
