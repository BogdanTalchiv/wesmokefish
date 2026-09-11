/** Spot-checks the synced catalog against price-per-kg values shown on wesmokefish.md. */
import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../src/data/catalog.json", import.meta.url), "utf8"));

// Values read directly off the live wesmokefish.md homepage.
const expected = {
  "yucola-somon": 900,
  "creveti-afumati-cu-parmezan": 690,
  "midii-afumate": 790,
  "vomer-afumat-la-rece": 290,
  "frigarui-afumate-ton-somon-peste-spada": 875,
  "ton-afumat-in-sos-de-soia": 780,
  "crap-afumat-la-rece": 720,
  "marlin-afumat": 900,
  "scrumbie-usor-afumata": 480,
};

let failures = 0;
for (const [slug, want] of Object.entries(expected)) {
  const p = catalog.products.find((x) => x.slug === slug);
  if (!p) {
    console.log(`MISSING  ${slug}`);
    failures++;
    continue;
  }
  const got = p.variants[0].pricePerKg;
  const ok = got === want;
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FAIL"}  ${p.title.slice(0, 46).padEnd(46)} ${got} MDL/kg (site: ${want})`);
}

console.log("\n--- variant weight parsing across full catalog ---");
for (const p of catalog.products) {
  for (const v of p.variants) {
    if (v.title && !v.grams) {
      console.log(`UNPARSED WEIGHT: ${p.title} -> "${v.title}"`);
      failures++;
    }
  }
}

console.log(`\nslug collisions: ${catalog.products.length - new Set(catalog.products.map((p) => p.slug)).size}`);
console.log(`products in no collection: ${catalog.products.filter((p) => p.collections.length === 0).length}`);
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
