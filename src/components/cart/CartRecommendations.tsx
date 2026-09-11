"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { useCart } from "@/lib/cart/CartProvider";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { Price } from "@/components/ui/Price";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * In-cart recommendations. Driven by the cross-sell rules in
 * src/data/merchandising.ts, so suggestions are deliberate pairings rather
 * than random filler. Adding from here never closes the drawer.
 */
export function CartRecommendations({
  products,
  title,
  locale,
}: {
  products: Product[];
  title: string;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { addItem, lastAdded } = useCart();

  if (products.length === 0) return null;

  return (
    <section className="border-t border-cream-300 px-5 py-5 sm:px-6">
      <h3 className="eyebrow">{title}</h3>

      <ul className="mt-3 space-y-2.5">
        {products.map((product) => {
          const variant = getDefaultVariant(product);
          const image = product.images[0];
          const justAdded = lastAdded === variant.id;

          return (
            <li key={product.slug} className="flex items-center gap-3">
              <div className="photo-well relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px]">
                {image && (
                  <Image src={image.url} alt="" fill sizes="48px" quality={70} className="object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] leading-snug font-medium">{product.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
                  <Price amount={variant.price} locale={locale} className="text-ink-700" />
                  {variant.title && <span>· {formatVariantLabel(variant.title, locale)}</span>}
                </p>
              </div>

              <button
                type="button"
                onClick={() => addItem(variant.id, product.slug, 1, { open: false })}
                aria-label={`${t.cart.quickAdd}: ${product.title}`}
                className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[0.6875rem] font-semibold tracking-[0.04em] uppercase transition-colors duration-200 ${
                  justAdded ? "bg-success text-white" : "bg-cream-200 text-ink hover:bg-ink hover:text-cream"
                }`}
              >
                {justAdded ? (
                  t.product.added
                ) : (
                  <>
                    <Plus className="h-3 w-3" strokeWidth={2} aria-hidden />
                    {t.cart.quickAdd}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
