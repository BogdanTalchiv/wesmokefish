import type { Product, ProductVariant } from "@/lib/catalog/types";

/**
 * Analytics event layer.
 *
 * Everything is pushed to `window.dataLayer` using GA4 ecommerce parameter
 * names, and mirrored to the Meta Pixel when it is present. Nothing fires
 * unless the corresponding ID is configured AND the visitor consented, so no
 * events are fabricated in development or before consent.
 *
 * Purchase / add_payment_info are intentionally NOT fired here: checkout is
 * hosted by Shopify, so those belong in Shopify's own GA4 + Meta integration
 * (Shopify admin > Online store > Preferences, or the Meta/Google channel
 * apps). Firing them client-side would double-count and misreport revenue.
 */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price: number;
  quantity: number;
};

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "MDL";

function push(event: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/** Converts a catalog product + variant into a GA4 ecommerce item. */
export function toAnalyticsItem(
  product: Product,
  variant: ProductVariant,
  quantity = 1
): AnalyticsItem {
  return {
    item_id: variant.id,
    item_name: product.title,
    item_variant: variant.title ?? undefined,
    item_category: product.collections[0],
    price: variant.price,
    quantity,
  };
}

function itemsValue(items: AnalyticsItem[]): number {
  return Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
}

function contentIds(items: AnalyticsItem[]): string[] {
  return items.map((i) => i.item_id);
}

export function trackPageView(path: string, title?: string) {
  push({ event: "page_view", page_path: path, page_title: title });
  fbq("PageView");
}

export function trackViewItem(items: AnalyticsItem[]) {
  push({
    event: "view_item",
    ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
  });
  fbq("ViewContent", {
    content_type: "product",
    content_ids: contentIds(items),
    currency: CURRENCY,
    value: itemsValue(items),
  });
}

export function trackViewItemList(listName: string, items: AnalyticsItem[]) {
  push({
    event: "view_item_list",
    ecommerce: { item_list_name: listName, items },
  });
}

export function trackSelectItem(listName: string, item: AnalyticsItem) {
  push({
    event: "select_item",
    ecommerce: { item_list_name: listName, items: [item] },
  });
}

export function trackAddToCart(items: AnalyticsItem[]) {
  push({
    event: "add_to_cart",
    ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
  });
  fbq("AddToCart", {
    content_type: "product",
    content_ids: contentIds(items),
    currency: CURRENCY,
    value: itemsValue(items),
  });
}

export function trackRemoveFromCart(items: AnalyticsItem[]) {
  push({
    event: "remove_from_cart",
    ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
  });
}

export function trackViewCart(items: AnalyticsItem[]) {
  push({
    event: "view_cart",
    ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
  });
}

export function trackBeginCheckout(items: AnalyticsItem[]) {
  push({
    event: "begin_checkout",
    ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
  });
  fbq("InitiateCheckout", {
    content_type: "product",
    content_ids: contentIds(items),
    currency: CURRENCY,
    value: itemsValue(items),
    num_items: items.reduce((n, i) => n + i.quantity, 0),
  });
}

export function trackSearch(term: string, resultCount: number) {
  push({ event: "search", search_term: term, result_count: resultCount });
  fbq("Search", { search_string: term });
}

/**
 * Contact-intent events.
 *
 * Each takes an optional `location` — "footer", "header", "delivery_page",
 * "campaign_somon" and so on. That turns "37 people tapped the phone number"
 * into "the phone number in the cart drawer converts, the one in the footer
 * does not", which is the difference between a metric and a decision.
 */

type ContactMethod = "form" | "phone" | "whatsapp" | "email" | "instagram" | "tiktok";

export function trackContact(method: ContactMethod, location?: string) {
  push({ event: "contact", contact_method: method, link_location: location });
  fbq("Contact", { method });
}

export function trackClickPhone(location?: string) {
  push({ event: "click_phone", link_location: location });
  fbq("Contact", { method: "phone" });
}

export function trackClickWhatsapp(location?: string) {
  push({ event: "click_whatsapp", link_location: location });
  fbq("Contact", { method: "whatsapp" });
}

export function trackClickInstagram(location?: string) {
  push({ event: "click_instagram", link_location: location });
}

export function trackClickTiktok(location?: string) {
  push({ event: "click_tiktok", link_location: location });
}

export function trackNewsletterSignup() {
  push({ event: "generate_lead", lead_type: "newsletter" });
  fbq("Lead", { content_name: "newsletter" });
}
