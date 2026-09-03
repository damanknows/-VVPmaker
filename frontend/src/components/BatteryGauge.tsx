"use client";

import { BatteryCharging } from "lucide-react";

interface BatteryGaugeProps {
  soc: number; // 0 - 100
  powerKw: number; // positive = charging, negative = discharging
  capacityKwh?: number;
}

export function BatteryGauge({ soc, powerKw, capacityKwh = 400 }: BatteryGaugeProps) {
  // Determine color shift based on SoC percentage
  const getSocColor = (soc: number) => {
    if (soc < 20) return { text: "text-red-600", bg: "bg-red-500", border: "border-red-200", badgeBg: "bg-red-50" };
    if (soc <= 50) return { text: "text-amber-600", bg: "bg-amber-500", border: "border-amber-200", badgeBg: "bg-amber-50" };
    return { text: "text-emerald-600", bg: "bg-emerald-500", border: "border-emerald-200", badgeBg: "bg-emerald-50" };
  };

  const colors = getSocColor(soc);
  const storedEnergyKwh = Math.round((capacityKwh * soc) / 100);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all font-sans flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${colors.badgeBg} border ${colors.border}`}>
              <BatteryCharging className={`h-4 w-4 ${colors.text}`} />
            </div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">BESS Battery Gauge</h3>
          </div>
          <span className={`text-xs font-bold font-mono px-2.5 py-0.5 border ${colors.border} ${colors.text} ${colors.badgeBg} rounded-full`}>
            {soc}% Charged
          </span>
        </div>

        {/* Enterprise SCADA Radial Ring Meter */}
        <div className="relative my-4 flex items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-100"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Active SoC Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-500 stroke-current ${colors.text}`}
              strokeWidth="7"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * soc) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{soc}%</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">{storedEnergyKwh} / {capacityKwh} kWh</span>
          </div>
        </div>
      </div>

      {/* Bottom Power Flow Details */}
      <div className="space-y-2 border border-slate-200/80 bg-slate-50 p-3 rounded-xl text-xs font-sans">
        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500 font-medium">Current Mode</span>
          <span className={`font-bold font-mono ${colors.text}`}>
            {powerKw > 0 ? "Charging (+kW)" : powerKw < 0 ? "Discharging (-kW)" : "Standby"}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500 font-medium">Rate</span>
          <span className="font-bold text-slate-900 font-mono">
            {Math.abs(powerKw)} kW
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500 font-medium">Health (SoH)</span>
          <span className="text-emerald-600 font-bold font-mono">98.4% (Optimal)</span>
        </div>
      </div>
    </div>
  );
}
