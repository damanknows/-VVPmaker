"use client";

import { Campus, CurrentTelemetry, ScenarioPreset } from "@/types/telemetry";
import { BatteryCharging, Building2, CloudRain, CloudSun, IndianRupee, Leaf, Sun, Zap } from "lucide-react";

interface TelemetryBarProps {
  campuses: Campus[];
  selectedCampus: Campus;
  onSelectCampus: (campus: Campus) => void;
  scenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  telemetry: CurrentTelemetry;
}

export function TelemetryBar({
  campuses,
  selectedCampus,
  onSelectCampus,
  scenario,
  onSelectScenario,
  telemetry,
}: TelemetryBarProps) {
  // Calculate green energy percentage of total generation / demand
  const totalGreen = telemetry.solar_kw + telemetry.wind_kw;
  const greenShare = Math.min(
    100,
    Math.round((totalGreen / Math.max(1, telemetry.demand_kw)) * 100)
  );

  return (
    <div className="space-y-3">
      {/* Top Selector & SCADA Preset Bar */}
      <div className="scada-panel rounded-none p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Campus Selector */}
        <div className="flex items-center gap-2 font-mono">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium hidden md:inline">CAMPUS:</span>
          <select
            value={selectedCampus.id}
            onChange={(e) => {
              const matched = campuses.find((c) => c.id === e.target.value);
              if (matched) onSelectCampus(matched);
            }}
            className="rounded-none border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono text-white focus:border-slate-500 focus:outline-none transition-none cursor-pointer"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.solar_installed_kw}kW Solar)
              </option>
            ))}
          </select>
        </div>

        {/* SCADA Scenario Switcher Buttons */}
        <div className="flex items-center gap-1.5 font-mono overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden lg:inline">PRESETS:</span>

          {/* Sunny Peak Button */}
          <button
            onClick={() => onSelectScenario("SUNNY_PEAK")}
            className={`flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-mono border transition-none ${
              scenario === "SUNNY_PEAK"
                ? "border-amber-500 bg-amber-950/60 text-amber-300 font-bold"
                : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Sunny Peak</span>
            {scenario === "SUNNY_PEAK" && <span className="text-[10px] text-amber-400">[ACTIVE]</span>}
          </button>

          {/* Cloudy Afternoon Button */}
          <button
            onClick={() => onSelectScenario("CLOUDY_AFTERNOON")}
            className={`flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-mono border transition-none ${
              scenario === "CLOUDY_AFTERNOON"
                ? "border-cyan-500 bg-cyan-950/60 text-cyan-300 font-bold"
                : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Cloudy Dip</span>
            {scenario === "CLOUDY_AFTERNOON" && <span className="text-[10px] text-cyan-400">[ACTIVE]</span>}
          </button>

          {/* Windy Night Button */}
          <button
            onClick={() => onSelectScenario("WINDY_NIGHT")}
            className={`flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-mono border transition-none ${
              scenario === "WINDY_NIGHT"
                ? "border-indigo-500 bg-indigo-950/60 text-indigo-300 font-bold"
                : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>Windy Night</span>
            {scenario === "WINDY_NIGHT" && <span className="text-[10px] text-indigo-400">[ACTIVE]</span>}
          </button>
        </div>
      </div>

      {/* SCADA Blueprint KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 font-mono">
        {/* Metric 1: Campus Demand */}
        <div className="scada-panel rounded-none p-3 relative">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">Campus Load</span>
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{telemetry.demand_kw}</span>
            <span className="text-xs text-slate-400">kW</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Current demand across facility blocks
          </p>
        </div>

        {/* Metric 2: Green Energy Share */}
        <div className="scada-panel rounded-none p-3 relative">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">Green Share</span>
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">{greenShare}%</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            {totalGreen} kW clean generation
          </p>
        </div>

        {/* Metric 3: Battery SoC */}
        <div className="scada-panel rounded-none p-3 relative">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">Battery SoC</span>
            <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{telemetry.battery_soc}%</span>
            <span className="text-[10px] font-mono text-emerald-400">
              {telemetry.battery_power_kw > 0
                ? `+${telemetry.battery_power_kw} kW`
                : telemetry.battery_power_kw < 0
                ? `${telemetry.battery_power_kw} kW`
                : "Idle"}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            {telemetry.battery_power_kw > 0 ? "Charging from Solar" : telemetry.battery_power_kw < 0 ? "Discharging to Load" : "Standby Mode"}
          </p>
        </div>

        {/* Metric 4: Rupee Savings Today */}
        <div className="scada-panel rounded-none p-3 relative">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">Savings Today</span>
            <IndianRupee className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              ₹{telemetry.rupees_saved.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Avoided peak tariff charges
          </p>
        </div>

        {/* Metric 5: CO2 Offset */}
        <div className="col-span-2 sm:col-span-1 scada-panel rounded-none p-3 relative">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">CO₂ Avoided</span>
            <Leaf className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-cyan-400">{telemetry.co2_saved_kg}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Clean energy offset equivalent
          </p>
        </div>
      </div>
    </div>
  );
}
