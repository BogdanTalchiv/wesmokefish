import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PerKg, PriceRange } from "@/components/ui/Price";
import { AddToCartInline } from "@/components/product/AddToCartInline";
import { getProductBySlug } from "@/lib/catalog";
import { getDefaultVariant } from "@/lib/catalog/content";
import { SIGNATURE_SLUG } from "@/data/merchandising";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Editorial feature for the signature product.
 *
 * Dark, full-bleed and typographically larger than the rest of the page, so it
 * reads as a change of pace rather than another product row. Price, weights
 * and add-to-cart are all present — it is a shoppable spread, not a banner.
 */
export function SignatureProduct({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const product = getProductBySlug(SIGNATURE_SLUG);
  if (!product) return null;

  const image = product.images[0];
  const defaultVariant = getDefaultVariant(product);

  return (
    <section className="grain bg-ink text-cream" aria-labelledby="signature-heading">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
          {/* Image — first on mobile so the food leads. */}
          <Reveal className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] sm:aspect-[5/4] lg:aspect-[4/5]">
              {image && (
                <Image
                  src={image.url}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  quality={82}
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>

          <Reveal className="order-2 lg:order-1" delay={100}>
            <p className="eyebrow text-ember">{t.signature.eyebrow}</p>

            <h2
              id="signature-heading"
              className="mt-4 text-(length:--text-display) leading-[1] text-cream"
            >
              {product.title}
            </h2>

            <p className="mt-6 max-w-[44ch] text-[0.9375rem] leading-relaxed text-cream/70">
              {t.signature.body}
            </p>

            <div className="mt-8">
              <h3 className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
                {t.signature.reasonsTitle}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {t.signature.reasons.map((reason) => (
                  <li key={reason} className="flex gap-3 text-[0.875rem] text-cream/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <PriceRange
                  min={product.priceMin}
                  max={product.priceMax}
                  locale={locale}
                  className="font-display text-3xl text-cream"
                />
                <PerKg
                  pricePerKg={defaultVariant.pricePerKg}
                  locale={locale}
                  className="mt-1 block text-xs text-cream/45"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AddToCartInline
                product={product}
                locale={locale}
                variant="light"
                size="lg"
                className="sm:w-auto"
              />
              <ButtonLink
                href={localePath(locale, ROUTES.product(product.slug))}
                variant="onDark"
                size="lg"
                className="sm:w-auto"
              >
                {t.signature.view}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
