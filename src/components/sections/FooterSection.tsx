"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { soundManager } from "@/lib/sound";
import {
  Instagram,
  Youtube,
  Twitter,
  MessageSquare,
  ArrowUp,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Globe2,
} from "lucide-react";

export function FooterSection() {
  const { scrollTo } = useSmoothScroll();
  const [currentTimeEST, setCurrentTimeEST] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const estStr = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTimeEST(estStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSocialIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <Instagram className="h-5 w-5" />;
      case "YouTube":
        return <Youtube className="h-5 w-5" />;
      case "X (Twitter)":
        return <Twitter className="h-5 w-5" />;
      case "Discord":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Globe2 className="h-5 w-5" />;
    }
  };

  return (
    <footer className="relative pt-20 pb-12 border-t border-white/10 bg-[#030508] z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer: Social Links + Affiliate Links */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-16 border-b border-white/10 gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-2">
              CONNECT & FOLLOW LIVE
            </span>
            <h3 className="font-heading text-2xl font-bold text-white">
              Stay in the Flow With Waylon
            </h3>
          </div>

          {/* Magnetic Social Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {siteConfig.socials.map((social) => (
              <MagneticButton
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="glass"
                className="px-4 py-2.5 text-xs font-mono border-white/10 hover:border-profit/40"
              >
                <span className="mr-2 text-profit">{getSocialIcon(social.name)}</span>
                <span>{social.name}</span>
                <ArrowUpRight className="h-3 w-3 ml-1 opacity-70" />
              </MagneticButton>
            ))}
          </div>
        </div>

        {/* Middle Footer: Extra Affiliate Link (Celsius) & CME Clocks */}
        <div className="py-12 border-b border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Celsius affiliate link */}
          <div className="md:col-span-7">
            <a
              href={siteConfig.extraLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="group inline-flex items-center space-x-3 rounded-2xl bg-surface-light/40 border border-white/10 p-4 hover:border-profit/40 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-semibold text-white group-hover:text-profit transition-colors">
                    CELSIUS ESSENTIAL ENERGY // OFFICIAL AFFILIATE
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-profit group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Fuel for 9:30 AM market open focus and international travel sessions.
                </p>
              </div>
            </a>
          </div>

          {/* Time & Session Clock (EST) */}
          <div className="md:col-span-5 flex md:justify-end items-center space-x-4">
            <div className="rounded-xl bg-black/50 border border-white/10 px-4 py-2 text-right">
              <span className="text-[9px] font-mono uppercase text-slate-400 block">
                NEW YORK (EST) CLOCK
              </span>
              <span className="font-mono text-base font-bold text-profit">
                {currentTimeEST || "09:30:00"} EST
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                scrollTo("#hero");
              }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-white/10 text-slate-300 hover:text-white hover:border-profit/50 transition-colors shadow-lg"
              title="Back to Top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Big Wordmark Scroll Reveal */}
        <div className="py-16 text-center select-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0.1, y: 30 }}
            whileInView={{ opacity: 0.45, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/30 via-white/10 to-transparent leading-none">
              WAYTRADES
            </h1>
          </motion.div>
        </div>

        {/* Mandatory Legal Risk Disclaimer */}
        <div className="pt-8 border-t border-white/10">
          <div className="rounded-xl bg-surface/40 border border-white/5 p-4 sm:p-6 mb-8 text-left">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
              <ShieldAlert className="h-4 w-4 text-loss" />
              <span className="uppercase font-semibold tracking-wider text-slate-300">
                REGULATORY & RISK DISCLOSURE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
              {siteConfig.disclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} WayTrades (Waylon Skinner). All rights reserved.</p>
            <p className="text-[11px] text-slate-500">
              Crafted with Next.js, Three.js, GSAP & Lenis
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

