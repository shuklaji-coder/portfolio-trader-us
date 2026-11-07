# WayTrades — Award-Level 3D Portfolio for Waylon Skinner

A luxury, cinematic 3D animated personal portfolio website built for **WayTrades** (Waylon Skinner), an independent CME futures trader (S&P 500 ES/MES & Nasdaq 100 NQ/MNQ), trading community founder, and digital nomad.

> *"I look at candlesticks and travel the world."*

---

## ✨ Features & Storytelling Architecture

1. **Terminal Candlestick Loading Screen**
   - High-tech loading sequence with interactive candlestick chart drawing itself in real-time.
   - Smooth 0 → 100% counter with Bloomberg terminal boot logs and curtain reveal.

2. **Custom TradingView Crosshair Cursor**
   - Small pinpoint dot with smooth trailing outer ring.
   - Dynamically morphs into a TradingView crosshair with price-axis tag when hovering interactive elements.

3. **Hero Section with 3D Candlestick Landscape**
   - Full-screen procedural 3D scene using React Three Fiber: hundreds of green (`#00E5A0`) and red (`#FF4D5E`) candlesticks floating in space with realistic bodies and wicks.
   - Real-time mouse parallax, camera tilt, and cinematic bloom postprocessing.
   - Text-reveal headline animation: *"I look at candlesticks and travel the world."*
   - Sub-line typed effect: `ES • NQ • Futures • Options`.
   - Simulated live futures ticker tape (ES, NQ, MES, MNQ) with micro-ticks and green/red flash.
   - CTAs with magnetic cursor pull: *Join the Discord* and *Watch on YouTube*.

4. **About / The Trader**
   - Scroll-driven camera fly-through deeper into the candlestick matrix.
   - Glassmorphism bio card with trader profile photo placeholder and trading pillars.
   - Animated stat counters (8.6K+ Instagram followers, 3.2K+ Discord members, 24+ countries traded from, 100% risk discipline — strictly zero fake P&L claims).

5. **Markets I Trade**
   - Two interactive 3D perspective cards: **S&P 500 (ES / MES)** and **Nasdaq 100 (NQ / MNQ)**.
   - Tilt physics on mouse hover with dynamic light reflection.
   - Interactive glowing vector charts with node hover coordinates.
   - Complete CME contract specifications (tick values, point values, volatility profiles, trading hours).

6. **Trade with a Plan (Process Section)**
   - 4-step execution protocol: **Plan → Execute → Review → Repeat**.
   - Candlestick pattern visualizers for each step (Liquidity Sweep, Fair Value Gap / FVG, Order Block, Break of Structure).
   - Dedicated feature callout for **Kremvo** (*"Trade with a plan. Not emotions."*).

7. **Trading From Everywhere (Travel Section)**
   - 3D interactive dotted wireframe globe with glowing atmosphere and bezier flight arcs between global trading bases.
   - Rotating globe focuses on active city pins: **Bali, Tokyo, Dubai, London, New York, Miami, Lisbon, Singapore**.
   - Interactive diary card displaying local market session overlap and Waylon's field notes.

8. **Prop Firm Partners**
   - Two glass cards for **Alpha Futures** (code `WAY`) and **Tradeify** (code `WAY`).
   - Interactive "Copy Code WAY" button with micro-animation and celebratory confetti feedback.
   - Clear *"Official Partner • Affiliate Link"* compliance notices.

9. **Community (Discord Mega Card)**
   - Ambient floating chat bubble particles with live market commentary previews.
   - Full benefits matrix and free community join CTA.

10. **Socials, Clocks & Footer**
    - Magnetic hover buttons for Instagram, YouTube, X (Twitter), and Discord.
    - Extra affiliate link card for Celsius Essential Energy.
    - Live New York (EST) session clock.
    - Giant **WAYTRADES** wordmark with scroll-reveal mask effect.
    - Full regulatory futures risk disclosure statement.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) + [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/) synchronized with [GSAP](https://gsap.com/) ScrollTrigger
- **Animations & Micro-interactions**: [Framer Motion](https://www.framer-motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Confetti**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (numbers/tickers)

---

## 📁 Central Configuration (`src/config/site.ts`)

All content, links, affiliate codes, cities, stats, and colors are centralized in a single file for seamless customization:

```typescript
// Open src/config/site.ts to edit:
- Trader name, handles, tagline, and bio
- Stats & metrics
- Prop firm partner referral URLs & promo codes (Alpha Futures, Tradeify)
- Discord & YouTube links
- Travel cities array (latitude, longitude, market session, notes)
- Ticker tape symbols and decorative prices
- Legal risk disclaimer text
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd "d:/trader portfolio us"

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Local Preview

```bash
# Compile optimized production bundle
npm run build

# Start production server
npm run start
```

---

## ☁️ Deployment Guide (Vercel)

This application is optimized for zero-config deployment on **[Vercel](https://vercel.com/)**:

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the repository.
4. Framework Preset: select **Next.js**.
5. Build Command: `npm run build` (or leave default).
6. Output Directory: `.next` (default).
7. Environment Variables: **None required**.
8. Click **"Deploy"**.

Your portfolio will deploy with global CDN distribution, edge OpenGraph image generation, and sub-second loading speeds.

---

## ⚡ Performance & 60fps Optimization

- **InstancedMesh**: 100s of 3D candlesticks rendered in a single GPU draw call using `THREE.InstancedMesh`.
- **Adaptive DPR**: Device Pixel Ratio capped at `Math.min(window.devicePixelRatio, 2)` to eliminate thermal throttling on Retina and mobile screens.
- **Lenis + GSAP Loop**: Lenis runs directly inside GSAP's unified ticker (`gsap.ticker.add`), eliminating duplicate animation frames.
- **Dynamic Imports**: 3D Canvas scenes are lazily loaded with `next/dynamic` (`ssr: false`) to guarantee zero hydration mismatch.
- **Accessibility & Reduced Motion**: Automatically detects `prefers-reduced-motion` and scales down bloom and continuous rotations.

---

## 📄 License & Disclaimer

Trading futures involves substantial risk of loss and is not suitable for every investor. Content is for educational purposes only, not financial advice. Affiliate links may earn a commission.

