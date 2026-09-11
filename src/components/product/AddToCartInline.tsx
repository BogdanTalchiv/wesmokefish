"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button, type ButtonVariants } from "@/components/ui/Button";
import type { Product } from "@/lib/catalog/types";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { useCart } from "@/lib/cart/CartProvider";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Add-to-cart button with an inline weight picker, for use outside the
 * product page (editorial sections, campaign landings). Single-weight products
 * render just the button.
 */
export function AddToCartInline({
  product,
  locale,
  variant = "primary",
  size = "lg",
  className,
}: {
  product: Product;
  locale: Locale;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  className?: string;
}) {
  const t = getDictionary(locale);
  const { addItem, lastAdded } = useCart();
  const [selectedId, setSelectedId] = useState(() => getDefaultVariant(product).id);

  const selected = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const justAdded = lastAdded === selected.id;
  const hasWeights = product.variants.length > 1;

  const onDark = variant === "light" || variant === "onDark";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {hasWeights && (
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t.product.selectWeight}
        >
          {product.variants.map((v) => {
            const active = v.id === selected.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                disabled={!v.available}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors duration-150",
                  onDark
                    ? active
                      ? "border-cream bg-cream text-ink"
                      : "border-cream/25 text-cream/70 hover:border-cream hover:text-cream"
                    : active
                      ? "border-ink bg-ink text-cream"
                      : "border-cream-300 text-ink-500 hover:border-ink-400 hover:text-ink",
                  "disabled:cursor-not-allowed disabled:opacity-40"
                )}
              >
                {formatVariantLabel(v.title, locale)}
              </button>
            );
          })}
        </div>
      )}

      <Button
        variant={justAdded ? "accent" : variant}
        size={size}
        disabled={!selected.available}
        onClick={() => addItem(selected.id, product.slug, 1)}
        className="w-full sm:w-auto"
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
      </Button>
    </div>
  );
}
