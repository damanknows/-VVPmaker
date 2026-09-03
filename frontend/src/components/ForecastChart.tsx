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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all font-sans space-y-4">
      {/* Chart Title Header & Scrubber Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-mono">
              24-Hour Predictive Energy Forecast & Peak Tariff Overlay
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Synchronized AI generation curve vs campus demand profile
          </p>
        </div>

        {/* Play / Pause & Scrubber Actions */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-xl transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 text-white font-semibold shadow-xs hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
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
            className="flex items-center gap-1 border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-sans text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
            title="Reset to 14:00"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts Composite Chart */}
      <div className="h-[270px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={true} fontFamily="monospace" />
            <YAxis stroke="#64748b" fontSize={10} tickLine={true} fontFamily="monospace" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                fontSize: "11px",
                color: "#0f172a",
                fontFamily: "monospace",
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
              height={32}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-slate-700 font-sans font-medium">
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
              fillOpacity={0.1}
              stroke="#10b981"
              strokeDasharray="2 2"
              label={{
                value: "Surplus Window",
                position: "insideTopLeft",
                fill: "#059669",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "sans-serif",
              }}
            />

            {/* Reference Area for Peak Tariff Hours (18:00 to 22:00) */}
            <ReferenceArea
              x1="18:00"
              x2="22:00"
              fill="#f59e0b"
              fillOpacity={0.12}
              stroke="#f59e0b"
              strokeDasharray="2 2"
              label={{
                value: "Peak Tariff (₹11.5/kWh)",
                position: "insideTopRight",
                fill: "#d97706",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "sans-serif",
              }}
            />

            {/* Current Selected Hour Line */}
            <ReferenceArea
              x1={`${currentHour.toString().padStart(2, "0")}:00`}
              x2={`${currentHour.toString().padStart(2, "0")}:00`}
              stroke="#2563eb"
              strokeWidth={2}
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
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#windGradient)"
              stackId="1"
            />

            <Line
              type="monotone"
              dataKey="demand_kw"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#2563eb" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Light SaaS Timeline Scrubber Container */}
      <div className="border border-slate-200/80 bg-slate-50 p-3.5 rounded-xl space-y-2 font-sans">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-700 font-medium flex items-center gap-1.5">
            <span>Time Scrubber:</span>
            <span className="text-blue-600 font-mono font-bold text-sm">
              {`${currentHour.toString().padStart(2, "0")}:00`}
            </span>
          </span>
          <span className="text-slate-500 text-xs">
            Step through 24h SCADA telemetry
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={23}
          value={currentHour}
          onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
        />

        {/* Industrial Time Markings */}
        <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1 font-medium">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>
    </div>
  );
}
