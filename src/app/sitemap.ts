import type { MetadataRoute } from "next";
import { getAllCollections, getAllProducts } from "@/lib/catalog";
import { BUNDLES, CAMPAIGN_LANDINGS, OCCASIONS } from "@/data/merchandising";
import { ROUTES } from "@/config/navigation";
import { SITE_URL } from "@/config/business";
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS, localePath } from "@/lib/i18n/config";

/**
 * Sitemap.
 *
 * Every URL is listed once per locale with an `alternates.languages` map, so
 * Google sees the Romanian and Russian versions as the same page in two
 * languages rather than as duplicates.
 *
 * The legal pages are deliberately absent: they are marked noindex while they
 * are still placeholders, and a sitemap entry for a noindex page is a
 * contradiction Search Console reports as an error.
 */

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string | Date
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_TAGS[locale]] = `${SITE_URL}${localePath(locale, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localePath(DEFAULT_LOCALE, path)}`;

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, path)}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const collections = getAllCollections();

  return [
    ...entry(ROUTES.home, "weekly", 1),
    ...entry(ROUTES.products, "weekly", 0.9),

    ...collections.flatMap((collection) =>
      entry(ROUTES.collection(collection.slug), "weekly", 0.8)
    ),

    ...products.flatMap((product) =>
      entry(ROUTES.product(product.slug), "weekly", 0.7, product.createdAt)
    ),

    ...CAMPAIGN_LANDINGS.flatMap((campaign) =>
      entry(ROUTES.campaign(campaign.slug), "monthly", 0.6)
    ),

    ...OCCASIONS.flatMap((occasion) =>
      entry(ROUTES.occasion(occasion.slug), "weekly", 0.7)
    ),

    ...BUNDLES.flatMap((bundle) =>
      entry(ROUTES.bundle(bundle.slug), "weekly", 0.65)
    ),

    ...entry(ROUTES.delivery, "monthly", 0.6),
    ...entry(ROUTES.faq, "monthly", 0.6),
    ...entry(ROUTES.contact, "monthly", 0.5),
    ...entry(ROUTES.about, "monthly", 0.4),
  ];
}
