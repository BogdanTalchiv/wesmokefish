"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ProductRail } from "@/components/product/ProductRail";
import { FilterPanel, type Filters, EMPTY_FILTERS } from "./FilterPanel";
import { SortSelect, type SortKey, sortProducts } from "./SortSelect";
import type { Product } from "@/lib/catalog/types";
import { getDefaultVariant } from "@/lib/catalog/content";
import { searchProducts } from "@/lib/search";
import { useUrlQueryParam } from "@/lib/hooks/useUrlQueryParam";
import { fill, getDictionary, type Locale } from "@/lib/i18n";

/**
 * Filterable product grid, shared by /produse and /colectii/[slug].
 *
 * Filter state is local rather than in the URL: the whole catalog is 39
 * products and already on the client, so filtering is instant and there is no
 * request to make.
 *
 * Filters are deliberately few — category, price band, availability — because
 * a 39-product catalog does not need a facet wall.
 */
export function ProductGridView({
  products,
  locale,
  listName,
  /** Hide the category filter on single-collection pages. */
  showCategoryFilter = true,
}: {
  products: Product[];
  locale: Locale;
  listName: string;
  showCategoryFilter?: boolean;
}) {
  const t = getDictionary(locale);

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);

  /*
    `?q=` is read from the live URL on the client, not from the page's
    searchParams prop, so these pages stay statically prerendered with every
    product in the HTML. See src/lib/hooks/useUrlQueryParam.ts for why this
    rather than useSearchParams.

    A shared ?q= link therefore paints the full grid and narrows it on
    hydration. That is the right way round: crawlers get the whole catalogue,
    and arriving via ?q= is a minor path (the search drawer's "view all
    results" link).
  */
  const urlQuery = useUrlQueryParam("q");
  const [typedQuery, setTypedQuery] = useState<string | null>(null);
  // Once the shopper edits the box, their input wins over the URL.
  const query = typedQuery ?? urlQuery;
  const setQuery = setTypedQuery;

  const visible = useMemo(() => {
    let result = products;

    // Search first, so the ranking from searchProducts is preserved.
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      const allowed = new Set(searchProducts(trimmed, 100).map((r) => r.product.slug));
      result = result.filter((p) => allowed.has(p.slug));
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => p.collections.some((c) => filters.categories.includes(c)));
    }

    if (filters.priceBands.length > 0) {
      result = result.filter((p) =>
        filters.priceBands.some((band) => {
          const price = getDefaultVariant(p).price;
          if (band === "under100") return price < 100;
          if (band === "100to200") return price >= 100 && price < 200;
          if (band === "200to400") return price >= 200 && price < 400;
          return price >= 400;
        })
      );
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.available);
    }

    return sortProducts(result, sort, locale);
  }, [products, filters, sort, query, locale]);

  const activeCount =
    filters.categories.length + filters.priceBands.length + (filters.inStockOnly ? 1 : 0);

  const resultLabel =
    visible.length === 1
      ? t.collection.resultCountOne
      : fill(t.collection.resultCount, { count: visible.length });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-cream-300 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile: opens the filter sheet. Desktop shows the sidebar instead. */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={t.collection.openFilters}
            className="flex h-10 items-center gap-2 rounded-full border border-cream-300 px-4 text-[0.8125rem] font-medium transition-colors hover:border-ink lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {t.collection.filters}
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] font-semibold text-cream">
                {activeCount}
              </span>
            )}
          </button>

          <p className="text-[0.8125rem] tabular-nums text-ink-500" aria-live="polite">
            {resultLabel}
          </p>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="hidden items-center gap-1 text-[0.8125rem] text-ink-400 transition-colors hover:text-ink lg:flex"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              {t.collection.clearFilters}
            </button>
          )}
        </div>

        <SortSelect value={sort} onChange={setSort} locale={locale} />
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              products={products}
              filters={filters}
              onChange={setFilters}
              locale={locale}
              showCategories={showCategoryFilter}
              query={query}
              onQueryChange={setQuery}
            />
          </div>
        </aside>

        <div>
          {visible.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl">{t.collection.noResults}</p>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setFilters(EMPTY_FILTERS);
                  setQuery("");
                }}
                className="mt-5"
              >
                {t.collection.noResultsCta}
              </Button>
            </div>
          ) : (
            <ProductRail
              products={visible}
              locale={locale}
              listName={listName}
              variant="grid"
              priorityCount={4}
            />
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Drawer
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        side="bottom"
        title={t.collection.filters}
        closeLabel={t.common.close}
        footer={
          <div className="flex gap-3 bg-cream px-5 py-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="flex-1"
            >
              {t.collection.clearFilters}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setSheetOpen(false)}
              className="flex-[1.4]"
            >
              {t.collection.applyFilters} ({visible.length})
            </Button>
          </div>
        }
      >
        <div className="px-5 py-5">
          <FilterPanel
            products={products}
            filters={filters}
            onChange={setFilters}
            locale={locale}
            showCategories={showCategoryFilter}
            query={query}
            onQueryChange={setQuery}
          />
        </div>
      </Drawer>
    </div>
  );
}
