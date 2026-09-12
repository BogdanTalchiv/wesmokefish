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
  "pastrav-intreg-afumat",
  "dorado-afumata",
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
    slug: "creveti",
    productSlugs: ["creveti-afumati-cu-parmezan", "creveti-afumati"],
  },
  {
    slug: "fructe-de-mare",
    productSlugs: ["creveti-afumati-cu-parmezan", "creveti-afumati", "midii-afumate", "midii-marinate"],
  },
  {
    slug: "peste-afumat",
    productSlugs: [
      "yucola-somon",
      "pastrav-intreg-afumat",
      "scrumbie-usor-afumata",
      "crap-afumat-la-rece",
      "vomer-afumat-la-rece",
      "dorado-afumata",
      "sea-bass-usor-afumat",
    ],
  },
  {
    slug: "platou-festiv",
    productSlugs: ["yucola-somon", "creveti-afumati-cu-parmezan", "rulada-sah", "rulada-trio", "midii-afumate", "frigarui-afumate-ton-somon-peste-spada", "vomer-afumat-la-rece"],
  },
] as const;

export type CampaignSlug = (typeof CAMPAIGN_LANDINGS)[number]["slug"];

/**
 * Occasion merchandising — "Pentru ce ai poftă?"
 *
 * Each occasion is a curated set of real catalogue slugs, not a new product
 * type. A shopper who does not know the range can start from a meal instead
 * of a species. Images come from the first product that still has a photo.
 */
export const OCCASIONS = [
  {
    slug: "cina-in-doi",
    imageSlug: "yucola-somon",
    productSlugs: ["yucola-somon", "creveti-afumati-cu-parmezan", "rulada-sah", "midii-afumate"],
  },
  {
    slug: "musafiri",
    imageSlug: "rulada-sah",
    productSlugs: [
      "yucola-somon",
      "creveti-afumati-cu-parmezan",
      "rulada-sah",
      "rulada-trio",
      "midii-afumate",
      "frigarui-afumate-ton-somon-peste-spada",
    ],
  },
  {
    slug: "weekend",
    imageSlug: "scrumbie-usor-afumata",
    productSlugs: [
      "scrumbie-usor-afumata",
      "vomer-afumat-la-rece",
      "midii-afumate",
      "creveti-afumati",
      "bere-litra-helles",
      "bere-gotter-nefiltarata",
    ],
  },
  {
    slug: "seara-cu-baietii",
    imageSlug: "creveti-afumati-cu-parmezan",
    productSlugs: [
      "creveti-afumati-cu-parmezan",
      "midii-afumate",
      "scrumbie-usor-afumata",
      "vomer-afumat-la-rece",
      "bere-litra-pale-ale",
      "bere-heineken",
    ],
  },
  {
    slug: "platou",
    imageSlug: "frigarui-afumate-ton-somon-peste-spada",
    productSlugs: [
      "yucola-somon",
      "rulada-sah",
      "rulada-trio",
      "creveti-afumati-cu-parmezan",
      "midii-afumate",
      "frigarui-afumate-ton-somon-peste-spada",
    ],
  },
  {
    slug: "degustare",
    imageSlug: "midii-afumate",
    productSlugs: [
      "midii-afumate",
      "midii-marinate",
      "vomer-afumat-la-rece",
      "escolar-afumat",
      "creveti-afumati",
    ],
  },
] as const;

export type OccasionSlug = (typeof OCCASIONS)[number]["slug"];

/**
 * Curated bundles. Prices are always the live sum of each product's default
 * (cheapest available) variant — never a made-up set price or discount.
 *
 * Shopify does not have a bundle SKU today. Adding the set puts each real
 * variant in the cart and checkout remains Shopify's.
 */
export const BUNDLES = [
  {
    slug: "pentru-doi",
    productSlugs: ["yucola-somon", "creveti-afumati-cu-parmezan"],
  },
  {
    slug: "platou-weekend",
    productSlugs: ["yucola-somon", "creveti-afumati-cu-parmezan", "midii-afumate"],
  },
  {
    slug: "seafood-night",
    productSlugs: ["creveti-afumati-cu-parmezan", "midii-afumate", "midii-marinate"],
  },
  {
    slug: "pentru-musafiri",
    productSlugs: ["yucola-somon", "rulada-sah", "creveti-afumati-cu-parmezan"],
  },
] as const;

export type BundleSlug = (typeof BUNDLES)[number]["slug"];

/**
 * Compact mobile category chips. Destinations are real collection, campaign
 * or search routes — never a dead filter.
 */
export const QUICK_CATEGORIES = [
  { id: "afumate", href: "/colectii/peste-si-fructe-de-mare-afumate" },
  { id: "somon", href: "/campanii/somon" },
  { id: "creveti", href: "/campanii/creveti" },
  { id: "midii", href: "/produse?q=midii" },
  { id: "peste", href: "/campanii/peste-afumat" },
  { id: "fructe-de-mare", href: "/campanii/fructe-de-mare" },
  { id: "bere", href: "/colectii/bere" },
] as const;

export type QuickCategoryId = (typeof QUICK_CATEGORIES)[number]["id"];

/**
 * "Ce a ieșit din afumătoare" — CMS-ready and off until the owner has a
 * real update. Do not invent a weekly special.
 */
export const WHATS_NEW = {
  enabled: false,
  items: [] as ReadonlyArray<{
    id: string;
    productSlug?: string;
    image?: string;
    title: string;
    body: string;
  }>,
};

/**
 * Contextual related-product headlines. First matching `when` wins.
 * Used on the product page and in the cart once free delivery is cleared.
 */
export const RELATED_HEADLINE_RULES: ReadonlyArray<{
  id: "completeMeal" | "goesWith" | "platter" | "withBeer";
  when: readonly string[];
}> = [
  {
    id: "completeMeal",
    when: [
      "yucola-somon",
      "yucola-de-pastrav",
      "somon-proaspat-afumat",
      "somon-slab-sarat-cu-marar",
      "steak-de-somon-cu-sos-teriyaki",
      "rulada-sah",
      "rulada-trio",
    ],
  },
  {
    id: "goesWith",
    when: ["creveti-afumati-cu-parmezan", "creveti-afumati", "midii-afumate", "midii-marinate"],
  },
  {
    id: "withBeer",
    when: [
      "scrumbie-usor-afumata",
      "scrumbie-slab-sarata",
      "scrumbie-slab-sarata-cu-ceapa",
      "vomer-afumat-la-rece",
    ],
  },
  {
    id: "platter",
    when: [
      "pastrav-intreg-afumat",
      "dorado-afumata",
      "sea-bass-usor-afumat",
      "crap-afumat-la-rece",
      "ton-afumat-in-sos-de-soia",
      "marlin-afumat",
      "escolar-afumat",
      "frigarui-afumate-ton-somon-peste-spada",
    ],
  },
];
