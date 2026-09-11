import { Leaf, ShoppingBag, Truck, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { DELIVERY } from "@/config/business";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/**
 * Value strip.
 *
 * Each claim traces back to the audit: simple ordering (guest checkout on the
 * Shopify store), the stated delivery windows, the store's own "ambalare eco"
 * wording, and the verified 1.200 MDL free-delivery threshold.
 *
 * Presented as a typographic row rather than the usual four-icon Shopify
 * block — no boxes, no drop shadows.
 */
export function TrustStrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const amount = formatMoney(DELIVERY.freeShippingThreshold, locale);

  const items = [
    { icon: ShoppingBag, ...t.trust.ordering },
    { icon: Truck, ...t.trust.delivery },
    { icon: Leaf, ...t.trust.packaging },
    {
      icon: Wallet,
      title: fill(t.trust.freeShipping.title, { amount }),
      body: fill(t.trust.freeShipping.body, { amount }),
    },
  ];

  return (
    <section className="border-b border-cream-300" aria-label={t.trust.ordering.title}>
      <div className="container-page">
        <ul className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 70}
              className="flex gap-3.5 border-b border-cream-300 py-7 last:border-b-0 sm:border-b-0 lg:pr-8"
            >
              <item.icon
                className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-ember"
                strokeWidth={1.5}
                aria-hidden
              />
              <div>
                <h3 className="font-sans text-[0.8125rem] font-semibold tracking-[0.01em]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-500">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
