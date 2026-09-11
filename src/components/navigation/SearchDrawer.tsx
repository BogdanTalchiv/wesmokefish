"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { PriceRange } from "@/components/ui/Price";
import { searchProducts } from "@/lib/search";
import { formatVariantLabel, getDefaultVariant } from "@/lib/catalog/content";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { ROUTES } from "@/config/navigation";
import { trackSearch } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type SearchDrawerProps = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
};

export function SearchDrawer({ open, onClose, locale }: SearchDrawerProps) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchProducts(query, 8), [query]);

  /*
    Reset between openings so the panel never shows a stale query. Done during
    render (React's pattern for adjusting state when an input changes) so the
    box is already empty on the frame the drawer closes.
  */
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setQuery("");
  }

  // Focus the input once the drawer has been painted.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Report the settled query rather than every keystroke.
  useEffect(() => {
    if (!open || query.trim().length < 2) return;
    const timer = setTimeout(() => trackSearch(query.trim(), results.length), 700);
    return () => clearTimeout(timer);
  }, [query, results.length, open]);

  const showResults = query.trim().length >= 2;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="top"
      title={t.search.label}
      hideTitle
      closeLabel={t.search.close}
      className="max-h-[92svh] rounded-b-lg"
    >
      <div className="container-page py-5 sm:py-7">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-ink-400"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              aria-label={t.search.label}
              autoComplete="off"
              enterKeyHint="search"
              className={cn(
                "w-full border-b border-cream-300 bg-transparent py-3 pr-9 pl-8",
                "font-display text-xl tracking-[-0.01em] outline-none",
                "placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-ink-400",
                "focus:border-ink sm:text-2xl sm:placeholder:text-lg"
              )}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label={t.search.clear}
                className="absolute top-1/2 right-0 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            )}
          </div>

          {/* Popular searches, shown until the shopper starts typing. */}
          {!showResults && (
            <div className="mt-6">
              <p className="eyebrow">{t.search.suggestions}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.search.popular.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-cream-300 px-3.5 py-1.5 text-[0.8125rem] text-ink-700 transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="mt-6" aria-live="polite">
              {results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-display text-lg">
                    {fill(t.search.noResults, { query: query.trim() })}
                  </p>
                  <p className="mt-2 text-sm text-ink-500">{t.search.noResultsBody}</p>
                </div>
              ) : (
                <>
                  <p className="eyebrow">
                    {fill(t.search.resultsCount, { count: results.length })}
                  </p>
                  <ul className="mt-3 divide-y divide-cream-200">
                    {results.map(({ product }) => {
                      const variant = getDefaultVariant(product);
                      const image = product.images[0];
                      return (
                        <li key={product.slug}>
                          <Link
                            href={localePath(locale, ROUTES.product(product.slug))}
                            onClick={onClose}
                            className="group flex items-center gap-4 py-3 transition-colors hover:bg-cream-100"
                          >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[2px] bg-cream-100">
                              {image && (
                                <Image
                                  src={image.url}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  quality={70}
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium group-hover:text-ember">
                                {product.title}
                              </p>
                              {variant.title && (
                                <p className="mt-0.5 text-xs text-ink-400">
                                  {formatVariantLabel(variant.title, locale)}
                                </p>
                              )}
                            </div>
                            <PriceRange
                              min={product.priceMin}
                              max={product.priceMax}
                              locale={locale}
                              className="shrink-0 text-sm font-medium"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href={localePath(locale, `${ROUTES.products}?q=${encodeURIComponent(query.trim())}`)}
                    onClick={onClose}
                    className="mt-4 inline-block border-b border-ink/25 pb-0.5 text-sm font-medium transition-colors hover:border-ember hover:text-ember"
                  >
                    {t.search.viewAll}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
