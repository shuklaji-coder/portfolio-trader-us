import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = "WayTrades | Waylon Skinner — Futures Trader & Digital Nomad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#05070A",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 229, 160, 0.12)",
            filter: "blur(90px)",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              border: "1px solid rgba(0, 229, 160, 0.4)",
              backgroundColor: "#0B0F17",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00E5A0",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            W
          </div>
          <span
            style={{
              color: "#94A3B8",
              fontSize: "20px",
              letterSpacing: "4px",
              fontWeight: 600,
            }}
          >
            WAYTRADES // {siteConfig.legalName.toUpperCase()}
          </span>
        </div>

        {/* Main Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              maxWidth: "950px",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#00E5A0",
              letterSpacing: "2px",
            }}
          >
            {siteConfig.subHeadline}
          </div>
        </div>

        {/* Footer badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", color: "#E2E8F0", fontSize: "18px" }}>
            <span>8.6K+ Instagram</span>
            <span>•</span>
            <span>3.2K+ Community</span>
            <span>•</span>
            <span>24+ Countries</span>
          </div>

          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(0, 229, 160, 0.15)",
              border: "1px solid rgba(0, 229, 160, 0.4)",
              color: "#00E5A0",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            CME GLOBEX FUTURES
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
