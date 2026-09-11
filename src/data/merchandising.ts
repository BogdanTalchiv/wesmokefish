/**
 * Merchandising — the only file you need to edit to re-curate the storefront.
 *
 * Everything here references products by slug (see src/data/catalog.json).
 * Products, prices, images and variants themselves live in Shopify and are
 * pulled in by `npm run sync:catalog`. Nothing here duplicates commerce data.
 */

/**
 * Homepage "Cele mai vândute" rail.
 * Order copied from the current site's "CELE MAI VÂNDUTE PRODUSE" section.
 */
export const BESTSELLER_SLUGS = [
  "yucola-somon",
  "creveti-afumati-cu-parmezan",
  "midii-afumate",
  "vomer-afumat-la-rece",
  "frigarui-afumate-ton-somon-peste-spada",
  "ton-afumat-in-sos-de-soia",
  "crap-afumat-la-rece",
  "marlin-afumat",
] as const;

/**
 * Homepage "Produsele săptămânii" rail.
 * Order copied from the current site's "produsele săptămânii" section.
 */
export const PRODUCTS_OF_THE_WEEK_SLUGS = [
  "scrumbie-usor-afumata",
  "rulada-sah",
  "yucola-somon",
  "creveti-afumati-cu-parmezan",
] as const;

/** The editorial "Semnătura noastră" slot. One product, given the full page. */
export const SIGNATURE_SLUG = "yucola-somon";

/**
 * Category tiles on the homepage. Images are the real category images already
 * uploaded to the store's Shopify CDN.
 */
export const CATEGORY_TILES = [
  {
    collectionSlug: "peste-si-fructe-de-mare-afumate",
    image: "https://cdn.shopify.com/s/files/1/0805/3705/9385/files/peste.jpg",
  },
  {
    collectionSlug: "slab-sarat-si-marinat",
    image: "https://cdn.shopify.com/s/files/1/0805/3705/9385/files/somon.jpg",
  },
  {
    collectionSlug: "bere",
    image: "https://cdn.shopify.com/s/files/1/0805/3705/9385/files/beer.jpg",
  },
] as const;

/**
 * Cross-sell rules, evaluated in order. The first rule whose `when` matches a
 * product in the cart supplies recommendations; anything already in the cart is
 * filtered out downstream.
 *
 * These are deliberate pairings (fish -> seafood to share, seafood -> fish
 * centrepiece, everything -> beer), not random "you may also like" filler.
 */
export const CROSS_SELL_RULES: ReadonlyArray<{
  id: string;
  /** Matches if any cart product slug is in this list. */
  when: readonly string[];
  /** Suggested product slugs, best first. */
  recommend: readonly string[];
}> = [
  {
    id: "somon-to-seafood",
    when: ["yucola-somon", "yucola-de-pastrav", "somon-proaspat-afumat", "somon-slab-sarat-cu-marar", "steak-de-somon-cu-sos-teriyaki", "rulada-sah", "rulada-trio"],
    recommend: ["creveti-afumati-cu-parmezan", "midii-afumate", "creveti-afumati", "midii-marinate"],
  },
  {
    id: "seafood-to-centrepiece",
    when: ["creveti-afumati-cu-parmezan", "creveti-afumati", "midii-afumate", "midii-marinate"],
    recommend: ["yucola-somon", "pastrav-intreg-afumat", "dorado-afumata", "frigarui-afumate-ton-somon-peste-spada"],
  },
  {
    id: "whole-fish-to-platter",
    when: ["pastrav-intreg-afumat", "dorado-afumata", "sea-bass-usor-afumat", "crap-afumat-la-rece", "vomer-afumat-la-rece"],
    recommend: ["creveti-afumati-cu-parmezan", "rulada-sah", "midii-afumate", "yucola-somon"],
  },
  {
    id: "steak-to-sides",
    when: ["ton-afumat-in-sos-de-soia", "marlin-afumat", "escolar-afumat", "steak-de-pastrav", "frigarui-afumate-ton-somon-peste-spada"],
    recommend: ["midii-afumate", "creveti-afumati-cu-parmezan", "yucola-somon", "scrumbie-usor-afumata"],
  },
  {
    id: "salted-to-smoked",
    when: ["scrumbie-slab-sarata", "scrumbie-slab-sarata-cu-ceapa", "scrumbie-usor-afumata", "novac-tolstolob-in-sos-de-miere", "novac-afumat-cu-usturoi-si-marar"],
    recommend: ["yucola-somon", "creveti-afumati-cu-parmezan", "midii-afumate", "crap-afumat-la-rece"],
  },
];

/** Fallback recommendations when no cross-sell rule matches. */
export const DEFAULT_RECOMMENDATION_SLUGS = [
  "creveti-afumati-cu-parmezan",
  "yucola-somon",
  "midii-afumate",
  "scrumbie-usor-afumata",
] as const;

/**
 * Products offered specifically to help a shopper clear the free-delivery
 * threshold — small, easy add-ons rather than another large centrepiece.
 */
export const THRESHOLD_NUDGE_SLUGS = [
  "vomer-afumat-la-rece",
  "midii-marinate",
  "midii-afumate",
  "novac-tolstolob-in-sos-de-miere",
  "novac-afumat-cu-usturoi-si-marar",
  "escolar-afumat",
  "creveti-afumati-cu-parmezan",
  "scrumbie-usor-afumata",
] as const;

/**
 * Marketing landing pages for paid traffic. Each one is a real route under
 * /campanii/[slug] with message-matched copy and a curated product set.
 */
export const CAMPAIGN_LANDINGS = [
  {
    slug: "somon",
    productSlugs: ["yucola-somon", "yucola-de-pastrav", "somon-proaspat-afumat", "somon-slab-sarat-cu-marar", "steak-de-somon-cu-sos-teriyaki", "rulada-sah", "rulada-trio"],
  },
  {
    slug: "fructe-de-mare",
    productSlugs: ["creveti-afumati-cu-parmezan", "creveti-afumati", "midii-afumate", "midii-marinate"],
  },
  {
    slug: "platou-festiv",
    productSlugs: ["yucola-somon", "creveti-afumati-cu-parmezan", "rulada-sah", "rulada-trio", "midii-afumate", "frigarui-afumate-ton-somon-peste-spada", "vomer-afumat-la-rece"],
  },
] as const;

export type CampaignSlug = (typeof CAMPAIGN_LANDINGS)[number]["slug"];
