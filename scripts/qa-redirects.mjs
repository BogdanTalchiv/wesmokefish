/**
 * Verifies the 301 redirects from the old Shopify URLs.
 *
 * Product slugs are derived from titles, not Shopify handles, so every
 * indexed /products/<handle> URL must redirect to its new /produse/<slug>.
 * A silent gap here would drop existing search rankings.
 *
 * Requires the production server on http://localhost:3000.
 * Run with: node scripts/qa-redirects.mjs
 */

import catalog from "../src/data/catalog.json" with { type: "json" };

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const cases = [
  ...catalog.products.map((p) => ({
    from: `/products/${p.shopifyHandle}`,
    to: `/produse/${p.slug}`,
  })),
  ...catalog.collections.map((c) => ({
    from: `/collections/${c.shopifyHandle}`,
    to: `/colectii/${c.slug}`,
  })),
  { from: "/pages/livrare", to: "/livrare" },
  { from: "/pages/contact", to: "/contact" },
  { from: "/collections", to: "/produse" },
  { from: "/collections/all", to: "/produse" },
  { from: "/collections/frontpage", to: "/produse" },
  { from: "/search", to: "/produse" },
  // The Russian tree must redirect within /ru, not fall back to Romanian.
  { from: "/ru/pages/livrare", to: "/ru/livrare" },
  { from: "/ru/collections/frontpage", to: "/ru/produse" },
  {
    from: `/ru/products/${catalog.products[0].shopifyHandle}`,
    to: `/ru/produse/${catalog.products[0].slug}`,
  },
];

let failures = 0;
let checked = 0;

for (const testCase of cases) {
  const response = await fetch(`${BASE}${testCase.from}`, { redirect: "manual" });
  const location = response.headers.get("location");
  checked += 1;

  const ok = response.status === 308 || response.status === 301;
  const target = location?.replace(BASE, "") ?? "";

  if (!ok || target !== testCase.to) {
    failures += 1;
    console.log(`FAIL  ${testCase.from}`);
    console.log(`        status ${response.status}, location ${location ?? "none"}`);
    console.log(`        expected ${testCase.to}`);
  }
}

// A new slug must resolve, and an unknown one must 404 rather than 200.
const live = await fetch(`${BASE}/produse/${catalog.products[0].slug}`);
if (live.status !== 200) {
  failures += 1;
  console.log(`FAIL  new-style product URL returned ${live.status}`);
}

const missing = await fetch(`${BASE}/produse/definitely-not-a-product`);
if (missing.status !== 404) {
  failures += 1;
  console.log(`FAIL  unknown product URL returned ${missing.status}, expected 404`);
}

console.log(
  failures === 0
    ? `\nAll ${checked} redirects correct, plus live and 404 checks.`
    : `\n${failures} of ${checked} redirect checks failed.`
);
process.exit(failures === 0 ? 0 : 1);
