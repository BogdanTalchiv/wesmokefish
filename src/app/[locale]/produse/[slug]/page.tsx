import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewed, TrackProductView } from "@/components/product/RecentlyViewed";
import { Breadcrumbs, type Crumb } from "@/components/navigation/Breadcrumbs";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllProducts, getCollectionBySlug, getProductBySlug } from "@/lib/catalog";
import { getProductCopy, getProductFacts } from "@/lib/catalog/content";
import { getBundlePartner, getRelatedProducts } from "@/lib/cart/recommendations";
import { breadcrumbSchema, productSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DELIVERY } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/** Every product is prerendered at build time for both locales. */
export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  const product = getProductBySlug(slug);

  if (!product) return { title: "404" };

  const copy = getProductCopy(product);
  const t = getDictionary(locale);

  /*
    Title and description are written for search intent: product name plus the
    two things a local shopper is actually searching for — that it is smoked
    fish, and that it is delivered in Chișinău. Price is included because it
    lifts click-through on shopping-intent queries.
  */
  const title = `${product.title} — ${formatMoney(product.priceMin, locale)} | ${t.meta.siteName}`;
  const description = `${copy.short} ${fill(t.hero.badges.freeShipping, {
    amount: formatMoney(DELIVERY.freeShippingThreshold, locale),
  })}. ${t.hero.badges.sameDay}.`;

  return buildPageMetadata({
    locale,
    path: ROUTES.product(product.slug),
    title,
    description,
    image: product.images[0]?.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const copy = getProductCopy(product);
  const facts = getProductFacts(product);
  const related = getRelatedProducts(product, 4);
  const partner = getBundlePartner(product);

  const collectionSlug = product.collections[0];
  const collection = collectionSlug ? getCollectionBySlug(collectionSlug) : undefined;

  const crumbs: Crumb[] = [
    { name: t.nav.home, path: ROUTES.home },
    { name: t.collection.all, path: ROUTES.products },
    ...(collection
      ? [
          {
            name: t.categories.names[collection.slug as keyof typeof t.categories.names],
            path: ROUTES.collection(collection.slug),
          },
        ]
      : []),
    { name: product.title },
  ];

  const factRows = [
    { label: t.product.ingredients, value: facts.ingredients },
    { label: t.product.allergens, value: facts.allergens },
    { label: t.product.storage, value: facts.storage },
    { label: t.product.shelfLife, value: facts.shelfLife },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <>
      <JsonLd id="ld-product" data={productSchema(product, locale)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.product(product.slug) })),
          locale
        )}
      />
      <TrackProductView slug={product.slug} />

      <div className="container-page">
        <Breadcrumbs items={crumbs} locale={locale} className="py-5" />

        <div className="grid gap-10 pb-16 lg:grid-cols-2 lg:gap-14 lg:pb-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} title={product.title} locale={locale} />
            {product.images.length === 1 && (
              <p className="mt-3 text-xs text-ink-400">{t.product.oneImageOnly}</p>
            )}
          </div>

          {/* Details + purchase */}
          <div id="purchase-panel">
            <h1 className="text-(length:--text-display-sm) leading-[1.05]">{product.title}</h1>

            <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-500">
              {copy.short}
            </p>

            <div className="mt-8">
              <ProductPurchase product={product} locale={locale} />
            </div>

            {/* Description */}
            <div className="mt-10 border-t border-cream-300 pt-8">
              <h2 className="eyebrow">{t.product.description}</h2>
              <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-700">
                {copy.long}
              </p>
            </div>

            {/* Product facts — rendered only when the owner has supplied them. */}
            {factRows.length > 0 ? (
              <div className="mt-8 border-t border-cream-300 pt-8">
                <h2 className="eyebrow">{t.product.details}</h2>
                <dl className="mt-3 divide-y divide-cream-200">
                  {factRows.map((row) => (
                    <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                      <dt className="text-[0.8125rem] font-medium text-ink-500">{row.label}</dt>
                      <dd className="text-[0.875rem] leading-relaxed text-ink-700">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="mt-8 border-t border-cream-300 pt-8 text-xs leading-relaxed text-ink-400">
                {t.product.factsMissing}
              </p>
            )}

            {/* Delivery, restated at the point of decision */}
            <div className="mt-8 border-t border-cream-300 pt-8">
              <h2 className="eyebrow">{t.product.deliveryTitle}</h2>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-ink-700">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
                  {fill(t.delivery.freeBody, {
                    amount: formatMoney(DELIVERY.freeShippingThreshold, locale),
                  })}
                </li>
                {DELIVERY.windows.map((w) => (
                  <li
                    key={`${w.orderFrom}-${w.orderTo}`}
                    className="pl-[1.625rem] text-[0.875rem] leading-relaxed text-ink-500"
                  >
                    {fill(w.sameDay ? t.delivery.windowSameDay : t.delivery.windowNextDay, {
                      from: w.orderFrom,
                      to: w.orderTo,
                      dFrom: w.deliverFrom,
                      dTo: w.deliverTo,
                    })}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bundle */}
            {partner && (
              <div className="mt-8">
                <FrequentlyBoughtTogether product={product} partner={partner} locale={locale} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-cream-300 py-16 sm:py-20" aria-labelledby="related-heading">
          <div className="container-page">
            <SectionHeading title={t.product.related} as="h2" />
            <ProductRail
              products={related}
              locale={locale}
              listName={`related:${product.slug}`}
              className="mt-8"
            />
          </div>
        </section>
      )}

      <RecentlyViewed locale={locale} excludeSlug={product.slug} />
    </>
  );
}
