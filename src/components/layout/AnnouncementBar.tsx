import { Phone, Truck } from "lucide-react";
import { CONTACT, DELIVERY } from "@/config/business";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/**
 * Announcement bar. Carries only the two facts verified on the live site: the
 * free-delivery threshold and the same-day cut-off. No countdowns, no fake
 * promotions.
 */
export function AnnouncementBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="bg-ink text-cream">
      <div className="container-page">
        <div className="flex h-9 items-center justify-center gap-6 text-[0.6875rem] tracking-[0.08em] uppercase sm:justify-between">
          <p className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
            {fill(t.announcement.freeShipping, {
              amount: formatMoney(DELIVERY.freeShippingThreshold, locale),
            })}
          </p>

          <p className="hidden sm:block">{t.announcement.sameDay}</p>

          <a
            href={CONTACT.phoneHref}
            className="hidden items-center gap-2 transition-colors hover:text-ember md:flex"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="tabular-nums">{CONTACT.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
