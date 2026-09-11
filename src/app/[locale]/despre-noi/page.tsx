import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Process } from "@/components/sections/Process";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/structuredData";
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
    path: ROUTES.about,
    title: t.meta.about.title,
    description: t.meta.about.description,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const crumbs = [{ name: t.nav.home, path: ROUTES.home }, { name: t.nav.about }];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.about })),
          locale
        )}
      />

      <PageHeader
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        lede={t.about.lead}
        crumbs={crumbs}
        locale={locale}
      />

      <div className="container-page">
        <div className="max-w-[62ch] space-y-5">
          {t.about.body.map((paragraph) => (
            <p key={paragraph} className="text-[1.0625rem] leading-relaxed text-ink-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/*
          Marked placeholder rather than an invented founding story. The real
          brand history, team and production details have to come from
          WeSmokeFish — see t.about.placeholderNote.
        */}
        <aside className="mt-10 max-w-[62ch] rounded-[3px] border border-dashed border-cream-300 bg-cream-100 p-5">
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ember">
            {t.legal.needed}
          </p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">
            {t.about.placeholderNote}
          </p>
        </aside>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, ROUTES.products)} variant="primary" size="lg">
            {t.about.ctaProducts}
          </ButtonLink>
          <ButtonLink href={localePath(locale, ROUTES.contact)} variant="outline" size="lg">
            {t.about.ctaContact}
          </ButtonLink>
        </div>
      </div>

      <Process locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
