"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a single query-string parameter from the live URL.
 *
 * Why not Next's `useSearchParams`: that hook forces a page out of static
 * prerendering unless it sits behind a Suspense boundary, and a Suspense
 * fallback would leave the product grid out of the prerendered HTML. The
 * collection and all-products pages are the most linked-to pages on the
 * site — every product needs to be in their static HTML for crawlers.
 *
 * Why not `useState` + `useEffect`: the URL is an external mutable source, and
 * `useSyncExternalStore` is the hook React provides for reading one. It also
 * gives a defined server snapshot (empty), so the prerendered markup is the
 * unfiltered list and hydration cannot mismatch.
 *
 * The returned value is a string, which React compares by value, so no
 * snapshot caching is needed.
 */

function subscribe(onChange: () => void): () => void {
  // Covers browser back/forward between filtered and unfiltered views.
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

export function useUrlQueryParam(key: string): string {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key) ?? "",
    () => ""
  );
}
