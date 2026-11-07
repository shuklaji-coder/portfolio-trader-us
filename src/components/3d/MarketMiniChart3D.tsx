"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MarketContract } from "@/config/site";
import { soundManager } from "@/lib/sound";
import { TrendingUp, Activity, BarChart2 } from "lucide-react";

interface MarketMiniChart3DProps {
  market: MarketContract;
  accentColor?: "profit" | "cyan";
}

export function MarketMiniChart3D({
  market,
  accentColor = "profit",
}: MarketMiniChart3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Framer Motion 3D tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const brightness = useTransform(smoothY, [-0.5, 0.5], [1.1, 0.95]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoverIndex(null);
  };

  // Build SVG path coordinates from sample chart data
  const data = market.sampleChartData;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const width = 360;
  const height = 120;
  const paddingY = 14;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 20) + 10;
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const isProfit = accentColor === "profit";
  const strokeHex = isProfit ? "#00E5A0" : "#00D2FF";
  const glowHex = isProfit ? "rgba(0, 229, 160, 0.25)" : "rgba(0, 210, 255, 0.25)";

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full flex justify-center py-4 select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          filter: `brightness(${brightness})`,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F17]/90 p-6 md:p-8 backdrop-blur-2xl shadow-2xl transition-shadow duration-300 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Dynamic Card Radial Glow */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500 opacity-60"
          style={{
            background: `radial-gradient(400px circle at 50% 0%, ${glowHex}, transparent 75%)`,
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {market.category}
              </span>
              <span className="flex items-center text-[10px] font-mono text-profit">
                <span className="h-1.5 w-1.5 rounded-full bg-profit animate-ping mr-1" />
                ACTIVE
              </span>
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-white mt-1">
              {market.ticker}
            </h3>
            <p className="text-xs text-slate-400 font-mono">{market.name}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">LAST VALUE</span>
            <div className="font-mono text-xl font-bold text-white tracking-tight flex items-center justify-end">
              <TrendingUp className="h-4 w-4 text-profit mr-1 inline" />
              {activePoint.val.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Interactive Glowing Vector Chart */}
        <div className="relative z-10 my-4 h-32 w-full rounded-xl bg-black/40 border border-white/5 p-2 overflow-hidden flex flex-col justify-end">
          {/* Subtle Grid Lines inside Chart */}
          <div className="absolute inset-0 terminal-grid opacity-30 pointer-events-none" />

          {/* SVG Line Graph */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grad-${market.ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeHex} stopOpacity="0.4" />
                <stop offset="100%" stopColor={strokeHex} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Gradient Area */}
            <path d={areaD} fill={`url(#grad-${market.ticker})`} />

            {/* Glowing Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeHex}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(0,229,160,0.8)]"
            />

            {/* Interactive Data Nodes */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 5 : 2.5}
                fill={hoverIndex === i ? "#FFFFFF" : strokeHex}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => {
                  setHoverIndex(i);
                  soundManager.playHover();
                }}
              />
            ))}
          </svg>

          {/* Crosshair coordinate tooltip if hovering node */}
          {hoverIndex !== null && (
            <div
              className="absolute pointer-events-none rounded bg-surface border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white shadow-lg -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(hoverIndex / (data.length - 1)) * 90 + 5}%`,
                top: "20%",
              }}
            >
              T-{points.length - hoverIndex}: {points[hoverIndex].val}
            </div>
          )}
        </div>

        {/* Description Copy */}
        <p className="relative z-10 text-xs text-slate-300 leading-relaxed mb-5">
          {market.description}
        </p>

        {/* Institutional Specifications Matrix */}
        <div className="relative z-10 grid grid-cols-2 gap-3 rounded-xl bg-surface-light/40 border border-white/5 p-3.5 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Tick Value
            </span>
            <span className="text-white font-medium">{market.specs.tickValue}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Point Value
            </span>
            <span className="text-white font-medium">{market.specs.pointValue}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Volatility
            </span>
            <span className="text-profit font-medium">{market.specs.volatility}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              CME Hours
            </span>
            <span className="text-white font-medium">{market.specs.tradingHours}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
