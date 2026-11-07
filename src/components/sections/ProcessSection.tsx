"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PreMarketChecklist } from "@/components/ui/PreMarketChecklist";
import { soundManager } from "@/lib/sound";
import {
  Compass,
  Crosshair,
  BookOpenCheck,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  GitCommit,
  CheckCircle,
} from "lucide-react";

export function ProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass":
        return <Compass className="h-6 w-6 text-profit" />;
      case "Crosshair":
        return <Crosshair className="h-6 w-6 text-cyan-accent" />;
      case "BookOpenCheck":
        return <BookOpenCheck className="h-6 w-6 text-emerald-400" />;
      case "RefreshCw":
        return <RefreshCw className="h-6 w-6 text-teal-400" />;
      default:
        return <GitCommit className="h-6 w-6 text-profit" />;
    }
  };

  // Render dedicated interactive candlestick pattern simulation for each step
  const renderCandlePattern = (type: string) => {
    switch (type) {
      case "liquidity":
        return (
          <div className="relative h-28 w-full flex items-center justify-center space-x-3 bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
            {/* Liquidity line */}
            <div className="absolute top-6 left-2 right-2 border-t border-dashed border-loss/60 flex items-center justify-end">
              <span className="text-[9px] font-mono text-loss bg-surface px-1">
                PREVIOUS DAY HIGH (LIQUIDITY POOL)
              </span>
            </div>
            {/* Candle 1 (Bullish) */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-16 bg-profit" />
              <div className="absolute top-4 w-3 h-8 bg-profit rounded-[1px]" />
            </div>
            {/* Candle 2 (Sweep & Reject) */}
            <div className="relative flex flex-col items-center">
              <div className="w-[2px] h-20 bg-loss" />
              <div className="absolute top-7 w-3.5 h-6 bg-loss rounded-[1px] shadow-[0_0_10px_#FF4D5E]" />
              <span className="absolute -top-1 text-[8px] font-mono text-loss">SWEEP</span>
            </div>
            {/* Candle 3 (Displacement down) */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-16 bg-loss" />
              <div className="absolute top-5 w-3 h-10 bg-loss rounded-[1px]" />
            </div>
          </div>
        );

      case "fvg":
        return (
          <div className="relative h-28 w-full flex items-center justify-center space-x-3 bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
            {/* FVG Highlighted Imbalance Zone */}
            <div className="absolute top-10 bottom-8 left-12 right-12 bg-profit/15 border border-profit/40 rounded flex items-center justify-center pointer-events-none">
              <span className="text-[9px] font-mono text-profit font-semibold">
                FAIR VALUE GAP (FVG) ZONE
              </span>
            </div>
            {/* Candle 1 */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-12 bg-profit" />
              <div className="absolute bottom-2 w-3 h-6 bg-profit rounded-[1px]" />
            </div>
            {/* Candle 2 (Expansion) */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-24 bg-profit" />
              <div className="absolute top-3 w-4 h-16 bg-profit rounded-[1px] shadow-[0_0_12px_#00E5A0]" />
            </div>
            {/* Candle 3 (Mitigation & Tap) */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-14 bg-profit" />
              <div className="absolute top-3 w-3 h-8 bg-profit rounded-[1px]" />
              <span className="absolute -bottom-1 text-[8px] font-mono text-profit">ENTRY TAP</span>
            </div>
          </div>
        );

      case "orderblock":
        return (
          <div className="relative h-28 w-full flex items-center justify-center space-x-3 bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
            {/* OB Zone */}
            <div className="absolute top-8 bottom-6 left-10 right-20 bg-cyan-accent/15 border border-cyan-accent/40 rounded flex items-center justify-start pl-2 pointer-events-none">
              <span className="text-[9px] font-mono text-cyan-accent">INSTITUTIONAL ORDER BLOCK</span>
            </div>
            {/* Last Bearish Candle */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-14 bg-loss" />
              <div className="absolute top-4 w-3.5 h-7 bg-loss rounded-[1px]" />
            </div>
            {/* Strong Bullish Reversal */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-22 bg-profit" />
              <div className="absolute top-2 w-3.5 h-14 bg-profit rounded-[1px]" />
            </div>
            {/* Retest & Continuation */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-16 bg-profit" />
              <div className="absolute top-1 w-3.5 h-10 bg-profit rounded-[1px]" />
            </div>
          </div>
        );

      case "bos":
      default:
        return (
          <div className="relative h-28 w-full flex items-center justify-center space-x-3 bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
            {/* Break of Structure Line */}
            <div className="absolute top-6 left-4 right-4 border-t border-dashed border-profit/60 flex items-center justify-between">
              <span className="text-[8px] font-mono text-profit">SWING HIGH</span>
              <span className="text-[8px] font-mono text-profit bg-surface px-1">
                BOS CONFIRMED // TREND CONTINUATION
              </span>
            </div>
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-14 bg-profit" />
              <div className="absolute top-4 w-3 h-7 bg-profit rounded-[1px]" />
            </div>
            {/* Step 2 Retrace */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-12 bg-loss" />
              <div className="absolute top-4 w-3 h-5 bg-loss rounded-[1px]" />
            </div>
            {/* Step 3 Breakout */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1.5px] h-22 bg-profit" />
              <div className="absolute top-1 w-3.5 h-15 bg-profit rounded-[1px] shadow-[0_0_12px_#00E5A0]" />
            </div>
          </div>
        );
    }
  };

  return (
    <section id="process" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-surface/70 px-3.5 py-1 text-xs font-mono text-gold-light mb-4">
          <Crosshair className="h-3.5 w-3.5 text-gold" />
          <span>EXECUTION PROTOCOL // 4-STEP DISCIPLINE</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
          Trade With a Plan. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-200">
            Never With Emotions.
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl">
          Amateurs react to every tick. Professionals prepare before the market opens,
          wait for specific liquidity triggers, and review every execution rigorously.
        </p>
      </div>

      {/* Interactive Step Navigator / Horizontal Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {siteConfig.processSteps.map((item, index) => {
          const isSelected = activeStepIndex === index;
          return (
            <button
              key={item.step}
              onClick={() => {
                setActiveStepIndex(index);
                soundManager.playClick();
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? "bg-surface-light border-profit shadow-[0_0_20px_rgba(0,229,160,0.15)]"
                  : "bg-surface/50 border-white/10 hover:border-white/20 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-xs font-bold ${
                    isSelected ? "text-profit" : "text-slate-500"
                  }`}
                >
                  STEP {item.step}
                </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
                )}
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 line-clamp-1">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <motion.div
        key={activeStepIndex}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <GlassCard className="p-8 md:p-10 border-white/15" glowColor="profit">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-profit/10 border border-profit/30 flex items-center justify-center">
                  {getStepIcon(siteConfig.processSteps[activeStepIndex].icon)}
                </div>
                <div>
                  <span className="text-xs font-mono text-profit uppercase tracking-wider block">
                    PHASE {siteConfig.processSteps[activeStepIndex].step}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    {siteConfig.processSteps[activeStepIndex].title} —{" "}
                    {siteConfig.processSteps[activeStepIndex].subtitle}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {siteConfig.processSteps[activeStepIndex].description}
              </p>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <CheckCircle className="h-4 w-4 text-profit" />
                <span>Pattern: {siteConfig.processSteps[activeStepIndex].patternName}</span>
              </div>
            </div>

            {/* Right: Candlestick Pattern Visual Animation */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 block">
                CANDLESTICK STRUCTURE VISUALIZATION
              </span>
              {renderCandlePattern(siteConfig.processSteps[activeStepIndex].patternType)}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Interactive Pre-Market Discipline Checklist */}
      <div className="mt-12">
        <PreMarketChecklist />
      </div>

      {/* Kremvo Feature Callout Card in Monaco Gold */}
      <div className="mt-8">
        <GlassCard
          className="p-8 md:p-10 border-gold/30 bg-gradient-to-r from-surface via-[#120F08] to-surface relative overflow-hidden"
          glowColor="cyan"
        >
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 h-48 w-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-xs font-mono text-gold-light mb-3">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>{siteConfig.kremvo.badge}</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                &ldquo;{siteConfig.kremvo.tagline}&rdquo;
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                The hardest part of trading isn&apos;t finding a strategy — it&apos;s managing psychology
                and holding yourself accountable. Build your structured plan with Kremvo.
              </p>
            </div>

            <div className="flex-shrink-0">
              <MagneticButton
                href={siteConfig.kremvo.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="px-6 py-3.5 text-sm font-semibold"
              >
                <span>Explore Kremvo</span>
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </MagneticButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

