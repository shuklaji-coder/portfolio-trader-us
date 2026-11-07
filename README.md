# WayTrades — Award-Level 3D Portfolio for Waylon Skinner

A luxury, cinematic 3D animated personal portfolio website built for **WayTrades** (Waylon Skinner), an independent CME futures trader (S&P 500 ES/MES & Nasdaq 100 NQ/MNQ), trading community founder, and digital nomad.

> *"I look at candlesticks and travel the world."*

---

## ✨ Features & Storytelling Architecture

1. **Award-Level Apple/Awwwards Cinematic Loading Screen**
   - Editorial 3-phase kinetic typography sequence:
     - `[01 // THE DISCIPLINE]` — *"I look at candlesticks."*
     - `[02 // THE FREEDOM]` — *"And travel the world."*
     - `[03 // THE TRADER]` — **WAYLON SKINNER** in glowing Monaco Gold & Platinum.
   - Morphing center glowing candlestick (Green ➔ Liquid Gold ➔ Pure Breakout White).
   - Giant minimalist monospace counter (`00` ➔ `100%`) with a 2px hairline golden progress track.
   - Smooth scale/blur exit into the 3D world + 1-click / Spacebar instant skip.

2. **Custom TradingView Crosshair Cursor**
   - Pinpoint dot with trailing Monaco Gold spring ring.
   - Dynamically morphs into a TradingView crosshair with real-time X/Y coordinates when hovering interactive elements.

3. **Hero Section with 1,320 3D Candlesticks & Live Stream**
   - **Luxury Frosted Glass Command Shield**: Displays **WAYLON SKINNER** in giant Diamond Platinum & Monaco Gold metallic typography with verified CME Globex operator credentials.
   - **Continuous Live Candlestick Stream (Dual Engine)**:
     - **Mode A (60 FPS Canvas)**: Full-width panoramic chart with radiant vertical gradient candles, glowing laser wicks, laser trendline ribbon, OHLC hover HUD, and interactive **Paper Trading simulator (BUY / SELL with real-time P&L and confetti victory)**.
     - **Mode B (Official TradingView)**: Instant switch to live institutional CME futures data.
   - **Simulated Ticker Tape**: Real-time micro-ticks for ES, NQ, MES, and MNQ with green/red price flash.
   - **Magnetic CTA Buttons**: *Join the Discord* and *Watch on YouTube*.

4. **About / The Trader**
   - Scroll-driven camera fly-through deeper into the 3D candlestick field.
   - Glassmorphism bio card with trader profile photo placeholder and trading pillars.
   - Animated stat counters (8.6K+ Instagram followers, 3.2K+ Discord members, 24+ countries traded from, 100% risk discipline — strictly zero fake P&L claims).

5. **Markets I Trade & Global Sessions Radar**
   - **Global Market Sessions Live Radar**: Real-time ET clock, **New York 9:30 AM Opening Bell countdown timer**, and live status badges for Tokyo/Sydney, London Open, New York RTH, and CME Globex.
   - Two interactive 3D perspective cards: **S&P 500 (ES / MES)** and **Nasdaq 100 (NQ / MNQ)** with hover tilt and glowing vector charts.
   - **Interactive Futures Position Sizer & Risk Calculator**: Calculate dollar risk, contract size, and 1:3 R:R targets for ES, MES, NQ, and MNQ.

6. **Trade with a Plan (Process Section)**
   - 4-step execution protocol: **Plan → Execute → Review → Repeat**.
   - Candlestick pattern visualizers (Liquidity Sweep, Fair Value Gap / FVG, Order Block, Break of Structure).
   - Dedicated feature callout for **Kremvo** (*"Trade with a plan. Not emotions."*).
   - **Interactive Pre-Market Discipline Checklist**: 5-point risk check with live progress bar and "Disciplined Trader" badge.

7. **Trading From Everywhere (Travel Section)**
   - 3D interactive dotted wireframe globe with golden bezier flight arcs between global trading bases.
   - Rotating globe focuses on active city pins: **Bali, Tokyo, Dubai, London, New York, Miami, Lisbon, Singapore**.
   - **The Nomad Loadout**: Waylon's actual travel workstation showcase (MacBook M3 Max, Dual OLED monitors, Starlink Mini, and Celsius Energy Drink affiliate link).

8. **Prop Firm Partners**
   - Two luxury glass cards for **Alpha Futures** (code `WAY`) and **Tradeify** (code `WAY`).
   - Interactive "Copy Code WAY" button with micro-animation and celebratory confetti feedback.
   - Clear *"Official Partner • Affiliate Link"* compliance notices.

9. **Community (Discord Mega Card)**
   - Ambient floating chat bubble particles with live market commentary previews.
   - Full benefits matrix and free community join CTA (`https://discord.gg/HRm9eQuMed`).

10. **Socials, Clocks & Footer**
    - Magnetic hover buttons for Instagram, YouTube, X (Twitter), and Discord.
    - Extra affiliate link card for Celsius Essential Energy.
    - Live New York (EST) session clock.
    - Giant **WAYTRADES** wordmark with scroll-reveal mask effect.
    - Full regulatory futures risk disclosure statement.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) + [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Monaco Gold & Obsidian luxury theme
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
- Discord, YouTube, Instagram & X links
- Travel cities array (latitude, longitude, market session, notes)
- Nomad loadout gear items & Celsius affiliate link
- Ticker tape symbols and decorative prices
- Legal risk disclaimer text
```

---

## 🚀 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/<YOUR_USERNAME>/waytrades-portfolio.git
cd waytrades-portfolio
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add -A
   git commit -m "Deploy WayTrades portfolio"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/waytrades-portfolio.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your `waytrades-portfolio` repository and click **Deploy**.
4. Your site will be live worldwide in under 2 minutes with automatic global CDN and Edge caching!

---

## ⚖️ Compliance & Disclaimers

Trading futures involves substantial risk of loss and is not suitable for every investor. Content is for educational purposes only, not financial advice. Affiliate links may earn a commission.
