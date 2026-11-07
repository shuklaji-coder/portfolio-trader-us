"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { copyToClipboard } from "@/lib/utils";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";
import {
  Copy,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Tag,
  Sparkles,
} from "lucide-react";

export function PropFirmsSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, partnerName: string, event: React.MouseEvent) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(partnerName);
      soundManager.playSuccess();

      // Trigger celebratory micro confetti
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { x, y },
          colors: ["#00E5A0", "#00D2FF", "#FFFFFF"],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore if canvas-confetti unsupported
      }

      setTimeout(() => {
        setCopiedCode(null);
      }, 2500);
    }
  };

  return (
    <section id="partners" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-surface/70 px-3.5 py-1 text-xs font-mono text-profit mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>FIRM CAPITAL // PROP TRADING PARTNERS</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl">
          Scale Capital With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-profit via-teal-300 to-cyan-accent">
            Institutional Prop Firms.
          </span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl">
          Don&apos;t risk your life savings while building your edge. Trade simulated institutional
          capital on CME futures with my preferred prop firm partners.
        </p>
      </div>

      {/* Two Glass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {siteConfig.propPartners.map((partner) => {
          const isCopied = copiedCode === partner.name;

          return (
            <GlassCard
              key={partner.slug}
              className="p-8 md:p-10 border-white/10 flex flex-col justify-between hover:border-profit/30 transition-all duration-300"
              glowColor="profit"
            >
              <div>
                {/* Header Tag + Affiliate Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center space-x-1.5 rounded-full bg-profit/10 border border-profit/30 px-3 py-0.5 text-[11px] font-mono text-profit">
                    <Sparkles className="h-3 w-3" />
                    <span>{partner.offerBadge}</span>
                  </span>

                  {/* Affiliate Clear Disclosure */}
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {partner.affiliateNotice}
                  </span>
                </div>

                {/* Partner Title */}
                <h3 className="font-heading text-3xl font-bold text-white mb-2">
                  {partner.name}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {partner.description}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2.5 mb-8">
                  {partner.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <div className="h-4 w-4 rounded-full bg-profit/15 text-profit flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Area: Copy Code + Direct Link */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-profit" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">
                        PROMO CODE
                      </span>
                      <span className="font-mono text-lg font-bold text-profit tracking-wider">
                        {partner.discountCode}
                      </span>
                    </div>
                  </div>

                  {/* Copy Button with micro-animation */}
                  <button
                    onClick={(e) => handleCopyCode(partner.discountCode, partner.name, e)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
                      isCopied
                        ? "bg-profit text-[#05070A] shadow-[0_0_15px_#00E5A0]"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sign Up Direct Link */}
                <MagneticButton
                  href={partner.referralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full py-3.5 text-sm font-semibold flex items-center justify-center space-x-2"
                >
                  <span>Sign Up with {partner.name}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
