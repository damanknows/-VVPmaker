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
    <div className="space-y-4">
      {/* Top Selector & Preset Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-md">
        {/* Campus Selector */}
        <div className="flex items-center gap-2.5">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Campus:</span>
          <select
            value={selectedCampus.id}
            onChange={(e) => {
              const matched = campuses.find((c) => c.id === e.target.value);
              if (matched) onSelectCampus(matched);
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.solar_installed_kw}kW Solar)
              </option>
            ))}
          </select>
        </div>

        {/* Demo Scenario Switcher Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden lg:inline">Presets:</span>

          {/* Sunny Peak Button */}
          <button
            onClick={() => onSelectScenario("SUNNY_PEAK")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              scenario === "SUNNY_PEAK"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-500/50 hover:text-amber-400"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Sunny Peak</span>
          </button>

          {/* Cloudy Afternoon Button */}
          <button
            onClick={() => onSelectScenario("CLOUDY_AFTERNOON")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              scenario === "CLOUDY_AFTERNOON"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Cloudy Dip</span>
          </button>

          {/* Windy Night Button */}
          <button
            onClick={() => onSelectScenario("WINDY_NIGHT")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              scenario === "WINDY_NIGHT"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400"
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>Windy Night</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Metric 1: Campus Demand */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Campus Load</span>
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white">{telemetry.demand_kw}</span>
            <span className="text-xs font-semibold text-slate-400">kW</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Current demand across facility blocks
          </p>
        </div>

        {/* Metric 2: Green Energy Share */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Green Share</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-emerald-400">{greenShare}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {totalGreen} kW clean generation
          </p>
        </div>

        {/* Metric 3: Battery SoC */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Battery SoC</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">{telemetry.battery_soc}%</span>
            <span className="text-[11px] font-mono text-emerald-400">
              {telemetry.battery_power_kw > 0
                ? `+${telemetry.battery_power_kw} kW`
                : telemetry.battery_power_kw < 0
                ? `${telemetry.battery_power_kw} kW`
                : "Idle"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {telemetry.battery_power_kw > 0 ? "Charging from Solar" : telemetry.battery_power_kw < 0 ? "Discharging to Load" : "Standby Mode"}
          </p>
        </div>

        {/* Metric 4: Rupee Savings Today */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Savings Today</span>
            <IndianRupee className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-amber-400">
              ₹{telemetry.rupees_saved.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Avoided peak tariff charges
          </p>
        </div>

        {/* Metric 5: CO2 Offset */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">CO₂ Avoided</span>
            <Leaf className="h-4 w-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-teal-300">{telemetry.co2_saved_kg}</span>
            <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Clean energy offset equivalent
          </p>
        </div>
      </div>
    </div>
  );
}
