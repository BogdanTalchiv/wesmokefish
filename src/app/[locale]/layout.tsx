import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/lib/cart/CartProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/structuredData";
import { SITE_URL } from "@/config/business";
import { LOCALES, LOCALE_TAGS, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import "../globals.css";

/**
 * This is the application's root layout.
 *
 * It lives under [locale] rather than at src/app/layout.tsx so the active
 * locale is available synchronously here, which means <html lang> is correct
 * in the server-rendered HTML while every page stays statically generated.
 * Romanian is served without a URL prefix — see src/proxy.ts.
 */

/**
 * Two fonts only: Inter for UI and body, Fraunces for display headlines.
 * Both are self-hosted by next/font (no render-blocking third-party request)
 * and subset to Latin + Latin-Extended for Romanian diacritics, plus Cyrillic
 * for the Russian locale.
 */
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
  // Slightly softened, lower-contrast display cut — warm rather than fussy.
  axes: ["SOFT", "WONK", "opsz"],
});

/**
 * Root-level metadata defaults.
 *
 * Only `metadataBase` lives here, so that any page without its own
 * `generateMetadata` (the 404, for instance) still resolves relative OG and
 * Twitter image paths against the real origin instead of localhost. Titles
 * and descriptions are set per page — a site-wide default title would show up
 * as a duplicate in Search Console.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom — that would fail WCAG 1.4.4.
  maximumScale: 5,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Product imagery comes from Shopify's CDN — warm the connection early. */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        {/*
          Marks the document as able to run scroll-reveal animations, which
          lets those sections start from hidden.

          Gated on IntersectionObserver so the flag is only set when something
          will actually reveal the content again. If scripts fail, are blocked,
          or the browser is too old, the flag is never set and every section
          stays plainly visible — content is never hidden by an animation that
          cannot finish.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof IntersectionObserver!=="undefined")document.documentElement.dataset.js="true"`,
          }}
        />
        {/*
          Google Consent Mode v2 defaults.

          A raw inline script in <head> rather than next/script, because these
          defaults must be in the dataLayer before ANY Google tag can read
          them. Everything starts denied, so no analytics or advertising
          cookie is ever written before the visitor opts in — the consent
          banner then pushes a 'consent','update'. See
          src/lib/analytics/consent.ts.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
              `gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',` +
              `ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`,
          }}
        />
      </head>
      <body>
        {/* Site-wide structured data, emitted once per page. */}
        <JsonLd id="ld-organization" data={organizationSchema()} />
        <JsonLd id="ld-store" data={localBusinessSchema()} />
        <JsonLd id="ld-website" data={websiteSchema(locale)} />

        <CartProvider>
          <a href="#main" className="sr-only-focusable">
            {t.nav.skipToContent}
          </a>

          <AnnouncementBar locale={locale} />
          <Header locale={locale} />

          <main id="main">{children}</main>

          <Footer locale={locale} />

          <CartDrawer locale={locale} />
        </CartProvider>

        <Analytics />
        <CookieConsent locale={locale} />
      </body>
    </html>
  );
}
