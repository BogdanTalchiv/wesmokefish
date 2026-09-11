/**
 * Single source of truth for business facts.
 *
 * Everything marked VERIFIED was read directly off wesmokefish.md during the
 * audit. Everything marked NEEDS_OWNER_INPUT is deliberately inert: the UI
 * hides those blocks until the owner supplies real values, so the site never
 * publishes an unverified claim.
 */

export const STORE_DOMAIN = "wesmokefish.md";

/**
 * Shopify remains the commerce engine. Checkout is handed off to this domain.
 *
 * ⚠ READ BEFORE DEPLOYING ⚠
 *
 * `storefrontDomain` must be a domain that SHOPIFY still serves, because cart
 * permalinks are resolved by Shopify, not by this app.
 *
 * Today wesmokefish.md IS the Shopify storefront, so the default is correct
 * and checkout works with no configuration. But the moment this app is
 * deployed to wesmokefish.md, that domain stops being served by Shopify —
 * /cart/... would hit Next.js and 404, and every checkout would break.
 *
 * So when you cut the domain over, set NEXT_PUBLIC_SHOPIFY_DOMAIN to whatever
 * Shopify still answers on, e.g.:
 *
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN=wesmokefish.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.wesmokefish.md
 *
 * Verify by opening https://<that-domain>/cart in a browser: it must show a
 * Shopify cart page. Note that a myshopify.com domain usually redirects to the
 * primary domain, so a dedicated subdomain kept on Shopify is the safer setup.
 */
export const SHOPIFY = {
  /** Public storefront domain, used to build cart permalinks. */
  storefrontDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "wesmokefish.md",
  /** Optional: enables the Storefront API cart instead of permalink handoff. */
  storefrontApiVersion: "2025-07",
} as const;

export const CONTACT = {
  // VERIFIED — wesmokefish.md/pages/contact
  phone: "+373 682 22 200",
  phoneHref: "tel:+37368222200",
  whatsappHref: "https://wa.me/37368222200",
  email: "wesmokefishmd@gmail.com",
  address: {
    street: "Șoseaua Balcani 7B",
    city: "Chișinău",
    country: "MD",
    countryName: "Moldova",
  },
} as const;

export const SOCIAL = {
  // VERIFIED — links present in the live site footer/header
  instagram: "https://instagram.com/wesmokefishmd",
  tiktok: "https://tiktok.com/@wesmokefishmd",
  // NEEDS_OWNER_INPUT — no Facebook link found on the current site
  facebook: null,
} as const;

export const DELIVERY = {
  // VERIFIED — wesmokefish.md/pages/livrare: "Livrare gratis de la 1200 lei"
  freeShippingThreshold: 1200,
  currency: "MDL",

  /**
   * VERIFIED — wesmokefish.md/pages/livrare, stated verbatim as:
   *   orders taken 17:00–11:00  -> delivered next day 12:00–17:00
   *   orders taken 11:00–17:00  -> delivered same day 18:00–22:00
   */
  windows: [
    { orderFrom: "17:00", orderTo: "11:00", deliverFrom: "12:00", deliverTo: "17:00", sameDay: false },
    { orderFrom: "11:00", orderTo: "17:00", deliverFrom: "18:00", deliverTo: "22:00", sameDay: true },
  ],

  /**
   * NEEDS_OWNER_INPUT — the current site states the free-delivery threshold but
   * never states the delivery fee below it, nor the exact delivery zone.
   * Set these and the UI will display them automatically.
   */
  standardFee: null as number | null,
  /** Set to e.g. "Chișinău" once confirmed; until then the UI stays generic. */
  zone: null as string | null,
} as const;

/**
 * NEEDS_OWNER_INPUT — the current site prints "4.9/5 recenzii" as static theme
 * text, but the store has no reviews app, no review records and no aggregate
 * rating data behind it. Publishing it as a rating would be an unverifiable
 * claim, so rating display and review schema stay off until a real review
 * source (Judge.me, Loox, Google Business, ...) is connected.
 */
export const REVIEWS = {
  enabled: false,
  ratingValue: null as number | null,
  reviewCount: null as number | null,
  source: null as string | null,
  items: [] as ReadonlyArray<{
    author: string;
    rating: number;
    body: string;
    date: string;
    productSlug?: string;
  }>,
} as const;

/** Analytics IDs — supplied via env, never committed. */
export const ANALYTICS = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? null,
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? null,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null,
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? null,
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wesmokefish.md";

export const BRAND = {
  name: "WeSmokeFish",
  legalName: "WeSmokeFish",
} as const;
