import { ImageResponse } from "next/og";

/**
 * Favicon.
 *
 * A generated mark rather than a binary asset, so it follows the brand
 * palette defined in globals.css. "W" on the ink background reads at 16px,
 * which a fish silhouette would not.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141110",
          color: "#fbf8f3",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 6,
        }}
      >
        W
      </div>
    ),
    size
  );
}
