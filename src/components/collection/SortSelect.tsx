"use client";

import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { getDefaultVariant } from "@/lib/catalog/content";
import { BESTSELLER_SLUGS } from "@/data/merchandising";
import { getDictionary, type Locale } from "@/lib/i18n";

export type SortKey =
  | "recommended"
  | "priceAsc"
  | "priceDesc"
  | "perKgAsc"
  | "nameAsc"
  | "newest";

const COLLATOR_LOCALE: Record<Locale, string> = { ro: "ro-MD", ru: "ru-MD" };

/**
 * Sorts a product list.
 *
 * "Recommended" is not arbitrary: curated bestsellers come first in their
 * curated order, then everything else. That makes the default ordering the
 * one most likely to convert.
 */
export function sortProducts(products: Product[], sort: SortKey, locale: Locale): Product[] {
  const list = [...products];

  switch (sort) {
    case "priceAsc":
      return list.sort((a, b) => getDefaultVariant(a).price - getDefaultVariant(b).price);

    case "priceDesc":
      return list.sort((a, b) => getDefaultVariant(b).price - getDefaultVariant(a).price);

    case "perKgAsc":
      return list.sort((a, b) => {
        // Products without a weight (the beer range) sort last.
        const aKg = getDefaultVariant(a).pricePerKg ?? Number.POSITIVE_INFINITY;
        const bKg = getDefaultVariant(b).pricePerKg ?? Number.POSITIVE_INFINITY;
        return aKg - bKg;
      });

    case "nameAsc": {
      const collator = new Intl.Collator(COLLATOR_LOCALE[locale]);
      return list.sort((a, b) => collator.compare(a.title, b.title));
    }

    case "newest":
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case "recommended":
    default: {
      const rank = (slug: string) => {
        const index = (BESTSELLER_SLUGS as readonly string[]).indexOf(slug);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };
      return list.sort((a, b) => rank(a.slug) - rank(b.slug));
    }
  }
}

export function SortSelect({
  value,
  onChange,
  locale,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
  locale: Locale;
}) {
  const t = getDictionary(locale);

  const options: Array<{ key: SortKey; label: string }> = [
    { key: "recommended", label: t.collection.sortOptions.recommended },
    { key: "priceAsc", label: t.collection.sortOptions.priceAsc },
    { key: "priceDesc", label: t.collection.sortOptions.priceDesc },
    { key: "perKgAsc", label: t.collection.sortOptions.perKgAsc },
    { key: "nameAsc", label: t.collection.sortOptions.nameAsc },
    { key: "newest", label: t.collection.sortOptions.newest },
  ];

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        {t.collection.sort}
      </label>
      {/*
        A native <select> on purpose: it gives the platform picker on mobile,
        full keyboard support, and no JS beyond the change handler.
      */}
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-cream-300 bg-cream pr-9 pl-4 text-[0.8125rem] font-medium outline-none transition-colors hover:border-ink focus:border-ink"
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}
