"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/sound";
import { Calculator, ShieldAlert, TrendingUp, DollarSign, Target, Percent } from "lucide-react";

interface ContractSpec {
  symbol: string;
  name: string;
  pointValue: number;
  tickSize: number;
  category: string;
}

const CONTRACTS: Record<string, ContractSpec> = {
  ES: { symbol: "ES", name: "E-mini S&P 500", pointValue: 50, tickSize: 0.25, category: "Standard" },
  MES: { symbol: "MES", name: "Micro E-mini S&P", pointValue: 5, tickSize: 0.25, category: "Micro" },
  NQ: { symbol: "NQ", name: "E-mini Nasdaq 100", pointValue: 20, tickSize: 0.25, category: "Standard" },
  MNQ: { symbol: "MNQ", name: "Micro E-mini Nasdaq", pointValue: 2, tickSize: 0.25, category: "Micro" },
};

export function FuturesRiskCalculator() {
  const [selectedKey, setSelectedKey] = useState<string>("ES");
  const [contractsCount, setContractsCount] = useState<number>(2);
  const [stopLossPoints, setStopLossPoints] = useState<number>(4.5);
  const [takeProfitPoints, setTakeProfitPoints] = useState<number>(13.5);

  const contract = CONTRACTS[selectedKey];

  // Calculations
  const riskUSD = contractsCount * stopLossPoints * contract.pointValue;
  const rewardUSD = contractsCount * takeProfitPoints * contract.pointValue;
  const rrRatio = stopLossPoints > 0 ? Number((takeProfitPoints / stopLossPoints).toFixed(2)) : 0;
  const breakevenWinRate = rrRatio > 0 ? Number(((1 / (1 + rrRatio)) * 100).toFixed(1)) : 50;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#090D15]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-profit/10 border border-profit/30 flex items-center justify-center text-profit">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-profit uppercase tracking-wider block">
              INSTITUTIONAL POSITION SIZER
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
              Futures Risk & R:R Calculator
            </h3>
          </div>
        </div>

        {/* Contract Selector Tabs */}
        <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1">
          {Object.keys(CONTRACTS).map((key) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedKey(key);
                  soundManager.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "bg-profit text-[#05070A] shadow-[0_0_12px_rgba(0,229,160,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contracts Count Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400">CONTRACT QUANTITY</span>
              <span className="font-bold text-white">{contractsCount} Contracts</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={contractsCount}
              onChange={(e) => setContractsCount(Number(e.target.value))}
              className="w-full accent-[#00E5A0] bg-surface h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Stop Loss (Points) Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400">STOP LOSS (POINTS)</span>
              <span className="font-bold text-loss">-{stopLossPoints} pts</span>
            </div>
            <input
              type="range"
              min="1"
              max={selectedKey.includes("NQ") ? 50 : 20}
              step={0.25}
              value={stopLossPoints}
              onChange={(e) => setStopLossPoints(Number(e.target.value))}
              className="w-full accent-[#FF4D5E] bg-surface h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Take Profit (Points) Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400">TAKE PROFIT (POINTS)</span>
              <span className="font-bold text-profit">+{takeProfitPoints} pts</span>
            </div>
            <input
              type="range"
              min="2"
              max={selectedKey.includes("NQ") ? 150 : 50}
              step={0.5}
              value={takeProfitPoints}
              onChange={(e) => setTakeProfitPoints(Number(e.target.value))}
              className="w-full accent-[#00E5A0] bg-surface h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Real-Time Results Matrix */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Total Risk */}
          <div className="rounded-xl bg-black/40 border border-loss/30 p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              MAX TRADE RISK
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-loss">
              -${riskUSD.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-slate-500">Fixed stop loss buffer</span>
          </div>

          {/* Total Target Reward */}
          <div className="rounded-xl bg-black/40 border border-profit/30 p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              PROJECTED PROFIT
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-profit">
              +${rewardUSD.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-slate-500">Pre-planned target</span>
          </div>

          {/* R:R Ratio */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              RISK-TO-REWARD
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-accent">
              1 : {rrRatio}
            </div>
            <span className="text-[10px] font-mono text-slate-500">Asymmetric edge</span>
          </div>

          {/* Breakeven Win Rate */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              BREAKEVEN WIN RATE
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-white">
              {breakevenWinRate}%
            </div>
            <span className="text-[10px] font-mono text-slate-500">Statistical requirement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

