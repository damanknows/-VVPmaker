"use client";

import { CurrentTelemetry } from "@/types/telemetry";
import { BatteryCharging, Building2, Sun, Wind, Zap } from "lucide-react";

interface EnergyFlowHeroProps {
  telemetry: CurrentTelemetry;
}

export function EnergyFlowHero({ telemetry }: EnergyFlowHeroProps) {
  const isSolarActive = telemetry.solar_kw > 0;
  const isWindActive = telemetry.wind_kw > 0;
  const isBatteryCharging = telemetry.battery_power_kw > 0;
  const isBatteryDischarging = telemetry.battery_power_kw < 0;
  const isGridImporting = telemetry.grid_import_kw > 0;
  const isGridExporting = telemetry.grid_export_kw > 0;

  return (
    <div className="scada-panel rounded-none p-4 relative font-mono">
      {/* Visual Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-none" />
            <h2 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
              SCADA Single-Line Diagram (SLD) • Microgrid Power Routing
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Real-time power routing across Solar, Wind, Battery Storage & Campus Grid
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-400 rounded-none" />
            <span>Solar Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-cyan-400 rounded-none" />
            <span>Wind Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-emerald-400 rounded-none" />
            <span>BESS Battery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-indigo-400 rounded-none" />
            <span>Campus Load</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Graph Diagram - Single-Line Diagram SLD */}
      <div className="relative min-h-[300px] w-full py-2">
        {/* SVG Orthogonal 90-Degree SLD Bus Lines with Arrowheads */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none stroke-slate-700"
          style={{ zIndex: 0 }}
        >
          <defs>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Orthogonal 90-Degree Stepped SLD Bus Paths */}
          {/* Path 1: Solar -> Central Bus */}
          <path
            d="M 180 55 L 260 55 L 260 150 L 340 150"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            markerEnd="url(#arrow-amber)"
            className="opacity-75"
          />

          {/* Path 2: Wind -> Central Bus */}
          <path
            d="M 180 245 L 260 245 L 260 150 L 340 150"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            markerEnd="url(#arrow-cyan)"
            className="opacity-75"
          />

          {/* Path 3: Battery -> Bus */}
          <path
            d="M 340 55 L 420 55 L 420 150 L 480 150"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            markerEnd="url(#arrow-emerald)"
            className="opacity-75"
          />

          {/* Path 4: Grid -> Bus */}
          <path
            d="M 340 245 L 420 245 L 420 150 L 480 150"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className="opacity-75"
          />
        </svg>

        {/* 5 Core Visual Schematic Nodes */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 items-center my-auto font-mono">
          {/* Column 1: Renewable Generation Schematic Blocks */}
          <div className="space-y-4">
            {/* Node 1: Solar Array Block */}
            <div
              className={`rounded-none border p-3 bg-slate-900 ${
                isSolarActive ? "border-amber-500/60" : "border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-slate-950 border border-slate-700 text-amber-400">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Solar Rooftop Array</h3>
                    <p className="text-[10px] text-slate-400">Monocrystalline PERC</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400">{telemetry.solar_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Direct Inverter Flow</span>
                <span className="text-amber-400">{isSolarActive ? "Active Generation" : "Idle (Night)"}</span>
              </div>
            </div>

            {/* Node 2: Wind Turbine Block */}
            <div
              className={`rounded-none border p-3 bg-slate-900 ${
                isWindActive ? "border-cyan-500/60" : "border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-slate-950 border border-slate-700 text-cyan-400">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Wind Turbines</h3>
                    <p className="text-[10px] text-slate-400">Vertical Axis Micro-wind</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-cyan-400">{telemetry.wind_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Microgrid Bus</span>
                <span className="text-cyan-400">{isWindActive ? "Generating" : "Low Wind"}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Storage & Grid Blocks */}
          <div className="space-y-4">
            {/* Node 3: Battery BESS Storage Block */}
            <div
              className={`rounded-none border p-3 bg-slate-900 ${
                isBatteryCharging || isBatteryDischarging
                  ? "border-emerald-500/60"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-slate-950 border border-slate-700 text-emerald-400">
                    <BatteryCharging className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Battery Storage (BESS)</h3>
                    <p className="text-[10px] text-slate-400">LFP 400kWh Battery Bank</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{telemetry.battery_soc}%</span>
                  <span className="text-[10px] text-slate-400 block">SoC</span>
                </div>
              </div>

              {/* Precise SCADA Meter Bar */}
              <div className="w-full bg-slate-950 border border-slate-800 h-2 rounded-none my-2 p-0.5">
                <div
                  className="h-full bg-emerald-500 rounded-none transition-all duration-300"
                  style={{ width: `${telemetry.battery_soc}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Power Flow</span>
                <span className={`font-mono ${telemetry.battery_power_kw > 0 ? "text-emerald-400" : telemetry.battery_power_kw < 0 ? "text-teal-400" : "text-slate-400"}`}>
                  {telemetry.battery_power_kw > 0
                    ? `+${telemetry.battery_power_kw} kW (Charging)`
                    : telemetry.battery_power_kw < 0
                    ? `${telemetry.battery_power_kw} kW (Discharging)`
                    : "Standby (0 kW)"}
                </span>
              </div>
            </div>

            {/* Node 4: Main Utility Grid Block */}
            <div className={`rounded-none border p-3 bg-slate-900 ${
              isGridImporting
                ? "border-orange-500/60"
                : isGridExporting
                ? "border-amber-500/60"
                : "border-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-slate-950 border border-slate-700 text-orange-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Main Utility Grid</h3>
                    <p className="text-[10px] text-slate-400">JVVNL 11kV Substation</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-orange-400">
                    {telemetry.grid_import_kw > 0 ? telemetry.grid_import_kw : telemetry.grid_export_kw}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Grid Status</span>
                <span className="text-orange-400">
                  {telemetry.grid_import_kw > 0
                    ? "Importing from Utility"
                    : telemetry.grid_export_kw > 0
                    ? "Exporting Clean Surplus"
                    : "Zero Grid Draw (Self-Sufficient)"}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Main Campus Load Block */}
          <div>
            <div className="rounded-none border border-indigo-500/60 bg-slate-900 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-none bg-slate-950 border border-indigo-500/40 text-indigo-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">Main Campus Total Load</h3>
                  <p className="text-[10px] text-indigo-300">Hostels, Labs & Workshops</p>
                </div>
              </div>

              <div className="my-3 text-center bg-slate-950 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Instantaneous Power Consumed</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white font-mono">{telemetry.demand_kw}</span>
                  <span className="text-xs text-indigo-400 font-mono">kW</span>
                </div>
              </div>

              {/* Sub-breakdown */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Clean Self-Sufficiency</span>
                  <span className="font-bold text-emerald-400">
                    {Math.min(100, Math.round(((telemetry.solar_kw + telemetry.wind_kw + Math.max(0, -telemetry.battery_power_kw)) / telemetry.demand_kw) * 100))}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Microgrid Bus Freq</span>
                  <span className="text-slate-200">50.02 Hz (Stable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
