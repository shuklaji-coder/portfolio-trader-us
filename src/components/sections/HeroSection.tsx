"use client";

import React from "react";
import { FullscreenCandlestickHero } from "@/components/ui/FullscreenCandlestickHero";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      <FullscreenCandlestickHero />
    </section>
  );
}
