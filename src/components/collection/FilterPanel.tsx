"use client";

import { Search as SearchIcon, X } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { COLLECTION_ORDER } from "@/config/navigation";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

export type PriceBand = "under100" | "100to200" | "200to400" | "over400";

export type Filters = {
  categories: string[];
  priceBands: PriceBand[];
  inStockOnly: boolean;
};

export const EMPTY_FILTERS: Filters = {
  categories: [],
  priceBands: [],
  inStockOnly: false,
};

/**
 * Filter controls, shared between the desktop sidebar and the mobile sheet.
 *
 * Counts next to each option are computed from the real catalog, so a shopper
 * never picks a filter that returns nothing.
 */
export function FilterPanel({
  products,
  filters,
  onChange,
  locale,
  showCategories,
  query,
  onQueryChange,
}: {
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
  locale: Locale;
  showCategories: boolean;
  query: string;
  onQueryChange: (next: string) => void;
}) {
  const t = getDictionary(locale);

  const bands: Array<{ key: PriceBand; label: string; test: (price: number) => boolean }> = [
    {
      key: "under100",
      label: fill(t.collection.priceUnder, { amount: formatMoney(100, locale) }),
      test: (p) => p < 100,
    },
    {
      key: "100to200",
      label: fill(t.collection.priceBetween, {
        from: formatMoney(100, locale),
        to: formatMoney(200, locale),
      }),
      test: (p) => p >= 100 && p < 200,
    },
    {
      key: "200to400",
      label: fill(t.collection.priceBetween, {
        from: formatMoney(200, locale),
        to: formatMoney(400, locale),
      }),
      test: (p) => p >= 200 && p < 400,
    },
    {
      key: "over400",
      label: fill(t.collection.priceOver, { amount: formatMoney(400, locale) }),
      test: (p) => p >= 400,
    },
  ];

  const categoryOptions = COLLECTION_ORDER.map((slug) => ({
    slug,
    label: t.categories.names[slug as keyof typeof t.categories.names],
    count: products.filter((p) => p.collections.includes(slug)).length,
  })).filter((option) => option.count > 0);

  function toggleCategory(slug: string) {
    onChange({
      ...filters,
      categories: filters.categories.includes(slug)
        ? filters.categories.filter((s) => s !== slug)
        : [...filters.categories, slug],
    });
  }

  function toggleBand(band: PriceBand) {
    onChange({
      ...filters,
      priceBands: filters.priceBands.includes(band)
        ? filters.priceBands.filter((b) => b !== band)
        : [...filters.priceBands, band],
    });
  }

  return (
    <div className="space-y-7">
      {/* In-collection search */}
      <div>
        <label htmlFor="filter-search" className="eyebrow">
          {t.search.open}
        </label>
        <div className="relative mt-2.5">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            id="filter-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.search.placeholder}
            className="h-10 w-full rounded-[2px] border border-cream-300 bg-cream pr-9 pl-9 text-[0.8125rem] outline-none transition-colors placeholder:text-ink-400 focus:border-ink"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label={t.search.clear}
              className="absolute top-1/2 right-1.5 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {showCategories && categoryOptions.length > 1 && (
        <fieldset>
          <legend className="eyebrow">{t.collection.category}</legend>
          <div className="mt-2.5 space-y-2">
            {categoryOptions.map((option) => (
              <CheckRow
                key={option.slug}
                label={option.label}
                count={option.count}
                checked={filters.categories.includes(option.slug)}
                onChange={() => toggleCategory(option.slug)}
              />
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="eyebrow">{t.collection.priceRange}</legend>
        <div className="mt-2.5 space-y-2">
          {bands.map((band) => {
            const count = products.filter((p) => band.test(p.priceMin)).length;
            if (count === 0) return null;
            return (
              <CheckRow
                key={band.key}
                label={band.label}
                count={count}
                checked={filters.priceBands.includes(band.key)}
                onChange={() => toggleBand(band.key)}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow">{t.collection.availability}</legend>
        <div className="mt-2.5">
          <CheckRow
            label={t.collection.inStock}
            count={products.filter((p) => p.available).length}
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          />
        </div>
      </fieldset>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-ink-700 transition-colors hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-[2px] accent-[var(--color-ink)]"
      />
      <span className="flex-1">{label}</span>
      <span className="tabular-nums text-ink-400">{count}</span>
    </label>
  );
}
