"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ResolvedCartLine } from "@/lib/cart/CartProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { PerKg, Price } from "@/components/ui/Price";
import { formatVariantLabel } from "@/lib/catalog/content";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { ROUTES } from "@/config/navigation";

export function CartLineItem({
  line,
  locale,
  onNavigate,
}: {
  line: ResolvedCartLine;
  locale: Locale;
  onNavigate?: () => void;
}) {
  const t = getDictionary(locale);
  const { setQuantity, removeItem } = useCart();
  const { product, variant, quantity } = line;
  const image = product.images[0];

  return (
    <li className="flex gap-3.5 py-4">
      <Link
        href={localePath(locale, ROUTES.product(product.slug))}
        onClick={onNavigate}
        className="photo-well relative h-[5.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[2px]"
        tabIndex={-1}
        aria-hidden
      >
        {image && (
          <Image src={image.url} alt="" fill sizes="72px" quality={72} className="object-cover" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[0.8125rem] leading-snug font-medium">
              <Link
                href={localePath(locale, ROUTES.product(product.slug))}
                onClick={onNavigate}
                className="transition-colors hover:text-ember"
              >
                {product.title}
              </Link>
            </h3>
            {variant.title && (
              <p className="mt-0.5 text-xs text-ink-400">
                {formatVariantLabel(variant.title, locale)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeItem(variant.id)}
            aria-label={fill(t.cart.removeItem, { title: product.title })}
            className="-mt-1 -mr-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {/* Quantity stepper — 36px targets, comfortable on mobile. */}
          <div className="flex items-center rounded-full border border-cream-300">
            <button
              type="button"
              onClick={() => setQuantity(variant.id, quantity - 1)}
              aria-label={t.product.decrease}
              className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </button>
            <span
              className="w-7 text-center text-[0.8125rem] font-medium tabular-nums"
              aria-label={`${t.product.quantity}: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(variant.id, quantity + 1)}
              aria-label={t.product.increase}
              className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <Price amount={line.lineTotal} locale={locale} className="text-[0.8125rem] font-medium" />
            <PerKg pricePerKg={variant.pricePerKg} locale={locale} className="text-[0.625rem]" />
          </div>
        </div>
      </div>
    </li>
  );
}
