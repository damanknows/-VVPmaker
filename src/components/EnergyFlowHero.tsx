"use client";

import { CurrentTelemetry } from "@/types/telemetry";
import { motion } from "framer-motion";
import { ArrowRightLeft, BatteryCharging, Building2, Sun, Wind, Zap } from "lucide-react";

interface EnergyFlowHeroProps {
  telemetry: CurrentTelemetry;
}

export function EnergyFlowHero({ telemetry }: EnergyFlowHeroProps) {
  // Determine flow speeds and active states based on current kW values
  const isSolarActive = telemetry.solar_kw > 0;
  const isWindActive = telemetry.wind_kw > 0;
  const isBatteryCharging = telemetry.battery_power_kw > 0;
  const isBatteryDischarging = telemetry.battery_power_kw < 0;
  const isGridImporting = telemetry.grid_import_kw > 0;
  const isGridExporting = telemetry.grid_export_kw > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl">
      {/* Visual Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Live Microgrid Energy Flow Visualizer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time power routing across Solar, Wind, Battery Storage & Campus Grid
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Solar</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Wind</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>BESS Battery</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span>Campus Load</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Graph Diagram */}
      <div className="relative min-h-[320px] w-full flex flex-col justify-between py-2">
        {/* SVG Flow Connecting Lines with Framer Motion Particles */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none stroke-slate-800"
          style={{ zIndex: 0 }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="solarToLoad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="windToLoad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="batteryFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="gridFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Lines connecting left nodes to central/right load node */}
          {/* Path 1: Solar to Center */}
          <path d="M 160 60 C 260 60, 320 160, 480 160" fill="none" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />
          
          {/* Path 2: Wind to Center */}
          <path d="M 160 260 C 260 260, 320 160, 480 160" fill="none" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />

          {/* Path 3: Battery to Center */}
          <path d="M 320 60 C 380 60, 420 160, 480 160" fill="none" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />

          {/* Path 4: Grid to Center */}
          <path d="M 320 260 C 380 260, 420 160, 480 160" fill="none" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />
        </svg>

        {/* 5 Core Visual Nodes Grid */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 items-center my-auto">
          {/* Column 1: Renewable Sources (Solar & Wind) */}
          <div className="space-y-4">
            {/* Node 1: Solar Array */}
            <motion.div
              animate={{ scale: isSolarActive ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 3 }}
              className={`group relative rounded-xl border p-4 transition-all ${
                isSolarActive
                  ? "border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Sun className="h-5 w-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Solar Rooftop Array</h3>
                    <p className="text-[11px] text-slate-400">Monocrystalline PERC</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-amber-400">{telemetry.solar_kw}</span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Direct Inverter Flow</span>
                <span className="font-mono text-amber-400">{isSolarActive ? "Active Generation" : "Idle (Night)"}</span>
              </div>
            </motion.div>

            {/* Node 2: Wind Turbine */}
            <motion.div
              animate={{ scale: isWindActive ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 4 }}
              className={`group relative rounded-xl border p-4 transition-all ${
                isWindActive
                  ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Wind className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Wind Turbines</h3>
                    <p className="text-[11px] text-slate-400">Vertical Axis Micro-wind</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-cyan-400">{telemetry.wind_kw}</span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Microgrid Bus</span>
                <span className="font-mono text-cyan-400">{isWindActive ? "Generating" : "Low Wind"}</span>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Storage & Grid (Battery & Main Grid) */}
          <div className="space-y-4">
            {/* Node 3: Battery BESS Storage */}
            <motion.div
              animate={{ scale: isBatteryCharging || isBatteryDischarging ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className={`group relative rounded-xl border p-4 transition-all ${
                isBatteryCharging
                  ? "border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                  : isBatteryDischarging
                  ? "border-teal-500/40 bg-teal-500/10 shadow-lg shadow-teal-500/10"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <BatteryCharging className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Battery Storage (BESS)</h3>
                    <p className="text-[11px] text-slate-400">LFP 400kWh Battery Bank</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-emerald-400">{telemetry.battery_soc}%</span>
                  <span className="text-xs text-slate-400 block font-mono">SoC</span>
                </div>
              </div>

              {/* Progress Bar for SoC */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${telemetry.battery_soc}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Power Flow</span>
                <span className={`font-semibold font-mono ${telemetry.battery_power_kw > 0 ? "text-emerald-400" : telemetry.battery_power_kw < 0 ? "text-teal-400" : "text-slate-400"}`}>
                  {telemetry.battery_power_kw > 0
                    ? `+${telemetry.battery_power_kw} kW (Charging)`
                    : telemetry.battery_power_kw < 0
                    ? `${telemetry.battery_power_kw} kW (Discharging)`
                    : "Standby (0 kW)"}
                </span>
              </div>
            </motion.div>

            {/* Node 4: Main Campus Grid */}
            <div className={`group relative rounded-xl border p-4 transition-all ${
              isGridImporting
                ? "border-orange-500/40 bg-orange-500/10"
                : isGridExporting
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-slate-800 bg-slate-900/60"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Main Utility Grid</h3>
                    <p className="text-[11px] text-slate-400">JVVNL 11kV Substation</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-orange-400">
                    {telemetry.grid_import_kw > 0 ? telemetry.grid_import_kw : telemetry.grid_export_kw}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Grid Status</span>
                <span className="font-mono text-orange-400">
                  {telemetry.grid_import_kw > 0
                    ? "Importing from Utility"
                    : telemetry.grid_export_kw > 0
                    ? "Exporting Clean Surplus"
                    : "Zero Grid Draw (Self-Sufficient)"}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Main Campus Load */}
          <div>
            <motion.div
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="relative rounded-2xl border border-indigo-500/50 bg-gradient-to-br from-indigo-950/80 to-slate-900/90 p-5 shadow-2xl shadow-indigo-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Main Campus Total Load</h3>
                  <p className="text-xs text-indigo-300/80">Hostels, Labs & Workshops</p>
                </div>
              </div>

              <div className="my-4 text-center rounded-xl bg-slate-950/80 p-4 border border-indigo-500/20">
                <span className="text-xs font-medium text-slate-400 block mb-1">Instantaneous Power Consumed</span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{telemetry.demand_kw}</span>
                  <span className="text-sm font-semibold text-indigo-400">kW</span>
                </div>
              </div>

              {/* Sub-breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Clean Self-Sufficiency</span>
                  <span className="font-semibold text-emerald-400">
                    {Math.min(100, Math.round(((telemetry.solar_kw + telemetry.wind_kw + Math.max(0, -telemetry.battery_power_kw)) / telemetry.demand_kw) * 100))}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Microgrid Bus Freq</span>
                  <span className="font-mono text-slate-200">50.02 Hz (Stable)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
