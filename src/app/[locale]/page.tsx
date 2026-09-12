import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Occasions } from "@/components/sections/Occasions";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { SignatureProduct } from "@/components/sections/SignatureProduct";
import { Bundles } from "@/components/sections/Bundles";
import { EditorialBreak } from "@/components/sections/EditorialBreak";
import { Process } from "@/components/sections/Process";
import { WhatsNew } from "@/components/sections/WhatsNew";
import { Reviews } from "@/components/sections/Reviews";
import { SocialGallery } from "@/components/sections/SocialGallery";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { QuickCategories } from "@/components/navigation/QuickCategories";
import { ProductRail } from "@/components/product/ProductRail";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProductsBySlugs } from "@/lib/catalog";
import { BESTSELLER_SLUGS, PRODUCTS_OF_THE_WEEK_SLUGS } from "@/data/merchandising";
import { faqSchema, itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { getDictionary, isLocale, localePath, type Locale } from "@/lib/i18n";

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
    path: ROUTES.home,
    title: t.meta.home.title,
    description: t.meta.home.description,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const bestsellers = getProductsBySlugs(BESTSELLER_SLUGS);
  const weekly = getProductsBySlugs(PRODUCTS_OF_THE_WEEK_SLUGS);

  return (
    <>
      <JsonLd id="ld-faq" data={faqSchema(t.faq.items)} />
      <JsonLd id="ld-bestsellers" data={itemListSchema(bestsellers, locale)} />

      <Hero locale={locale} />
      <TrustStrip locale={locale} />

      <div className="border-b border-cream-300 py-3 sm:hidden">
        <div className="container-page">
          <QuickCategories locale={locale} />
        </div>
      </div>

      <Occasions locale={locale} />

      <CategoryTiles locale={locale} />

      <section className="pb-20 sm:pb-28" aria-labelledby="bestsellers-heading">
        <div className="container-page">
          <SectionHeading
            eyebrow={t.bestsellers.eyebrow}
            title={t.bestsellers.title}
            sub={t.bestsellers.sub}
            action={{ label: t.bestsellers.cta, href: localePath(locale, ROUTES.products) }}
            headingId="bestsellers-heading"
          />
          <ProductRail
            products={bestsellers}
            locale={locale}
            listName="bestsellers"
            className="mt-10 sm:mt-12"
          />
        </div>
      </section>

      <SignatureProduct locale={locale} />

      <section className="py-20 sm:py-28" aria-labelledby="weekly-heading">
        <div className="container-page">
          <SectionHeading
            eyebrow={t.weekly.eyebrow}
            title={t.weekly.title}
            sub={t.weekly.sub}
            headingId="weekly-heading"
          />
          <ProductRail
            products={weekly}
            locale={locale}
            listName="products_of_the_week"
            variant="grid"
            className="mt-10 sm:mt-12"
          />
        </div>
      </section>

      <Bundles locale={locale} />
      <Process locale={locale} />
      <EditorialBreak locale={locale} />
      <WhatsNew locale={locale} />
      <Reviews locale={locale} />
      <SocialGallery locale={locale} />
      <DeliveryInfo locale={locale} />
      <Faq locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
