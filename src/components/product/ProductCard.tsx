"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/catalog/types";
import {
  formatVariantLabel,
  getDefaultVariant,
  getProductCopy,
  isBestseller,
  isNew,
} from "@/lib/catalog/content";
import { useCart } from "@/lib/cart/CartProvider";
import { Badge } from "@/components/ui/Badge";
import { PerKg, Price } from "@/components/ui/Price";
import { cn, formatMoney } from "@/lib/utils";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { toAnalyticsItem, trackSelectItem } from "@/lib/analytics/events";

type ProductCardProps = {
  product: Product;
  locale: Locale;
  /** Analytics list name, e.g. "bestsellers" or "collection:bere". */
  listName?: string;
  priority?: boolean;
  className?: string;
  /** Compact layout for cart cross-sell and narrow rails. */
  compact?: boolean;
};

/**
 * Product card.
 *
 * Visual hierarchy is deliberate: photo -> name -> price -> weight -> CTA.
 * Multi-weight products expose their weights as chips directly on the card, so
 * a shopper can add the size they want without opening the product page.
 */
export function ProductCard({
  product,
  locale,
  listName,
  priority = false,
  className,
  compact = false,
}: ProductCardProps) {
  const t = getDictionary(locale);
  const { addItem, lastAdded } = useCart();
  const copy = getProductCopy(product);

  const [selected, setSelected] = useState<ProductVariant>(() => getDefaultVariant(product));

  const href = localePath(locale, `/produse/${product.slug}`);
  const image = product.images[0];
  const hasWeights = product.variants.length > 1;
  const justAdded = lastAdded === selected.id;
  const showBestseller = isBestseller(product);
  const showNew = !showBestseller && isNew(product);

  function handleAdd() {
    addItem(selected.id, product.slug, 1);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col",
        // The whole card lifts very slightly on hover — no shadow theatrics.
        "transition-transform duration-500 [transition-timing-function:var(--ease-out-soft)]",
        "hover:-translate-y-0.5",
        className
      )}
    >
      <div className="photo-well relative overflow-hidden rounded-[3px]">
        {/*
          Fixed 4:5 box with a sized <Image> underneath. The aspect ratio is
          reserved in CSS, so images loading late can never shift the layout.
        */}
        <Link
          href={href}
          className="block aspect-[4/5]"
          onClick={() =>
            listName &&
            trackSelectItem(listName, toAnalyticsItem(product, selected, 1))
          }
          tabIndex={-1}
          aria-hidden="true"
        >
          {image ? (
            <Image
              src={image.url}
              alt={product.title}
              fill
              sizes={
                compact
                  ? "112px"
                  : "(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1439px) 23vw, 320px"
              }
              priority={priority}
              loading={priority ? undefined : "lazy"}
              quality={78}
              className="object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.045]"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-ink-400">
              {product.title}
            </div>
          )}
        </Link>

        {(showBestseller || showNew) && !compact && (
          <div className="pointer-events-none absolute top-3 left-3">
            {showBestseller && <Badge tone="bestseller">{t.product.bestseller}</Badge>}
            {showNew && <Badge tone="new">{t.product.new}</Badge>}
          </div>
        )}

        {/* Quick add — sits over the image on desktop, revealed on hover. */}
        {!compact && (
          <div
            className={cn(
              "absolute inset-x-3 bottom-3 hidden lg:block",
              "translate-y-2 opacity-0 transition-[opacity,transform] duration-300",
              "[transition-timing-function:var(--ease-out-soft)]",
              "group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            )}
          >
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selected.available}
              aria-label={`${t.product.addToCart}: ${product.title}${
                selected.title ? ` — ${formatVariantLabel(selected.title, locale)}` : ""
              }`}
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-[2px] text-[0.8125rem] font-medium",
                "transition-colors duration-200",
                justAdded
                  ? "bg-success text-white"
                  : "bg-cream text-ink hover:bg-ink hover:text-cream",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                  {t.product.added}
                </>
              ) : selected.available ? (
                <>
                  <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {t.product.addToCart}
                </>
              ) : (
                t.product.soldOut
              )}
            </button>
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "pt-2" : "pt-4")}>
        <h3
          className={cn(
            "font-sans font-medium tracking-[-0.005em]",
            compact ? "text-[0.8125rem] leading-snug" : "text-[0.9375rem] leading-snug"
          )}
        >
          <Link
            href={href}
            className="transition-colors hover:text-ember"
            onClick={() =>
              listName && trackSelectItem(listName, toAnalyticsItem(product, selected, 1))
            }
          >
            {/* Full-card click target, without swallowing the buttons below. */}
            <span className="absolute inset-0 z-0" aria-hidden />
            <span className="relative">{product.title}</span>
          </Link>
        </h3>

        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-500">
            {copy.short}
          </p>
        )}

        {/* Weight chips — only when the product genuinely has several sizes. */}
        {hasWeights && !compact && (
          <div className="relative z-10 mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t.product.selectWeight}>
            {product.variants.map((variant) => {
              const active = variant.id === selected.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelected(variant)}
                  disabled={!variant.available}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium tabular-nums transition-colors duration-150",
                    active
                      ? "border-ink bg-ink text-cream"
                      : "border-cream-300 text-ink-500 hover:border-ink-400 hover:text-ink",
                    "disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  {formatVariantLabel(variant.title, locale)}
                </button>
              );
            })}
          </div>
        )}

        <div className={cn("mt-auto flex items-end justify-between gap-3", compact ? "pt-2" : "pt-4")}>
          <div className="flex flex-col gap-0.5">
            <Price
              amount={selected.price}
              locale={locale}
              className={cn("font-medium", compact ? "text-[0.8125rem]" : "text-[0.9375rem]")}
            />
            {!compact && (
              <PerKg pricePerKg={selected.pricePerKg} locale={locale} className="text-[0.6875rem]" />
            )}
          </div>

          {/* Mobile / compact add button — always visible, thumb-sized. */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selected.available}
            aria-label={fill(
              `${t.product.addToCart}: {name} — {price}`,
              { name: product.title, price: formatMoney(selected.price, locale) }
            )}
            className={cn(
              "relative z-10 grid shrink-0 place-items-center rounded-full transition-colors duration-200",
              compact ? "h-8 w-8" : "h-10 w-10 lg:hidden",
              justAdded ? "bg-success text-white" : "bg-ink text-cream hover:bg-ember",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            {justAdded ? (
              <Check className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} aria-hidden />
            ) : (
              <Plus className={compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]"} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
