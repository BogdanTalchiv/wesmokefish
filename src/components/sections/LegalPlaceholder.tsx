import { Mail, Phone } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { CONTACT } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, type Locale } from "@/lib/i18n";

/**
 * Shared body for the four legal pages.
 *
 * These pages deliberately contain NO legal text. Privacy policy, terms,
 * returns and cookie policy all make binding statements about how a specific
 * business actually operates — data retention, processors, refund windows,
 * consumer rights under Moldovan law. Generating that text would produce a
 * document that reads convincingly and commits WeSmokeFish to terms nobody
 * checked, which is worse than an obvious gap.
 *
 * So each page renders a clearly marked placeholder plus real contact
 * details, and stays out of the sitemap-visible promise business until the
 * owner supplies the real text.
 */
export function LegalPlaceholder({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader
        title={title}
        crumbs={[{ name: t.nav.home, path: ROUTES.home }, { name: title }]}
        locale={locale}
      />

      <div className="container-page pb-20">
        <div className="max-w-[62ch] rounded-[3px] border border-dashed border-cream-300 bg-cream-100 p-6 sm:p-8">
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ember">
            {t.legal.needed}
          </p>
          <h2 className="mt-3 font-display text-xl leading-snug">{t.legal.placeholderTitle}</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-700">
            {t.legal.placeholderBody}
          </p>

          <p className="mt-5 border-t border-cream-300 pt-5 text-[0.875rem] leading-relaxed text-ink-500">
            {fill(t.legal.placeholderContact, {
              email: CONTACT.email,
              phone: CONTACT.phone,
            })}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors hover:text-ember"
            >
              <Phone className="h-4 w-4 text-ember" strokeWidth={1.5} aria-hidden />
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors hover:text-ember"
            >
              <Mail className="h-4 w-4 text-ember" strokeWidth={1.5} aria-hidden />
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
