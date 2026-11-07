"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { soundManager } from "@/lib/sound";
import {
  MessageSquare,
  Users,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function CommunitySection() {
  // Floating decorative ambient particles / chat bubbles
  const floatingBubbles = [
    { text: "NQ 20680 FVG tapped! Watching for rejection", x: "8%", y: "15%", delay: 0 },
    { text: "ES took liquidity at 5880 swing high", x: "78%", y: "20%", delay: 1.5 },
    { text: "Disciplined day: +2.5R, closing terminal", x: "12%", y: "75%", delay: 2.2 },
    { text: "9:30 AM NY bell ringing in 5 minutes!", x: "74%", y: "78%", delay: 0.8 },
  ];

  return (
    <section id="community" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 overflow-hidden">
      {/* Ambient Floating Chat Bubbles */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.35, 0.7, 0.35],
              y: [0, -14, 0],
            }}
            transition={{
              duration: 5 + i * 1.2,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-xl bg-surface-light/70 border border-white/10 px-3.5 py-2 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-lg"
            style={{ left: bubble.x, top: bubble.y }}
          >
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-profit" />
              <span>{bubble.text}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background Volumetric Discord Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] bg-gradient-to-tr from-[#5865F2]/20 via-profit/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Main Glass Discord Hero Card */}
      <GlassCard
        className="p-8 sm:p-12 md:p-16 border-white/15 bg-gradient-to-b from-surface/90 to-[#0A0D15]/95 text-center flex flex-col items-center relative overflow-hidden"
        glowColor="profit"
      >
        {/* Top Community Pill */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-1.5 text-xs font-mono text-[#7983F5] mb-6">
          <Radio className="h-3.5 w-3.5 animate-pulse text-[#5865F2]" />
          <span>FREE TRADING COMMUNITY // FUTURES & OPTIONS</span>
        </div>

        {/* Big Discord Headline */}
        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl mb-4">
          Way Trades Community. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-profit via-teal-300 to-[#5865F2]">
            Options + Futures • Free to Join.
          </span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
          {siteConfig.community.description}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mb-10 text-left">
          {siteConfig.community.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-center space-x-2.5 rounded-xl bg-white/5 border border-white/5 p-3 text-xs text-slate-300"
            >
              <CheckCircle2 className="h-4 w-4 text-profit flex-shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Discord Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <MagneticButton
            href={siteConfig.community.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="px-8 py-4 text-base font-semibold"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span>Join Discord Now — It&apos;s 100% Free</span>
            <ArrowUpRight className="h-4 w-4 ml-1.5" />
          </MagneticButton>
        </div>

        {/* Live Active Presence Counter */}
        <div className="mt-8 flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-profit animate-ping" />
          <span>3,200+ Members • Active Discussions 24/7</span>
        </div>
      </GlassCard>
    </section>
  );
}
