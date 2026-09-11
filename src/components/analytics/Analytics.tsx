"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ANALYTICS } from "@/config/business";
import { useConsent } from "@/lib/analytics/useConsent";
import { trackPageView } from "@/lib/analytics/events";

/**
 * Analytics loader.
 *
 * Tags load only when BOTH their env var is set AND the visitor has consented.
 * Nothing is loaded in development or on a preview without IDs configured, so
 * no phantom traffic or fake events ever reach the real properties.
 *
 * Purchase and payment events are intentionally not tracked here — they belong
 * to Shopify's own GA4/Meta integration on the hosted checkout. See
 * src/lib/analytics/events.ts for the reasoning.
 */
export function Analytics() {
  const pathname = usePathname();
  const consent = useConsent();

  // SPA page_view on every client-side navigation.
  useEffect(() => {
    if (!pathname) return;
    if (!consent.analytics && !consent.marketing) return;
    trackPageView(pathname, document.title);
  }, [pathname, consent.analytics, consent.marketing]);

  const { gtmId, ga4Id, metaPixelId, clarityId } = ANALYTICS;

  return (
    <>
      {/*
        The Consent Mode v2 defaults are NOT here — they live as a raw inline
        script in the document <head> (see the root layout), which is the only
        way to guarantee they execute before any Google tag can read them.
      */}

      {gtmId && (consent.analytics || consent.marketing) && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {/* GA4 directly, for setups without GTM. */}
      {!gtmId && ga4Id && consent.analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:true});`}
          </Script>
        </>
      )}

      {metaPixelId && consent.marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {clarityId && consent.analytics && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','${clarityId}');`}
        </Script>
      )}

      {gtmId && (consent.analytics || consent.marketing) && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
}
