import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Price } from "@/components/ui/Price";
import { AddBundleButton } from "@/components/product/AddBundleButton";
import { BUNDLES } from "@/data/merchandising";
import { getBundleProducts, getBundleTotal } from "@/lib/merchandising";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Curated sets from real products.
 *
 * The displayed total is the sum of each product's live default price. There
 * is no invented bundle discount — Shopify does not have one.
 */
export function Bundles({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="bg-cream-100 py-20 sm:py-28" aria-labelledby="bundles-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.bundles.eyebrow}
          title={t.bundles.title}
          sub={t.bundles.sub}
          headingId="bundles-heading"
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 lg:grid-cols-2">
          {BUNDLES.map((bundle, index) => {
            const products = getBundleProducts(bundle.slug);
            if (products.length === 0) return null;
            const total = getBundleTotal(products);

            return (
              <Reveal as="li" key={bundle.slug} delay={index * 80}>
                <article className="flex h-full flex-col border border-cream-300 bg-cream p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-[1.625rem] leading-tight">
                        <Link
                          href={localePath(locale, ROUTES.bundle(bundle.slug))}
                          className="transition-colors hover:text-ember"
                        >
                          {t.bundles.names[bundle.slug]}
                        </Link>
                      </h3>
                      <p className="mt-2 max-w-[40ch] text-[0.875rem] leading-relaxed text-ink-500">
                        {t.bundles.blurbs[bundle.slug]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.6875rem] tracking-[0.1em] uppercase text-ink-400">
                        {t.bundles.total}
                      </p>
                      <Price
                        amount={total}
                        locale={locale}
                        className="font-display text-[1.5rem] leading-none"
                      />
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {products.map((product) => {
                      const variant = getDefaultVariant(product);
                      const image = product.images[0];
                      return (
                        <li key={product.slug} className="flex items-center gap-3">
                          <div className="photo-well relative h-14 w-12 shrink-0 overflow-hidden rounded-[2px]">
                            {image && (
                              <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="48px"
                                quality={70}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={localePath(locale, ROUTES.product(product.slug))}
                              className="text-[0.875rem] leading-snug font-medium transition-colors hover:text-ember"
                            >
                              {product.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-ink-400">
                              <Price amount={variant.price} locale={locale} />
                              {variant.title &&
                                ` · ${formatVariantLabel(variant.title, locale)}`}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <AddBundleButton
                    products={products}
                    locale={locale}
                    className="mt-6 w-full"
                  />
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
