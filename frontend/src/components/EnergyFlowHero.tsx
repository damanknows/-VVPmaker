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
    <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 shadow-xs font-sans">
      {/* Visual Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-mono">
              Electrical Single-Line Schematic Diagram (SLD) • Substation Bus Routing
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time power routing across Solar, Wind, Battery Storage & Campus Grid
          </p>
        </div>

        {/* SLD Bus Line Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 bg-white px-3.5 py-1.5 border border-slate-200 rounded-full shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-500 rounded-full" />
            <span>Solar String Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-sky-500 rounded-full" />
            <span>VAWT Turbine Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-emerald-500 rounded-full" />
            <span>400kWh BESS Rack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-slate-400 rounded-full" />
            <span>11kV Campus Feed</span>
          </div>
        </div>
      </div>

      {/* Modern Light SaaS Substation Single-Line Diagram SLD Canvas */}
      <div className="relative min-h-[300px] w-full py-2">
        {/* Solid 2px Electrical Bus Lines with Junction Terminal Dots */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none stroke-slate-300"
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Solid 2px Electrical SLD Bus Lines */}
          {/* Path 1: Solar Incomer -> Main Bus */}
          <path
            d="M 180 55 L 260 55 L 260 150 L 340 150"
            fill="none"
            stroke="#f59e0b"
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
            stroke="#10b981"
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

        {/* Substation Pure White Module Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 items-center my-auto">
          {/* Column 1: Solar & Wind Generation Blocks */}
          <div className="space-y-4">
            {/* Module 1: Monocrystalline PV String */}
            <div
              className={`bg-white border p-4 rounded-xl shadow-xs hover:shadow-md transition-all ${
                isSolarActive ? "border-amber-300 ring-1 ring-amber-400/30" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs">Solar Rooftop Array</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Monocrystalline PV String</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-bold text-amber-600">{telemetry.solar_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
                <span>Direct Inverter Flow</span>
                <span className="text-amber-600 font-semibold">{isSolarActive ? "Active Generation" : "Idle (Night)"}</span>
              </div>
            </div>

            {/* Module 2: VAWT Micro-Turbine */}
            <div
              className={`bg-white border p-4 rounded-xl shadow-xs hover:shadow-md transition-all ${
                isWindActive ? "border-sky-300 ring-1 ring-sky-400/30" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-100 text-sky-600">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs">Wind Turbines</h3>
                    <p className="text-[10px] text-slate-500 font-mono">VAWT Micro-Turbine</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-bold text-sky-600">{telemetry.wind_kw}</span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
                <span>Microgrid Bus</span>
                <span className="text-sky-600 font-semibold">{isWindActive ? "Generating" : "Low Wind"}</span>
              </div>
            </div>
          </div>

          {/* Column 2: BESS Storage & Main Utility Grid */}
          <div className="space-y-4">
            {/* Module 3: 400kWh LFP Rack */}
            <div
              className={`bg-white border p-4 rounded-xl shadow-xs hover:shadow-md transition-all ${
                isBatteryCharging || isBatteryDischarging
                  ? "border-emerald-300 ring-1 ring-emerald-400/30"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <BatteryCharging className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs">Battery Storage (BESS)</h3>
                    <p className="text-[10px] text-slate-500 font-mono">400kWh LFP Rack</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-bold text-emerald-600">{telemetry.battery_soc}%</span>
                  <span className="text-[10px] text-slate-400 block">SoC</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-full my-2.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${telemetry.battery_soc}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                <span>Power Flow</span>
                <span className={`font-mono font-semibold ${telemetry.battery_power_kw > 0 ? "text-emerald-600" : telemetry.battery_power_kw < 0 ? "text-sky-600" : "text-slate-500"}`}>
                  {telemetry.battery_power_kw > 0
                    ? `+${telemetry.battery_power_kw} kW (Charging)`
                    : telemetry.battery_power_kw < 0
                    ? `${telemetry.battery_power_kw} kW (Discharging)`
                    : "Standby (0 kW)"}
                </span>
              </div>
            </div>

            {/* Module 4: 11kV Substation Incomer */}
            <div className={`bg-white border p-4 rounded-xl shadow-xs hover:shadow-md transition-all ${
              isGridImporting
                ? "border-orange-300 ring-1 ring-orange-400/30"
                : isGridExporting
                ? "border-amber-300 ring-1 ring-amber-400/30"
                : "border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 border border-orange-100 text-orange-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xs">Main Utility Grid</h3>
                    <p className="text-[10px] text-slate-500 font-mono">11kV Substation Incomer</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-bold text-orange-600">
                    {telemetry.grid_import_kw > 0 ? telemetry.grid_import_kw : telemetry.grid_export_kw}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kW</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
                <span>Grid Status</span>
                <span className="text-orange-600 font-semibold">
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
            <div className="bg-white border border-blue-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all ring-1 ring-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs">Main Campus Total Load</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Hostels, Labs & Workshops</p>
                </div>
              </div>

              <div className="my-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono">
                <span className="text-[10px] text-slate-500 block mb-0.5 font-sans font-medium">Instantaneous Power Consumed</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-slate-900 font-mono">{telemetry.demand_kw}</span>
                  <span className="text-xs text-blue-600 font-mono font-semibold">kW</span>
                </div>
              </div>

              {/* Sub-breakdown */}
              <div className="space-y-2 text-xs font-mono pt-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 font-sans">Clean Self-Sufficiency</span>
                  <span className="font-bold text-emerald-600">
                    {Math.min(100, Math.round(((telemetry.solar_kw + telemetry.wind_kw + Math.max(0, -telemetry.battery_power_kw)) / telemetry.demand_kw) * 100))}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 font-sans">Microgrid Bus Freq</span>
                  <span className="text-slate-800 font-semibold">50.02 Hz (Stable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
