import type { Dictionary } from "@/lib/i18n";

/**
 * Route map. Paths are locale-free here; `localePath()` adds the /ru prefix.
 */
export const ROUTES = {
  home: "/",
  products: "/produse",
  collection: (slug: string) => `/colectii/${slug}`,
  product: (slug: string) => `/produse/${slug}`,
  campaign: (slug: string) => `/campanii/${slug}`,
  occasion: (slug: string) => `/ocazii/${slug}`,
  bundle: (slug: string) => `/seturi/${slug}`,
  delivery: "/livrare",
  about: "/despre-noi",
  contact: "/contact",
  faq: "/intrebari-frecvente",
  privacy: "/politica-de-confidentialitate",
  terms: "/termeni-si-conditii",
  returns: "/politica-de-retur",
  cookies: "/politica-cookie",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary header navigation. */
export function getPrimaryNav(t: Dictionary): NavItem[] {
  return [
    { label: t.nav.products, href: ROUTES.products },
    { label: t.nav.delivery, href: ROUTES.delivery },
    { label: t.nav.about, href: ROUTES.about },
    { label: t.nav.contact, href: ROUTES.contact },
  ];
}

/** Collection slugs in the order we want them presented everywhere. */
export const COLLECTION_ORDER = [
  "peste-si-fructe-de-mare-afumate",
  "slab-sarat-si-marinat",
  "bere",
] as const;

export function getFooterNav(t: Dictionary) {
  return {
    shop: [
      { label: t.collection.all, href: ROUTES.products },
      { label: t.categories.names["peste-si-fructe-de-mare-afumate"], href: ROUTES.collection("peste-si-fructe-de-mare-afumate") },
      { label: t.categories.names["slab-sarat-si-marinat"], href: ROUTES.collection("slab-sarat-si-marinat") },
      { label: t.categories.names.bere, href: ROUTES.collection("bere") },
      { label: t.occasions.nav, href: ROUTES.occasion("platou") },
      { label: t.bundles.nav, href: ROUTES.bundle("pentru-doi") },
    ],
    info: [
      { label: t.nav.delivery, href: ROUTES.delivery },
      { label: t.nav.faq, href: ROUTES.faq },
      { label: t.nav.about, href: ROUTES.about },
      { label: t.nav.contact, href: ROUTES.contact },
    ],
    legal: [
      { label: t.footer.privacy, href: ROUTES.privacy },
      { label: t.footer.terms, href: ROUTES.terms },
      { label: t.footer.returns, href: ROUTES.returns },
      { label: t.footer.cookies, href: ROUTES.cookies },
    ],
  };
}
