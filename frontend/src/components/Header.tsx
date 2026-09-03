"use client";

import { Campus } from "@/types/telemetry";
import { ChevronRight, Cpu, ShieldCheck, UserCheck, Zap } from "lucide-react";
import { useState } from "react";
import { ArchitectureModal } from "./ArchitectureModal";

interface HeaderProps {
  isLiveBackend: boolean;
  scenario: string;
  selectedCampus?: Campus;
}

export function Header({ isLiveBackend, scenario, selectedCampus }: HeaderProps) {
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sld");

  const campusName = selectedCampus
    ? selectedCampus.name.split(" - ")[0]
    : "GEC Bikaner";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-slate-900 shadow-sm">
        {/* Main Portal Header Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left Govt of Rajasthan / DTE Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-amber-500">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight sm:text-base">
                  Government of Rajasthan • Directorate of Technical Education
                </h1>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-800 text-amber-500 border border-slate-700">
                  SVH26004
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Energy Management & Virtual Power Plant (VPP) Control Cell
              </p>
            </div>
          </div>

          {/* Center Dynamic Breadcrumb Navigation (Enterprise SCADA) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 border border-slate-800">
            <span>Campuses</span>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-slate-200 font-semibold">{campusName}</span>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-amber-500 font-semibold">Substation-01</span>
          </div>

          {/* Right Operator Status & Controls */}
          <div className="flex items-center gap-3">
            {/* Operator Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 border border-slate-700">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Operator: Er. R. Sharma (Shift A)</span>
            </div>

            {/* VPP Live Sync Status Badge */}
            <div className="flex items-center gap-2 border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-mono">
              <span className="h-2 w-2 bg-emerald-500" />
              <span className="font-medium text-slate-300">
                {isLiveBackend ? "Backend Live API" : "Mock Edge Mode"}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-500">{scenario}</span>
            </div>

            {/* Architecture Pitch Modal Button */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="flex items-center gap-1.5 border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200 hover:bg-slate-700 transition-none"
            >
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              <span>4-Tier Architecture</span>
            </button>
          </div>
        </div>

        {/* Enterprise SCADA Sub-Navigation Tab Strip */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-1 text-xs font-mono py-1">
            <button
              onClick={() => setActiveTab("sld")}
              className={`px-3 py-1 border-b-2 font-medium transition-none ${
                activeTab === "sld"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [Live SCADA SLD]
            </button>

            <button
              onClick={() => setActiveTab("forecast")}
              className={`px-3 py-1 border-b-2 font-medium transition-none ${
                activeTab === "forecast"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [24h Forecasting]
            </button>

            <button
              onClick={() => setActiveTab("bess")}
              className={`px-3 py-1 border-b-2 font-medium transition-none ${
                activeTab === "bess"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [BESS Health]
            </button>

            <button
              onClick={() => setActiveTab("tariff")}
              className={`px-3 py-1 border-b-2 font-medium transition-none ${
                activeTab === "tariff"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [Daily Tariff Audit]
            </button>
          </div>
        </div>
      </header>

      {/* 4-Tier Architecture Pitch Modal */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
    </>
  );
}
