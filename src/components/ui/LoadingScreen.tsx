"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Sparkles, Terminal, Activity, ArrowRight, Volume2, VolumeX } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

// Order book dummy stream items
const BID_LEVELS = [
  { price: "5,892.75", size: 342 },
  { price: "5,892.50", size: 215 },
  { price: "5,892.25", size: 580 },
  { price: "5,892.00", size: 144 },
  { price: "5,891.75", size: 402 },
];

const ASK_LEVELS = [
  { price: "5,894.00", size: 260 },
  { price: "5,893.75", size: 310 },
  { price: "5,893.50", size: 195 },
  { price: "5,893.25", size: 480 },
  { price: "5,893.00", size: 620 },
];

// Rich 16-candlestick sequence for the radar HUD
const INTRO_CANDLESTICKS = [
  { o: 25, c: 38, h: 48, l: 20, isUp: true },
  { o: 38, c: 32, h: 42, l: 28, isUp: false },
  { o: 32, c: 54, h: 60, l: 30, isUp: true },
  { o: 54, c: 48, h: 56, l: 44, isUp: false },
  { o: 48, c: 70, h: 76, l: 46, isUp: true },
  { o: 70, c: 65, h: 72, l: 60, isUp: false },
  { o: 65, c: 88, h: 94, l: 62, isUp: true },
  { o: 88, c: 82, h: 90, l: 78, isUp: false },
  { o: 82, c: 102, h: 108, l: 80, isUp: true },
  { o: 102, c: 96, h: 104, l: 92, isUp: false },
  { o: 96, c: 118, h: 124, l: 94, isUp: true },
  { o: 118, c: 112, h: 120, l: 108, isUp: false },
  { o: 112, c: 135, h: 142, l: 110, isUp: true },
  { o: 135, c: 130, h: 138, l: 126, isUp: false },
  { o: 130, c: 154, h: 162, l: 128, isUp: true },
  { o: 154, c: 168, h: 175, l: 150, isUp: true },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [orderBookTicks, setOrderBookTicks] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasTriggeredRef = useRef(false);

  // Play synthetic Web Audio tone (no external audio files needed)
  const playTone = useCallback((freq: number, type: OscillatorType = "sine", duration: number = 0.08) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio context silently ignored if blocked by autoplay policy
    }
  }, []);

  // Completion trigger with sound and cinematic split
  const triggerExit = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setProgress(100);
    playTone(523.25, "sine", 0.3); // High C harmonic chime
    setIsUnlocked(true);
    setTimeout(() => {
      onComplete?.();
    }, 850);
  }, [onComplete, playTone]);

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

  // Realistic non-linear progress counter & order book pulse
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      setOrderBookTicks((prev) => prev + 1);

      if (pct % 15 === 0 && soundEnabled) {
        playTone(300 + pct * 6, "triangle", 0.04);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(triggerExit, 350);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [triggerExit, soundEnabled, playTone]);

  // High-performance 60 FPS Canvas Background with floating golden candlestick dust
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Floating particles: mini candlesticks and gold dust motes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      wickHeight: Math.random() * 20 + 12,
      speedY: -(Math.random() * 0.7 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      isGreen: Math.random() > 0.4,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint terminal grid coordinates
      ctx.strokeStyle = "rgba(212, 175, 55, 0.04)";
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating miniature candlesticks
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -30) p.y = height + 30;
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        const color = p.isGreen
          ? `rgba(0, 229, 160, ${p.opacity})`
          : `rgba(212, 175, 55, ${p.opacity * 0.8})`;

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.wickHeight / 2);
        ctx.lineTo(p.x, p.y + p.wickHeight / 2);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        ctx.fillRect(p.x - 2, p.y - p.size / 2, 4, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isUnlocked ? (
        <motion.div
          key="master-loading-screen"
          className="fixed inset-0 z-[999999] flex flex-col justify-between bg-[#030407] text-white select-none cursor-pointer overflow-hidden"
          onClick={triggerExit}
        >
          {/* Background Canvas Particles */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-80"
          />

          {/* Radial Ambient Gold Spotlights */}
          <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-gold/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-profit/15 rounded-full blur-[160px] pointer-events-none" />

          {/* Sweeping Laser Scan Line */}
          <motion.div
            initial={{ top: "-5%" }}
            animate={{ top: "105%" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5D061] to-transparent opacity-60 shadow-[0_0_20px_#F5D061] pointer-events-none"
          />

          {/* TOP BAR: Terminal Telemetry & Audio Toggle */}
          <div className="relative z-20 w-full px-6 sm:px-12 pt-8 flex items-center justify-between">
            {/* Branding Pill */}
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-gold animate-ping opacity-75" />
                <span className="h-2 w-2 rounded-full bg-gold" />
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="font-bold tracking-widest text-white">WAYTRADES</span>
                <span className="text-gold/60">//</span>
                <span className="text-slate-400">HIGH-FREQUENCY TRADING TERMINAL</span>
              </div>
            </div>

            {/* Audio Toggle & Quick Enter Hint */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) playTone(440, "sine", 0.1);
                }}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/10 bg-black/50 hover:border-gold/40 text-xs font-mono text-slate-300 transition-colors"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-profit" />
                    <span>AUDIO ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                    <span>AUDIO OFF</span>
                  </>
                )}
              </button>

              <div className="hidden md:flex items-center space-x-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-mono text-gold hover:bg-gold/20 transition-all">
                <span>PRESS SPACE TO ENTER</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* MAIN CENTERPIECE: Holographic Seal + Laser Candlestick HUD */}
          <div className="relative z-20 w-full max-w-4xl mx-auto px-6 py-6 flex flex-col items-center text-center">
            {/* Holographic 3D Medallion with rotating concentric rings */}
            <div className="relative mb-6">
              {/* Outer Gear Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-5 rounded-full border border-dashed border-gold/30 pointer-events-none"
              />
              {/* Inner Counter-Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2.5 rounded-full border border-dotted border-profit/40 pointer-events-none"
              />

              {/* Center Metallic Gold Crest */}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-[#241d10] via-[#0d0f15] to-[#040609] border-2 border-gold/70 flex items-center justify-center shadow-[0_0_45px_rgba(212,175,55,0.35)]">
                <span className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F5D061] to-[#997720] drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
                  W
                </span>
                <Sparkles className="absolute -top-1.5 -right-1.5 h-4 w-4 text-gold animate-bounce" />
              </div>
            </div>

            {/* Typography: Waylon Skinner */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5D061] to-white uppercase mb-2"
            >
              WAYLON SKINNER
            </motion.h1>

            {/* Tagline */}
            <p className="font-mono text-xs sm:text-sm text-gold tracking-widest uppercase mb-8 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-profit animate-ping" />
              <span>&ldquo;I look at candlesticks and travel the world.&rdquo;</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </p>

            {/* 3-Column Terminal Deck: Left Order Book | Center Radar Chart | Right Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full max-w-3xl items-stretch">
              {/* Left Column: Real-time Level 2 Order Book */}
              <div className="hidden lg:flex flex-col justify-between rounded-xl border border-white/10 bg-black/60 p-3.5 backdrop-blur-md text-left font-mono text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                  <span className="font-bold text-white flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-gold" />
                    <span>CME DOM</span>
                  </span>
                  <span className="text-[10px] text-profit">LIVE</span>
                </div>

                {/* Asks */}
                <div className="space-y-1 my-2">
                  {ASK_LEVELS.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex justify-between text-loss">
                      <span>{a.price}</span>
                      <span className="text-slate-400">{a.size + (orderBookTicks % 7) * 3}</span>
                    </div>
                  ))}
                </div>

                {/* Mid market spread line */}
                <div className="py-1 px-2 rounded bg-gold/15 border border-gold/30 text-center text-gold font-bold text-[10px]">
                  SPREAD: 0.25 (ES)
                </div>

                {/* Bids */}
                <div className="space-y-1 mt-2">
                  {BID_LEVELS.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex justify-between text-profit">
                      <span>{b.price}</span>
                      <span className="text-slate-400">{b.size + (orderBookTicks % 5) * 4}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center 2 Columns: Laser Candlestick Radar */}
              <div className="lg:col-span-2 rounded-xl border border-gold/40 bg-gradient-to-b from-[#10141f]/90 via-black/80 to-[#040609]/95 p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
                    <Terminal className="h-3 w-3 text-gold" />
                    <span className="text-white font-semibold">ES & NQ FEED</span>
                    <span className="text-gold/60">•</span>
                    <span className="text-profit">OPTIMIZED</span>
                  </div>
                  <div className="font-mono text-xs text-gold font-bold">
                    {progress}% LOADED
                  </div>
                </div>

                {/* Candlesticks Waveform */}
                <div className="relative h-28 w-full flex items-end justify-between px-2 pt-4 pb-2 border-b border-white/10">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="w-full border-b border-dashed border-gold/40" />
                    <div className="w-full border-b border-dashed border-gold/40" />
                    <div className="w-full border-b border-dashed border-gold/40" />
                  </div>

                  {INTRO_CANDLESTICKS.map((c, idx) => {
                    const threshold = (idx / INTRO_CANDLESTICKS.length) * 85;
                    const isDrawn = progress >= threshold;
                    const heightPct = Math.max(15, Math.abs(c.c - c.o) * 1.5);
                    const wickPct = Math.max(25, (c.h - c.l) * 1.5);

                    return (
                      <div
                        key={idx}
                        className="relative flex flex-col items-center h-full justify-end w-3 sm:w-4"
                      >
                        {/* Wick */}
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: isDrawn ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`w-[1.5px] rounded-full origin-bottom absolute bottom-2 ${
                            c.isUp ? "bg-profit/80" : "bg-loss/80"
                          }`}
                          style={{ height: `${wickPct}%` }}
                        />

                        {/* Candle Body */}
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: isDrawn ? 1 : 0 }}
                          transition={{ duration: 0.25, delay: 0.02 }}
                          className={`w-2 sm:w-2.5 rounded-[2px] z-10 origin-bottom ${
                            c.isUp
                              ? "bg-gradient-to-t from-emerald-500 to-profit shadow-[0_0_10px_rgba(0,229,160,0.6)]"
                              : "bg-gradient-to-t from-red-600 to-loss shadow-[0_0_10px_rgba(255,77,94,0.6)]"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar & Status */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-[#090d16] rounded-full overflow-hidden border border-gold/30 p-[1px]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold via-[#FFE070] to-profit shadow-[0_0_14px_#d4af37]"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Telemetry */}
              <div className="hidden lg:flex flex-col justify-between rounded-xl border border-white/10 bg-black/60 p-3.5 backdrop-blur-md text-left font-mono text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                  <span className="font-bold text-white flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-profit" />
                    <span>SYSTEM</span>
                  </span>
                  <span className="text-[10px] text-gold">256-BIT</span>
                </div>

                <div className="space-y-1.5 my-auto text-[10px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">LATENCY:</span>
                    <span className="text-profit font-bold">1.2ms (CME)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">FPS:</span>
                    <span className="text-gold font-bold">60.0 LOCKED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ENGINE:</span>
                    <span className="text-white">THREE.JS / R3F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NOMAD GPS:</span>
                    <span className="text-cyan-accent">GLOBAL HUBS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PARTNERS:</span>
                    <span className="text-gold">ALPHA / TRADEIFY</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-profit" />
                  <span>STATUS: ARMED</span>
                </div>
              </div>
            </div>

            {/* Launch CTA Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center space-x-3 px-6 py-2.5 rounded-full border border-gold/60 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-gold hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-profit animate-ping" />
              <span className="font-heading font-bold text-sm tracking-widest text-white uppercase">
                {progress < 100 ? "INITIALIZING TERMINAL... (CLICK TO SKIP)" : "ENTER TRADING FLOOR"}
              </span>
              <ArrowRight className="h-4 w-4 text-gold" />
            </motion.div>
          </div>

          {/* BOTTOM BAR: Risk Notice & Verification */}
          <div className="relative z-20 w-full px-6 sm:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-3.5 w-3.5 text-profit" />
              <span className="text-slate-400">
                CME GLOBEX FUTURES // ES (S&P 500) • NQ (NASDAQ 100)
              </span>
            </div>

            <div className="flex items-center space-x-4 text-slate-400">
              <span className="text-gold font-medium">WAYLON SKINNER PORTFOLIO</span>
              <span>•</span>
              <span>TRADE WITH A PLAN</span>
            </div>
          </div>
        </motion.div>
      ) : (
        /* VAULT SPLIT EXIT TRANSITION: Top door slides UP, Bottom door slides DOWN */
        <div className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden">
          {/* Top Half Shutter */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#030407] border-b-2 border-gold/80 shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
          />

          {/* Bottom Half Shutter */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#030407] border-t-2 border-gold/80 shadow-[0_-10px_30px_rgba(212,175,55,0.4)]"
          />

          {/* Horizontal Golden Light Flash along the seam */}
          <motion.div
            initial={{ opacity: 1, scaleX: 1 }}
            animate={{ opacity: 0, scaleX: 1.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_60px_#ffffff]"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
