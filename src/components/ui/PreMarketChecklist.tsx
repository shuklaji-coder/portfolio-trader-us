"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import { Check, ShieldCheck, Flame, Sparkles, Award } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: "news",
    title: "High-Impact Macro News Checked",
    detail: "No open positions during CPI, FOMC, or NFP releases without calculated risk.",
  },
  {
    id: "levels",
    title: "Asian & London Session Liquidity Mapped",
    detail: "Key liquidity pools (Asia high/low, London high/low) marked on ES and NQ charts.",
  },
  {
    id: "poi",
    title: "High-Timeframe FVGs & Order Blocks Identified",
    detail: "Wait for price to arrive at predetermined institutional zones before looking for entry.",
  },
  {
    id: "risk",
    title: "Daily Max Loss & Stop Loss Locked",
    detail: "Pre-calculated 1:2 or 1:3 R:R on every contract. Walk away if daily limit is reached.",
  },
  {
    id: "patience",
    title: "Zero Chasing at 9:30 AM Bell",
    detail: "Patiently wait for the opening bell liquidity sweep and confirmation candle.",
  },
];

export function PreMarketChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const handleToggle = (id: string, e: React.MouseEvent) => {
    soundManager.playClick();
    setCheckedIds((prev) => {
      const isAlready = prev.includes(id);
      const next = isAlready ? prev.filter((i) => i !== id) : [...prev, id];

      // If all 5 checked, trigger celebration
      if (next.length === DEFAULT_ITEMS.length) {
        soundManager.playSuccess();
        try {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          confetti({
            particleCount: 30,
            spread: 50,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            },
            colors: ["#D4AF37", "#F5D061", "#00E5A0"],
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      }

      return next;
    });
  };

  const progressPercent = Math.round((checkedIds.length / DEFAULT_ITEMS.length) * 100);
  const isAllCompleted = checkedIds.length === DEFAULT_ITEMS.length;

  return (
    <div className="w-full rounded-2xl border border-gold/25 bg-[#070A0F]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gold-light uppercase tracking-wider block">
              PSYCHOLOGY & RISK PROTOCOL
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
              Pre-Market Discipline Checklist
            </h3>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400">
            {checkedIds.length}/{DEFAULT_ITEMS.length} RULES LOCKED
          </span>
          <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3 mb-6">
        {DEFAULT_ITEMS.map((item, idx) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={(e) => handleToggle(item.id, e)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start space-x-3 select-none ${
                isChecked
                  ? "bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : "bg-surface/60 border-white/10 hover:border-white/20 text-slate-300"
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                  isChecked
                    ? "bg-gradient-to-br from-gold to-gold-light text-[#040609] font-bold"
                    : "border border-white/20 bg-black/40"
                }`}
              >
                {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>

              <div>
                <h4
                  className={`text-xs sm:text-sm font-mono font-semibold transition-colors ${
                    isChecked ? "text-gold-light line-through opacity-90" : "text-white"
                  }`}
                >
                  {idx + 1}. {item.title}
                </h4>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Status Banner */}
      {isAllCompleted ? (
        <div className="rounded-xl border border-gold/50 bg-gold/15 p-4 flex items-center justify-between text-gold-light shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-gold-light animate-bounce" />
            <div>
              <span className="font-heading font-bold text-sm text-white block">
                DISCIPLINE VERIFIED // MINDSET READY
              </span>
              <span className="text-[11px] font-mono text-gold-light">
                Trade your plan. Zero emotions. Strictly follow your pre-set stops.
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-gold text-[#040609] px-3 py-1 rounded-md">
            100% READY
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/10">
          <span>Click each rule to verify before market open</span>
          <span className="text-gold-light/60">Discipline is the only true edge</span>
        </div>
      )}
    </div>
  );
}

