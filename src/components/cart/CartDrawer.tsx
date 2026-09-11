"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Lock, ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { CartLineItem } from "./CartLineItem";
import { CartRecommendations } from "./CartRecommendations";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { useCart } from "@/lib/cart/CartProvider";
import { getCartRecommendations, getThresholdNudges } from "@/lib/cart/recommendations";
import { buildCartPermalink } from "@/lib/shopify/checkout";
import { toAnalyticsItem, trackBeginCheckout } from "@/lib/analytics/events";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { ROUTES } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Conversion-focused cart drawer.
 *
 * Top to bottom: free-delivery progress, line items, then recommendations —
 * either products that help clear the delivery threshold, or deliberate
 * pairings once it is already cleared. Checkout hands off to the real Shopify
 * checkout via a cart permalink.
 */
export function CartDrawer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const {
    isOpen,
    closeCart,
    lines,
    itemCount,
    subtotal,
    amountToFreeShipping,
    freeShippingUnlocked,
    freeShippingProgress,
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);

  const cartSlugs = useMemo(() => lines.map((l) => l.product.slug), [lines]);

  // Below the threshold, recommend things that actually close the gap.
  // Above it, recommend genuine pairings.
  const recommendations = useMemo(() => {
    if (lines.length === 0) return [];
    return freeShippingUnlocked
      ? getCartRecommendations(cartSlugs, 3)
      : getThresholdNudges(cartSlugs, amountToFreeShipping, 3);
  }, [lines.length, freeShippingUnlocked, cartSlugs, amountToFreeShipping]);

  const checkoutUrl = useMemo(
    () =>
      buildCartPermalink(
        lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        locale
      ),
    [lines, locale]
  );

  function handleCheckout() {
    setCheckingOut(true);
    trackBeginCheckout(lines.map((l) => toAnalyticsItem(l.product, l.variant, l.quantity)));
  }

  const isEmpty = lines.length === 0;

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      side="right"
      title={
        isEmpty
          ? t.cart.title
          : `${t.cart.title} · ${
              itemCount === 1 ? t.cart.itemCountOne : fill(t.cart.itemCount, { count: itemCount })
            }`
      }
      closeLabel={t.cart.close}
      footer={
        isEmpty ? undefined : (
          <div className="space-y-3 bg-cream px-5 py-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.8125rem] font-medium">{t.cart.subtotal}</span>
              <Price amount={subtotal} locale={locale} className="font-display text-xl" />
            </div>

            <p className="text-xs text-ink-400">{t.cart.deliveryNote}</p>

            {/*
              A plain anchor, not a router Link: this leaves our app for the
              Shopify-hosted checkout on wesmokefish.md.
            */}
            <a
              href={checkoutUrl}
              onClick={handleCheckout}
              className={cn(
                "flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-[2px]",
                "bg-ink text-[0.9375rem] font-medium text-cream",
                "transition-colors duration-200 hover:bg-ember",
                checkingOut && "pointer-events-none opacity-80"
              )}
            >
              {checkingOut ? (
                t.cart.redirecting
              ) : (
                <>
                  {t.cart.checkout}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </>
              )}
            </a>

            <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-ink-400">
              <Lock className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden />
              {t.cart.checkoutNote}
            </p>
          </div>
        )
      }
    >
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
          <ShoppingBag className="h-9 w-9 text-cream-300" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 font-display text-xl">{t.cart.empty}</p>
          <p className="mt-1.5 max-w-[16rem] text-sm text-ink-500">{t.cart.emptyBody}</p>
          <ButtonLink
            href={localePath(locale, ROUTES.products)}
            onClick={closeCart}
            variant="primary"
            size="md"
            className="mt-6"
          >
            {t.cart.emptyCta}
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b border-cream-300 px-5 py-4 sm:px-6">
            <FreeShippingProgress
              subtotal={subtotal}
              amountRemaining={amountToFreeShipping}
              progress={freeShippingProgress}
              unlocked={freeShippingUnlocked}
              locale={locale}
            />
          </div>

          <ul className="divide-y divide-cream-200 px-5 sm:px-6">
            {lines.map((line) => (
              <CartLineItem
                key={line.variantId}
                line={line}
                locale={locale}
                onNavigate={closeCart}
              />
            ))}
          </ul>

          <CartRecommendations
            products={recommendations}
            title={freeShippingUnlocked ? t.cart.crossSellTitle : t.cart.thresholdNudgeTitle}
            locale={locale}
          />
        </>
      )}
    </Drawer>
  );
}
