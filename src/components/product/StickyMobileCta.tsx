"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/catalog/types";
import { formatVariantLabel } from "@/lib/catalog/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn, formatMoney } from "@/lib/utils";

/**
 * Sticky add-to-cart bar for mobile.
 *
 * Appears only once the main purchase panel has scrolled out of view, so it
 * never duplicates a button already on screen. Hidden from assistive tech
 * while off-screen, and the desktop layout never renders it.
 *
 * Slides with a CSS transform. It stays mounted and is marked `inert` when
 * hidden, which keeps it out of the tab order and the accessibility tree
 * without needing an animation library for the exit.
 */
export function StickyMobileCta({
  product,
  variant,
  quantity,
  locale,
  justAdded,
  onAdd,
}: {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  locale: Locale;
  justAdded: boolean;
  onAdd: () => void;
}) {
  const t = getDictionary(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // The panel marks itself with this id on the product page.
    const anchor = document.getElementById("purchase-panel");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  const total = Math.round(variant.price * quantity * 100) / 100;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-cream-300 bg-cream/95 backdrop-blur-lg lg:hidden",
        // Clear the iOS home indicator.
        "pb-[env(safe-area-inset-bottom)]",
        "transition-transform duration-300 ease-(--ease-out-soft) will-change-transform",
        "motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-page">
        <div className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8125rem] font-medium">
              {product.title}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
              <span className="font-medium tabular-nums text-ink-700">
                {formatMoney(total, locale)}
              </span>
              {variant.title && (
                <span>· {formatVariantLabel(variant.title, locale)}</span>
              )}
              {quantity > 1 && <span>· ×{quantity}</span>}
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            disabled={!variant.available}
            className={cn(
              "flex h-11 shrink-0 items-center gap-2 rounded-[2px] px-5 text-[0.875rem] font-medium transition-colors",
              justAdded ? "bg-success text-white" : "bg-ink text-cream",
              "disabled:opacity-45",
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                {t.product.added}
              </>
            ) : variant.available ? (
              <>
                <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {t.product.addToCart}
              </>
            ) : (
              t.product.soldOut
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
