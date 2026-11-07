"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/sound";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "secondary" | "glass" | "outline";
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  target,
  rel,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const pullFactor = 0.35; // gentle, elegant pull
    setPosition({
      x: (clientX - centerX) * pullFactor,
      y: (clientY - centerY) * pullFactor,
    });
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    soundManager.playClick();
    onClick?.();
  };

  // Base styling for variant
  const variantStyles = {
    primary:
      "bg-profit hover:bg-[#00FFAF] text-[#05070A] font-semibold shadow-[0_0_25px_rgba(0,229,160,0.35)] hover:shadow-[0_0_35px_rgba(0,229,160,0.6)] border border-profit/50",
    secondary:
      "bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md shadow-lg",
    glass:
      "bg-surface/80 hover:bg-surface-light/80 text-white border border-white/10 hover:border-profit/40 backdrop-blur-lg hover:shadow-[0_0_20px_rgba(0,229,160,0.15)]",
    outline:
      "bg-transparent text-slate-200 border border-white/20 hover:border-profit hover:text-profit backdrop-blur-sm",
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.2 }}
      className={`relative inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-medium tracking-wide transition-colors cursor-pointer group select-none ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}

