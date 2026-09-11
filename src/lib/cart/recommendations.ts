import {
  CROSS_SELL_RULES,
  DEFAULT_RECOMMENDATION_SLUGS,
  THRESHOLD_NUDGE_SLUGS,
} from "@/data/merchandising";
import { getProductBySlug, getProductsInCollection } from "@/lib/catalog";
import type { Product } from "@/lib/catalog/types";

function resolve(slugs: readonly string[], exclude: Set<string>, limit: number): Product[] {
  const out: Product[] = [];
  for (const slug of slugs) {
    if (out.length >= limit) break;
    if (exclude.has(slug)) continue;
    const product = getProductBySlug(slug);
    if (!product || !product.available) continue;
    out.push(product);
    exclude.add(slug);
  }
  return out;
}

/**
 * Cart cross-sell. Walks the merchandising rules in order, collecting
 * recommendations for every product already in the cart, then tops up from the
 * default list. Anything already in the cart is never recommended back.
 */
export function getCartRecommendations(cartSlugs: string[], limit = 3): Product[] {
  const exclude = new Set(cartSlugs);
  const picks: Product[] = [];

  for (const rule of CROSS_SELL_RULES) {
    if (picks.length >= limit) break;
    const matches = cartSlugs.some((slug) => rule.when.includes(slug));
    if (!matches) continue;
    picks.push(...resolve(rule.recommend, exclude, limit - picks.length));
  }

  if (picks.length < limit) {
    picks.push(...resolve(DEFAULT_RECOMMENDATION_SLUGS, exclude, limit - picks.length));
  }

  return picks;
}

/**
 * Products offered to help clear the free-delivery threshold. Prefers items
 * that actually close the gap without massively overshooting it, so the nudge
 * reads as helpful rather than as an upsell.
 */
export function getThresholdNudges(
  cartSlugs: string[],
  amountNeeded: number,
  limit = 3
): Product[] {
  const exclude = new Set(cartSlugs);

  const candidates = THRESHOLD_NUDGE_SLUGS.map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p) && p!.available && !exclude.has(p!.slug));

  const scored = candidates
    .map((product) => {
      // Cheapest variant that closes the gap, else the most expensive one.
      const sorted = [...product.variants].filter((v) => v.available).sort((a, b) => a.price - b.price);
      const closing = sorted.find((v) => v.price >= amountNeeded) ?? sorted[sorted.length - 1];
      if (!closing) return null;
      const overshoot = Math.abs(closing.price - amountNeeded);
      return { product, overshoot, closes: closing.price >= amountNeeded };
    })
    .filter((x): x is { product: Product; overshoot: number; closes: boolean } => x !== null)
    // Items that close the gap first, then by how close they land to it.
    .sort((a, b) => Number(b.closes) - Number(a.closes) || a.overshoot - b.overshoot);

  return scored.slice(0, limit).map((s) => s.product);
}

/**
 * Product-page "goes well alongside" list. Uses the same deliberate pairings
 * as the cart, falling back to other products from the same collection.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const exclude = new Set([product.slug]);
  const picks: Product[] = [];

  for (const rule of CROSS_SELL_RULES) {
    if (picks.length >= limit) break;
    if (!rule.when.includes(product.slug)) continue;
    picks.push(...resolve(rule.recommend, exclude, limit - picks.length));
  }

  if (picks.length < limit) {
    const sameCollection = product.collections[0];
    if (sameCollection) {
      const siblings = getProductsInCollection(sameCollection)
        .filter((p) => p.slug !== product.slug)
        .map((p) => p.slug);
      picks.push(...resolve(siblings, exclude, limit - picks.length));
    }
  }

  if (picks.length < limit) {
    picks.push(...resolve(DEFAULT_RECOMMENDATION_SLUGS, exclude, limit - picks.length));
  }

  return picks;
}

/**
 * "Frequently bought together" pairing for the product page — one deliberate
 * partner product, chosen so the pair reads like a real meal.
 */
export function getBundlePartner(product: Product): Product | null {
  const related = getRelatedProducts(product, 1);
  return related[0] ?? null;
}
