"use client";

import React, { useState, useEffect } from "react";
import { Clock, Globe2, Bell, Zap, Flame, ShieldAlert } from "lucide-react";

interface SessionInfo {
  name: string;
  city: string;
  flag: string;
  openHourET: number; // in 24h format ET
  openMinET: number;
  closeHourET: number;
  closeMinET: number;
  description: string;
  volatility: "Low" | "Medium" | "Extreme" | "High";
}

const SESSIONS: SessionInfo[] = [
  {
    name: "Asia / Tokyo",
    city: "Tokyo & Sydney",
    flag: "🇯🇵",
    openHourET: 18,
    openMinET: 0,
    closeHourET: 2,
    closeMinET: 0,
    description: "Consolidation & Asian range liquidity buildup",
    volatility: "Low",
  },
  {
    name: "London Open",
    city: "London",
    flag: "🇬🇧",
    openHourET: 3,
    openMinET: 0,
    closeHourET: 11,
    closeMinET: 30,
    description: "European liquidity injection & early trend creation",
    volatility: "High",
  },
  {
    name: "New York RTH (Cash Open)",
    city: "New York",
    flag: "🇺🇸",
    openHourET: 9,
    openMinET: 30,
    closeHourET: 16,
    closeMinET: 0,
    description: "Prime ES/NQ volatility, opening bell institutional order flow",
    volatility: "Extreme",
  },
  {
    name: "CME Globex Session",
    city: "Chicago",
    flag: "🏛️",
    openHourET: 18,
    openMinET: 0,
    closeHourET: 17,
    closeMinET: 0,
    description: "23-hour continuous electronic futures market",
    volatility: "Medium",
  },
];

