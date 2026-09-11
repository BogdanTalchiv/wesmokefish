import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGridView } from "@/components/collection/ProductGridView";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCollections, getCollectionBySlug, getProductsInCollection } from "@/lib/catalog";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.slug }));
}

type CategoryKey = "peste-si-fructe-de-mare-afumate" | "slab-sarat-si-marinat" | "bere";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "404" };

  const t = getDictionary(locale);
  const name = t.categories.names[slug as CategoryKey] ?? collection.title;
  const blurb = t.categories.blurbs[slug as CategoryKey] ?? "";
  const count = getProductsInCollection(slug).length;

  return buildPageMetadata({
    locale,
    path: ROUTES.collection(slug),
    title: `${name} — ${fill(t.categories.productCount, { count })} | ${t.meta.siteName}`,
    description: `${blurb} ${t.meta.products.description}`.trim(),
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const t = getDictionary(locale);

  const products = getProductsInCollection(slug);
  const name = t.categories.names[slug as CategoryKey] ?? collection.title;
  const blurb = t.categories.blurbs[slug as CategoryKey] ?? "";

  const crumbs = [
    { name: t.nav.home, path: ROUTES.home },
    { name: t.collection.all, path: ROUTES.products },
    { name },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.collection(slug) })),
          locale
        )}
      />
      <JsonLd id="ld-itemlist" data={itemListSchema(products, locale, name)} />

      <div className="container-page pb-20">
        <Breadcrumbs items={crumbs} locale={locale} className="py-5" />

        <header className="max-w-[46ch] pb-8">
          <h1 className="text-(length:--text-display-sm) leading-[1.05]">{name}</h1>
          {blurb && (
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">{blurb}</p>
          )}
        </header>

        <ProductGridView
          products={products}
          locale={locale}
          listName={`collection:${slug}`}
          showCategoryFilter={false}
        />
      </div>
    </>
  );
}
