import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddBundleButton } from "@/components/product/AddBundleButton";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Price } from "@/components/ui/Price";
import { JsonLd } from "@/components/seo/JsonLd";
import { BUNDLES, type BundleSlug } from "@/data/merchandising";
import { getBundle, getBundleProducts, getBundleTotal } from "@/lib/merchandising";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { getDictionary, isLocale, localePath, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return BUNDLES.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  if (!getBundle(slug)) return { title: "404" };

  const t = getDictionary(locale);
  const name = t.bundles.names[slug as BundleSlug];
  const blurb = t.bundles.blurbs[slug as BundleSlug];
  const products = getBundleProducts(slug);

  return buildPageMetadata({
    locale,
    path: ROUTES.bundle(slug),
    title: `${name} — ${t.meta.siteName}`,
    description: `${blurb} ${t.bundles.sub}`,
    image: products[0]?.images[0]?.url,
  });
}

export default async function BundlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  if (!getBundle(slug)) notFound();

  const t = getDictionary(locale);
  const name = t.bundles.names[slug as BundleSlug];
  const blurb = t.bundles.blurbs[slug as BundleSlug];
  const products = getBundleProducts(slug);
  if (products.length === 0) notFound();

  const total = getBundleTotal(products);

  const crumbs = [
    { name: t.nav.home, path: ROUTES.home },
    { name: t.bundles.nav, path: ROUTES.bundle("pentru-doi") },
    { name },
  ];

  return (
    <>
      <JsonLd id="ld-itemlist" data={itemListSchema(products, locale, name)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.bundle(slug) })),
          locale
        )}
      />

      <div className="container-page pb-20">
        <Breadcrumbs items={crumbs} locale={locale} className="py-5" />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={localePath(locale, ROUTES.product(product.slug))}
                className="photo-well relative aspect-[4/5] overflow-hidden rounded-[3px]"
              >
                {product.images[0] && (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1023px) 50vw, 28vw"
                    quality={80}
                    className="object-cover"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="lg:sticky lg:top-24">
            <p className="eyebrow">{t.bundles.eyebrow}</p>
            <h1 className="mt-3 text-(length:--text-display-sm) leading-[1.05]">{name}</h1>
            <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-500">
              {blurb}
            </p>

            <p className="mt-8 text-[0.6875rem] tracking-[0.1em] uppercase text-ink-400">
              {t.bundles.includes}
            </p>
            <ul className="mt-3 divide-y divide-cream-200">
              {products.map((product) => {
                const variant = getDefaultVariant(product);
                return (
                  <li key={product.slug} className="flex items-baseline justify-between gap-4 py-3">
                    <Link
                      href={localePath(locale, ROUTES.product(product.slug))}
                      className="text-[0.9375rem] font-medium transition-colors hover:text-ember"
                    >
                      {product.title}
                      {variant.title && (
                        <span className="ml-1.5 text-ink-400">
                          · {formatVariantLabel(variant.title, locale)}
                        </span>
                      )}
                    </Link>
                    <Price amount={variant.price} locale={locale} className="shrink-0 tabular-nums" />
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-end justify-between border-t border-cream-300 pt-6">
              <p className="text-[0.6875rem] tracking-[0.1em] uppercase text-ink-400">
                {t.bundles.total}
              </p>
              <Price amount={total} locale={locale} className="font-display text-3xl" />
            </div>

            <AddBundleButton products={products} locale={locale} className="mt-6 w-full" />
          </div>
        </div>
      </div>

      <DeliveryInfo locale={locale} />
    </>
  );
}
