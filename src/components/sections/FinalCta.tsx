import Image from "next/image";
import { Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { CONTACT } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Closing CTA. Food photography first, one question, one next step.
 */
export function FinalCta({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const image = getProductBySlug("creveti-afumati-cu-parmezan")?.images[0];

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {image && (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="100vw"
            quality={78}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/70" aria-hidden />
      </div>

      <div className="relative z-10">
        <div className="container-page">
          <Reveal className="flex min-h-[26rem] flex-col items-center justify-center py-20 text-center sm:min-h-[32rem] sm:py-28">
            <h2 className="max-w-[16ch] font-display text-(length:--text-display) leading-[1.02] text-cream">
              {t.finalCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-cream/65">
              {t.finalCta.body}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={localePath(locale, ROUTES.products)} variant="light" size="lg">
                {t.finalCta.ctaPrimary}
              </ButtonLink>
              <ButtonAnchor href={CONTACT.phoneHref} variant="onDark" size="lg">
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {t.finalCta.ctaSecondary}
              </ButtonAnchor>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
