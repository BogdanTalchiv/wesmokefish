import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGridView } from "@/components/collection/ProductGridView";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllProducts } from "@/lib/catalog";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  const t = getDictionary(locale);

  return buildPageMetadata({
    locale,
    path: ROUTES.products,
    title: t.meta.products.title,
    description: t.meta.products.description,
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const products = getAllProducts();

  const crumbs = [
    { name: t.nav.home, path: ROUTES.home },
    { name: t.collection.all },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.products })),
          locale
        )}
      />
      <JsonLd
        id="ld-itemlist"
        data={itemListSchema(products.slice(0, 24), locale, t.collection.all)}
      />

      <div className="container-page pb-20">
        <Breadcrumbs items={crumbs} locale={locale} className="py-5" />

        <header className="max-w-[42ch] pb-8">
          <h1 className="text-(length:--text-display-sm) leading-[1.05]">{t.collection.all}</h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
            {t.collection.allSub}
          </p>
        </header>

        <ProductGridView products={products} locale={locale} listName="all_products" />
      </div>
    </>
  );
}
