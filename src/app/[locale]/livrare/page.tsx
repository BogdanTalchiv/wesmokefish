import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Truck } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { PhoneCta } from "@/components/marketing/PhoneCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DELIVERY } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

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
    path: ROUTES.delivery,
    title: t.meta.delivery.title,
    description: t.meta.delivery.description,
  });
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const threshold = formatMoney(DELIVERY.freeShippingThreshold, locale);

  const crumbs = [{ name: t.nav.home, path: ROUTES.home }, { name: t.nav.delivery }];

  /*
    Every card below states only what the live store actually publishes.
    The standard delivery fee and the delivery zone are not published
    anywhere, so instead of inventing a number or a radius we say plainly
    that it is confirmed by phone. Fill in DELIVERY.standardFee / .zone in
    src/config/business.ts and these two cards switch to the exact wording
    automatically.
  */
  const cards = [
    {
      icon: Truck,
      title: fill(t.delivery.freeTitle, { amount: threshold }),
      body: fill(t.delivery.freeBody, { amount: threshold }),
      note:
        DELIVERY.standardFee === null
          ? fill(t.delivery.feeUnknown, { amount: threshold })
          : fill(t.delivery.feeKnown, {
              amount: threshold,
              fee: formatMoney(DELIVERY.standardFee, locale),
            }),
    },
    {
      icon: Clock,
      title: t.delivery.windowsTitle,
      body: null,
      windows: DELIVERY.windows.map((w) =>
        fill(w.sameDay ? t.delivery.windowSameDay : t.delivery.windowNextDay, {
          from: w.orderFrom,
          to: w.orderTo,
          dFrom: w.deliverFrom,
          dTo: w.deliverTo,
        })
      ),
    },
    {
      icon: MapPin,
      title: t.delivery.zoneTitle,
      body: DELIVERY.zone === null ? t.delivery.zoneUnknown : fill(t.delivery.zoneKnown, { zone: DELIVERY.zone }),
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.delivery })),
          locale
        )}
      />
      <JsonLd id="ld-faq" data={faqSchema(t.faq.items)} />

      <PageHeader
        eyebrow={t.delivery.eyebrow}
        title={t.delivery.title}
        lede={t.delivery.sub}
        crumbs={crumbs}
        locale={locale}
      />

      <div className="container-page">
        <div className="grid gap-px overflow-hidden rounded-[3px] bg-cream-300 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="bg-cream-100 p-6 sm:p-7">
              <card.icon className="h-5 w-5 text-ember" strokeWidth={1.5} aria-hidden />
              <h2 className="mt-4 font-display text-lg leading-snug">{card.title}</h2>
              {card.body && (
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-500">{card.body}</p>
              )}
              {"windows" in card && card.windows && (
                <ul className="mt-2.5 space-y-2">
                  {card.windows.map((w) => (
                    <li key={w} className="text-[0.875rem] leading-relaxed text-ink-500">
                      {w}
                    </li>
                  ))}
                </ul>
              )}
              {"note" in card && card.note && (
                <p className="mt-3 border-t border-cream-300 pt-3 text-[0.8125rem] leading-relaxed text-ink-400">
                  {card.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* How to order */}
        <section className="py-16 sm:py-20" aria-labelledby="how-to-order">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 id="how-to-order" className="text-(length:--text-display-sm) leading-[1.05]">
                {t.delivery.howTitle}
              </h2>
              <div className="mt-7 rounded-[3px] bg-ink p-6 text-cream sm:p-7">
                <p className="font-display text-lg leading-snug">{t.delivery.contactTitle}</p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/65">
                  {t.delivery.contactBody}
                </p>
                <PhoneCta location="delivery_page" variant="light" className="mt-5" />
              </div>
            </div>

            <ol className="space-y-0 divide-y divide-cream-300 border-y border-cream-300">
              {t.delivery.howSteps.map((step, i) => (
                <li key={step} className="flex gap-5 py-5">
                  <span
                    className="font-display text-xl leading-none text-ember/40 tabular-nums"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <Faq locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
