"use client";

import { Cpu, ShieldCheck, Zap } from "lucide-react";
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-5">
          {/* Left SCADA Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-amber-400">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-mono tracking-tight text-white sm:text-lg">
                  VVP-Maker <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-none bg-slate-800 text-amber-400 border border-slate-700">SVH26004</span>
                </h1>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Govt. of Rajasthan DTE • Vendor-Neutral VPP Microgrid Orchestrator
              </p>
            </div>
          </div>

          {/* Right SCADA Controls & Status */}
          <div className="flex items-center gap-2.5">
            {/* VPP Live Sync Status Badge */}
            <div className="flex items-center gap-2 rounded-none border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs font-mono">
              <span className="h-2 w-2 rounded-none bg-emerald-500" />
              <span className="font-medium text-slate-300">
                {isLiveBackend ? "Backend Live API" : "Mock Edge Mode"}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400">{scenario}</span>
            </div>

            {/* Architecture Pitch Modal Button */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="flex items-center gap-1.5 rounded-none border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-mono text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-none"
            >
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              <span>4-Tier Architecture</span>
            </button>

            {/* Rajasthan Dept Badge */}
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-none px-2 py-1">
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
