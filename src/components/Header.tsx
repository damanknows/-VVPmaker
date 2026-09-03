"use client";

import { Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { ArchitectureModal } from "./ArchitectureModal";

interface HeaderProps {
  isLiveBackend: boolean;
  scenario: string;
}

export function Header({ isLiveBackend, scenario }: HeaderProps) {
  const [isArchOpen, setIsArchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  VVP-Maker <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">SVH26004</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Govt. of Rajasthan DTE • Vendor-Neutral VPP Microgrid Orchestrator
              </p>
            </div>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            {/* VPP Live Sync Status Badge */}
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">
                {isLiveBackend ? "Backend Live API" : "Mock Edge Mode"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-amber-400 font-mono">{scenario}</span>
            </div>

            {/* Architecture Pitch Modal Button */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all shadow-sm shadow-indigo-500/10"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>4-Tier Architecture</span>
            </button>

            {/* Rajasthan Dept Badge */}
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>DTE Rajasthan</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4-Tier Architecture Pitch Modal */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
    </>
  );
}
