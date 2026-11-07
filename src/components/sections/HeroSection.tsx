"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TickerTape } from "@/components/ui/TickerTape";
import { LiveCandleStream } from "@/components/ui/LiveCandleStream";
import { soundManager } from "@/lib/sound";
import { ArrowUpRight, Youtube, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const [typedIndex, setTypedIndex] = useState(0);
  const fullSubline = siteConfig.subHeadline;

  // Typing effect for subtitle
  useEffect(() => {
    if (typedIndex < fullSubline.length) {
      const timeout = setTimeout(() => {
        setTypedIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [typedIndex, fullSubline]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-0 overflow-hidden"
    >
      {/* Background Volumetric Monaco Gold Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-gold/15 via-gold-light/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center z-10">
        
        {/* Luxury Glassmorphism Showcase Shield for Waylon Skinner's Name */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl mx-auto rounded-3xl border border-gold/35 bg-[#05080e]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.85)] mb-6 flex flex-col items-center relative overflow-hidden"
        >
          {/* Subtle gold flare inside shield */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-36 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Verified Operator Tag */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 backdrop-blur-xl mb-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-gold-light uppercase">
              VERIFIED OPERATOR // CME GLOBEX FUTURES
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[11px] sm:text-xs font-mono text-slate-300 font-semibold">{siteConfig.handle}</span>
          </div>

          {/* Big Beautiful Name: WAYLON SKINNER in Monaco Gold & Platinum Typography */}
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none my-1 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_25px_rgba(255,255,255,0.25)]">
              WAYLON{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-gold to-[#B38C22] drop-shadow-[0_0_45px_rgba(212,175,55,0.55)]">
              SKINNER
            </span>
          </h1>

          {/* Brand Name Badge & Famous Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono mt-3 mb-1">
            <span className="rounded-lg bg-gradient-to-r from-gold/25 via-gold/15 to-gold/25 border border-gold/50 px-3 py-1 font-bold text-gold-light tracking-widest shadow-md">
              {siteConfig.name.toUpperCase()}
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-slate-200 tracking-wide font-medium italic text-sm sm:text-base">
              &ldquo;{siteConfig.tagline}&rdquo;
            </span>
          </div>

          {/* Typed Subtitle with Blinking Gold Cursor */}
          <div className="h-6 flex items-center justify-center font-mono text-xs sm:text-sm text-slate-300 tracking-widest mt-2 uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-white font-bold">
              {fullSubline.slice(0, typedIndex)}
            </span>
            <span className="inline-block w-2 h-4 bg-gold ml-1.5 animate-pulse" />
          </div>
        </motion.div>

        {/* CONTINUOUS LIVE CANDLESTICK STREAM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full my-1"
        >
          <LiveCandleStream />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 mb-10"
        >
          {/* Join Discord CTA */}
          <MagneticButton
            href={siteConfig.community.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="px-7 py-3.5 text-sm sm:text-base font-semibold"
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
            className="px-7 py-3.5 text-sm sm:text-base border-white/15"
          >
            <Youtube className="h-5 w-5 mr-2 text-[#FF4D5E]" />
            <span>Watch on YouTube</span>
            <ArrowUpRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </MagneticButton>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col items-center space-y-2 text-slate-500 pb-6"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">
            SCROLL TO EXPLORE THE PORTFOLIO
          </span>
          <div className="h-7 w-4 rounded-full border border-gold/30 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </div>

      {/* Live-Looking Ticker Tape at the Bottom of Hero */}
      <TickerTape />
    </section>
  );
}