export function MarketSessionsRadar() {
  const [mounted, setMounted] = useState(false);
  const [currentTimeET, setCurrentTimeET] = useState<Date | null>(null);
  const [formattedETString, setFormattedETString] = useState("");
  const [countdownText, setCountdownText] = useState("");
  const [countdownLabel, setCountdownLabel] = useState("");

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      // Get current Eastern Time string
      const etString = now.toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const [hStr, mStr, sStr] = etString.split(":");
      const curHour = parseInt(hStr, 10);
      const curMin = parseInt(mStr, 10);
      const curSec = parseInt(sStr, 10);

      const etDate = new Date();
      etDate.setHours(curHour, curMin, curSec, 0);
      setCurrentTimeET(etDate);

      // Nicely formatted 12-hour ET display
      const niceEt = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setFormattedETString(niceEt);

      // Compute countdown to Next Major Event (NY 09:30 AM Bell, or 16:00 PM Close, or 18:00 Globex Reopen)
      const currentSecondsInDay = curHour * 3600 + curMin * 60 + curSec;
      const nyOpenSeconds = 9 * 3600 + 30 * 60; // 09:30 ET
      const nyCloseSeconds = 16 * 3600; // 16:00 ET
      const cmeReopenSeconds = 18 * 3600; // 18:00 ET

      let targetSeconds = 0;
      let label = "";

      if (currentSecondsInDay < nyOpenSeconds) {
        targetSeconds = nyOpenSeconds;
        label = "NY 9:30 AM Bell Countdown";
      } else if (currentSecondsInDay < nyCloseSeconds) {
        targetSeconds = nyCloseSeconds;
        label = "NY Cash Close Countdown";
      } else if (currentSecondsInDay < cmeReopenSeconds) {
        targetSeconds = cmeReopenSeconds;
        label = "CME Globex Re-Open Countdown";
      } else {
        // After 18:00, countdown to tomorrow's 09:30 AM
        targetSeconds = 24 * 3600 + nyOpenSeconds;
        label = "Tomorrow NY 9:30 AM Bell";
      }

      const diffSec = targetSeconds - currentSecondsInDay;
      const hours = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");

      setCountdownText(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);
      setCountdownLabel(label);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if a session is currently active based on current ET time
  const isSessionActive = (session: SessionInfo): boolean => {
    if (!currentTimeET) return false;
    const curH = currentTimeET.getHours();
    const curM = currentTimeET.getMinutes();
    const currentMins = curH * 60 + curM;

    const openMins = session.openHourET * 60 + session.openMinET;
    const closeMins = session.closeHourET * 60 + session.closeMinET;

    if (openMins < closeMins) {
      // Normal range within same day (e.g. 09:30 to 16:00)
      return currentMins >= openMins && currentMins < closeMins;
    } else {
      // Overnight range wrapping past midnight (e.g. 18:00 to 02:00 or 18:00 to 17:00)
      return currentMins >= openMins || currentMins < closeMins;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gold/25 bg-gradient-to-b from-[#0e111a]/95 via-surface/90 to-[#040609]/95 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-12">
      {/* Background ambient gold & cyan glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
            <Globe2 className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-bold text-white text-base sm:text-lg tracking-wide">
                Global Market Sessions Radar
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-profit/15 text-profit border border-profit/30">
                LIVE ET
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time futures liquidity windows & CME opening bell tracking
            </p>
          </div>
        </div>

        {/* Live Clock & Countdown Banner */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          {/* ET Time */}
          <div className="flex items-center space-x-2 bg-black/60 border border-white/15 px-3.5 py-1.5 rounded-xl">
            <Clock className="h-4 w-4 text-gold" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                New York (ET)
              </div>
              <div className="text-sm font-mono font-bold text-white tracking-wider">
                {mounted ? formattedETString : "09:30:00 AM"}
              </div>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-gold/15 to-profit/15 border border-gold/40 px-3.5 py-1.5 rounded-xl">
            <Bell className="h-4 w-4 text-gold animate-bounce" />
            <div>
              <div className="text-[10px] font-mono text-gold uppercase tracking-wider">
                {mounted ? countdownLabel : "NY 9:30 AM Bell Countdown"}
              </div>
              <div className="text-sm font-mono font-bold text-profit tracking-widest">
                {mounted ? countdownText : "00:00:00"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Global Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {SESSIONS.map((session) => {
          const active = mounted && isSessionActive(session);

          return (
            <div
              key={session.name}
              className={`relative rounded-xl border p-4 transition-all duration-300 ${
                active
                  ? "bg-gradient-to-b from-gold/15 via-surface/80 to-black/70 border-gold/60 shadow-lg shadow-gold/10"
                  : "bg-surface/40 border-white/5 opacity-75 hover:opacity-100"
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl" role="img" aria-label={session.city}>
                    {session.flag}
                  </span>
                  <span className="font-heading font-semibold text-white text-sm">
                    {session.name}
                  </span>
                </div>

                {/* Status Pill */}
                {active ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-profit/20 text-profit border border-profit/40 shadow-sm shadow-profit/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-profit animate-ping" />
                    <span>ACTIVE</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10">
                    CLOSED
                  </span>
                )}
              </div>

              {/* Time window */}
              <div className="text-xs font-mono text-gold/90 mb-2 font-medium">
                {session.openHourET.toString().padStart(2, "0")}:
                {session.openMinET.toString().padStart(2, "0")} -{" "}
                {session.closeHourET.toString().padStart(2, "0")}:
                {session.closeMinET.toString().padStart(2, "0")} ET
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                {session.description}
              </p>

              {/* Volatility Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono">
                <span className="text-slate-500">Volatility:</span>
                <span
                  className={`font-semibold flex items-center space-x-1 ${
                    session.volatility === "Extreme"
                      ? "text-profit"
                      : session.volatility === "High"
                      ? "text-gold"
                      : session.volatility === "Medium"
                      ? "text-cyan-accent"
                      : "text-slate-400"
                  }`}
                >
                  {session.volatility === "Extreme" && <Flame className="h-3 w-3 inline text-profit" />}
                  {session.volatility === "High" && <Zap className="h-3 w-3 inline text-gold" />}
                  <span>{session.volatility}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trader Discipline Note */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-gold flex-shrink-0" />
          <span>
            <strong className="text-white">Waylon&apos;s Golden Rule:</strong> The highest A+ setups on ES/NQ occur within the first 90 minutes of the New York 9:30 AM Bell (09:30 - 11:00 AM ET).
          </span>
        </div>
        <span className="font-mono text-[11px] text-gold/80 bg-gold/10 px-2.5 py-1 rounded border border-gold/20 flex-shrink-0">
          CME Globex Rules Applied
        </span>
      </div>
    </div>
  );
}

