"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { MarketMiniChart3D } from "@/components/3d/MarketMiniChart3D";
import { Activity, Layers, BarChart3 } from "lucide-react";

export function MarketsSection() {
  const [esMarket, nqMarket] = siteConfig.markets;

  return (
    <section id="markets" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-surface/70 px-3.5 py-1 text-xs font-mono text-cyan-accent mb-4">
          <Activity className="h-3.5 w-3.5" />
          <span>PORTFOLIO ASSETS // CME EQUITY INDEX</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
          Two Flagship Instruments. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-profit via-cyan-accent to-emerald-400">
            Infinite Global Liquidity.
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl">
          By focusing exclusively on the two most liquid futures contracts in the world,
          execution becomes second nature. Hover to explore 3D contract specifications.
        </p>
      </div>

      {/* Two Interactive 3D Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <MarketMiniChart3D market={esMarket} accentColor="profit" />
        <MarketMiniChart3D market={nqMarket} accentColor="cyan" />
      </div>

      {/* Micro-contract callout badge for beginners / sizing */}
      <div className="mt-12 rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-profit/10 border border-profit/30 flex items-center justify-center text-profit">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white text-sm">
              Trade Big with Micro Contracts (MES / MNQ)
            </h4>
            <p className="text-xs text-slate-400">
              1/10th the contract size of standard E-mini. Ideal for strict account sizing,
              risk scaling, and prop firm evaluations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="rounded bg-white/5 px-2.5 py-1 border border-white/10">
            MES: $1.25 / tick
          </span>
          <span className="rounded bg-white/5 px-2.5 py-1 border border-white/10">
            MNQ: $0.50 / tick
          </span>
        </div>
      </div>
    </section>
  );
}

