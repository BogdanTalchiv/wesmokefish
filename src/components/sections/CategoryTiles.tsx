import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CATEGORY_TILES } from "@/data/merchandising";
import { getAllCollections } from "@/lib/catalog";
import { COLLECTION_ORDER, ROUTES } from "@/config/navigation";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Category tiles.
 *
 * Only the three collections that actually exist in Shopify. The first tile is
 * given double width because smoked fish is the core range and carries 22 of
 * the store's 39 products.
 */
export function CategoryTiles({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const collections = getAllCollections();

  const tiles = COLLECTION_ORDER.flatMap((slug) => {
    const collection = collections.find((c) => c.slug === slug);
    const tile = CATEGORY_TILES.find((x) => x.collectionSlug === slug);
    if (!collection || !tile) return [];
    return [{ collection, image: tile.image as string }];
  });

  return (
    <section className="py-20 sm:py-28" aria-labelledby="categories-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.categories.eyebrow}
          title={t.categories.title}
          sub={t.categories.sub}
          action={{ label: t.nav.allProducts, href: localePath(locale, ROUTES.products) }}
          headingId="categories-heading"
        />

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ collection, image }, index) => {
            const name = t.categories.names[collection.slug as keyof typeof t.categories.names];
            const blurb = t.categories.blurbs[collection.slug as keyof typeof t.categories.blurbs];
            const wide = index === 0;

            return (
              <Reveal
                key={collection.slug}
                delay={index * 90}
                className={wide ? "sm:col-span-2 lg:col-span-2" : undefined}
              >
                <Link
                  href={localePath(locale, ROUTES.collection(collection.slug))}
                  className="group relative block h-full overflow-hidden rounded-[3px] bg-ink"
                >
                  <div
                    className={
                      wide
                        ? "relative aspect-[4/3] sm:aspect-[16/10]"
                        : "relative aspect-[4/3] sm:aspect-[4/5]"
                    }
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes={
                        wide
                          ? "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 640px"
                          : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 320px"
                      }
                      quality={78}
                      className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.06]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-opacity duration-500 group-hover:from-ink/90"
                      aria-hidden
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-[1.375rem] leading-tight text-cream sm:text-[1.625rem]">
                          {name}
                        </h3>
                        <p className="mt-1.5 max-w-[32ch] text-[0.8125rem] leading-relaxed text-cream/65">
                          {blurb}
                        </p>
                        <p className="mt-2.5 text-[0.6875rem] tracking-[0.1em] uppercase text-cream/45">
                          {fill(t.categories.productCount, { count: collection.count })}
                        </p>
                      </div>

                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream/25 text-cream transition-colors duration-300 group-hover:border-ember group-hover:bg-ember"
                        aria-hidden
                      >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
