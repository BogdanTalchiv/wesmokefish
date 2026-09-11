import { BRAND, CONTACT, DELIVERY, REVIEWS, SITE_URL, SOCIAL } from "@/config/business";
import type { Product } from "@/lib/catalog/types";
import { getProductCopy } from "@/lib/catalog/content";
import { absoluteUrl } from "./metadata";
import { ROUTES } from "@/config/navigation";
import type { Locale } from "@/lib/i18n/config";

/**
 * Structured data.
 *
 * Every field here maps to something verified during the audit. Notably there
 * is NO aggregateRating or review markup: the store has no review data, and
 * emitting a rating we cannot substantiate is both dishonest and a Google
 * structured-data violation. It switches on automatically once REVIEWS.enabled
 * is set with real data.
 */

export function organizationSchema() {
  const sameAs = [SOCIAL.instagram, SOCIAL.tiktok, SOCIAL.facebook].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    },
    sameAs,
  };
}

/**
 * The business sells prepared food from a physical address in Chișinău, so
 * LocalBusiness/Store is the accurate type alongside Organization.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: BRAND.name,
    image: `${SITE_URL}/opengraph-image`,
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "$$",
    currenciesAccepted: DELIVERY.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    },
    // Opening hours are not published on the current site, so they are omitted
    // rather than guessed. Add `openingHoursSpecification` once confirmed.
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND.name,
    url: absoluteUrl(locale, ROUTES.home),
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "ru" ? "ru-MD" : "ro-MD",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(locale, ROUTES.products)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product, locale: Locale) {
  const copy = getProductCopy(product);
  const url = absoluteUrl(locale, ROUTES.product(product.slug));

  const offers = product.variants.map((variant) => ({
    "@type": "Offer",
    url,
    priceCurrency: DELIVERY.currency,
    price: variant.price.toFixed(2),
    availability: variant.available
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    ...(variant.title ? { name: variant.title } : {}),
    ...(variant.grams
      ? {
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: variant.grams,
            unitCode: "GRM",
          },
        }
      : {}),
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        currency: DELIVERY.currency,
        // Only the verified free-delivery threshold is expressed here.
        value: variant.price >= DELIVERY.freeShippingThreshold ? "0" : undefined,
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "MD",
      },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: copy.long,
    sku: product.variants[0]?.sku ?? product.id,
    image: product.images.map((img) => img.url),
    brand: { "@type": "Brand", name: BRAND.name },
    url,
    offers:
      offers.length === 1
        ? offers[0]
        : {
            "@type": "AggregateOffer",
            priceCurrency: DELIVERY.currency,
            lowPrice: product.priceMin.toFixed(2),
            highPrice: product.priceMax.toFixed(2),
            offerCount: offers.length,
            availability: product.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            offers,
          },
    // Ratings are only emitted when backed by real review data.
    ...(REVIEWS.enabled && REVIEWS.ratingValue && REVIEWS.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: REVIEWS.ratingValue,
            reviewCount: REVIEWS.reviewCount,
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function faqSchema(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListSchema(products: Product[], locale: Locale, name?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(name ? { name } : {}),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(locale, ROUTES.product(product.slug)),
      name: product.title,
    })),
  };
}
