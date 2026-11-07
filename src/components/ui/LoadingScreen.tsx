"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

const PHASES = [
  {
    step: "01",
    label: "THE DISCIPLINE",
    headline: "I look at candlesticks.",
    sub: "Reading institutional order flow on ES & NQ.",
    candleState: "green",
  },
  {
    step: "02",
    label: "THE FREEDOM",
    headline: "And travel the world.",
    sub: "Tokyo • Dubai • Bali • New York • London.",
    candleState: "gold",
  },
  {
    step: "03",
    label: "THE TRADER",
    headline: "WAYLON SKINNER",
    sub: "Founder of WayTrades // CME Futures",
    candleState: "breakout",
  },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  // Fast exit on click or keypress
  const triggerExit = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(100);
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 700);
  }, [onComplete]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [triggerExit]);

  // Smooth counter animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2300; // 2.3 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setPhaseIndex(0);
      } else if (pct < 70) {
        setPhaseIndex(1);
      } else {
        setPhaseIndex(2);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(triggerExit, 300);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [triggerExit]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(16px)",
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          onClick={triggerExit}
          className="fixed inset-0 z-[999999] flex flex-col justify-between bg-[#020306] text-white select-none cursor-pointer overflow-hidden p-6 sm:p-12 md:p-16"
        >
          {/* Subtle Ambient Golden Glow in the Void */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-gold/15 via-[#F5D061]/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-profit/10 rounded-full blur-[140px] pointer-events-none" />

          {/* TOP BAR: Clean Minimalist Brand Header */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
              <span className="font-heading font-bold text-sm tracking-[0.25em] text-white">
                WAYTRADES
              </span>
              <span className="text-white/20">|</span>
              <span className="font-mono text-xs text-gold/80 tracking-widest hidden sm:inline">
                PORTFOLIO EDITION
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full hover:border-gold/40 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-profit" />
              <span>TAP ANYWHERE TO SKIP</span>
            </div>
          </div>

          {/* CENTER: Massive Minimalist Storytelling Typography & Glowing Center Candlestick */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center my-auto">
            {/* Minimalist Glowing Candlestick Hero in Center */}
            <div className="relative h-32 w-16 mb-8 flex items-center justify-center">
              {/* Vertical Laser Wick */}
              <motion.div
                key={`wick-${currentPhase.step}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-gold to-transparent shadow-[0_0_15px_#F5D061]"
              />

              {/* Glowing Candlestick Body */}
              <motion.div
                key={`body-${currentPhase.step}`}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className={`w-7 rounded-sm relative z-10 border shadow-2xl transition-all duration-500 ${
                  currentPhase.candleState === "green"
                    ? "h-16 bg-gradient-to-t from-emerald-600 to-profit border-profit/60 shadow-[0_0_30px_rgba(0,229,160,0.5)]"
                    : currentPhase.candleState === "gold"
                    ? "h-20 bg-gradient-to-t from-[#B38F24] via-gold to-[#FFE68C] border-gold shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                    : "h-24 bg-gradient-to-t from-profit via-[#FFE68C] to-white border-white shadow-[0_0_50px_rgba(255,255,255,0.7)]"
                }`}
              />

              {/* Pulsing Light Ring around Candle */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-24 w-24 rounded-full border border-gold/30 pointer-events-none"
              />
            </div>

            {/* Step Subtitle Pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${currentPhase.step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center space-x-2 font-mono text-xs text-gold tracking-[0.2em] uppercase mb-4"
              >
                <span>[ {currentPhase.step} // {currentPhase.label} ]</span>
              </motion.div>
            </AnimatePresence>

            {/* Giant Cinematic Headline */}
            <div className="h-20 sm:h-28 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`headline-${currentPhase.step}`}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-3xl leading-none"
                >
                  {currentPhase.headline === "WAYLON SKINNER" ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-gold to-white drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
                      WAYLON SKINNER
                    </span>
                  ) : (
                    currentPhase.headline
                  )}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Clean Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${currentPhase.step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-3 font-mono text-xs sm:text-sm text-slate-400 tracking-wider"
              >
                {currentPhase.sub}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* BOTTOM BAR: Massive Editorial Counter + Hairline Golden Progress Track */}
          <div className="relative z-10 w-full flex flex-col space-y-4">
            <div className="flex items-end justify-between">
              <div className="font-mono text-xs text-slate-500 tracking-widest hidden sm:block">
                CME GLOBEX • ES & NQ FUTURES
              </div>

              {/* Huge Monospace Percentage Counter */}
              <div className="flex items-baseline space-x-2 font-mono">
                <span className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white">
                  {progress.toString().padStart(2, "0")}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gold">%</span>
              </div>
            </div>

            {/* Hairline 2px Gold Progress Line across whole width */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-gold via-[#FFE270] to-profit shadow-[0_0_12px_#F5D061]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
