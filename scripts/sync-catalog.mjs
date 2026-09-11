/**
 * Catalog sync — pulls the live catalog from the WeSmokeFish Shopify store and
 * writes a normalised snapshot to src/data/catalog.json.
 *
 * Shopify stays the single source of truth for products, prices and variants.
 * Re-run `npm run sync:catalog` after any change in Shopify admin.
 *
 * Usage: node scripts/sync-catalog.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const STORE = process.env.SHOPIFY_STORE_URL ?? "https://wesmokefish.md";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "data", "catalog.json");

/** Collections we surface in navigation, with clean ASCII SEO slugs. */
const COLLECTION_SLUGS = {
  "pește-și-fructe-de-mare-afumate": "peste-si-fructe-de-mare-afumate",
  "pește-și-fructe-de-mare-slab-sarat-și-marinate": "slab-sarat-si-marinat",
  "bere-1": "bere",
};

/**
 * Manual slug overrides, for products whose full title makes an unusably long
 * URL. Keep these short and keyword-relevant.
 */
const SLUG_OVERRIDES = {
  "frigarui-afumat-din-ton-somon-și-pește-spada-cu-sos-sweet-chili-și-shriracea":
    "frigarui-afumate-ton-somon-peste-spada",
  "scrumbie-slab-sarata-copy": "scrumbie-slab-sarata-cu-ceapa",
  "novac-tolstolob-afumat-cu-usturoi-și-marar": "novac-afumat-cu-usturoi-si-marar",
};

const CYRILLIC = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "iu", я: "ia",
};

function slugify(input) {
  return input
    .toLowerCase()
    .split("")
    .map((c) => CYRILLIC[c] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ț/g, "t")
    .replace(/ș/g, "s")
    .replace(/ă|â/g, "a")
    .replace(/î/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Shopify variant titles carry the sellable weight, e.g. "300 gm",
 * "120 ± gm", "400± gm", "1200 - 1300 gm", "1200 gm (bucata întreagă)".
 * We parse the lower bound in grams so price-per-kg can be computed.
 */
function parseGrams(variantTitle) {
  if (!variantTitle || variantTitle === "Default Title") return null;
  const match = variantTitle.replace(/\s+/g, " ").match(/(\d[\d\s]*)\s*(?:±|-|–)?\s*(?:\d+)?\s*(gm|g|kg)/i);
  if (!match) return null;
  const value = Number(match[1].replace(/\s/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;
  return match[2].toLowerCase() === "kg" ? value * 1000 : value;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "wesmokefish-catalog-sync" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function main() {
  console.log(`Syncing catalog from ${STORE} ...`);

  const { products: rawProducts } = await fetchJson(`${STORE}/products.json?limit=250`);
  const { collections: rawCollections } = await fetchJson(`${STORE}/collections.json?limit=250`);

  // Map every product handle to the collections it belongs to.
  const membership = new Map();
  const collections = [];

  for (const col of rawCollections) {
    const slug = COLLECTION_SLUGS[col.handle];
    if (!slug) continue; // skip internal collections such as "frontpage"

    const { products } = await fetchJson(
      `${STORE}/collections/${encodeURIComponent(col.handle)}/products.json?limit=250`
    );
    const handles = products.map((p) => p.handle);

    for (const handle of handles) {
      if (!membership.has(handle)) membership.set(handle, []);
      membership.get(handle).push(slug);
    }

    collections.push({
      slug,
      shopifyHandle: col.handle,
      title: col.title.trim(),
      count: handles.length,
    });
    console.log(`  collection ${slug}: ${handles.length} products`);
  }

  /**
   * Many Shopify handles no longer match their product ("Scrumbie ușor afumată"
   * sits on `steak-de-pastrav-copy`), which is bad for SEO and confusing in a
   * URL. We derive our own slug from the product title and keep the Shopify
   * handle for API lookups and legacy redirects.
   */
  const usedSlugs = new Set();
  const slugFor = (title, handle) => {
    const base = SLUG_OVERRIDES[handle] ?? slugify(title) ?? slugify(handle);
    let slug = base;
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
    usedSlugs.add(slug);
    return slug;
  };

  const products = rawProducts.map((p) => {
    const variants = p.variants.map((v) => {
      const grams = parseGrams(v.title);
      const price = Number(v.price);
      return {
        id: String(v.id),
        gid: `gid://shopify/ProductVariant/${v.id}`,
        title: v.title === "Default Title" ? null : v.title.replace(/\s+/g, " ").trim(),
        price,
        compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
        available: Boolean(v.available),
        grams,
        pricePerKg: grams ? Math.round((price / (grams / 1000)) * 100) / 100 : null,
        sku: v.sku || null,
      };
    });

    const prices = variants.map((v) => v.price);

    return {
      id: String(p.id),
      gid: `gid://shopify/Product/${p.id}`,
      slug: slugFor(p.title, p.handle),
      shopifyHandle: p.handle,
      title: p.title.replace(/\s+/g, " ").trim(),
      descriptionHtml: p.body_html || "",
      vendor: p.vendor,
      tags: p.tags,
      collections: membership.get(p.handle) ?? [],
      images: p.images.map((img) => ({
        url: img.src,
        width: img.width,
        height: img.height,
      })),
      optionName: p.options?.[0]?.name && p.options[0].name !== "Title" ? p.options[0].name : null,
      variants,
      priceMin: Math.min(...prices),
      priceMax: Math.max(...prices),
      available: variants.some((v) => v.available),
      createdAt: p.created_at,
    };
  });

  const snapshot = {
    syncedAt: new Date().toISOString(),
    source: STORE,
    currency: "MDL",
    collections,
    products,
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

  console.log(`\nWrote ${products.length} products / ${collections.length} collections to ${path.relative(ROOT, OUT)}`);

  const noWeight = products.filter((p) => p.variants.every((v) => !v.grams));
  const noImage = products.filter((p) => p.images.length === 0);
  const noDescription = products.filter((p) => !p.descriptionHtml.trim());
  console.log(`\nData gaps to flag to the store owner:`);
  console.log(`  products without weight/price-per-kg: ${noWeight.length}`);
  console.log(`  products without images:              ${noImage.length}`);
  console.log(`  products without a Shopify description: ${noDescription.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
