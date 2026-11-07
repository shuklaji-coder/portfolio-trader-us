"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig, CityPin } from "@/config/site";
import { GlobeScene } from "@/components/3d/GlobeScene";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundManager } from "@/lib/sound";
import { Globe, MapPin, Clock, Compass, Plane } from "lucide-react";

export function TravelSection() {
  const [selectedCity, setSelectedCity] = useState<CityPin>(siteConfig.cities[0]);

  const handleCitySelect = (city: CityPin) => {
    setSelectedCity(city);
    soundManager.playClick();
  };

  return (
    <section id="travel" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-surface/70 px-3.5 py-1 text-xs font-mono text-gold-light mb-4">
          <Plane className="h-3.5 w-3.5 text-gold" />
          <span>NOMAD EXPEDITIONS // 24+ COUNTRIES</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
          Trading From Everywhere. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-200">
            One Laptop. Infinite Horizons.
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl">
          The market doesn&apos;t care where your desk is. With CME Globex open 23 hours a day,
          the entire world becomes your trading floor. Select a city below to rotate the 3D globe.
        </p>
      </div>

      {/* Main Grid: 3D Interactive Globe + City Diary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Interactive 3D Dotted Wireframe Globe */}
        <div className="lg:col-span-7 relative flex items-center justify-center">
          <GlobeScene
            activeCityId={selectedCity.id}
            onSelectCity={handleCitySelect}
          />
          {/* Subtle drag hint */}
          <div className="absolute bottom-2 text-center pointer-events-none">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-surface/80 px-2.5 py-1 rounded-full border border-white/5">
              CLICK PINS OR DRAG TO ROTATE GLOBE
            </span>
          </div>
        </div>

        {/* Right: Selected City Detail Card & City Selector */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* City Detail Card with Smooth Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <GlassCard
                className="p-6 md:p-8 border-white/15 bg-surface/90 shadow-2xl relative overflow-hidden"
                glowColor="cyan"
              >
                {/* Background accent badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-profit" />
                    <span className="text-xs font-mono uppercase tracking-wider text-profit">
                      TRADING BASE // {selectedCity.country.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {selectedCity.lat.toFixed(2)}°N, {selectedCity.lng.toFixed(2)}°E
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                  {selectedCity.name}
                </h3>

                {/* Market Session Pill */}
                <div className="flex items-center space-x-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono text-cyan-accent mb-4">
                  <Clock className="h-4 w-4 text-cyan-accent" />
                  <span>Session: {selectedCity.marketSession}</span>
                </div>

                {/* Trader Field Note */}
                <div className="rounded-xl bg-black/40 border border-white/5 p-4 mb-4">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    WAYLON&apos;S TRADER LOG
                  </span>
                  <p className="text-slate-200 text-sm italic leading-relaxed">
                    &ldquo;{selectedCity.note}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/10">
                  <span className="flex items-center">
                    <Globe className="h-3.5 w-3.5 text-profit mr-1.5" />
                    ES & NQ Low Latency Wi-Fi Verified
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Quick City Selector Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              SELECT DESTINATION:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {siteConfig.cities.map((city) => {
                const isActive = city.id === selectedCity.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`rounded-lg px-3 py-2 text-xs font-mono transition-all duration-200 text-left border ${
                      isActive
                        ? "bg-profit/15 text-profit border-profit/40 shadow-[0_0_12px_rgba(0,229,160,0.2)] font-semibold"
                        : "bg-surface/60 text-slate-400 border-white/5 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    <div className="truncate">{city.name.split(" ")[0]}</div>
                    <div className="text-[9px] text-slate-500 truncate">{city.country}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

