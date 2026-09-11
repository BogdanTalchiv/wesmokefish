import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/business";

/**
 * robots.txt
 *
 * `/api/` is disallowed because those routes accept POST only and have no
 * crawlable content. The Shopify checkout paths (/cart, /checkout) are
 * disallowed too — they are handled by Shopify on the same domain, produce
 * infinite parameterised variants, and must never appear in search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cart", "/checkout", "/*?q=", "/*?variant="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
