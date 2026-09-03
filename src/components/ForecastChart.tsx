"use client";

import { ForecastItem } from "@/types/telemetry";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";

interface ForecastChartProps {
  forecast: ForecastItem[];
  currentHour: number;
  onHourChange: (hour: number | ((prev: number) => number)) => void;
}

export function ForecastChart({ forecast, currentHour, onHourChange }: ForecastChartProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play timer effect for simulation scrubber
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        onHourChange((prev: number) => (prev + 1) % 24);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onHourChange]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Chart Title Header & Scrubber Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              24-Hour Predictive Energy Forecast & Peak Tariff Overlay
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized AI generation curve vs campus demand profile
          </p>
        </div>

        {/* Play / Pause & Scrubber Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isPlaying
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Sim</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Auto-Play 24h</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onHourChange(14);
            }}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            title="Reset to 14:00"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts Composite Chart */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#f8fafc",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              formatter={(value: any, name: any) => [
                `${value} kW`,
                name === "solar_kw"
                  ? "Solar Gen"
                  : name === "wind_kw"
                  ? "Wind Gen"
                  : name === "demand_kw"
                  ? "Campus Load"
                  : name,
              ]}
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-slate-300 font-medium">
                  {value === "solar_kw"
                    ? "Solar (kW)"
                    : value === "wind_kw"
                    ? "Wind (kW)"
                    : value === "demand_kw"
                    ? "Campus Load (kW)"
                    : value}
                </span>
              )}
            />

            {/* Reference Area for Solar Surplus Window (11:00 to 15:00) */}
            <ReferenceArea
              x1="11:00"
              x2="15:00"
              fill="#10b981"
              fillOpacity={0.12}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: "Surplus Window",
                position: "insideTopLeft",
                fill: "#34d399",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Reference Area for Peak Tariff Hours (18:00 to 22:00) */}
            <ReferenceArea
              x1="18:00"
              x2="22:00"
              fill="#f59e0b"
              fillOpacity={0.15}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: "Peak Tariff (₹11.5/kWh)",
                position: "insideTopRight",
                fill: "#fbbf24",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Current Selected Hour Line */}
            <ReferenceArea
              x1={`${currentHour.toString().padStart(2, "0")}:00`}
              x2={`${currentHour.toString().padStart(2, "0")}:00`}
              stroke="#38bdf8"
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="solar_kw"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#solarGradient)"
              stackId="1"
            />

            <Area
              type="monotone"
              dataKey="wind_kw"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#windGradient)"
              stackId="1"
            />

            <Line
              type="monotone"
              dataKey="demand_kw"
              stroke="#818cf8"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#818cf8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Time Scrubber Slider */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span>Time Scrubber:</span>
            <span className="text-amber-400 font-mono text-sm">
              {`${currentHour.toString().padStart(2, "0")}:00`}
            </span>
          </span>
          <span className="text-slate-400 text-[11px]">
            Drag to step through 24h telemetry live
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={23}
          value={currentHour}
          onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>00:00</span>
          <span>06:00 (Dawn)</span>
          <span>12:00 (Solar Peak)</span>
          <span>18:00 (Peak Tariff Start)</span>
          <span>23:00</span>
        </div>
      </div>
    </div>
  );
}
