"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import { TradingViewWidget } from "@/components/ui/TradingViewWidget";
import {
  Play,
  Pause,
  RefreshCw,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  Activity,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
  Radio,
} from "lucide-react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  time: string;
}

interface ActiveTrade {
  type: "LONG" | "SHORT";
  entryPrice: number;
  entryTime: string;
  contracts: number;
}

export function LiveCandleStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mode: Custom Continuous Simulator vs Official Real-Time TradingView Chart
  const [chartMode, setChartMode] = useState<"simulator" | "tradingview">("simulator");
  const [instrument, setInstrument] = useState<"ES" | "NQ">("ES");
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(5886.5);
  const [priceChange, setPriceChange] = useState(18.25);
  const [lastTickDir, setLastTickDir] = useState<"up" | "down">("up");
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Paper Trading Simulator State
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const basePrice = instrument === "ES" ? 5880 : 20640;
  const tickSize = instrument === "ES" ? 0.25 : 0.5;
  const pointValue = instrument === "ES" ? 50 : 20;

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
    setActiveTrade(null);
    setTradeMessage(null);
  }, [basePrice, instrument]);

  useEffect(() => {
    initCandles();
  }, [initCandles]);

  // Live Continuous Ticking & New Candle Generation Loop
  useEffect(() => {
    if (!isPlaying || chartMode !== "simulator") return;

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
  }, [isPlaying, speed, tickSize, chartMode]);

  // Paper Trade Action Handlers
  const handleOpenTrade = (type: "LONG" | "SHORT") => {
    soundManager.playClick();
    setActiveTrade({
      type,
      entryPrice: currentPrice,
      entryTime: new Date().toLocaleTimeString(),
      contracts: 2,
    });
    setTradeMessage(`EXECUTED ${type} 2x @ ${currentPrice.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3000);
  };

  const handleCloseTrade = (e: React.MouseEvent) => {
    if (!activeTrade) return;

    const pointsDelta =
      activeTrade.type === "LONG"
        ? currentPrice - activeTrade.entryPrice
        : activeTrade.entryPrice - currentPrice;

    const pnlUSD = pointsDelta * pointValue * activeTrade.contracts;

    if (pnlUSD > 0) {
      soundManager.playSuccess();
      try {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ["#00E5A0", "#00FFAF", "#FFFFFF"],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
      setTradeMessage(`TARGET HIT! +$${pnlUSD.toFixed(2)} (+${pointsDelta.toFixed(2)} pts)`);
    } else {
      soundManager.playClick();
      setTradeMessage(`CLOSED: -$${Math.abs(pnlUSD).toFixed(2)} (${pointsDelta.toFixed(2)} pts)`);
    }

    setActiveTrade(null);
    setTimeout(() => setTradeMessage(null), 4000);
  };

  // Canvas 60fps Chart Rendering Loop
  useEffect(() => {
    if (chartMode !== "simulator") return;

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

      // Factor in active trade entry price so it is never clipped
      if (activeTrade) {
        if (activeTrade.entryPrice < minPrice) minPrice = activeTrade.entryPrice - 2;
        if (activeTrade.entryPrice > maxPrice) maxPrice = activeTrade.entryPrice + 2;
      }

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

        // 1. Candlestick Wick with Laser Sparks
        const isGold = (idx % 7 === 0 && isGreen);
        const wickColor = isGold ? "#F5D061" : isGreen ? "#00E5A0" : "#FF4D5E";

        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // Laser spark dot at wick high
        ctx.fillStyle = isGold ? "#FFF7CC" : isGreen ? "#7AFFCE" : "#FFAEB6";
        ctx.beginPath();
        ctx.arc(x + candleWidth / 2, highY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Candlestick Body with Radiant Vertical Gradient
        let bodyGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyHeight);
        if (isGold) {
          bodyGrad.addColorStop(0, "#FFF2A8");
          bodyGrad.addColorStop(0.4, "#F5D061");
          bodyGrad.addColorStop(1, "#B38F24");
        } else if (isGreen) {
          bodyGrad.addColorStop(0, "#5CFFA8");
          bodyGrad.addColorStop(0.45, "#00E5A0");
          bodyGrad.addColorStop(1, "#007A4D");
        } else {
          bodyGrad.addColorStop(0, "#FFA3AC");
          bodyGrad.addColorStop(0.45, "#FF4D5E");
          bodyGrad.addColorStop(1, "#9E1322");
        }

        // Body Glow
        ctx.shadowColor = isGold
          ? "rgba(245, 208, 97, 0.7)"
          : isGreen
          ? "rgba(0, 229, 160, 0.5)"
          : "rgba(255, 77, 94, 0.5)";
        ctx.shadowBlur = isGold || idx === candles.length - 1 ? 14 : 7;
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

        // Crisp Outer Highlight Border
        ctx.strokeStyle = isGold ? "#FFF9D4" : isGreen ? "#8AFFE2" : "#FFB8BF";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
        ctx.shadowBlur = 0;

        // 3. Volume Histogram Bar at Bottom
        const volHeight = (candle.volume / (maxVol || 1)) * 55;
        const volY = height - volHeight - 15;
        ctx.fillStyle = isGold
          ? "rgba(245, 208, 97, 0.35)"
          : isGreen
          ? "rgba(0, 229, 160, 0.3)"
          : "rgba(255, 77, 94, 0.3)";
        ctx.fillRect(x, volY, candleWidth, volHeight);
      });

      // 3.5. Glowing Micro-Trend Ribbon Weaving Across Candles
      if (candles.length > 2) {
        ctx.strokeStyle = "rgba(245, 208, 97, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        candles.forEach((c, i) => {
          const cx = i * totalCandleSlot + 15 + candleWidth / 2;
          const cy = priceToY(c.close);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
      }

      // 4. Active Paper Trade Position Line (If Trade is Active)
      if (activeTrade) {
        const tradeY = priceToY(activeTrade.entryPrice);
        const isLong = activeTrade.type === "LONG";
        const tradeColor = isLong ? "#00D2FF" : "#F59E0B";

        ctx.setLineDash([6, 3]);
        ctx.strokeStyle = tradeColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, tradeY);
        ctx.lineTo(width - 65, tradeY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Trade Label
        ctx.fillStyle = tradeColor;
        ctx.fillRect(15, tradeY - 18, 140, 16);
        ctx.fillStyle = "#05070A";
        ctx.font = "bold 9px JetBrains Mono, monospace";
        ctx.fillText(
          `${activeTrade.type} 2x @ ${activeTrade.entryPrice.toFixed(2)}`,
          20,
          tradeY - 6
        );
      }

      // 5. Live Current Price Horizontal Dotted Line & Flashing Badge
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

      // 6. Interactive Crosshair & Tooltip on Hover
      if (mousePos && mousePos.x < width - 70) {
        const hoverIdx = Math.floor((mousePos.x - 15) / totalCandleSlot);
        if (hoverIdx >= 0 && hoverIdx < candles.length) {
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
  }, [candles, mousePos, activeTrade, chartMode]);

  // Handle Resize
  useEffect(() => {
    if (chartMode !== "simulator") return;

    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = window.innerWidth < 640 ? 320 : 440;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartMode]);

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

  // Live P&L Calculation if Trade is Active
  const activePointsDelta = activeTrade
    ? activeTrade.type === "LONG"
      ? currentPrice - activeTrade.entryPrice
      : activeTrade.entryPrice - currentPrice
    : 0;

  const activePnlUSD = activeTrade
    ? activePointsDelta * pointValue * activeTrade.contracts
    : 0;

  const isProfit = activePnlUSD >= 0;

  return (
    <div className="w-full max-w-7xl mx-auto my-6 rounded-3xl border border-gold/30 bg-[#06090e]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden select-none">
      {/* Top Terminal Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-surface/80 gap-3">
        {/* Left: Mode Toggle & Feed Badge */}
        <div className="flex items-center space-x-3">
          {/* Real vs Sim Mode Switch */}
          <div className="flex items-center rounded-lg bg-black/50 border border-white/10 p-0.5">
            <button
              onClick={() => {
                setChartMode("simulator");
                soundManager.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                chartMode === "simulator"
                  ? "bg-profit text-[#05070A] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              SIMULATOR (60 FPS)
            </button>
            <button
              onClick={() => {
                setChartMode("tradingview");
                soundManager.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors flex items-center space-x-1 ${
                chartMode === "tradingview"
                  ? "bg-cyan-accent text-[#05070A] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="h-3 w-3 mr-1 inline animate-pulse text-red-500" />
              <span>TRADINGVIEW (REAL DATA)</span>
            </button>
          </div>

          {/* Instrument Toggle: ES vs NQ */}
          <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
            <button
              onClick={() => {
                setInstrument("ES");
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                instrument === "ES" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => {
                setInstrument("NQ");
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                instrument === "NQ" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              NQ
            </button>
          </div>
        </div>

        {/* Right: Live Price & Controls */}
        <div className="flex items-center space-x-3">
          {chartMode === "simulator" && (
            <div className="flex items-baseline space-x-2">
              <span className="text-xs font-mono text-slate-400">{instrument} LAST:</span>
              <span
                className={`font-mono text-base sm:text-lg font-bold tracking-tight transition-colors ${
                  lastTickDir === "up" ? "text-profit" : "text-loss"
                }`}
              >
                {currentPrice.toFixed(2)}
              </span>
              <span
                className={`text-xs font-mono hidden sm:flex items-center ${
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
          )}

          {chartMode === "simulator" && (
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
          )}
        </div>
      </div>

      {/* Main Chart Area */}
      {chartMode === "simulator" ? (
        <>
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

          {/* Interactive Paper Trading Action Deck */}
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-[#0A0E17] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">PAPER TRADING DEMO:</span>
              {activeTrade ? (
                <div
                  className={`flex items-center space-x-2 rounded-lg px-3 py-1 font-mono font-bold ${
                    isProfit
                      ? "bg-profit/15 text-profit border border-profit/30"
                      : "bg-loss/15 text-loss border border-loss/30"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full animate-ping bg-current" />
                  <span>
                    {activeTrade.type} 2x @ {activeTrade.entryPrice.toFixed(2)} | P&L:{" "}
                    {isProfit ? `+$${activePnlUSD.toFixed(2)}` : `-$${Math.abs(activePnlUSD).toFixed(2)}`}{" "}
                    ({activePointsDelta > 0 ? `+${activePointsDelta.toFixed(2)}` : activePointsDelta.toFixed(2)} pts)
                  </span>
                </div>
              ) : (
                <span className="text-slate-500">Test trade live market volatility</span>
              )}
            </div>

            {/* Trading Buttons */}
            <div className="flex items-center space-x-2">
              {tradeMessage && (
                <span className="text-xs font-mono font-semibold text-profit animate-pulse mr-2">
                  {tradeMessage}
                </span>
              )}

              {activeTrade ? (
                <button
                  onClick={handleCloseTrade}
                  className="flex items-center space-x-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 text-xs font-mono font-bold text-white transition-all shadow-lg"
                >
                  <XCircle className="h-4 w-4 text-loss" />
                  <span>CLOSE POSITION</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenTrade("LONG")}
                    className="flex items-center space-x-1 rounded-lg bg-profit hover:bg-[#00FFAF] px-4 py-1.5 text-xs font-mono font-bold text-[#05070A] transition-all shadow-[0_0_15px_rgba(0,229,160,0.3)]"
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                    <span>BUY / LONG</span>
                  </button>
                  <button
                    onClick={() => handleOpenTrade("SHORT")}
                    className="flex items-center space-x-1 rounded-lg bg-loss hover:bg-[#FF6B7A] px-4 py-1.5 text-xs font-mono font-bold text-white transition-all shadow-[0_0_15px_rgba(255,77,94,0.3)]"
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                    <span>SELL / SHORT</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Official Real-Time TradingView Live Chart */
        <div className="w-full h-[420px] p-2 bg-[#070B11]">
          <TradingViewWidget
            symbol={instrument === "ES" ? "CME_MINI:ES1!" : "CME_MINI:NQ1!"}
            height={400}
          />
        </div>
      )}
    </div>
  );
}
