import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { CONTACT, DELIVERY } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/**
 * Delivery explainer.
 *
 * Every number here is verified on wesmokefish.md/pages/livrare. The one gap —
 * the delivery fee below the free threshold — is stated honestly as "confirmed
 * by phone" rather than guessed, and switches to a concrete price the moment
 * `DELIVERY.standardFee` is set. Same for the delivery zone.
 */
export function DeliveryInfo({
  locale,
  showCta = true,
}: {
  locale: Locale;
  showCta?: boolean;
}) {
  const t = getDictionary(locale);
  const amount = formatMoney(DELIVERY.freeShippingThreshold, locale);

  return (
    <section className="bg-cream-100 py-20 sm:py-28" aria-labelledby="delivery-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.delivery.eyebrow}
          title={t.delivery.title}
          sub={t.delivery.sub}
          action={
            showCta
              ? { label: t.delivery.cta, href: localePath(locale, ROUTES.delivery) }
              : undefined
          }
        />

        <div className="mt-12 grid gap-x-8 gap-y-10 lg:grid-cols-3">
          {/* Cost */}
          <Reveal>
            <div className="flex items-center gap-2.5">
              <Truck className="h-[1.125rem] w-[1.125rem] shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
              <h3 className="font-sans text-[0.9375rem] font-semibold">
                {fill(t.delivery.freeTitle, { amount })}
              </h3>
            </div>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-500">
              {fill(t.delivery.freeBody, { amount })}
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">
              {DELIVERY.standardFee !== null
                ? fill(t.delivery.feeKnown, {
                    amount,
                    fee: formatMoney(DELIVERY.standardFee, locale),
                  })
                : fill(t.delivery.feeUnknown, { amount })}
            </p>
          </Reveal>

          {/* Windows */}
          <Reveal delay={90}>
            <div className="flex items-center gap-2.5">
              <Clock className="h-[1.125rem] w-[1.125rem] shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
              <h3 className="font-sans text-[0.9375rem] font-semibold">{t.delivery.windowsTitle}</h3>
            </div>
            <ul className="mt-3 space-y-2.5">
              {DELIVERY.windows.map((w) => (
                <li key={`${w.orderFrom}-${w.orderTo}`} className="text-[0.875rem] leading-relaxed text-ink-500">
                  {fill(w.sameDay ? t.delivery.windowSameDay : t.delivery.windowNextDay, {
                    from: w.orderFrom,
                    to: w.orderTo,
                    dFrom: w.deliverFrom,
                    dTo: w.deliverTo,
                  })}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Zone + how to order */}
          <Reveal delay={180}>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-[1.125rem] w-[1.125rem] shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
              <h3 className="font-sans text-[0.9375rem] font-semibold">{t.delivery.zoneTitle}</h3>
            </div>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-500">
              {DELIVERY.zone
                ? fill(t.delivery.zoneKnown, { zone: DELIVERY.zone })
                : t.delivery.zoneUnknown}
            </p>

            <h3 className="mt-7 font-sans text-[0.9375rem] font-semibold">{t.delivery.howTitle}</h3>
            <ol className="mt-3 space-y-1.5">
              {t.delivery.howSteps.map((step, i) => (
                <li key={step} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-500">
                  <span className="shrink-0 tabular-nums text-ink-400">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* Phone ordering */}
        <Reveal className="mt-12 border-t border-cream-300 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-sans text-[0.9375rem] font-semibold">{t.delivery.contactTitle}</h3>
              <p className="mt-1.5 text-[0.875rem] text-ink-500">{t.delivery.contactBody}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonAnchor href={CONTACT.phoneHref} variant="primary" size="md">
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span className="tabular-nums">{CONTACT.phone}</span>
              </ButtonAnchor>
              <ButtonLink href={localePath(locale, ROUTES.contact)} variant="outline" size="md">
                {t.nav.contact}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
