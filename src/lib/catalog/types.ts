export type ProductImage = {
  url: string;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  gid: string;
  /** Weight label as configured in Shopify, e.g. "300 gm". Null for single-variant products. */
  title: string | null;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  /** Lower-bound weight in grams, parsed from the variant title. */
  grams: number | null;
  /** Derived: price / (grams / 1000). Null when the variant has no weight. */
  pricePerKg: number | null;
  sku: string | null;
};

export type Product = {
  id: string;
  gid: string;
  /** Clean ASCII slug used in our URLs. */
  slug: string;
  /** Original Shopify handle, kept for API lookups and redirects. */
  shopifyHandle: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  collections: string[];
  images: ProductImage[];
  /** Shopify's option name for the weight axis, e.g. "Bucata", "Bețișorul". */
  optionName: string | null;
  variants: ProductVariant[];
  priceMin: number;
  priceMax: number;
  available: boolean;
  createdAt: string;
};

export type Collection = {
  slug: string;
  shopifyHandle: string;
  title: string;
  productHandles: string[];
  count: number;
};

export type Catalog = {
  syncedAt: string;
  source: string;
  currency: string;
  collections: Collection[];
  products: Product[];
};
