import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#040609",
        card: "rgba(13, 17, 24, 0.8)",
        surface: "#090D14",
        "surface-light": "#111824",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5D061",
          dark: "#A38020",
          glow: "rgba(212, 175, 55, 0.35)",
        },
        profit: {
          DEFAULT: "#00E5A0",
          glow: "rgba(0, 229, 160, 0.35)",
          dark: "#00875A",
        },
        loss: {
          DEFAULT: "#FF4D5E",
          glow: "rgba(255, 77, 94, 0.35)",
          dark: "#B82334",
        },
        cyan: {
          accent: "#D4AF37", // mapped to luxury champagne gold
          glow: "rgba(212, 175, 55, 0.35)",
        },
        border: "rgba(255, 255, 255, 0.08)",
        "border-glow": "rgba(212, 175, 55, 0.25)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(212, 175, 55, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 175, 55, 0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 70%)",
        "gold-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.16), transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ticker: "ticker 35s linear infinite",
        "ticker-reverse": "ticker-reverse 35s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ticker-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
