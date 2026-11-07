"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

// Sections
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { MarketsSection } from "@/components/sections/MarketsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TravelSection } from "@/components/sections/TravelSection";
import { PropFirmsSection } from "@/components/sections/PropFirmsSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { FooterSection } from "@/components/sections/FooterSection";

// Dynamically import 3D Candlestick Scene to avoid SSR issues
const CandlestickScene = dynamic(
  () =>
    import("@/components/3d/CandlestickScene").then((mod) => mod.CandlestickScene),
  { ssr: false }
);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SmoothScrollProvider>
      {/* TradingView Crosshair Custom Cursor */}
      <CustomCursor />

      {/* Terminal Candlestick Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Persistent 3D Candlestick Landscape Background */}
      <CandlestickScene scrollProgress={scrollProgress} />

      {/* Sticky Blur Navbar */}
      <Navbar />

      {/* Scroll-Driven Storytelling Sections */}
      <main className="relative flex flex-col min-h-screen">
        <HeroSection />
        <AboutSection />
        <MarketsSection />
        <ProcessSection />
        <TravelSection />
        <PropFirmsSection />
        <CommunitySection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}

