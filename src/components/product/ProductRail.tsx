"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/catalog/types";
import { getDefaultVariant } from "@/lib/catalog/content";
import { toAnalyticsItem, trackViewItemList } from "@/lib/analytics/events";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ProductRailProps = {
  products: Product[];
  locale: Locale;
  /** GA4 item_list_name, e.g. "bestsellers". */
  listName: string;
  /** Scroll-snap rail on mobile, grid from sm up. */
  variant?: "rail" | "grid";
  priorityCount?: number;
  className?: string;
};

/**
 * Horizontal product rail.
 *
 * On mobile it is a scroll-snap carousel — cards are wide enough to read but
 * peek the next one, which reads as swipeable without needing arrows. From the
 * `sm` breakpoint up it becomes a plain grid.
 *
 * Fires `view_item_list` once, when the rail first enters the viewport.
 */
export function ProductRail({
  products,
  locale,
  listName,
  variant = "rail",
  priorityCount = 0,
  className,
}: ProductRailProps) {
  const ref = useRef<HTMLUListElement>(null);
  const reported = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || products.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || reported.current) return;
        reported.current = true;
        trackViewItemList(
          listName,
          products.map((p) => toAnalyticsItem(p, getDefaultVariant(p), 1))
        );
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [products, listName]);

  if (products.length === 0) return null;

  /*
    One DOM list for both layouts.
    - `rail`: horizontal snap-scroll on mobile, grid from `sm` up. The cards are
      sized so the next one peeks into view, which signals swipeability without
      needing arrows.
    - `grid`: always a grid.
    Rendering the list twice and toggling with `hidden` would double the HTML
    and repeat every product name for crawlers and screen readers.
  */
  const isRail = variant === "rail";

  return (
    <ul
      ref={ref}
      className={cn(
        "list-none",
        isRail
          ? [
              "snap-rail -mx-5 gap-3 px-5 pb-1",
              "sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0",
              "lg:grid-cols-4 lg:gap-x-6",
            ]
          : "grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6",
        className
      )}
    >
      {products.map((product, i) => (
        <li
          key={product.slug}
          className={cn(isRail && "w-[calc(50%-1.125rem)] min-w-[9.5rem] sm:w-auto sm:min-w-0")}
        >
          <ProductCard
            product={product}
            locale={locale}
            listName={listName}
            priority={i < priorityCount}
          />
        </li>
      ))}
    </ul>
  );
}
