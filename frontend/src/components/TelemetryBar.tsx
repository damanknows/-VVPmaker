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
    <div className="space-y-4 font-sans">
      {/* Top Selector & Industrial Segmented Preset Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Campus Selector */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider hidden md:inline">Campus:</span>
          <select
            value={selectedCampus.id}
            onChange={(e) => {
              const matched = campuses.find((c) => c.id === e.target.value);
              if (matched) onSelectCampus(matched);
            }}
            className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer font-medium"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.solar_installed_kw}kW Solar)
              </option>
            ))}
          </select>
        </div>

        {/* Modern Light SaaS Segmented Push Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70 overflow-x-auto">
          <span className="text-xs text-slate-500 font-medium px-2.5 hidden lg:inline">Scenarios:</span>

          {/* Sunny Peak Button */}
          <button
            onClick={() => onSelectScenario("SUNNY_PEAK")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              scenario === "SUNNY_PEAK"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Sunny Peak</span>
          </button>

          {/* Cloudy Afternoon Button */}
          <button
            onClick={() => onSelectScenario("CLOUDY_AFTERNOON")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              scenario === "CLOUDY_AFTERNOON"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Cloudy Dip</span>
          </button>

          {/* Windy Night Button */}
          <button
            onClick={() => onSelectScenario("WINDY_NIGHT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              scenario === "WINDY_NIGHT"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>Windy Night</span>
          </button>
        </div>
      </div>

      {/* Modern Light SaaS KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Metric 1: Campus Load */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Campus Load</span>
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">{telemetry.demand_kw}</span>
            <span className="text-xs text-slate-500 font-mono">kW</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Current demand across facility blocks
          </p>
        </div>

        {/* Metric 2: Green Energy Share */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Green Share</span>
            <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-600">{greenShare}%</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 font-mono">
            {totalGreen} kW clean generation
          </p>
        </div>

        {/* Metric 3: Battery SoC */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Battery SoC</span>
            <div className="p-2 bg-cyan-50 border border-cyan-100 rounded-xl text-cyan-600">
              <BatteryCharging className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{telemetry.battery_soc}%</span>
            <span className="text-[11px] font-mono font-semibold text-cyan-600">
              {telemetry.battery_power_kw > 0
                ? `+${telemetry.battery_power_kw} kW`
                : telemetry.battery_power_kw < 0
                ? `${telemetry.battery_power_kw} kW`
                : "Idle"}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {telemetry.battery_power_kw > 0 ? "Charging from Solar" : telemetry.battery_power_kw < 0 ? "Discharging to Load" : "Standby Mode"}
          </p>
        </div>

        {/* Metric 4: Rupee Savings Today */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Savings Today</span>
            <div className="p-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-600">
              ₹{telemetry.rupees_saved.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Avoided peak tariff charges
          </p>
        </div>

        {/* Metric 5: CO2 Offset */}
        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">CO₂ Avoided</span>
            <div className="p-2 bg-green-50 border border-green-100 rounded-xl text-green-600">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-green-600">{telemetry.co2_saved_kg}</span>
            <span className="text-xs text-slate-500 font-mono">kg</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Clean energy offset equivalent
          </p>
        </div>
      </div>
    </div>
  );
}
