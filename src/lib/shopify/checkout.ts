import { SHOPIFY } from "@/config/business";
import type { Locale } from "@/lib/i18n/config";

/**
 * CHECKOUT ARCHITECTURE
 *
 * Shopify stays the commerce engine. This frontend never touches payments,
 * inventory or orders — it hands the shopper to Shopify's own checkout with a
 * pre-filled cart, using a Shopify cart permalink:
 *
 *   https://wesmokefish.md/cart/{variantId}:{qty},{variantId}:{qty}?locale=ro
 *
 * Why a permalink rather than rebuilding checkout:
 *  - Prices, taxes, stock and discounts are re-resolved by Shopify at checkout,
 *    so a stale price in our snapshot can never be charged to a customer.
 *  - Existing apps on the store (upsell, address autocomplete, order limits)
 *    keep working, because it is the real Shopify checkout.
 *  - No card data, no PCI surface, no secrets in the frontend.
 *  - Orders, customers and inventory in Shopify admin are untouched.
 *
 * If a Storefront API access token is later added to the environment, swap in
 * `createStorefrontCart` (see ./storefront.ts) to get a Shopify-hosted cart ID
 * and abandoned-cart recovery. The permalink path stays as the fallback.
 */

export type CheckoutLine = {
  variantId: string;
  quantity: number;
};

/** Shopify caps permalink quantities; keep well inside safe limits. */
const MAX_QTY_PER_LINE = 99;

export function buildCartPermalink(lines: CheckoutLine[], locale: Locale = "ro"): string {
  const usable = lines
    .filter((line) => line.variantId && line.quantity > 0)
    .map((line) => `${line.variantId}:${Math.min(line.quantity, MAX_QTY_PER_LINE)}`);

  if (usable.length === 0) {
    return `https://${SHOPIFY.storefrontDomain}/cart`;
  }

  return `https://${SHOPIFY.storefrontDomain}/cart/${usable.join(",")}?locale=${locale}`;
}

/** Direct "Buy now" link for a single variant. */
export function buildBuyNowLink(variantId: string, quantity = 1, locale: Locale = "ro"): string {
  return buildCartPermalink([{ variantId, quantity }], locale);
}
