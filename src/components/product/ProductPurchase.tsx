"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PerKg, Price } from "@/components/ui/Price";
import { StickyMobileCta } from "./StickyMobileCta";
import type { Product } from "@/lib/catalog/types";
import {
  formatVariantLabel,
  getDefaultVariant,
  isApproximateWeight,
} from "@/lib/catalog/content";
import { useCart } from "@/lib/cart/CartProvider";
import { buildBuyNowLink } from "@/lib/shopify/checkout";
import { DELIVERY } from "@/config/business";
import {
  toAnalyticsItem,
  trackBeginCheckout,
  trackViewItem,
} from "@/lib/analytics/events";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { cn, formatMoney } from "@/lib/utils";

/**
 * Purchase panel: weight, quantity, add to cart, buy now.
 *
 * Price and price-per-kg update live with the selected weight, because
 * comparing value per kilo is how people actually shop for smoked fish.
 * "Buy now" links straight to the Shopify checkout for that variant, skipping
 * the cart for shoppers who already know what they want.
 */
export function ProductPurchase({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { addItem, lastAdded, subtotal, lines } = useCart();

  const [selectedId, setSelectedId] = useState(() => getDefaultVariant(product).id);
  const [quantity, setQuantity] = useState(1);

  const selected = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const justAdded = lastAdded === selected.id;
  const hasWeights = product.variants.length > 1;
  const lineTotal = Math.round(selected.price * quantity * 100) / 100;

  // Report view_item once per product, and again if the shopper switches
  // weight, since each variant is a distinct item to GA4 and Meta.
  useEffect(() => {
    trackViewItem([toAnalyticsItem(product, selected, 1)]);
  }, [product, selected]);

  /*
    What the cart would be worth if the shopper added the selection on screen.

    Two things have to be counted for this to read as true. The existing cart
    subtotal, so someone already holding 1.000 MDL of fish is not told they
    need the full amount again. And only the *unadded* part of the on-screen
    quantity — once the item is in the cart it is already inside `subtotal`,
    and adding `lineTotal` on top would make this panel disagree with the cart
    drawer sitting open next to it.
  */
  const alreadyInCart =
    lines.find((line) => line.variant.id === selected.id)?.quantity ?? 0;
  const pendingQuantity = Math.max(0, quantity - alreadyInCart);
  const projectedSubtotal = subtotal + selected.price * pendingQuantity;

  const remainingForFreeDelivery = Math.max(
    0,
    Math.round((DELIVERY.freeShippingThreshold - projectedSubtotal) * 100) / 100
  );

  function handleAdd() {
    addItem(selected.id, product.slug, quantity);
  }

  function handleBuyNow() {
    trackBeginCheckout([toAnalyticsItem(product, selected, quantity)]);
  }

  return (
    <>
      <div>
        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Price
            amount={selected.price}
            locale={locale}
            className="font-display text-[2rem] leading-none"
          />
          <PerKg pricePerKg={selected.pricePerKg} locale={locale} className="text-[0.8125rem]" />
        </div>
        {hasWeights && (
          <p className="mt-1.5 text-xs text-ink-400">{t.product.priceNote}</p>
        )}

        {/* Weight */}
        {hasWeights && (
          <fieldset className="mt-7">
            <legend className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-400">
              {t.product.selectWeight}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const active = variant.id === selected.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(variant.id)}
                    disabled={!variant.available}
                    aria-pressed={active}
                    className={cn(
                      "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-[2px] border px-3.5 py-2.5 transition-colors duration-150",
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-cream-300 hover:border-ink-400",
                      "disabled:cursor-not-allowed disabled:opacity-40"
                    )}
                  >
                    <span className="text-[0.8125rem] font-medium tabular-nums">
                      {formatVariantLabel(variant.title, locale)}
                    </span>
                    <span
                      className={cn(
                        "text-[0.6875rem] tabular-nums",
                        active ? "text-cream/65" : "text-ink-400"
                      )}
                    >
                      {formatMoney(variant.price, locale)}
                    </span>
                  </button>
                );
              })}
            </div>

            {isApproximateWeight(selected.title) && (
              <p className="mt-2.5 text-xs text-ink-400">{t.product.weightApprox}</p>
            )}
          </fieldset>
        )}

        {/* Quantity + add to cart */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="flex h-[3.25rem] shrink-0 items-center justify-between rounded-[2px] border border-cream-300 px-1 sm:w-[8.5rem]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label={t.product.decrease}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-35"
            >
              <Minus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
            <span
              className="min-w-6 text-center text-[0.9375rem] font-medium tabular-nums"
              aria-live="polite"
              aria-label={`${t.product.quantity}: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={quantity >= 99}
              aria-label={t.product.increase}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-35"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <Button
            variant={justAdded ? "accent" : "primary"}
            size="lg"
            onClick={handleAdd}
            disabled={!selected.available}
            className="flex-1"
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                {t.product.added}
              </>
            ) : selected.available ? (
              <>
                {t.product.addToCart}
                {quantity > 1 && (
                  <span className="text-cream/60">· {formatMoney(lineTotal, locale)}</span>
                )}
              </>
            ) : (
              t.product.soldOut
            )}
          </Button>
        </div>

        {/* Buy now — a plain anchor, it leaves for the Shopify checkout. */}
        {selected.available && (
          <a
            href={buildBuyNowLink(selected.id, quantity, locale)}
            onClick={handleBuyNow}
            className="mt-3 flex h-[3.25rem] w-full items-center justify-center rounded-[2px] border border-ink/20 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            {t.product.buyNow}
          </a>
        )}

        {/* Delivery nudge, using only the verified threshold */}
        <p className="mt-5 flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ink-500">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-ember" strokeWidth={1.5} aria-hidden />
          {remainingForFreeDelivery === 0
            ? t.cart.freeShippingReached
            : fill(t.cart.freeShippingProgress, {
                amount: formatMoney(remainingForFreeDelivery, locale),
              })}
        </p>
      </div>

      <StickyMobileCta
        product={product}
        variant={selected}
        quantity={quantity}
        locale={locale}
        justAdded={justAdded}
        onAdd={handleAdd}
      />
    </>
  );
}
