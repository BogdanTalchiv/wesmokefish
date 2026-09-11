import catalogJson from "@/data/catalog.json";
import type { Catalog, Collection, Product } from "./types";

export type { Catalog, Collection, Product, ProductVariant, ProductImage } from "./types";

const catalog = catalogJson as unknown as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getAllProducts(): Product[] {
  return catalog.products;
}

export function getAllCollections(): Collection[] {
  return catalog.collections;
}

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.products.find((p) => p.slug === slug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return catalog.collections.find((c) => c.slug === slug);
}

export function getProductsInCollection(slug: string): Product[] {
  return catalog.products.filter((p) => p.collections.includes(slug));
}

export function getVariantById(id: string): { product: Product; variant: Product["variants"][number] } | undefined {
  for (const product of catalog.products) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** Food products only — excludes the beer collection. */
export function getFoodProducts(): Product[] {
  return catalog.products.filter((p) => !p.collections.includes("bere"));
}

/**
 * Homepage bestsellers, in the exact order the current site lists them under
 * "CELE MAI VÂNDUTE PRODUSE". Editable in src/data/merchandising.ts.
 */
export function getProductsBySlugs(slugs: readonly string[]): Product[] {
  return slugs.map((s) => getProductBySlug(s)).filter((p): p is Product => Boolean(p));
}

/** Newest food products first — used for the "products of the week" rail. */
export function getNewestProducts(limit: number): Product[] {
  return [...getFoodProducts()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
