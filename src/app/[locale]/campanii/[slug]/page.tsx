import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ProductRail } from "@/components/product/ProductRail";
import { Faq } from "@/components/sections/Faq";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { Reviews } from "@/components/sections/Reviews";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneCta } from "@/components/marketing/PhoneCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { CAMPAIGN_LANDINGS, type CampaignSlug } from "@/data/merchandising";
import { getProductsBySlugs } from "@/lib/catalog";
import { itemListSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/config/navigation";
import { getDictionary, isLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Campaign landing pages for paid social traffic.
 *
 * Why these exist instead of pointing ads at the homepage: an ad for salmon
 * should land on salmon. Each page repeats the ad's promise in the headline
 * (message match), shows only the products that promise refers to, answers
 * the objections that stop a first-time buyer, and keeps the navigation
 * intentionally quiet so the only obvious next step is to buy.
 *
 * The product sets and slugs live in src/data/merchandising.ts and the copy
 * lives in the dictionaries, so marketing can retarget a campaign without
 * touching this file.
 */

export function generateStaticParams() {
  return CAMPAIGN_LANDINGS.map((campaign) => ({ slug: campaign.slug }));
}

function getCampaign(slug: string) {
  return CAMPAIGN_LANDINGS.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  if (!getCampaign(slug)) return { title: "404" };

  const t = getDictionary(locale);
  const copy = t.campaign[slug as CampaignSlug];
  const products = getProductsBySlugs([...(getCampaign(slug)?.productSlugs ?? [])]);

  return buildPageMetadata({
    locale,
    path: ROUTES.campaign(slug),
    title: `${copy.title} | ${t.meta.siteName}`,
    description: copy.sub,
    image: products[0]?.images[0]?.url,
  });
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  const t = getDictionary(locale);
  const copy = t.campaign[slug as CampaignSlug];
  const products = getProductsBySlugs([...campaign.productSlugs]);
  const heroImage = products[0]?.images[0]?.url;

  return (
    <>
      <JsonLd id="ld-itemlist" data={itemListSchema(products, locale, copy.title)} />

      {/* Hero — message match with the ad creative */}
      <section className="relative overflow-hidden bg-ink text-cream">
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={80}
              className="object-cover opacity-45"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35"
              aria-hidden
            />
          </>
        )}

        <div className="container-page relative z-10 flex min-h-[26rem] flex-col justify-end py-16 sm:min-h-[32rem] sm:py-20">
          <p className="eyebrow text-ember">{copy.eyebrow}</p>
          <h1 className="mt-3 max-w-[22ch] text-(length:--text-display) leading-[1.02] text-cream">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-cream/70">
            {copy.sub}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#produse" variant="accent" size="lg">
              {copy.cta}
            </ButtonLink>
            <PhoneCta location={`campaign_${slug}`} variant="onDark" size="lg" />
          </div>
        </div>
      </section>

      {/* Benefits — the three objections that stop a first-time buyer */}
      <section className="border-b border-cream-300" aria-label={copy.eyebrow}>
        <div className="container-page">
          <ul className="grid gap-x-8 gap-y-6 py-10 sm:grid-cols-3">
            {copy.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" strokeWidth={2} aria-hidden />
                <div>
                  <p className="text-[0.9375rem] leading-snug font-medium">{benefit.title}</p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">
                    {benefit.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The products the ad promised, and nothing else */}
      <section id="produse" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="campaign-products">
        <div className="container-page">
          <h2 id="campaign-products" className="text-(length:--text-display-sm) leading-[1.05]">
            {copy.title}
          </h2>
          <ProductRail
            products={products}
            locale={locale}
            listName={`campaign:${slug}`}
            variant="grid"
            priorityCount={4}
            className="mt-10"
          />

          <div className="mt-12 text-center">
            <ButtonLink
              href={localePath(locale, ROUTES.products)}
              variant="outline"
              size="lg"
            >
              {t.nav.allProducts}
            </ButtonLink>
          </div>
        </div>
      </section>

      <Reviews locale={locale} />
      <DeliveryInfo locale={locale} />
      <Faq locale={locale} />
    </>
  );
}
