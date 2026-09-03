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
    <div className="scada-panel p-4 relative font-sans">
      {/* Visual Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-none" />
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              Electrical Single-Line Schematic Diagram (SLD) • Substation Bus Routing
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time power routing across Solar, Wind, Battery Storage & Campus Grid
          </p>
        </div>

        {/* SLD Bus Line Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300 bg-slate-900 px-3 py-1 border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-500 rounded-none" />
            <span>Solar String Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-sky-500 rounded-none" />
            <span>VAWT Turbine Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-emerald-500 rounded-none" />
            <span>400kWh BESS Rack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-slate-400 rounded-none" />
            <span>11kV Campus Feed</span>
          </div>
        </div>
      </div>

      {/* Industrial Substation Single-Line Diagram SLD Canvas */}
      <div className="relative min-h-[300px] w-full py-2">
        {/* Solid 2px Electrical Bus Lines with Junction Terminal Dots */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none stroke-slate-600"
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#d97706" />
            </marker>
            <marker
              id="arrow-sky"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284c7" />
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#16a34a" />
            </marker>
          </defs>

          {/* Solid 2px Electrical SLD Bus Lines */}
          {/* Path 1: Solar Incomer -> Main Bus */}
          <path
            d="M 180 55 L 260 55 L 260 150 L 340 150"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
            markerEnd="url(#arrow-amber)"
          />

          {/* Path 2: Wind Incomer -> Main Bus */}
          <path
            d="M 180 245 L 260 245 L 260 150 L 340 150"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            markerEnd="url(#arrow-sky)"
          />

          {/* Path 3: Battery Tie-Line -> Main Bus */}
          <path
            d="M 340 55 L 420 55 L 420 150 L 480 150"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            markerEnd="url(#arrow-emerald)"
          />

          {/* Path 4: 11kV Grid Incomer -> Main Bus */}
          <path
            d="M 340 245 L 420 245 L 420 150 L 480 150"
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
          />

          {/* T-Junction Terminal Dots */}
          <circle cx="260" cy="150" r="4" fill="#94a3b8" />
          <circle cx="420" cy="150" r="4" fill="#94a3b8" />
          <circle cx="340" cy="150" r="4" fill="#94a3b8" />
          <circle cx="480" cy="150" r="4" fill="#94a3b8" />
        </svg>

        {/* Substation PLC / MCC Panel Module Component Blocks */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 items-center my-auto">
          {/* Column 1: Solar & Wind MCC Modules */}
          <div className="space-y-4">
            {/* Module 1: Monocrystalline PV String */}
            <div
              className={`border p-3 bg-slate-900 ${
                isSolarActive ? "border-amber-600" : "border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center bg-slate-950 border border-slate-700 text-amber-500">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Solar Rooftop Array</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Monocrystalline PV String</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-amber-500">{telemetry.solar_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Direct Inverter Flow</span>
                <span className="text-amber-500 font-semibold">{isSolarActive ? "Active Generation" : "Idle (Night)"}</span>
              </div>
            </div>

            {/* Module 2: VAWT Micro-Turbine */}
            <div
              className={`border p-3 bg-slate-900 ${
                isWindActive ? "border-sky-600" : "border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center bg-slate-950 border border-slate-700 text-sky-400">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Wind Turbines</h3>
                    <p className="text-[10px] text-slate-400 font-mono">VAWT Micro-Turbine</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-sky-400">{telemetry.wind_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Microgrid Bus</span>
                <span className="text-sky-400 font-semibold">{isWindActive ? "Generating" : "Low Wind"}</span>
              </div>
            </div>
          </div>

          {/* Column 2: BESS Rack & 11kV Grid Incomer */}
          <div className="space-y-4">
            {/* Module 3: 400kWh LFP Rack */}
            <div
              className={`border p-3 bg-slate-900 ${
                isBatteryCharging || isBatteryDischarging
                  ? "border-emerald-600"
                  : "border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center bg-slate-950 border border-slate-700 text-emerald-500">
                    <BatteryCharging className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Battery Storage (BESS)</h3>
                    <p className="text-[10px] text-slate-400 font-mono">400kWh LFP Rack</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-500">{telemetry.battery_soc}%</span>
                  <span className="text-[10px] text-slate-400 block">SoC</span>
                </div>
              </div>

              {/* SCADA Technical Progress Meter Bar */}
              <div className="w-full bg-slate-950 border border-slate-800 h-2 my-2 p-0.5">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${telemetry.battery_soc}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>Power Flow</span>
                <span className={`font-mono font-semibold ${telemetry.battery_power_kw > 0 ? "text-emerald-500" : telemetry.battery_power_kw < 0 ? "text-sky-400" : "text-slate-400"}`}>
                  {telemetry.battery_power_kw > 0
                    ? `+${telemetry.battery_power_kw} kW (Charging)`
                    : telemetry.battery_power_kw < 0
                    ? `${telemetry.battery_power_kw} kW (Discharging)`
                    : "Standby (0 kW)"}
                </span>
              </div>
            </div>

            {/* Module 4: 11kV Substation Incomer */}
            <div className={`border p-3 bg-slate-900 ${
              isGridImporting
                ? "border-orange-600"
                : isGridExporting
                ? "border-amber-600"
                : "border-slate-700"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center bg-slate-950 border border-slate-700 text-orange-500">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Main Utility Grid</h3>
                    <p className="text-[10px] text-slate-400 font-mono">11kV Substation Incomer</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-orange-500">
                    {telemetry.grid_import_kw > 0 ? telemetry.grid_import_kw : telemetry.grid_export_kw}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                <span>Grid Status</span>
                <span className="text-orange-500 font-semibold">
                  {telemetry.grid_import_kw > 0
                    ? "Importing from Utility"
                    : telemetry.grid_export_kw > 0
                    ? "Exporting Clean Surplus"
                    : "Zero Grid Draw (Self-Sufficient)"}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Main Campus Load Substation Feeder Block */}
          <div>
            <div className="border border-slate-600 bg-slate-900 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center bg-slate-950 border border-slate-700 text-slate-200">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">Main Campus Total Load</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Hostels, Labs & Workshops</p>
                </div>
              </div>

              <div className="my-3 text-center bg-slate-950 p-3 border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5 font-sans">Instantaneous Power Consumed</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white font-mono">{telemetry.demand_kw}</span>
                  <span className="text-xs text-slate-400 font-mono">kW</span>
                </div>
              </div>

              {/* Sub-breakdown */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Clean Self-Sufficiency</span>
                  <span className="font-bold text-emerald-500">
                    {Math.min(100, Math.round(((telemetry.solar_kw + telemetry.wind_kw + Math.max(0, -telemetry.battery_power_kw)) / telemetry.demand_kw) * 100))}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Microgrid Bus Freq</span>
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
