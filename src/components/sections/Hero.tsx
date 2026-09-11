import Image from "next/image";
import { Clock, MapPin, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroMedia } from "./HeroMedia";
import { DELIVERY } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { SIGNATURE_SLUG } from "@/data/merchandising";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

/**
 * Hero.
 *
 * Answers what / why / where / what-next in one screen: full-bleed product
 * photography, a short headline, and two CTAs. The signal strip underneath
 * carries only facts verified on the live site — the 1.200 MDL free-delivery
 * threshold, the same-day cut-off, and the Chișinău base.
 *
 * The image is the LCP element, so it is priority-loaded, sized per breakpoint
 * and given a reserved box to keep CLS at zero.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const signature = getProductBySlug(SIGNATURE_SLUG);
  const heroImage = signature?.images[0]?.url;

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Media layer */}
      <div className="absolute inset-0">
        {heroImage && (
          <HeroMedia>
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              fetchPriority="high"
              quality={80}
              sizes="100vw"
              className="object-cover object-[58%_center] sm:object-center"
            />
          </HeroMedia>
        )}

        {/*
          Two overlays rather than one: a bottom-weighted gradient for text
          contrast, plus a light left-side wash so the headline stays legible
          over the brighter part of the photograph on wide screens.
        */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden bg-gradient-to-r from-ink/80 via-ink/30 to-transparent lg:block"
          aria-hidden
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <div className="container-page">
          <div className="flex min-h-[max(31rem,78svh)] flex-col justify-end py-14 sm:min-h-[max(34rem,80svh)] sm:py-20 lg:min-h-[max(36rem,82svh)]">
            <div className="max-w-[42rem]">
              <p className="eyebrow text-ember">{t.hero.eyebrow}</p>

              <h1 className="mt-4 text-(length:--text-display-lg) leading-[0.94] text-cream">
                {/* Two lines by design — the break is part of the composition. */}
                {t.hero.headline.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-cream/75 sm:text-base">
                {t.hero.sub}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href={localePath(locale, ROUTES.products)}
                  variant="light"
                  size="lg"
                  className="sm:w-auto"
                >
                  {t.hero.ctaPrimary}
                </ButtonLink>
                <ButtonLink
                  href={localePath(locale, ROUTES.collection("peste-si-fructe-de-mare-afumate"))}
                  variant="onDark"
                  size="lg"
                  className="sm:w-auto"
                >
                  {t.hero.ctaSecondary}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified signal strip */}
      <div className="relative z-10 border-t border-cream/10 bg-ink/60 backdrop-blur-sm">
        <div className="container-page">
          <ul className="grid grid-cols-1 divide-y divide-cream/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              {
                icon: Truck,
                text: fill(t.hero.badges.freeShipping, {
                  amount: formatMoney(DELIVERY.freeShippingThreshold, locale),
                }),
              },
              { icon: Clock, text: t.hero.badges.sameDay },
              { icon: MapPin, text: t.hero.badges.chisinau },
            ].map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center justify-center gap-2.5 py-3.5 text-[0.75rem] tracking-[0.04em] text-cream/70 sm:text-[0.8125rem]"
              >
                <Icon className="h-4 w-4 shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
