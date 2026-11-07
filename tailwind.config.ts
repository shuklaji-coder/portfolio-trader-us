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
        background: "#05070A",
        card: "rgba(11, 15, 23, 0.75)",
        surface: "#0B0F17",
        "surface-light": "#131B2A",
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
          accent: "#00D2FF",
          glow: "rgba(0, 210, 255, 0.35)",
        },
        border: "rgba(255, 255, 255, 0.08)",
        "border-glow": "rgba(0, 229, 160, 0.2)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 50% 50%, rgba(0, 229, 160, 0.08) 0%, transparent 70%)",
        "terminal-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 210, 255, 0.12), transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ticker: "ticker 35s linear infinite",
        "ticker-reverse": "ticker-reverse 35s linear infinite",
        float: "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
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
