"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/catalog/types";
import { getDefaultVariant } from "@/lib/catalog/content";
import { useCart } from "@/lib/cart/CartProvider";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * Adds every product in a curated set at its default (cheapest available)
 * variant. Opens the cart once, after the last add, so the shopper sees the
 * full basket rather than a flicker of successive drawers.
 */
export function AddBundleButton({
  products,
  locale,
  variant = "primary",
  className,
}: {
  products: Product[];
  locale: Locale;
  variant?: "primary" | "light" | "accent";
  className?: string;
}) {
  const t = getDictionary(locale);
  const { addItem, lastAdded } = useCart();
  const [added, setAdded] = useState(false);

  const lastVariant = products.at(-1)
    ? getDefaultVariant(products[products.length - 1])
    : null;
  const justAdded = added && lastVariant && lastAdded === lastVariant.id;

  function handleAdd() {
    products.forEach((product, index) => {
      const selected = getDefaultVariant(product);
      if (!selected?.available) return;
      addItem(selected.id, product.slug, 1, {
        open: index === products.length - 1,
      });
    });
    setAdded(true);
  }

  return (
    <Button
      variant={justAdded ? "accent" : variant}
      size="lg"
      onClick={handleAdd}
      className={className}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
          {t.product.added}
        </>
      ) : (
        t.bundles.addSet
      )}
    </Button>
  );
}
