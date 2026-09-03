"use client";

import { BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, Sparkles, Zap } from "lucide-react";

interface BatteryGaugeProps {
  soc: number; // 0 - 100
  powerKw: number; // positive = charging, negative = discharging
  capacityKwh?: number;
}

export function BatteryGauge({ soc, powerKw, capacityKwh = 400 }: BatteryGaugeProps) {
  // Determine color shift based on SoC percentage
  const getSocColor = (soc: number) => {
    if (soc < 20) return { text: "text-red-400", bg: "bg-red-500", border: "border-red-500/30", glow: "shadow-red-500/20" };
    if (soc <= 50) return { text: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30", glow: "shadow-amber-500/20" };
    return { text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" };
  };

  const colors = getSocColor(soc);
  const storedEnergyKwh = Math.round((capacityKwh * soc) / 100);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BatteryCharging className={`h-5 w-5 ${colors.text}`} />
            <h3 className="font-bold text-white text-sm">BESS Battery Gauge</h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.border} ${colors.text} bg-slate-900`}>
            {soc}% Charged
          </span>
        </div>

        {/* Radial Meter Visual */}
        <div className="relative my-4 flex items-center justify-center">
          <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Active SoC Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-700 stroke-current ${colors.text}`}
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * soc) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{soc}%</span>
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">{storedEnergyKwh} / {capacityKwh} kWh</span>
          </div>
        </div>
      </div>

      {/* Bottom Power Flow Details */}
      <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Current Mode</span>
          <span className={`font-semibold font-mono ${colors.text}`}>
            {powerKw > 0 ? "Charging (+kW)" : powerKw < 0 ? "Discharging (-kW)" : "Standby"}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Rate</span>
          <span className="font-semibold text-white font-mono">
            {Math.abs(powerKw)} kW
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Health (SoH)</span>
          <span className="font-semibold text-emerald-400">98.4% (Optimal)</span>
        </div>
      </div>
    </div>
  );
}
