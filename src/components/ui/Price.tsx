import { cn, formatMoney } from "@/lib/utils";
import { fill, getDictionary, type Locale } from "@/lib/i18n";

type PriceProps = {
  amount: number;
  locale: Locale;
  className?: string;
};

export function Price({ amount, locale, className }: PriceProps) {
  return (
    <span className={cn("tabular-nums", className)}>{formatMoney(amount, locale)}</span>
  );
}

type PerKgProps = {
  pricePerKg: number | null;
  locale: Locale;
  className?: string;
};

/**
 * Price per kilogram. This is the single most useful number for comparing
 * smoked fish, so it stays visible rather than hidden in a spec table — and
 * it is derived from the Shopify price and variant weight, never hardcoded.
 */
export function PerKg({ pricePerKg, locale, className }: PerKgProps) {
  if (!pricePerKg) return null;
  const t = getDictionary(locale);
  return (
    <span className={cn("tabular-nums text-ink-400", className)}>
      {fill(t.product.perKg, { price: formatMoney(pricePerKg, locale) })}
    </span>
  );
}

type PriceRangeProps = {
  min: number;
  max: number;
  locale: Locale;
  className?: string;
};

/** Shows "de la 156 MDL" for multi-weight products, a flat price otherwise. */
export function PriceRange({ min, max, locale, className }: PriceRangeProps) {
  const t = getDictionary(locale);
  if (min === max) return <Price amount={min} locale={locale} className={className} />;
  return (
    <span className={cn("tabular-nums", className)}>
      {fill(t.product.from, { price: formatMoney(min, locale) })}
    </span>
  );
}
