"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { soundManager } from "@/lib/sound";
import {
  Laptop,
  Monitor,
  Wifi,
  Flame,
  Headphones,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface GearItem {
  id: string;
  category: string;
  name: string;
  specs: string;
  note: string;
  icon: React.ReactNode;
  affiliateUrl?: string;
  badge?: string;
}

export function NomadLoadout() {
  const [activeGearId, setActiveGearId] = useState<string>("laptop");

  const gearList: GearItem[] = [
    {
      id: "laptop",
      category: "CORE MACHINE",
      name: "Apple MacBook Pro 16\" M-Max",
      specs: "64GB Unified Memory • 120Hz Liquid Retina XDR",
      note: "Silent, cool operation running NinjaTrader, TradingView, and live voice chat without thermal throttling.",
      icon: <Laptop className="h-5 w-5 text-gold-light" />,
    },
    {
      id: "monitors",
      category: "DUAL DISPLAYS",
      name: "Dual 15.6\" 2K OLED Portable Screens",
      specs: "Foldable Ultra-Slim • USB-C Single Cable Power",
      note: "Triple-screen trading setup that fits in a standard carry-on backpack anywhere in the world.",
      icon: <Monitor className="h-5 w-5 text-gold-light" />,
    },
    {
      id: "connectivity",
      category: "LOW-LATENCY NETWORK",
      name: "Starlink Mini + Chicago CME VPS Tunnel",
      specs: "< 18ms CME Routing • Dual SIM Global 5G Backup",
      note: "Zero missed executions whether trading from Bali cliffs, Tokyo highrises, or Lisbon rooftops.",
      icon: <Wifi className="h-5 w-5 text-gold-light" />,
    },
    {
      id: "energy",
      category: "TRADING FUEL",
      name: "Celsius Essential Energy",
      specs: "200mg Caffeine • 7 Essential Vitamins • Zero Sugar",
      note: "Daily fuel for high-intensity 9:30 AM NY market open focus and international timezone shifts.",
      icon: <Flame className="h-5 w-5 text-orange-400" />,
      affiliateUrl: "https://club.co/@waylon_skinner/celsius/affiliate",
      badge: "Official Partner Link",
    },
    {
      id: "audio",
      category: "FOCUS ISOLATION",
      name: "Noise-Canceling Studio Headphones",
      specs: "Active Noise Cancellation • Spatial Audio",
      note: "Locks in deep state of flow during the opening 90 minutes of NYSE volatility.",
      icon: <Headphones className="h-5 w-5 text-gold-light" />,
    },
    {
      id: "journal",
      category: "TRADE JOURNAL",
      name: "Kremvo Structured Trading Journal",
      specs: "Execution Tagging • Psychology Logging • Edge Analytics",
      note: "Every execution is logged and reviewed daily. Discipline is the only compounding edge.",
      icon: <BookOpen className="h-5 w-5 text-gold-light" />,
      affiliateUrl: "https://www.kremvo.com/?utm_source=instagram&utm_medium=linktree",
      badge: "Recommended Journal",
    },
  ];

  const activeGear = gearList.find((g) => g.id === activeGearId) || gearList[0];

  return (
    <div className="w-full rounded-2xl border border-gold/25 bg-[#070A0F]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-gold-light uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>PORTABLE TRADING RIG // 2026 LOADOUT</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Waylon&apos;s Nomad Trading Desk
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          LOCATION-INDEPENDENT SETUP
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Gear Selector Chips */}
        <div className="lg:col-span-5 space-y-2">
          {gearList.map((gear) => {
            const isSelected = gear.id === activeGearId;
            return (
              <button
                key={gear.id}
                onClick={() => {
                  setActiveGearId(gear.id);
                  soundManager.playClick();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-gold/15 border-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-surface/60 border-white/5 hover:border-white/15 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-gold/20 text-gold-light" : "bg-black/40 text-slate-400"
                    }`}
                  >
                    {gear.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gold-light/70 uppercase block">
                      {gear.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-white truncate max-w-[180px] block">
                      {gear.name.split(" ")[0]} {gear.name.split(" ")[1] || ""}
                    </span>
                  </div>
                </div>

                {gear.badge && (
                  <span className="text-[9px] font-mono text-gold-light bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                    LINK
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Selected Gear Detailed Card */}
        <div className="lg:col-span-7 rounded-xl border border-gold/20 bg-surface/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-gold-light tracking-wider">
                {activeGear.category}
              </span>
              {activeGear.badge && (
                <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                  {activeGear.badge}
                </span>
              )}
            </div>

            <h4 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
              {activeGear.name}
            </h4>

            <div className="rounded-lg bg-black/40 border border-white/10 px-3.5 py-2 text-xs font-mono text-gold-light mb-4">
              {activeGear.specs}
            </div>

            <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                WAYLON&apos;S NOMAD LOG
              </span>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;{activeGear.note}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="flex items-center text-xs font-mono text-slate-400">
              <CheckCircle className="h-4 w-4 text-gold mr-1.5 inline" />
              Verified Digital Nomad Essential
            </span>

            {activeGear.affiliateUrl && (
              <a
                href={activeGear.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-gold hover:bg-gold-light text-[#040609] font-mono text-xs font-bold px-4 py-2 transition-colors shadow-md"
              >
                <span>Visit {activeGear.name.split(" ")[0]}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

