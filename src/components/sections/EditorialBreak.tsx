import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getProductBySlug } from "@/lib/catalog";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Emotional editorial break.
 *
 * One image, two lines, one CTA. Its only job is to build appetite between two
 * commercial sections, so there is nothing else in it.
 */
export function EditorialBreak({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // A close-up texture shot reads better here than a packshot.
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
        <div className="absolute inset-0 bg-ink/65" aria-hidden />
      </div>

      <div className="relative z-10">
        <div className="container-page">
          <Reveal className="flex min-h-[24rem] flex-col items-center justify-center py-20 text-center sm:min-h-[30rem] sm:py-28">
            <p className="max-w-[26ch] font-display text-(length:--text-display) leading-[1.05] text-cream">
              {t.editorial.line1}
            </p>
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-cream/65">
              {t.editorial.line2}
            </p>
            <ButtonLink
              href={localePath(locale, ROUTES.products)}
              variant="light"
              size="lg"
              className="mt-9"
            >
              {t.editorial.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
