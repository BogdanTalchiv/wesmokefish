import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPlaceholder } from "@/components/sections/LegalPlaceholder";
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
    path: ROUTES.returns,
    title: t.legal.returnsTitle,
    description: t.legal.placeholderBody,
    noIndex: true,
  });
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return <LegalPlaceholder locale={locale} title={getDictionary(locale).legal.returnsTitle} />;
}
