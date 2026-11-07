"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TickerTape } from "@/components/ui/TickerTape";
import { LiveCandleStream } from "@/components/ui/LiveCandleStream";
import { soundManager } from "@/lib/sound";
import { ArrowUpRight, Youtube, MessageSquare } from "lucide-react";

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
      {/* Background Volumetric Gold Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-gold/15 via-gold-light/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center z-10">
        {/* Terminal Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-surface/85 px-4 py-1.5 backdrop-blur-xl mb-3 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-slate-200 uppercase">
            {siteConfig.legalName} • {siteConfig.name.toUpperCase()}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono text-gold-light font-bold">FUTURES SPECIALIST</span>
        </motion.div>

        {/* Typed Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-7 flex items-center justify-center font-mono text-sm sm:text-lg text-slate-300 tracking-wider mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-[#F5D061] font-bold">
            {fullSubline.slice(0, typedIndex)}
          </span>
          <span className="inline-block w-2 h-4 bg-gold ml-1.5 animate-pulse" />
        </motion.div>

        {/* CONTINUOUS LIVE CANDLESTICK STREAM (Replaces the big text right here!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full my-2"
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
          <div className="h-7 w-4 rounded-full border border-white/20 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-profit"
            />
          </div>
        </motion.div>
      </div>

      {/* Live-Looking Ticker Tape at the Bottom of Hero */}
      <TickerTape />
    </section>
  );
}
