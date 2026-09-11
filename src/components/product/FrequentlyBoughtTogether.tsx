"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/lib/catalog/types";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { useCart } from "@/lib/cart/CartProvider";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * "Frequently bought together".
 *
 * The pairing comes from the deliberate cross-sell rules in
 * src/data/merchandising.ts, not from order history — the storefront has no
 * access to that. So the heading is a genuine merchandising suggestion, and
 * there is no fabricated "87% of customers also bought" statistic anywhere.
 *
 * There is also no invented bundle discount: the set total is simply the sum
 * of both real prices.
 */
export function FrequentlyBoughtTogether({
  product,
  partner,
  locale,
}: {
  product: Product;
  partner: Product;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { addItem } = useCart();

  const primary = getDefaultVariant(product);
  const secondary = getDefaultVariant(partner);
  const total = Math.round((primary.price + secondary.price) * 100) / 100;

  function addSet() {
    addItem(primary.id, product.slug, 1, { open: false });
    addItem(secondary.id, partner.slug, 1);
  }

  return (
    <section className="rounded-[3px] bg-cream-100 p-5 sm:p-6" aria-labelledby="fbt-heading">
      <h2 id="fbt-heading" className="eyebrow">
        {t.product.boughtTogether}
      </h2>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {[
            { item: product, variant: primary, linkable: false },
            { item: partner, variant: secondary, linkable: true },
          ].map(({ item, variant, linkable }, i) => (
            <div key={item.slug} className="flex items-center gap-3">
              {i > 0 && (
                <Plus className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.5} aria-hidden />
              )}
              <div className="flex items-center gap-2.5">
                <div className="photo-well relative h-16 w-14 shrink-0 overflow-hidden rounded-[2px]">
                  {item.images[0] && (
                    <Image
                      src={item.images[0].url}
                      alt=""
                      fill
                      sizes="56px"
                      quality={70}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[0.8125rem] leading-snug font-medium">
                    {linkable ? (
                      <Link
                        href={localePath(locale, ROUTES.product(item.slug))}
                        className="transition-colors hover:text-ember"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    <Price amount={variant.price} locale={locale} />
                    {variant.title && ` · ${formatVariantLabel(variant.title, locale)}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sm:ml-auto sm:text-right">
          <p className="text-[0.6875rem] tracking-[0.1em] uppercase text-ink-400">
            {t.product.totalForSet}
          </p>
          <Price amount={total} locale={locale} className="font-display text-xl" />
          <Button variant="primary" size="md" onClick={addSet} className="mt-2.5 w-full sm:w-auto">
            {t.product.addBoth}
          </Button>
        </div>
      </div>
    </section>
  );
}
