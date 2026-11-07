"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Terminal, Sparkles, ChevronRight, Activity } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

const TERMINAL_LOGS = [
  "CONNECTING TO CME GLOBEX CHICAGO GATEWAY...",
  "INITIALIZING ES (S&P 500) & NQ (NASDAQ 100) ORDER BOOK...",
  "CALIBRATING MONACO GOLD 3D R3F SHADERS...",
  "MAPPING GLOBAL NOMAD HUBS: TOKYO • DUBAI • BALI • NYC...",
  "CANDLESTICK VOLUMES VERIFIED: LIQUIDITY CONFIRMED...",
  "SYSTEM ARMED // TRADE WITH A PLAN. NOT EMOTIONS."
];

// Rich procedural candlesticks for the intro scanner
const INTRO_CANDLES = [
  { o: 30, c: 45, h: 55, l: 25, isUp: true },
  { o: 45, c: 40, h: 50, l: 35, isUp: false },
  { o: 40, c: 62, h: 68, l: 38, isUp: true },
  { o: 62, c: 58, h: 65, l: 52, isUp: false },
  { o: 58, c: 75, h: 82, l: 55, isUp: true },
  { o: 75, c: 70, h: 78, l: 65, isUp: false },
  { o: 70, c: 92, h: 96, l: 68, isUp: true },
  { o: 92, c: 88, h: 95, l: 82, isUp: false },
  { o: 88, c: 105, h: 112, l: 85, isUp: true },
  { o: 105, c: 120, h: 125, l: 100, isUp: true },
  { o: 120, c: 115, h: 122, l: 110, isUp: false },
  { o: 115, c: 138, h: 145, l: 112, isUp: true },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const hasFinishedRef = useRef(false);

  // Fast-forward / complete function
  const triggerExit = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(100);
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 700);
  }, [onComplete]);

  // Handle keyboard or click to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerExit]);

  // Progressive count-up timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds total intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Rotate terminal logs based on progress percentage
      const logIdx = Math.min(
        TERMINAL_LOGS.length - 1,
        Math.floor((pct / 100) * TERMINAL_LOGS.length)
      );
      setCurrentLogIndex(logIdx);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          triggerExit();
        }, 300);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [triggerExit]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          onClick={triggerExit}
          className="fixed inset-0 z-[999999] flex flex-col justify-between bg-[#030508] text-white overflow-hidden cursor-pointer select-none"
        >
          {/* Subtle Film Grain & Radar Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040609]/40 to-[#030508] pointer-events-none" />

          {/* Glowing Ambient Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-gold/15 via-gold/5 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-profit/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Sweeping Laser Scanner Line */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-40 shadow-[0_0_15px_#d4af37] pointer-events-none"
          />

          {/* TOP BAR: Terminal Header */}
          <div className="relative z-10 w-full px-6 sm:px-10 pt-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Pulsing Core Badge */}
              <div className="relative flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-gold animate-ping opacity-75" />
                <span className="absolute h-2 w-2 rounded-full bg-gold" />
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs tracking-wider">
                <span className="font-bold text-white tracking-widest">WAYTRADES</span>
                <span className="text-gold/60">//</span>
                <span className="text-slate-400">CME GLOBEX TERMINAL</span>
              </div>
            </div>

            {/* Skip badge */}
            <div className="hidden sm:flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-mono text-gold hover:bg-gold/20 transition-colors">
              <span>CLICK TO ENTER</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>

          {/* CENTER: Luxury Monogram + Animated Candlestick Oscilloscope */}
          <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
            {/* Monogram Crest with orbiting golden halo */}
            <div className="relative mb-6">
              {/* Outer rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3.5 rounded-full border border-dashed border-gold/30 pointer-events-none"
              />

              {/* Glowing Hexagon Box */}
              <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-[#1c1810] via-[#090b10] to-[#040609] border border-gold/50 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.25)]">
                <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C0] via-gold to-[#8A6D1C]">
                  W
                </span>
                <Sparkles className="absolute top-1.5 right-1.5 h-3 w-3 text-gold/80 animate-pulse" />
              </div>
            </div>

            {/* Title & Identity */}
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5D061] to-white uppercase mb-2">
              WAYLON SKINNER
            </h1>
            <p className="font-mono text-xs sm:text-sm text-gold/90 tracking-widest uppercase mb-6 flex items-center space-x-2">
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>&ldquo;I look at candlesticks and travel the world.&rdquo;</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
            </p>

            {/* Glowing Live Candlestick Display with Laser Wick Generation */}
            <div className="relative w-full max-w-lg h-28 sm:h-32 rounded-xl border border-gold/25 bg-black/60 backdrop-blur-md px-4 py-3 flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                <div className="w-full border-b border-dashed border-gold/40" />
                <div className="w-full border-b border-dashed border-gold/40" />
                <div className="w-full border-b border-dashed border-gold/40" />
              </div>

              {/* Watermark in chart */}
              <div className="absolute top-2 left-3 font-mono text-[10px] text-slate-500 uppercase flex items-center space-x-1.5">
                <Activity className="h-3 w-3 text-gold" />
                <span>ES_F // NQ_F 1M BOOT SEQUENCE</span>
              </div>

              <div className="absolute top-2 right-3 font-mono text-[10px] text-profit flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-profit animate-ping" />
                <span>60 FPS</span>
              </div>

              {/* Candlesticks array */}
              <div className="relative z-10 flex items-end justify-between h-full pt-6 pb-1 px-2">
                {INTRO_CANDLES.map((c, i) => {
                  const threshold = (i / INTRO_CANDLES.length) * 85;
                  const isPainted = progress >= threshold;
                  const bodyHeightPct = Math.max(12, Math.abs(c.c - c.o) * 1.6);
                  const wickHeightPct = Math.max(20, (c.h - c.l) * 1.6);

                  return (
                    <div
                      key={i}
                      className="relative flex flex-col items-center h-full justify-end w-4 sm:w-6"
                    >
                      {/* Wick */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isPainted ? 1 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`w-[1.5px] rounded-full origin-bottom absolute bottom-2 ${
                          c.isUp ? "bg-profit/80" : "bg-loss/80"
                        }`}
                        style={{ height: `${wickHeightPct}%` }}
                      />

                      {/* Body */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isPainted ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: 0.03, ease: "easeOut" }}
                        className={`w-2.5 sm:w-3.5 rounded-[2px] z-10 origin-bottom ${
                          c.isUp
                            ? "bg-gradient-to-t from-emerald-500 to-profit shadow-[0_0_12px_rgba(0,229,160,0.5)] border border-emerald-300/40"
                            : "bg-gradient-to-t from-red-600 to-loss shadow-[0_0_12px_rgba(255,77,94,0.5)] border border-rose-300/40"
                        }`}
                        style={{ height: `${bodyHeightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Percentage & Progress Line */}
            <div className="w-full max-w-lg mt-5">
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <Terminal className="h-3.5 w-3.5 text-gold" />
                  <span className="truncate max-w-[280px] sm:max-w-[360px] text-left text-slate-300">
                    {TERMINAL_LOGS[currentLogIndex]}
                  </span>
                </div>
                <div className="font-mono text-right flex items-baseline space-x-1">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {progress}
                  </span>
                  <span className="text-sm font-bold text-gold">%</span>
                </div>
              </div>

              {/* Dual Gold/Profit Progress Track */}
              <div className="w-full h-1.5 bg-[#121622] rounded-full overflow-hidden border border-gold/20 p-[1px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold via-[#FFE270] to-profit shadow-[0_0_10px_#d4af37]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM BAR: Global Coordinates & Verification Footer */}
          <div className="relative z-10 w-full px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-profit" />
              <span className="text-slate-400">
                PROPRIETARY CME FUTURES EXECUTION SYSTEM
              </span>
            </div>

            <div className="flex items-center space-x-4 text-slate-400">
              <span>LATENCY: 1.8ms</span>
              <span>•</span>
              <span className="text-gold">S&P 500 (ES) & NASDAQ (NQ)</span>
              <span>•</span>
              <span className="text-white">PRESS SPACE TO SKIP</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
