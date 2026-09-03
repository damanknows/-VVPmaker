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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs font-sans">
        {/* Main Portal Header Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left Govt of Rajasthan / DTE Title with Official State Emblem Logo */}
          <div className="flex items-center gap-3">
            {/* Official Government of Rajasthan State Emblem Logo */}
            <div className="flex h-10 w-10 items-center justify-center bg-white p-0.5 border border-slate-200 shadow-xs rounded-xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rajasthan_logo.png"
                alt="Government of Rajasthan Emblem"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight sm:text-base">
                  Government of Rajasthan • Directorate of Technical Education
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  SVH26004
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Energy Management & Virtual Power Plant (VPP) Control Cell
              </p>
            </div>
          </div>

          {/* Center Dynamic Breadcrumb Navigation (Modern SaaS Pill) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-100/80 px-3.5 py-1 border border-slate-200 rounded-full">
            <span className="font-sans text-slate-500">Campuses</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">{campusName}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">Substation-01</span>
          </div>

          {/* Right Operator Status & Controls */}
          <div className="flex items-center gap-3">
            {/* Operator Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 font-mono bg-slate-50 px-3 py-1 border border-slate-200 rounded-full">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Operator: Er. R. Sharma (Shift A)</span>
            </div>

            {/* VPP Live Sync Status Badge */}
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono rounded-full">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-slate-700">
                {isLiveBackend ? "Backend Live API" : "Mock Edge Mode"}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-600 font-semibold">{scenario}</span>
            </div>

            {/* Architecture Pitch Modal Trigger Button */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1 text-xs font-sans font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-full shadow-xs cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-slate-500" />
              <span>4-Tier Architecture</span>
            </button>
          </div>
        </div>

        {/* Enterprise SCADA Sub-Navigation Tab Strip */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 text-xs font-sans py-1.5">
            <button
              onClick={() => handleTabClick("sld", "sld-section")}
              className={`px-3.5 py-1.5 font-medium transition-all rounded-lg cursor-pointer ${
                activeTab === "sld"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Live SCADA SLD
            </button>

            <button
              onClick={() => handleTabClick("forecast", "forecast-section")}
              className={`px-3.5 py-1.5 font-medium transition-all rounded-lg cursor-pointer ${
                activeTab === "forecast"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              24h Forecasting
            </button>

            <button
              onClick={() => handleTabClick("bess", "bess-section")}
              className={`px-3.5 py-1.5 font-medium transition-all rounded-lg cursor-pointer ${
                activeTab === "bess"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              BESS Health
            </button>

            <button
              onClick={() => handleTabClick("tariff", "tariff-section")}
              className={`px-3.5 py-1.5 font-medium transition-all rounded-lg cursor-pointer ${
                activeTab === "tariff"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Daily Tariff Audit
            </button>
          </div>
        </div>
      </header>

      {/* 4-Tier Architecture Pitch Modal */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
    </>
  );
}
