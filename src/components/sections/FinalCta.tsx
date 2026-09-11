import { Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { CONTACT } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Closing CTA. Restates the same-day cut-off, because that is the single most
 * persuasive verified fact the store has, then offers both paths to purchase:
 * browse, or call.
 */
export function FinalCta({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-(length:--text-display) leading-[1.02]">{t.finalCta.title}</h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-500">
            {t.finalCta.body}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, ROUTES.products)} variant="primary" size="lg">
              {t.finalCta.ctaPrimary}
            </ButtonLink>
            <ButtonAnchor href={CONTACT.phoneHref} variant="outline" size="lg">
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {t.finalCta.ctaSecondary}
            </ButtonAnchor>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
