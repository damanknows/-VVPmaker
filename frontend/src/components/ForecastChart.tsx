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
    <div className="scada-panel p-4 space-y-3">
      {/* Chart Title Header & Scrubber Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-400" />
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              24-Hour Predictive Energy Forecast & Peak Tariff Overlay
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Synchronized AI generation curve vs campus demand profile
          </p>
        </div>

        {/* Play / Pause & Scrubber Actions */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono border transition-none cursor-pointer ${
              isPlaying
                ? "border-amber-600 bg-amber-950 text-amber-500 font-bold"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
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
            className="flex items-center gap-1 border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono text-slate-400 hover:text-white transition-none cursor-pointer"
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
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 2" stroke="#334155" vertical={true} />
            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={true} fontFamily="monospace" />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={true} fontFamily="monospace" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "0px",
                fontSize: "11px",
                color: "#f8fafc",
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
              iconType="square"
              formatter={(value) => (
                <span className="text-xs text-slate-300 font-mono">
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
              fill="#16a34a"
              fillOpacity={0.12}
              stroke="#16a34a"
              strokeDasharray="2 2"
              label={{
                value: "Surplus Window",
                position: "insideTopLeft",
                fill: "#4ade80",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            />

            {/* Reference Area for Peak Tariff Hours (18:00 to 22:00) */}
            <ReferenceArea
              x1="18:00"
              x2="22:00"
              fill="#d97706"
              fillOpacity={0.15}
              stroke="#d97706"
              strokeDasharray="2 2"
              label={{
                value: "Peak Tariff (₹11.5/kWh)",
                position: "insideTopRight",
                fill: "#fbbf24",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            />

            {/* Current Selected Hour Line */}
            <ReferenceArea
              x1={`${currentHour.toString().padStart(2, "0")}:00`}
              x2={`${currentHour.toString().padStart(2, "0")}:00`}
              stroke="#38bdf8"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="solar_kw"
              stroke="#d97706"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#solarGradient)"
              stackId="1"
            />

            <Area
              type="monotone"
              dataKey="wind_kw"
              stroke="#0284c7"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#windGradient)"
              stackId="1"
            />

            <Line
              type="monotone"
              dataKey="demand_kw"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#818cf8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Standard Industrial Timeline Scrubber */}
      <div className="border border-slate-700 bg-slate-900 p-3 space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span>Time Scrubber:</span>
            <span className="text-amber-500 font-mono font-bold">
              {`${currentHour.toString().padStart(2, "0")}:00`}
            </span>
          </span>
          <span className="text-slate-400 text-[10px]">
            Step through 24h SCADA telemetry
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={23}
          value={currentHour}
          onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-950 border border-slate-700 appearance-none cursor-pointer accent-amber-500 focus:outline-none"
        />

        {/* Industrial Time Markings */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
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
