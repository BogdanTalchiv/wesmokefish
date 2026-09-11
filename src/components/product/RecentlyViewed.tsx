"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ProductRail } from "./ProductRail";
import { getProductBySlug } from "@/lib/catalog";
import type { Product } from "@/lib/catalog/types";
import { getDictionary, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "wsf.recentlyViewed.v1";
const CHANGE_EVENT = "wsf:recently-viewed-change";
const MAX_TRACKED = 8;

/**
 * Recently-viewed products, backed by localStorage.
 *
 * Modelled as an external store read through `useSyncExternalStore` rather
 * than state hydrated in an effect. That gives a defined server snapshot (an
 * empty list, so nothing renders during prerender and there is no hydration
 * mismatch) and keeps every mounted instance in sync when a new product view
 * is recorded.
 */

const EMPTY: readonly string[] = [];

let cachedRaw: string | null = null;
let cachedSlugs: readonly string[] = EMPTY;

function read(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }

  // Snapshots are compared by identity, so the parsed array is cached against
  // the raw string it came from.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedSlugs = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : EMPTY;
    } catch {
      cachedSlugs = EMPTY;
    }
  }
  return cachedSlugs;
}

function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Records a product view. Safe to call on every product page render. */
export function recordProductView(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = read();
    if (existing[0] === slug) return;
    const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_TRACKED);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage unavailable — recently-viewed is a nicety, not a requirement.
  }
}

export function RecentlyViewed({
  locale,
  excludeSlug,
  limit = 4,
}: {
  locale: Locale;
  excludeSlug?: string;
  limit?: number;
}) {
  const t = getDictionary(locale);
  const slugs = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const products = slugs
    .filter((slug) => slug !== excludeSlug)
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, limit);

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20" aria-labelledby="recently-viewed-heading">
      <div className="container-page">
        <h2 id="recently-viewed-heading" className="eyebrow">
          {t.product.recentlyViewed}
        </h2>
        <ProductRail
          products={products}
          locale={locale}
          listName="recently_viewed"
          className="mt-6"
        />
      </div>
    </section>
  );
}

/**
 * Records the current product as viewed.
 *
 * Runs in an effect rather than during render because it writes to an
 * external store, which must not happen while rendering.
 */
export function TrackProductView({ slug }: { slug: string }) {
  useEffect(() => {
    recordProductView(slug);
  }, [slug]);
  return null;
}
