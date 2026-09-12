import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { OCCASIONS } from "@/data/merchandising";
import { getOccasionProducts } from "@/lib/merchandising";
import { getProductBySlug } from "@/lib/catalog";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Occasion discovery — a merchandising layer on top of collections.
 *
 * A first-time visitor often knows the meal ("cina în doi") before they know
 * the species. Each tile is a real curated set; nothing here invents a product.
 */
export function Occasions({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="pofta" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="occasions-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.occasions.eyebrow}
          title={t.occasions.title}
          sub={t.occasions.sub}
          headingId="occasions-heading"
        />

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occasion, index) => {
            const products = getOccasionProducts(occasion.slug);
            const image =
              getProductBySlug(occasion.imageSlug)?.images[0] ?? products[0]?.images[0];
            const name = t.occasions.names[occasion.slug];
            const blurb = t.occasions.blurbs[occasion.slug];

            return (
              <Reveal as="li" key={occasion.slug} delay={index * 70}>
                <Link
                  href={localePath(locale, ROUTES.occasion(occasion.slug))}
                  className="group relative block overflow-hidden rounded-[3px] bg-ink"
                >
                  <div className="relative aspect-[5/4] sm:aspect-[4/3]">
                    {image && (
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        quality={78}
                        className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.05]"
                      />
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-display text-[1.5rem] leading-tight text-cream sm:text-[1.75rem]">
                      {name}
                    </h3>
                    <p className="mt-1.5 max-w-[32ch] text-[0.8125rem] leading-relaxed text-cream/70">
                      {blurb}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
