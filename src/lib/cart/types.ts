export type CartLine = {
  /** Shopify numeric variant id — the key Shopify checkout needs. */
  variantId: string;
  /** Our catalog slug, so we can re-resolve product data on load. */
  productSlug: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  /** True once the persisted cart has been read from storage. */
  hydrated: boolean;
};

export type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; variantId: string; productSlug: string; quantity: number }
  | { type: "setQuantity"; variantId: string; quantity: number }
  | { type: "remove"; variantId: string }
  | { type: "clear" };
