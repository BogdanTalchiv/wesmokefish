import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { PhoneCta } from "@/components/marketing/PhoneCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structuredData";
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
    path: ROUTES.faq,
    title: t.meta.faq.title,
    description: t.meta.faq.description,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const crumbs = [{ name: t.nav.home, path: ROUTES.home }, { name: t.nav.faq }];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.faq })),
          locale
        )}
      />
      <JsonLd id="ld-faq" data={faqSchema(t.faq.items)} />

      <PageHeader title={t.faq.title} eyebrow={t.faq.eyebrow} crumbs={crumbs} locale={locale} />

      {/* PageHeader already supplies the page heading, so the section drops its own. */}
      <Faq locale={locale} hideHeading />

      <div className="container-page">
        <div className="flex flex-col items-start gap-4 rounded-[3px] bg-cream-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="font-display text-lg leading-snug">{t.faq.moreTitle}</p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-500">
              {t.faq.moreBody}
            </p>
          </div>
          <PhoneCta location="faq_page" variant="primary" className="shrink-0" />
        </div>
      </div>

      <FinalCta locale={locale} />
    </>
  );
}
