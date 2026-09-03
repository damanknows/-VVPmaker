"use client";

import { Campus } from "@/types/telemetry";
import { ChevronRight, Cpu, UserCheck } from "lucide-react";
import { useState } from "react";
import { ArchitectureModal } from "./ArchitectureModal";

interface HeaderProps {
  isLiveBackend: boolean;
  scenario: string;
  selectedCampus?: Campus;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({
  isLiveBackend,
  scenario,
  selectedCampus,
  activeTab = "sld",
  onTabChange,
}: HeaderProps) {
  const [isArchOpen, setIsArchOpen] = useState(false);

  const campusName = selectedCampus
    ? selectedCampus.name.split(" - ")[0]
    : "GEC Bikaner";

  const handleTabClick = (tabId: string, elementId: string) => {
    if (onTabChange) onTabChange(tabId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-slate-900 shadow-sm">
        {/* Main Portal Header Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left Govt of Rajasthan / DTE Title with Official State Emblem Logo */}
          <div className="flex items-center gap-3">
            {/* Official Government of Rajasthan State Emblem Logo */}
            <div className="flex h-10 w-10 items-center justify-center bg-white p-0.5 border border-slate-600 shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rajasthan_logo.png"
                alt="Government of Rajasthan Emblem"
                className="h-full w-full object-contain"
              />
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
              className="flex items-center gap-1.5 border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200 hover:bg-slate-700 transition-none cursor-pointer"
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
              onClick={() => handleTabClick("sld", "sld-section")}
              className={`px-3 py-1 border-b-2 font-medium transition-none cursor-pointer ${
                activeTab === "sld"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [Live SCADA SLD]
            </button>

            <button
              onClick={() => handleTabClick("forecast", "forecast-section")}
              className={`px-3 py-1 border-b-2 font-medium transition-none cursor-pointer ${
                activeTab === "forecast"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [24h Forecasting]
            </button>

            <button
              onClick={() => handleTabClick("bess", "bess-section")}
              className={`px-3 py-1 border-b-2 font-medium transition-none cursor-pointer ${
                activeTab === "bess"
                  ? "border-amber-500 text-amber-500 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              [BESS Health]
            </button>

            <button
              onClick={() => handleTabClick("tariff", "tariff-section")}
              className={`px-3 py-1 border-b-2 font-medium transition-none cursor-pointer ${
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
