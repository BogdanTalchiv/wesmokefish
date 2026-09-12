import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductRail } from "@/components/product/ProductRail";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OCCASIONS, type OccasionSlug } from "@/data/merchandising";
import { getOccasion, getOccasionProducts } from "@/lib/merchandising";
import { getProductBySlug } from "@/lib/catalog";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ slug: occasion.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  if (!getOccasion(slug)) return { title: "404" };

  const t = getDictionary(locale);
  const name = t.occasions.names[slug as OccasionSlug];
  const blurb = t.occasions.blurbs[slug as OccasionSlug];
  const occasion = getOccasion(slug);
  const cover = occasion ? getProductBySlug(occasion.imageSlug) : undefined;

  return buildPageMetadata({
    locale,
    path: ROUTES.occasion(slug),
    title: `${name} — ${t.meta.siteName}`,
    description: `${blurb} ${t.hero.badges.sameDay}.`,
    image: cover?.images[0]?.url,
  });
}

export default async function OccasionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  if (!getOccasion(slug)) notFound();

  const t = getDictionary(locale);
  const name = t.occasions.names[slug as OccasionSlug];
  const blurb = t.occasions.blurbs[slug as OccasionSlug];
  const products = getOccasionProducts(slug);
  const occasion = getOccasion(slug);
  const heroImage =
    (occasion ? getProductBySlug(occasion.imageSlug)?.images[0] : undefined) ??
    products[0]?.images[0];

  const crumbs = [
    { name: t.nav.home, path: ROUTES.home },
    { name: t.occasions.nav, path: ROUTES.products },
    { name },
  ];

  return (
    <>
      <JsonLd id="ld-itemlist" data={itemListSchema(products, locale, name)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.occasion(slug) })),
          locale
        )}
      />

      <div className="container-page">
        <Breadcrumbs items={crumbs} locale={locale} className="py-5" />
      </div>

      <section className="relative overflow-hidden bg-ink text-cream">
        {heroImage && (
          <>
            <Image
              src={heroImage.url}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={80}
              className="object-cover opacity-50"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
              aria-hidden
            />
          </>
        )}
        <div className="container-page relative z-10">
          <div className="flex min-h-[18rem] flex-col justify-end py-14 sm:min-h-[22rem] sm:py-16">
            <p className="eyebrow text-ember">{t.occasions.eyebrow}</p>
            <h1 className="mt-3 max-w-[16ch] text-(length:--text-display) leading-[1.02]">
              {name}
            </h1>
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-cream/70">
              {blurb}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="occasion-products">
        <div className="container-page">
          <h2 id="occasion-products" className="sr-only">
            {name}
          </h2>
          <ProductRail
            products={products}
            locale={locale}
            listName={`occasion:${slug}`}
            variant="grid"
            priorityCount={4}
          />
        </div>
      </section>

      <DeliveryInfo locale={locale} />
    </>
  );
}
