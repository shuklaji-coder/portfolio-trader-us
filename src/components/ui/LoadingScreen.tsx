"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING CME FEED...");

  useEffect(() => {
    const statuses = [
      "INITIALIZING CME GLOBEX FEED...",
      "CALCULATING ES & NQ LIQUIDITY POOLS...",
      "GENERATING 3D CANDLESTICK LANDSCAPE...",
      "SYNCHRONIZING WORLD TRADING HUBS...",
      "SYSTEM READY — TRADE WITH A PLAN."
    ];

    let current = 0;
    const interval = setInterval(() => {
      // Non-linear acceleration for natural terminal feel
      const increment = Math.max(1, Math.floor((100 - current) / 7) + Math.floor(Math.random() * 4));
      current += increment;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setStatusText(statuses[4]);
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 600);
      } else {
        setProgress(current);
        const statusIdx = Math.min(statuses.length - 2, Math.floor((current / 100) * (statuses.length - 1)));
        setStatusText(statuses[statusIdx]);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Demo candles to draw sequentially
  const demoCandles = [
    { height: 28, top: 40, isUp: true, wickTop: 25, wickBottom: 75 },
    { height: 42, top: 25, isUp: true, wickTop: 15, wickBottom: 80 },
    { height: 32, top: 35, isUp: false, wickTop: 20, wickBottom: 72 },
    { height: 50, top: 20, isUp: true, wickTop: 10, wickBottom: 88 },
    { height: 24, top: 48, isUp: false, wickTop: 35, wickBottom: 78 },
    { height: 60, top: 15, isUp: true, wickTop: 5, wickBottom: 95 },
  ];

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05070A] text-white overflow-hidden terminal-grid"
        >
          {/* Subtle background radial glow */}
          <div className="absolute h-[500px] w-[500px] rounded-full bg-profit/5 blur-[120px] pointer-events-none" />

          {/* Top terminal badge */}
          <div className="absolute top-8 left-8 flex items-center space-x-2 text-xs font-mono text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-profit animate-ping" />
            <span className="text-slate-400">WAYTRADES</span>
            <span>//</span>
            <span>TERMINAL BOOT</span>
          </div>

          <div className="flex flex-col items-center max-w-sm w-full px-6 text-center">
            {/* Candlestick drawing animation */}
            <div className="relative h-28 w-64 mb-8 flex items-end justify-between px-4 border-b border-white/10 pb-2">
              {/* Horizontal chart reference lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-white/30 w-full" />
                <div className="border-b border-dashed border-white/30 w-full" />
                <div className="border-b border-dashed border-white/30 w-full" />
              </div>

              {demoCandles.map((c, i) => {
                const candleProgressThreshold = (i / demoCandles.length) * 80;
                const isDrawn = progress >= candleProgressThreshold;

                return (
                  <div key={i} className="relative flex flex-col items-center h-full justify-end w-6">
                    {/* Wick */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isDrawn ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`w-[1.5px] rounded-full origin-bottom absolute bottom-2 ${
                        c.isUp ? "bg-profit" : "bg-loss"
                      }`}
                      style={{ height: `${c.wickBottom - c.wickTop}%` }}
                    />

                    {/* Candle Body */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isDrawn ? 1 : 0 }}
                      transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                      className={`w-3.5 rounded-[2px] z-10 origin-bottom ${
                        c.isUp
                          ? "bg-profit shadow-[0_0_12px_rgba(0,229,160,0.4)]"
                          : "bg-loss shadow-[0_0_12px_rgba(255,77,94,0.4)]"
                      }`}
                      style={{ height: `${c.height}%`, marginBottom: `${100 - c.top - c.height}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Numeric Percentage Counter */}
            <div className="flex items-baseline space-x-1 font-mono mb-3">
              <span className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                {progress}
              </span>
              <span className="text-xl md:text-2xl text-profit font-semibold">%</span>
            </div>

            {/* Sleek Progress Bar */}
            <div className="w-full h-1 bg-surface-light rounded-full overflow-hidden mb-4 border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-profit via-cyan-accent to-profit"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Dynamic Status Log */}
            <p className="text-xs font-mono text-slate-400 tracking-wider uppercase h-4">
              {statusText}
            </p>
          </div>

          {/* Bottom disclaimer badge */}
          <div className="absolute bottom-6 text-[10px] font-mono text-slate-600">
            ES • NQ • CME GLOBEX • 60 FPS 3D ENGINE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

