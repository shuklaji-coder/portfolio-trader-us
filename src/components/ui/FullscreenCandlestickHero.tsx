"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TickerTape } from "@/components/ui/TickerTape";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import {
  ArrowUpRight,
  Youtube,
  MessageSquare,
  Sparkles,
  Radio,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  XCircle,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  time: string;
}

interface ActiveTrade {
  type: "LONG" | "SHORT";
  entryPrice: number;
  entryTime: string;
  contracts: number;
}

export function FullscreenCandlestickHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtitle typing effect
  const [typedIndex, setTypedIndex] = useState(0);
  const fullSubline = siteConfig.subHeadline;

  useEffect(() => {
    if (typedIndex < fullSubline.length) {
      const timeout = setTimeout(() => {
        setTypedIndex((prev) => prev + 1);
      }, 65);
      return () => clearTimeout(timeout);
    }
  }, [typedIndex, fullSubline]);

  // Live Candlestick State
  const [instrument, setInstrument] = useState<"ES" | "NQ">("ES");
  const [isPlaying, setIsPlaying] = useState(true);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(5886.5);
  const [priceChange, setPriceChange] = useState(18.25);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Paper Trading State
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const basePrice = instrument === "ES" ? 5880 : 20640;
  const tickSize = instrument === "ES" ? 0.25 : 0.5;
  const pointValue = instrument === "ES" ? 50 : 20;

  // Generate historical candles spanning across screen width
  const initCandles = useCallback(() => {
    const initial: Candle[] = [];
    let price = basePrice;
    const now = new Date();
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 45 : 75;

    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const delta = (Math.random() - 0.48) * (instrument === "ES" ? 2.8 : 9.0);
      const open = price;
      const close = Number((open + delta).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * (instrument === "ES" ? 1.8 : 4.5)).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * (instrument === "ES" ? 1.8 : 4.5)).toFixed(2));
      const volume = Math.floor(Math.random() * 450) + 60;

      price = close;
      initial.push({
        open,
        close,
        high,
        low,
        volume,
        isUp: close >= open,
        time,
      });
    }

    setCandles(initial);
    setCurrentPrice(initial[initial.length - 1].close);
    setActiveTrade(null);
  }, [basePrice, instrument]);

  useEffect(() => {
    initCandles();
  }, [initCandles]);

  // Continuous Live Candlestick Ticking & Formation Loop
  useEffect(() => {
    if (!isPlaying) return;

    let subTicks = 0;
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const current = { ...updated[lastIdx] };

        // Micro-tick price movement
        const tickDelta = (Math.random() > 0.48 ? 1 : -1) * tickSize;
        const newClose = Number((current.close + tickDelta).toFixed(2));
        current.close = newClose;
        current.high = Number(Math.max(current.high, newClose).toFixed(2));
        current.low = Number(Math.min(current.low, newClose).toFixed(2));
        current.isUp = current.close >= current.open;
        current.volume += Math.floor(Math.random() * 8) + 1;

        updated[lastIdx] = current;
        setCurrentPrice(newClose);
        setPriceChange(Number((newClose - updated[0].open).toFixed(2)));

        subTicks++;
        // Finalize candle and spawn a new one every 14 micro-ticks
        if (subTicks >= 14) {
          subTicks = 0;
          const nextOpen = current.close;
          const nowStr = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          updated.push({
            open: nextOpen,
            close: nextOpen,
            high: nextOpen,
            low: nextOpen,
            volume: 40,
            isUp: true,
            time: nowStr,
          });

          // Keep fixed count across viewport width
          const maxCapacity = window.innerWidth < 768 ? 48 : 80;
          if (updated.length > maxCapacity) {
            updated.shift();
          }
        }

        return updated;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, tickSize]);

  // Resize canvas to full viewport width & height
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width || window.innerWidth;
        canvasRef.current.height = rect.height || window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 60 FPS Fullscreen Canvas Candlestick Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark Luxury Obsidian Void Background
      ctx.fillStyle = "#030508";
      ctx.fillRect(0, 0, width, height);

      if (candles.length === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Compute Price Min / Max
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      let maxVol = 0;

      candles.forEach((c) => {
        if (c.low < minPrice) minPrice = c.low;
        if (c.high > maxPrice) maxPrice = c.high;
        if (c.volume > maxVol) maxVol = c.volume;
      });

      if (activeTrade) {
        if (activeTrade.entryPrice < minPrice) minPrice = activeTrade.entryPrice - 2;
        if (activeTrade.entryPrice > maxPrice) maxPrice = activeTrade.entryPrice + 2;
      }

      const paddingY = 80;
      const priceRange = maxPrice - minPrice || 1;
      const chartHeight = height - 120; // Bottom space for volume & ticker

      const priceToY = (price: number) => {
        return chartHeight - paddingY - ((price - minPrice) / priceRange) * (chartHeight - paddingY * 2);
      };

      // 1. Draw Fullscreen Terminal Coordinate Grid
      const numGridLines = 7;
      ctx.strokeStyle = "rgba(212, 175, 55, 0.05)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
      ctx.font = "11px JetBrains Mono, monospace";

      for (let i = 0; i <= numGridLines; i++) {
        const y = paddingY + (i / numGridLines) * (chartHeight - paddingY * 2);
        const priceVal = maxPrice - (i / numGridLines) * priceRange;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width - 75, y);
        ctx.stroke();

        ctx.fillText(priceVal.toFixed(2), width - 70, y + 4);
      }

      // 2. Draw Candlesticks & Radiant Neon Wicks Across Whole Viewport
      const totalCandleSlot = width / candles.length;
      const candleWidth = Math.max(5, totalCandleSlot - 4);

      candles.forEach((candle, idx) => {
        const x = idx * totalCandleSlot + 2;
        const openY = priceToY(candle.open);
        const closeY = priceToY(candle.close);
        const highY = priceToY(candle.high);
        const lowY = priceToY(candle.low);

        const isGreen = candle.close >= candle.open;
        const isGold = (idx % 8 === 0 && isGreen);
        const wickColor = isGold ? "#F5D061" : isGreen ? "#00E5A0" : "#FF4D5E";

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(3, Math.abs(closeY - openY));

        // A. Wick
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // Wick Spark
        ctx.fillStyle = isGold ? "#FFFFFF" : isGreen ? "#6BFFC9" : "#FFA3AC";
        ctx.beginPath();
        ctx.arc(x + candleWidth / 2, highY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // B. Radiant Gradient Body
        let bodyGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyHeight);
        if (isGold) {
          bodyGrad.addColorStop(0, "#FFF4BA");
          bodyGrad.addColorStop(0.5, "#F5D061");
          bodyGrad.addColorStop(1, "#A8801A");
        } else if (isGreen) {
          bodyGrad.addColorStop(0, "#5CFFA8");
          bodyGrad.addColorStop(0.5, "#00E5A0");
          bodyGrad.addColorStop(1, "#006E44");
        } else {
          bodyGrad.addColorStop(0, "#FFA3AC");
          bodyGrad.addColorStop(0.5, "#FF4D5E");
          bodyGrad.addColorStop(1, "#8A1220");
        }

        // Bloom Glow
        ctx.shadowColor = isGold
          ? "rgba(245, 208, 97, 0.7)"
          : isGreen
          ? "rgba(0, 229, 160, 0.55)"
          : "rgba(255, 77, 94, 0.55)";
        ctx.shadowBlur = isGold || idx === candles.length - 1 ? 16 : 8;
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

        // Highlight stroke
        ctx.strokeStyle = isGold ? "#FFF7CC" : isGreen ? "#8AFFE2" : "#FFBAC1";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
        ctx.shadowBlur = 0;

        // C. Volume Bar at bottom
        const volHeight = (candle.volume / (maxVol || 1)) * 65;
        const volY = height - volHeight - 65;
        ctx.fillStyle = isGold
          ? "rgba(245, 208, 97, 0.3)"
          : isGreen
          ? "rgba(0, 229, 160, 0.25)"
          : "rgba(255, 77, 94, 0.25)";
        ctx.fillRect(x, volY, candleWidth, volHeight);
      });

      // 3. Golden Laser Spline Connecting Candle Peaks
      if (candles.length > 2) {
        ctx.strokeStyle = "rgba(245, 208, 97, 0.5)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(245, 208, 97, 0.6)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        candles.forEach((c, i) => {
          const cx = i * totalCandleSlot + 2 + candleWidth / 2;
          const cy = priceToY(c.close);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 4. Fullscreen Active Trade Entry Line
      if (activeTrade) {
        const tradeY = priceToY(activeTrade.entryPrice);
        const isLong = activeTrade.type === "LONG";
        const tradeColor = isLong ? "#00D2FF" : "#F59E0B";

        ctx.setLineDash([8, 4]);
        ctx.strokeStyle = tradeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, tradeY);
        ctx.lineTo(width, tradeY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = tradeColor;
        ctx.fillRect(20, tradeY - 20, 160, 18);
        ctx.fillStyle = "#030508";
        ctx.font = "bold 10px JetBrains Mono, monospace";
        ctx.fillText(
          `${activeTrade.type} 2x @ ${activeTrade.entryPrice.toFixed(2)}`,
          26,
          tradeY - 7
        );
      }

      // 5. Fullscreen Pulsing Live Price Line Across 100% Width
      const latest = candles[candles.length - 1];
      if (latest) {
        const liveY = priceToY(latest.close);

        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = latest.isUp ? "#00E5A0" : "#FF4D5E";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, liveY);
        ctx.lineTo(width - 75, liveY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulsing Live Price Badge on Right Margin
        ctx.fillStyle = latest.isUp ? "#00E5A0" : "#FF4D5E";
        ctx.fillRect(width - 75, liveY - 11, 75, 22);
        ctx.fillStyle = "#030508";
        ctx.font = "bold 11px JetBrains Mono, monospace";
        ctx.fillText(latest.close.toFixed(2), width - 68, liveY + 4);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [candles, activeTrade]);

  // Paper Trading Actions
  const handleBuy = () => {
    soundManager.playBuy();
    setActiveTrade({
      type: "LONG",
      entryPrice: currentPrice,
      entryTime: new Date().toLocaleTimeString(),
      contracts: 2,
    });
    setTradeMessage(`LONG 2x ${instrument} FILLED @ ${currentPrice.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  const handleSell = () => {
    soundManager.playSell();
    setActiveTrade({
      type: "SHORT",
      entryPrice: currentPrice,
      entryTime: new Date().toLocaleTimeString(),
      contracts: 2,
    });
    setTradeMessage(`SHORT 2x ${instrument} FILLED @ ${currentPrice.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  const handleCloseTrade = () => {
    if (!activeTrade) return;
    const points = activeTrade.type === "LONG"
      ? currentPrice - activeTrade.entryPrice
      : activeTrade.entryPrice - currentPrice;
    const pnl = points * pointValue * activeTrade.contracts;

    if (pnl > 0) {
      soundManager.playTargetHit();
      confetti({ particleCount: 60, spread: 60, colors: ["#00E5A0", "#F5D061", "#FFF"] });
      setTradeMessage(`TARGET HIT! +$${pnl.toFixed(2)} (+${points.toFixed(2)} pts)`);
    } else {
      soundManager.playClick();
      setTradeMessage(`CLOSED: -$${Math.abs(pnl).toFixed(2)} (${points.toFixed(2)} pts)`);
    }

    setActiveTrade(null);
    setTimeout(() => setTradeMessage(null), 4000);
  };

  const activePoints = activeTrade
    ? activeTrade.type === "LONG"
      ? currentPrice - activeTrade.entryPrice
      : activeTrade.entryPrice - currentPrice
    : 0;
  const activeUSD = activePoints * pointValue * (activeTrade?.contracts || 2);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-20"
    >
      {/* 1. FULLSCREEN CANDLESTICK CANVAS COVERING THE ENTIRE HERO SCREEN */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radial Gold & Profit Lighting Overlays */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-gold/15 via-gold/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-profit/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 2. TOP FLOATING HUD: Live CME Status + Paper Trading Controls */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* CME Feed Pill */}
        <div className="flex items-center space-x-2.5 rounded-full border border-gold/40 bg-[#06090f]/80 px-4 py-1.5 backdrop-blur-xl shadow-lg">
          <span className="h-2 w-2 rounded-full bg-profit animate-ping" />
          <span className="text-xs font-mono font-bold tracking-wider text-white">
            CME GLOBEX LIVE: {instrument} {currentPrice.toFixed(2)}
          </span>
          <span
            className={`text-xs font-mono font-semibold ${
              priceChange >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2)}
          </span>
        </div>

        {/* Floating Paper Trading Quick Controls */}
        <div className="flex items-center space-x-2 rounded-2xl border border-white/15 bg-[#06090f]/85 p-1.5 backdrop-blur-xl shadow-xl">
          {/* Instrument switch */}
          <div className="flex rounded-lg bg-black/60 p-0.5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => {
                setInstrument("ES");
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                instrument === "ES" ? "bg-gold text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => {
                setInstrument("NQ");
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                instrument === "NQ" ? "bg-gold text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              NQ
            </button>
          </div>

          {!activeTrade ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBuy}
                className="px-3.5 py-1 rounded-lg bg-profit/20 hover:bg-profit border border-profit/40 hover:border-profit text-profit hover:text-black font-mono text-xs font-bold transition-all shadow-sm"
              >
                BUY / LONG
              </button>
              <button
                onClick={handleSell}
                className="px-3.5 py-1 rounded-lg bg-loss/20 hover:bg-loss border border-loss/40 hover:border-loss text-loss hover:text-white font-mono text-xs font-bold transition-all shadow-sm"
              >
                SELL / SHORT
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                  activeUSD >= 0
                    ? "bg-profit/20 border-profit/40 text-profit"
                    : "bg-loss/20 border-loss/40 text-loss"
                }`}
              >
                {activeTrade.type} 2x: {activeUSD >= 0 ? `+$${activeUSD.toFixed(2)}` : `-$${Math.abs(activeUSD).toFixed(2)}`}
              </div>
              <button
                onClick={handleCloseTrade}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold border border-white/20 transition-all flex items-center space-x-1"
              >
                <XCircle className="h-3.5 w-3.5 text-loss mr-1" />
                <span>FLATTEN</span>
              </button>
            </div>
          )}

          {/* Trade notification pill */}
          {tradeMessage && (
            <span className="hidden lg:inline text-xs font-mono font-bold text-gold animate-bounce px-2">
              {tradeMessage}
            </span>
          )}
        </div>
      </div>

      {/* 3. CENTER FLOATING LUXURY COMMAND PLATE: WAYLON SKINNER */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center flex flex-col items-center justify-center my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-3xl border border-gold/40 bg-[#05080f]/85 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden"
        >
          {/* Subtle Golden Beam Inside Shield */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-36 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          {/* Verified CME Operator Tag */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold/40 bg-black/60 px-4 py-1.5 backdrop-blur-xl mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <span className="h-2.5 w-2.5 rounded-full bg-gold animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-gold-light uppercase">
              VERIFIED OPERATOR // CME GLOBEX FUTURES
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[11px] sm:text-xs font-mono text-slate-300 font-semibold">
              {siteConfig.handle}
            </span>
          </div>

          {/* GIANT BOLD NAME: WAYLON SKINNER in Monaco Gold & Diamond Platinum */}
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none my-1 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)]">
              WAYLON{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-gold to-[#B38C22] drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]">
              SKINNER
            </span>
          </h1>

          {/* Brand Badge & Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono mt-3 mb-2">
            <span className="rounded-lg bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 border border-gold/60 px-3.5 py-1 font-bold text-gold-light tracking-widest shadow-md">
              {siteConfig.name.toUpperCase()}
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-slate-100 tracking-wide font-medium italic text-sm sm:text-base">
              &ldquo;{siteConfig.tagline}&rdquo;
            </span>
          </div>

          {/* Live Subline with Typing Cursor */}
          <div className="h-6 flex items-center justify-center font-mono text-xs sm:text-sm text-slate-300 tracking-widest mt-2 uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-white font-bold">
              {fullSubline.slice(0, typedIndex)}
            </span>
            <span className="inline-block w-2 h-4 bg-gold ml-1.5 animate-pulse" />
          </div>

          {/* CTAs Inside Command Center */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
            {/* Join Discord CTA */}
            <MagneticButton
              href={siteConfig.community.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="px-7 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-gold/20"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Join the Discord</span>
              <ArrowUpRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticButton>

            {/* Watch on YouTube CTA */}
            <MagneticButton
              href={siteConfig.socials.find((s) => s.name === "YouTube")?.url || "https://www.youtube.com/@waytrades"}
              target="_blank"
              rel="noopener noreferrer"
              variant="glass"
              className="px-7 py-3 text-sm sm:text-base border-white/20 hover:border-gold/50"
            >
              <Youtube className="h-5 w-5 mr-2 text-[#FF4D5E]" />
              <span>Watch on YouTube</span>
              <ArrowUpRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* 4. BOTTOM FLOATING TICKER TAPE ACROSS BASE */}
      <div className="relative z-20 w-full pb-2">
        <TickerTape />
      </div>
    </div>
  );
}

