"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { User, Globe, ShieldCheck, Zap, Terminal, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-surface/70 px-3.5 py-1 text-xs font-mono text-gold-light mb-4">
          <Terminal className="h-3.5 w-3.5 text-gold" />
          <span>OPERATOR BRIEF // THE TRADER</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
          Systematic Execution. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-200">
            Total Location Freedom.
          </span>
        </h2>
      </div>

      {/* Main Grid: Bio Card + Stats Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Glass Bio Card (Placeholder for photo/text easy to edit in config) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <GlassCard className="h-full flex flex-col justify-between p-8 md:p-10 border-gold/20" glowColor="cyan">
            <div>
              {/* Profile Card Header */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/10">
                {/* Photo Placeholder (Easily replaceable via siteConfig or image src) */}
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-surface-light via-[#141208] to-[#0A0E17] border border-gold/40 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                  <div className="h-full w-full rounded-xl bg-surface flex flex-col items-center justify-center text-slate-300">
                    <User className="h-8 w-8 text-gold mb-0.5" />
                    <span className="text-[9px] font-mono text-gold-light/60 uppercase">PHOTO</span>
                  </div>
                  {/* Active status pulse */}
                  <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-gold border-2 border-surface" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-heading text-2xl font-bold text-white">
                      {siteConfig.legalName}
                    </h3>
                    <span className="text-xs font-mono text-gold-light bg-gold/10 border border-gold/30 px-2 py-0.5 rounded">
                      {siteConfig.handle}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Independent Futures Trader • Founder of WayTrades Community
                  </p>
                </div>
              </div>

              {/* Bio Narrative */}
              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{siteConfig.bio}</p>
                <p className="text-slate-400">{siteConfig.extendedBio}</p>
              </div>

              {/* Core Trading Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
                <div className="rounded-xl bg-white/5 p-3 border border-gold/15">
                  <span className="text-[10px] font-mono text-gold-light/60 uppercase tracking-wider block mb-1">
                    Focus Assets
                  </span>
                  <span className="font-mono text-xs font-semibold text-white">
                    ES • MES • NQ • MNQ
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-gold/15">
                  <span className="text-[10px] font-mono text-gold-light/60 uppercase tracking-wider block mb-1">
                    Primary Window
                  </span>
                  <span className="font-mono text-xs font-semibold text-gold-light">
                    9:30 - 11:30 AM EST
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-gold/15">
                  <span className="text-[10px] font-mono text-gold-light/60 uppercase tracking-wider block mb-1">
                    Core Model
                  </span>
                  <span className="font-mono text-xs font-semibold text-gold">
                    Liquidity & FVGs
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Tag */}
            <div className="mt-8 flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/5">
              <span className="flex items-center text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-gold mr-1.5 inline" />
                Discipline-first futures execution
              </span>
              <span>EST. 2020</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Animated Stats Counters */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {siteConfig.stats.map((stat, i) => (
            <GlassCard
              key={stat.label}
              className="p-6 border-gold/15 flex flex-col justify-between hover:border-gold/40 transition-all duration-300"
              glowColor="cyan"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  {stat.label}
                </span>
                <span className="text-[10px] font-mono text-gold-light bg-gold/10 border border-gold/25 px-2 py-0.5 rounded">
                  VERIFIED METRIC
                </span>
              </div>

              <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white my-2 flex items-baseline">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={2.2}
                />
              </div>

              <p className="text-xs text-slate-400 font-mono">
                {stat.subtext}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

