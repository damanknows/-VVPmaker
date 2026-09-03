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
    if (soc < 20) return { text: "text-red-400", bg: "bg-red-500", border: "border-red-500/60" };
    if (soc <= 50) return { text: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/60" };
    return { text: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/60" };
  };

  const colors = getSocColor(soc);
  const storedEnergyKwh = Math.round((capacityKwh * soc) / 100);

  return (
    <div className="scada-panel rounded-none p-4 font-mono flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BatteryCharging className={`h-4 w-4 ${colors.text}`} />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">BESS Battery Gauge</h3>
          </div>
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${colors.border} ${colors.text} bg-zinc-950`}>
            {soc}% Charged
          </span>
        </div>

        {/* SCADA Technical Radial Ring Meter */}
        <div className="relative my-3 flex items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-zinc-800"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active SoC Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-500 stroke-current ${colors.text}`}
              strokeWidth="6"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * soc) / 100}
              strokeLinecap="square"
              fill="transparent"
            />
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
            <span className="text-2xl font-bold text-white tracking-tight">{soc}%</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">{storedEnergyKwh} / {capacityKwh} kWh</span>
          </div>
        </div>
      </div>

      {/* Bottom Power Flow Details */}
      <div className="space-y-1.5 rounded-none border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-mono">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-400">Current Mode</span>
          <span className={`font-bold ${colors.text}`}>
            {powerKw > 0 ? "Charging (+kW)" : powerKw < 0 ? "Discharging (-kW)" : "Standby"}
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-400">Rate</span>
          <span className="font-bold text-white">
            {Math.abs(powerKw)} kW
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-400">Health (SoH)</span>
          <span className="text-emerald-500">98.4% (Optimal)</span>
        </div>
      </div>
    </div>
  );
}
