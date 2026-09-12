import { Reveal } from "@/components/ui/Reveal";
import { DELIVERY } from "@/config/business";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/**
 * Value strip — typographic, no icon grid.
 *
 * Each claim is still the verified one: guest checkout, same-day window,
 * eco packaging wording from the live store, 1.200 MDL free delivery.
 */
export function TrustStrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const amount = formatMoney(DELIVERY.freeShippingThreshold, locale);

  const items = [
    t.trust.ordering,
    t.trust.delivery,
    t.trust.packaging,
    {
      title: fill(t.trust.freeShipping.title, { amount }),
      body: fill(t.trust.freeShipping.body, { amount }),
    },
  ];

  return (
    <section className="border-b border-cream-300" aria-label={t.trust.ordering.title}>
      <div className="container-page">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 60}
              className="border-b border-cream-300 py-8 last:border-b-0 sm:border-b-0 sm:pr-10 lg:py-10"
            >
              <p className="font-display text-[1.375rem] leading-tight">{item.title}</p>
              <p className="mt-2 max-w-[28ch] text-[0.8125rem] leading-relaxed text-ink-500">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
