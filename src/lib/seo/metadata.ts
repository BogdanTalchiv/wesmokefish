import type { Metadata } from "next";
import { BRAND, SITE_URL } from "@/config/business";
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS, localePath, type Locale } from "@/lib/i18n/config";

/** Absolute URL for a locale-free path. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * Builds the hreflang map for a page. Every page declares both language
 * versions plus x-default pointing at Romanian, which is what Google expects
 * for a market with two co-official languages.
 */
export function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_TAGS[locale]] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(DEFAULT_LOCALE, path);
  return languages;
}

type PageMetaInput = {
  locale: Locale;
  /** Locale-free path, e.g. "/produse/yucola-somon". */
  path: string;
  title: string;
  description: string;
  /** Absolute or CDN image URL for OG/Twitter cards. */
  image?: string;
  /** Set for pages that must not be indexed (e.g. thin campaign variants). */
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex = false,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = image ?? `${SITE_URL}/opengraph-image`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: buildAlternates(path),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: BRAND.name,
      locale: LOCALE_TAGS[locale].replace("-", "_"),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}
