import { ImageResponse } from "next/og";
import { BRAND, DELIVERY } from "@/config/business";
import { getDictionary } from "@/lib/i18n";

/**
 * Default social share card.
 *
 * Generated at build time rather than shipped as a static asset, so the
 * wordmark and the delivery line stay in sync with src/config/business.ts.
 * Pages with their own product photography override this via `openGraph.images`.
 *
 * Deliberately type-only — no photograph — because a generic fish stock image
 * would be less honest and less distinctive than the brand mark.
 */

const t = getDictionary("ro");

export const alt = `${BRAND.name} — ${t.meta.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141110",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#bd5a2c",
          }}
        >
          Chișinău
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/*
            Satori requires an explicit display on any element with more than
            one child, so the wordmark is two flex siblings rather than text
            plus an inline span.
          */}
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#fbf8f3" }}>WeSmoke</span>
            <span style={{ color: "#bd5a2c" }}>Fish</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              color: "rgba(251,248,243,0.7)",
              lineHeight: 1.3,
              maxWidth: 820,
            }}
          >
            {t.meta.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(251,248,243,0.5)",
          }}
        >
          {`Livrare gratuită de la ${DELIVERY.freeShippingThreshold.toLocaleString("ro-MD")} ${DELIVERY.currency}`}
        </div>
      </div>
    ),
    size
  );
}
