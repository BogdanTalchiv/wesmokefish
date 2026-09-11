import type { NextConfig } from "next";
import catalog from "./src/data/catalog.json";

/**
 * Legacy Shopify URLs -> new routes.
 *
 * Our slugs are derived from product titles, while the live store's handles
 * are often stale ("Scrumbie ușor afumată" lives on `steak-de-pastrav-copy`),
 * so these have to be mapped one by one rather than pattern-matched. This
 * keeps every indexed URL and shared link alive with a 301.
 *
 * Several handles contain Romanian diacritics (`creveți-afumați-cu-parmezan`,
 * `pește-și-fructe-de-mare-afumate`). A browser sends those percent-encoded,
 * so each one is registered in BOTH its literal and its encoded form —
 * matching only the literal silently 404s the real inbound URL and throws away
 * that page's existing search ranking.
 */
function pathVariants(path: string): string[] {
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return encoded === path ? [path] : [path, encoded];
}

/** The live store serves a Russian tree under /ru/... as well. */
const LOCALE_PREFIXES = ["", "/ru"];

function legacyRedirect(oldPath: string, newPath: string) {
  return LOCALE_PREFIXES.flatMap((prefix) =>
    pathVariants(`${prefix}${oldPath}`).map((source) => ({
      source,
      destination: `${prefix}${newPath}`,
      permanent: true,
    }))
  );
}

const legacyRedirects = [
  ...catalog.products.flatMap((product) =>
    legacyRedirect(`/products/${product.shopifyHandle}`, `/produse/${product.slug}`)
  ),
  ...catalog.collections.flatMap((collection) =>
    legacyRedirect(`/collections/${collection.shopifyHandle}`, `/colectii/${collection.slug}`)
  ),
  ...legacyRedirect("/pages/livrare", "/livrare"),
  ...legacyRedirect("/pages/contact", "/contact"),
  ...legacyRedirect("/pages/despre-noi", "/despre-noi"),
  // Shopify's catch-all listings. Both point at the full catalogue rather than
  // the homepage: a shopper who asked for a product list should get one.
  ...legacyRedirect("/collections", "/produse"),
  ...legacyRedirect("/collections/all", "/produse"),
  ...legacyRedirect("/collections/frontpage", "/produse"),
  ...legacyRedirect("/search", "/produse"),
];

const nextConfig: NextConfig = {
  images: {
    // Product photography is served from the store's Shopify CDN. Next's
    // optimizer re-encodes it to AVIF/WebP at the sizes we actually request.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "wesmokefish.md" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
