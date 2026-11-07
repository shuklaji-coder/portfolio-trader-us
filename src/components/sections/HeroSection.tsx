"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TickerTape } from "@/components/ui/TickerTape";
import { soundManager } from "@/lib/sound";
import { ArrowUpRight, Youtube, MessageSquare, Compass, ShieldAlert } from "lucide-react";

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

  const words = siteConfig.tagline.split(" ");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-0 overflow-hidden"
    >
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-profit/10 via-cyan-accent/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center z-10">
        {/* Terminal Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-surface/80 px-4 py-1.5 backdrop-blur-xl mb-6 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">
            {siteConfig.legalName} • {siteConfig.name.toUpperCase()}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono text-profit">FUTURES SPECIALIST</span>
        </motion.div>

        {/* Big Headline with Text-Reveal Animation */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-[1.08] mb-6">
          {words.map((word, i) => {
            const isCandlesticks = word.toLowerCase().includes("candlestick");
            const isWorld = word.toLowerCase().includes("world");

            return (
              <span key={i} className="inline-block overflow-hidden mr-3 sm:mr-4">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${
                    isCandlesticks
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-profit to-[#00FFAF] drop-shadow-[0_0_30px_rgba(0,229,160,0.4)]"
                      : isWorld
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-blue-400 drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]"
                      : "text-white"
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </h1>

        {/* Typed Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="h-8 flex items-center justify-center font-mono text-base sm:text-xl text-slate-300 tracking-wider mb-10"
        >
          <span className="text-cyan-accent font-semibold">
            {fullSubline.slice(0, typedIndex)}
          </span>
          <span className="inline-block w-2 h-5 bg-profit ml-1.5 animate-pulse" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12"
        >
          {/* Join Discord CTA */}
          <MagneticButton
            href={siteConfig.community.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="px-7 py-4 text-base"
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
            className="px-7 py-4 text-base border-white/15"
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
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-col items-center space-y-2 text-slate-500 pb-8"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">
            SCROLL TO FLY THROUGH CANDLESTICKS
          </span>
          <div className="h-8 w-4 rounded-full border border-white/20 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
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
