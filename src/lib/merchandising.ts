import {
  BUNDLES,
  OCCASIONS,
  RELATED_HEADLINE_RULES,
  type BundleSlug,
  type OccasionSlug,
} from "@/data/merchandising";
import { getDefaultVariant } from "@/lib/catalog/content";
import { getProductBySlug } from "@/lib/catalog";
import type { Product } from "@/lib/catalog/types";
import type { Dictionary } from "@/lib/i18n";

export function getOccasion(slug: string) {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function getBundle(slug: string) {
  return BUNDLES.find((b) => b.slug === slug);
}

export function getOccasionProducts(slug: OccasionSlug | string): Product[] {
  const occasion = getOccasion(slug);
  if (!occasion) return [];
  return occasion.productSlugs
    .map((s) => getProductBySlug(s))
    .filter((p): p is Product => Boolean(p));
}

export function getBundleProducts(slug: BundleSlug | string): Product[] {
  const bundle = getBundle(slug);
  if (!bundle) return [];
  return bundle.productSlugs
    .map((s) => getProductBySlug(s))
    .filter((p): p is Product => p != null && p.available);
}

/** Live sum of each product's default variant. Never a made-up set price. */
export function getBundleTotal(products: Product[]): number {
  const raw = products.reduce((sum, product) => {
    const variant = getDefaultVariant(product);
    return sum + (variant?.price ?? 0);
  }, 0);
  return Math.round(raw * 100) / 100;
}

export type RelatedHeadlineKey =
  | "related"
  | "relatedCompleteMeal"
  | "relatedGoesWith"
  | "relatedPlatter"
  | "relatedWithBeer";

const HEADLINE_KEY: Record<(typeof RELATED_HEADLINE_RULES)[number]["id"], RelatedHeadlineKey> = {
  completeMeal: "relatedCompleteMeal",
  goesWith: "relatedGoesWith",
  platter: "relatedPlatter",
  withBeer: "relatedWithBeer",
};

export function getRelatedHeadlineKey(product: Product): RelatedHeadlineKey {
  for (const rule of RELATED_HEADLINE_RULES) {
    if (rule.when.includes(product.slug)) return HEADLINE_KEY[rule.id];
  }
  return "related";
}

export function getRelatedHeadline(product: Product, t: Dictionary): string {
  return t.product[getRelatedHeadlineKey(product)];
}

/** First product with a photograph — used as the occasion / bundle cover. */
export function coverImageOf(products: Product[]) {
  return products.find((p) => p.images[0])?.images[0];
}
