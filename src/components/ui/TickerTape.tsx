"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItemState {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
  isUp: boolean;
  flash?: "up" | "down" | null;
}

export function TickerTape() {
  const [tickers, setTickers] = useState<TickerItemState[]>(
    siteConfig.tickerTape.map((t) => ({ ...t, flash: null }))
  );

  // Micro-tick simulation every 2.5s for authentic live Bloomberg trading vibe
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) => {
        // Pick 1 or 2 random tickers to tick
        const randomIndex = Math.floor(Math.random() * prev.length);
        const item = prev[randomIndex];
        
        // Futures tick sizes
        const tickDelta = item.symbol.includes("NQ")
          ? (Math.random() > 0.45 ? 0.5 : -0.5)
          : item.symbol.includes("ES")
          ? (Math.random() > 0.45 ? 0.25 : -0.25)
          : (Math.random() > 0.45 ? 0.05 : -0.05);

        const newPrice = Number((item.price + tickDelta).toFixed(2));
        const newChange = Number((item.change + tickDelta).toFixed(2));
        const newPercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        const isUp = newChange >= 0;

        return prev.map((t, idx) =>
          idx === randomIndex
            ? {
                ...t,
                price: newPrice,
                change: newChange,
                percent: newPercent,
                isUp,
                flash: tickDelta > 0 ? "up" : "down",
              }
            : { ...t, flash: null }
        );
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full border-y border-white/10 bg-[#05070A]/90 py-2.5 backdrop-blur-md overflow-hidden z-20 select-none">
      {/* Decorative label badge */}
      <div className="absolute left-0 top-0 bottom-0 z-30 flex items-center bg-[#05070A]/95 px-3 border-r border-white/10 shadow-lg">
        <span className="flex items-center space-x-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
          <span>FUTURES TAPE</span>
          <span className="text-[9px] text-slate-500 hidden sm:inline">(SIMULATED)</span>
        </span>
      </div>

      {/* Infinite scrolling ticker list */}
      <div className="flex w-max animate-ticker pl-36 sm:pl-48">
        {[...tickers, ...tickers, ...tickers].map((ticker, index) => {
          return (
            <div
              key={`${ticker.symbol}-${index}`}
              className={`flex items-center space-x-2 px-5 font-mono text-xs transition-colors duration-300 ${
                ticker.flash === "up"
                  ? "bg-profit/15 text-profit"
                  : ticker.flash === "down"
                  ? "bg-loss/15 text-loss"
                  : "text-slate-300"
              }`}
            >
              <span className="font-bold text-white tracking-wide">{ticker.symbol}</span>
              <span className="text-slate-400 text-[11px] hidden md:inline">
                {ticker.name.split(" ")[0]}
              </span>
              <span className="font-semibold text-white">
                {ticker.price.toFixed(2)}
              </span>
              <span
                className={`flex items-center text-[11px] font-medium ${
                  ticker.isUp ? "text-profit" : "text-loss"
                }`}
              >
                {ticker.isUp ? (
                  <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5 inline" />
                )}
                {ticker.change > 0 ? `+${ticker.change.toFixed(2)}` : ticker.change.toFixed(2)} (
                {ticker.percent > 0 ? `+${ticker.percent.toFixed(2)}` : ticker.percent.toFixed(2)}%)
              </span>
              <span className="text-white/20 pl-2">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
