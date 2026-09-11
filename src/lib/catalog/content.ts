import { BEER_COPY, PRODUCT_COPY, PRODUCT_FACTS, type ProductCopy, type ProductFacts } from "@/data/product-content";
import { BESTSELLER_SLUGS } from "@/data/merchandising";
import type { Product } from "./types";

/** Strips HTML from a Shopify description so it can be used as plain text. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves product copy with a clear precedence:
 *   1. the Shopify description, if the owner has written one
 *   2. our authored fallback copy for that product
 *   3. generic beer copy, for the beer range
 *
 * This means the owner can take over any product's copy simply by filling in
 * the description field in Shopify admin — no code change needed.
 */
export function getProductCopy(product: Product): ProductCopy & { source: "shopify" | "authored" | "generic" } {
  const shopifyText = stripHtml(product.descriptionHtml);

  if (shopifyText.length > 0) {
    const authored = PRODUCT_COPY[product.slug];
    return {
      short: shopifyText.length <= 120 ? shopifyText : (authored?.short ?? shopifyText.slice(0, 117) + "…"),
      long: shopifyText,
      source: "shopify",
    };
  }

  const authored = PRODUCT_COPY[product.slug];
  if (authored) return { ...authored, source: "authored" };

  return { ...BEER_COPY, source: "generic" };
}

export function getProductFacts(product: Product): ProductFacts {
  return PRODUCT_FACTS[product.slug] ?? {};
}

export function hasProductFacts(product: Product): boolean {
  return Object.keys(getProductFacts(product)).length > 0;
}

export function isBestseller(product: Product): boolean {
  return (BESTSELLER_SLUGS as readonly string[]).includes(product.slug);
}

/** Newest product in the store, used sparingly for a "Nou" badge. */
const NEW_WINDOW_DAYS = 45;

export function isNew(product: Product, now = Date.now()): boolean {
  const created = new Date(product.createdAt).getTime();
  if (!Number.isFinite(created)) return false;
  return now - created < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/** The variant we preselect: cheapest available, so the entry price shows. */
export function getDefaultVariant(product: Product) {
  const available = product.variants.filter((v) => v.available);
  const pool = available.length > 0 ? available : product.variants;
  return pool.reduce((cheapest, v) => (v.price < cheapest.price ? v : cheapest), pool[0]);
}

/** True when the weight is an estimate (Shopify labels these with "±"). */
export function isApproximateWeight(variantTitle: string | null): boolean {
  return Boolean(variantTitle && variantTitle.includes("±"));
}

/** Turns "1200 - 1300 gm" / "400± gm" into a clean, readable label. */
export function formatVariantLabel(variantTitle: string | null, locale: "ro" | "ru"): string {
  if (!variantTitle) return "";
  const gUnit = locale === "ru" ? "г" : "g";
  const kgUnit = locale === "ru" ? "кг" : "kg";

  let label = variantTitle
    .replace(/\s*gm\b/i, ` ${gUnit}`)
    .replace(/\s*kg\b/i, ` ${kgUnit}`)
    .replace(/\s*±\s*/g, "± ")
    .replace(/\s+/g, " ")
    .trim();

  // "1200 g (bucata întreagă)" reads better as "1,2 kg (bucata întreagă)".
  label = label.replace(/(\d{4,})\s*(g|г)\b/, (_m, grams: string, unit: string) => {
    const kg = Number(grams) / 1000;
    const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-MD" : "ro-MD", {
      maximumFractionDigits: 1,
    }).format(kg);
    return `${formatted} ${unit === "г" ? kgUnit : kgUnit}`;
  });

  return label;
}
