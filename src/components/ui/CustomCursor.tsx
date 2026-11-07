"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "crosshair">("default");
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring physics for outer ring
  const springConfig = { damping: 24, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports fine hover pointer
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], input, textarea, select, .interactive-hover, .chart-canvas");
      if (interactive) {
        setIsHovered(true);
        setCursorType("crosshair");
      } else {
        setIsHovered(false);
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* TradingView Crosshair mode */}
      {cursorType === "crosshair" ? (
        <motion.div
          className="fixed left-0 top-0 pointer-events-none"
          style={{ x: smoothX, y: smoothY }}
        >
          {/* Center pinpoint */}
          <div className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full border border-profit bg-profit/40 backdrop-blur-sm" />

          {/* Crosshair Horizontal Line */}
          <div className="absolute -left-[30px] top-0 h-[1px] w-[60px] bg-gradient-to-r from-transparent via-profit/80 to-transparent" />

          {/* Crosshair Vertical Line */}
          <div className="absolute -top-[30px] left-0 h-[60px] w-[1px] bg-gradient-to-b from-transparent via-profit/80 to-transparent" />

          {/* Small TradingView price coordinate tag */}
          <div className="absolute left-3 top-3 rounded bg-surface/90 px-1.5 py-0.5 text-[9px] font-mono tracking-wider text-profit border border-profit/30 shadow-lg">
            {(coords.y * 5.25 + 5000).toFixed(2)}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Standard Dot at direct mouse coords */}
          <motion.div
            className="fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-profit shadow-[0_0_8px_#00E5A0]"
            style={{ x: mouseX, y: mouseY }}
          />

          {/* Trailing Outer Ring */}
          <motion.div
            className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-profit/40 bg-profit/5"
            style={{
              x: smoothX,
              y: smoothY,
              width: 32,
              height: 32,
            }}
            animate={{
              scale: isHovered ? 1.4 : 1,
              borderColor: isHovered ? "rgba(0, 229, 160, 0.8)" : "rgba(0, 229, 160, 0.35)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </>
      )}
    </div>
  );
}
