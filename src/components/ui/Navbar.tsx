"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { soundManager } from "@/lib/sound";
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Markets", href: "#markets" },
    { label: "Process", href: "#process" },
    { label: "Travel", href: "#travel" },
    { label: "Partners", href: "#partners" },
    { label: "Community", href: "#community" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple active section detection
      const sections = ["hero", "about", "markets", "process", "travel", "partners", "community"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundManager.playClick();
    scrollTo(href, { offset: -70 });
    setMobileMenuOpen(false);
  };

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    soundManager.enabled = nextState;
    if (nextState) {
      soundManager.playSuccess();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#05070A]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-white/10 group-hover:border-profit/50 transition-colors">
            {/* Minimal glowing candlestick glyph */}
            <div className="h-4 w-[2px] bg-profit rounded-full" />
            <div className="absolute h-2.5 w-1.5 bg-profit rounded-[1px] shadow-[0_0_8px_#00E5A0]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base tracking-wider text-white group-hover:text-profit transition-colors">
              {siteConfig.name.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-tight leading-none">
              FUTURES • ES • NQ
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 rounded-full border border-white/10 bg-surface/60 px-4 py-1.5 backdrop-blur-xl shadow-inner">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onMouseEnter={() => soundManager.playHover()}
                className={`relative px-3.5 py-1 text-xs font-medium tracking-wide transition-colors duration-200 rounded-full ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/10 border border-white/15 -z-10 shadow-sm" />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls: Market Status + Audio Toggle + Discord CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Live Market Session Pill */}
          <div className="flex items-center space-x-2 rounded-full border border-profit/20 bg-profit/5 px-3 py-1 text-[11px] font-mono text-profit">
            <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" />
            <span className="tracking-wider">CME GLOBEX • 23H</span>
          </div>

          {/* Terminal Sound Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? "Mute Terminal Audio" : "Enable Terminal Audio (Oscillators)"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-surface/80 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4 text-profit" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Quick Discord CTA */}
          <a
            href={siteConfig.community.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="group flex items-center space-x-1.5 rounded-lg border border-profit/40 bg-profit/10 px-3.5 py-1.5 text-xs font-semibold text-profit hover:bg-profit hover:text-[#05070A] transition-all duration-300 shadow-[0_0_15px_rgba(0,229,160,0.15)]"
          >
            <span>Discord</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleAudio}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-surface text-slate-300"
          >
            {audioEnabled ? <Volume2 className="h-3.5 w-3.5 text-profit" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-surface text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#05070A]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-base font-medium text-slate-300 hover:text-profit transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-profit">
              <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
              <span>CME GLOBEX SESSION ACTIVE</span>
            </div>
            <a
              href={siteConfig.community.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl bg-profit py-2.5 text-sm font-semibold text-[#05070A]"
            >
              <span>Join Free Discord</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
