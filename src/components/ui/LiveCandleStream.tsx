"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { soundManager } from "@/lib/sound";
import { Play, Pause, RefreshCw, Zap, TrendingUp, TrendingDown, Eye, Activity } from "lucide-react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  time: string;
}

export function LiveCandleStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [instrument, setInstrument] = useState<"ES" | "NQ">("ES");
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(5886.5);
  const [priceChange, setPriceChange] = useState(18.25);
  const [lastTickDir, setLastTickDir] = useState<"up" | "down">("up");
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const basePrice = instrument === "ES" ? 5880 : 20640;
  const tickSize = instrument === "ES" ? 0.25 : 0.5;

  // Initialize historical candles
  const initCandles = useCallback(() => {
    const initial: Candle[] = [];
    let price = basePrice;
    const now = new Date();

    for (let i = 40; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const delta = (Math.random() - 0.48) * (instrument === "ES" ? 2.5 : 8.0);
      const open = price;
      const close = Number((open + delta).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * (instrument === "ES" ? 1.5 : 4.0)).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * (instrument === "ES" ? 1.5 : 4.0)).toFixed(2));
      const volume = Math.floor(Math.random() * 350) + 50;

      price = close;
      initial.push({
        open,
        close,
        high,
        low,
        volume,
        isUp: close >= open,
        time,
      });
    }

    setCandles(initial);
    setCurrentPrice(initial[initial.length - 1].close);
  }, [basePrice, instrument]);

  useEffect(() => {
    initCandles();
  }, [initCandles]);

  // Live Continuous Ticking & New Candle Generation Loop
  useEffect(() => {
    if (!isPlaying) return;

    let subTickCount = 0;
    const tickIntervalMs = Math.max(80, 200 / speed);

    const interval = setInterval(() => {
      setCandles((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;

        const updated = [...prevCandles];
        const lastIdx = updated.length - 1;
        const current = { ...updated[lastIdx] };

        // Micro-tick variation
        const bias = Math.random() > 0.48 ? 1 : -1;
        const tickMove = bias * tickSize * (Math.random() > 0.7 ? 2 : 1);
        const newClose = Number((current.close + tickMove).toFixed(2));

        current.close = newClose;
        current.high = Math.max(current.high, newClose);
        current.low = Math.min(current.low, newClose);
        current.isUp = current.close >= current.open;
        current.volume += Math.floor(Math.random() * 8) + 1;

        setCurrentPrice(newClose);
        setLastTickDir(tickMove >= 0 ? "up" : "down");
        setPriceChange((prev) => Number((prev + tickMove * 0.1).toFixed(2)));

        updated[lastIdx] = current;
        subTickCount++;

        // Every 16 micro-ticks (~3 seconds), finalize current candle and start a new candle!
        if (subTickCount >= 16) {
          subTickCount = 0;
          const nowStr = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const nextCandle: Candle = {
            open: newClose,
            close: newClose,
            high: newClose,
            low: newClose,
            volume: Math.floor(Math.random() * 20) + 10,
            isUp: true,
            time: nowStr,
          };

          // Slide window forward
          return [...updated.slice(1), nextCandle];
        }

        return updated;
      });
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, speed, tickSize]);

  // Canvas 60fps Chart Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Dark Terminal Chart Background
      ctx.fillStyle = "#070B11";
      ctx.fillRect(0, 0, width, height);

      if (candles.length === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Compute Price Extents
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      let maxVol = 0;

      candles.forEach((c) => {
        if (c.low < minPrice) minPrice = c.low;
        if (c.high > maxPrice) maxPrice = c.high;
        if (c.volume > maxVol) maxVol = c.volume;
      });

      const paddingY = 40;
      const priceRange = maxPrice - minPrice || 1;
      const chartHeight = height - 90; // reserve bottom 90px for volume

      const priceToY = (price: number) => {
        return chartHeight - paddingY - ((price - minPrice) / priceRange) * (chartHeight - paddingY * 2);
      };

      // Draw Grid Lines (Horizontal Price Levels)
      const numGridLines = 5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#64748B";
      ctx.font = "10px JetBrains Mono, monospace";

      for (let i = 0; i <= numGridLines; i++) {
        const y = paddingY + (i / numGridLines) * (chartHeight - paddingY * 2);
        const priceVal = maxPrice - (i / numGridLines) * priceRange;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width - 65, y);
        ctx.stroke();

        // Right-side Price scale
        ctx.fillText(priceVal.toFixed(2), width - 60, y + 3);
      }

      // Draw Candlesticks & Volume Bars
      const candleWidth = Math.max(4, Math.floor((width - 70) / candles.length) - 4);
      const gap = 4;
      const totalCandleSlot = candleWidth + gap;

      candles.forEach((candle, idx) => {
        const x = idx * totalCandleSlot + 15;
        const openY = priceToY(candle.open);
        const closeY = priceToY(candle.close);
        const highY = priceToY(candle.high);
        const lowY = priceToY(candle.low);

        const isGreen = candle.close >= candle.open;
        const color = isGreen ? "#00E5A0" : "#FF4D5E";
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));

        // 1. Candlestick Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // 2. Candlestick Body
        ctx.fillStyle = color;
        ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

        // Highlight latest candle with neon glow
        if (idx === candles.length - 1) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
          ctx.shadowBlur = 0;
        }

        // 3. Volume Histogram Bar at Bottom
        const volHeight = (candle.volume / (maxVol || 1)) * 55;
        const volY = height - volHeight - 15;
        ctx.fillStyle = isGreen ? "rgba(0, 229, 160, 0.25)" : "rgba(255, 77, 94, 0.25)";
        ctx.fillRect(x, volY, candleWidth, volHeight);
      });

      // 4. Live Current Price Horizontal Dotted Line & Flashing Badge
      const latest = candles[candles.length - 1];
      if (latest) {
        const liveY = priceToY(latest.close);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = latest.isUp ? "#00E5A0" : "#FF4D5E";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, liveY);
        ctx.lineTo(width - 65, liveY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Live Price Tag Badge on Right Axis
        ctx.fillStyle = latest.isUp ? "#00E5A0" : "#FF4D5E";
        ctx.fillRect(width - 65, liveY - 9, 65, 18);

        ctx.fillStyle = "#05070A";
        ctx.font = "bold 10px JetBrains Mono, monospace";
        ctx.fillText(latest.close.toFixed(2), width - 60, liveY + 3.5);
      }

      // 5. Interactive Crosshair & Tooltip on Hover
      if (mousePos && mousePos.x < width - 70) {
        const hoverIdx = Math.floor((mousePos.x - 15) / totalCandleSlot);
        if (hoverIdx >= 0 && hoverIdx < candles.length) {
          const c = candles[hoverIdx];

          // Crosshair lines
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);

          // Vertical
          ctx.beginPath();
          ctx.moveTo(mousePos.x, 0);
          ctx.lineTo(mousePos.x, height);
          ctx.stroke();

          // Horizontal
          ctx.beginPath();
          ctx.moveTo(0, mousePos.y);
          ctx.lineTo(width - 65, mousePos.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [candles, mousePos]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = window.innerWidth < 640 ? 280 : 360;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const totalCandleSlot = Math.max(4, Math.floor((rect.width - 70) / candles.length) - 4) + 4;
    const hoverIdx = Math.floor((x - 15) / totalCandleSlot);
    if (hoverIdx >= 0 && hoverIdx < candles.length) {
      setHoveredCandle(candles[hoverIdx]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 rounded-2xl border border-white/15 bg-[#070B11]/90 backdrop-blur-2xl shadow-2xl overflow-hidden select-none">
      {/* Top Terminal Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-surface/80">
        <div className="flex items-center space-x-3">
          {/* Live pulsing dot */}
          <span className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-profit">
            <span className="h-2 w-2 rounded-full bg-profit animate-ping" />
            <span className="tracking-wider">LIVE CONTINUOUS CME FEED</span>
          </span>

          {/* Instrument Toggle: ES vs NQ */}
          <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
            <button
              onClick={() => {
                setInstrument("ES");
                soundManager.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                instrument === "ES"
                  ? "bg-profit text-[#05070A] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ES (S&P 500)
            </button>
            <button
              onClick={() => {
                setInstrument("NQ");
                soundManager.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                instrument === "NQ"
                  ? "bg-cyan-accent text-[#05070A] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              NQ (Nasdaq 100)
            </button>
          </div>
        </div>

        {/* Live Price Readout */}
        <div className="flex items-center space-x-4 my-1 sm:my-0">
          <div className="flex items-baseline space-x-2">
            <span className="text-xs font-mono text-slate-400">{instrument} GLOBEX:</span>
            <span
              className={`font-mono text-lg font-bold tracking-tight transition-colors ${
                lastTickDir === "up" ? "text-profit" : "text-loss"
              }`}
            >
              {currentPrice.toFixed(2)}
            </span>
            <span
              className={`text-xs font-mono flex items-center ${
                priceChange >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {priceChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5 inline" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5 inline" />
              )}
              {priceChange >= 0 ? `+${priceChange}` : priceChange}
            </span>
          </div>

          {/* Speed & Pause Controls */}
          <div className="flex items-center space-x-1 border-l border-white/10 pl-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title={isPlaying ? "Pause Stream" : "Resume Stream"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-profit" />}
            </button>

            <button
              onClick={() => {
                setSpeed((s) => (s === 1 ? 2 : s === 2 ? 3 : 1));
                soundManager.playClick();
              }}
              className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
              title="Change Stream Speed"
            >
              {speed}x
            </button>

            <button
              onClick={() => {
                initCandles();
                soundManager.playClick();
              }}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Reset Candlesticks"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Candlestick Canvas Viewport */}
      <div ref={containerRef} className="relative w-full h-[280px] sm:h-[360px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block"
        />

        {/* Hovered Candle HUD Info Overlay */}
        {hoveredCandle ? (
          <div className="absolute top-3 left-4 rounded-xl bg-surface/90 border border-white/15 px-3 py-1.5 backdrop-blur-md flex items-center space-x-3 text-[11px] font-mono pointer-events-none shadow-xl">
            <span className="text-slate-400">TIME: {hoveredCandle.time}</span>
            <span className="text-slate-400">
              O: <b className="text-white">{hoveredCandle.open.toFixed(2)}</b>
            </span>
            <span className="text-slate-400">
              H: <b className="text-profit">{hoveredCandle.high.toFixed(2)}</b>
            </span>
            <span className="text-slate-400">
              L: <b className="text-loss">{hoveredCandle.low.toFixed(2)}</b>
            </span>
            <span className="text-slate-400">
              C: <b className={hoveredCandle.isUp ? "text-profit" : "text-loss"}>{hoveredCandle.close.toFixed(2)}</b>
            </span>
            <span className="text-slate-400">
              VOL: <b className="text-cyan-accent">{hoveredCandle.volume}</b>
            </span>
          </div>
        ) : (
          <div className="absolute top-3 left-4 flex items-center space-x-2 text-[10px] font-mono text-slate-500 pointer-events-none">
            <Eye className="h-3.5 w-3.5 text-profit" />
            <span>HOVER ANY CANDLE TO INSPECT OHLC DATA</span>
          </div>
        )}

        {/* Volume Label */}
        <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase text-slate-500 pointer-events-none">
          VOLUME HISTOGRAM // CME DEPTH OF MARKET (DOM)
        </div>
      </div>
    </div>
  );
}

