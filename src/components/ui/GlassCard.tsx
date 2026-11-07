"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "profit" | "cyan" | "loss" | "white";
  spotlight?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = "profit",
  spotlight = true,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    profit: "rgba(0, 229, 160, 0.15)",
    cyan: "rgba(0, 210, 255, 0.15)",
    loss: "rgba(255, 77, 94, 0.15)",
    white: "rgba(255, 255, 255, 0.08)",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlight) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-surface/75 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Reflection */}
      {spotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles[glowColor]}, transparent 70%)`,
          }}
        />
      )}

      {/* Subtle top edge specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

