import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

/**
 * Locale routing.
 *
 * All pages live under src/app/[locale]/, but Romanian — the primary language —
 * is served without a prefix. This middleware rewrites `/produse` to
 * `/ro/produse` internally, so the visible URL stays clean while the App Router
 * still gets its `locale` param. Russian URLs already carry `/ru` and pass
 * through untouched.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocalePrefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Skip static assets, API routes and the SEO files, which must be served
   * from their real paths rather than rewritten into a locale tree.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-.*\\.xml|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest)$).*)",
  ],
};
