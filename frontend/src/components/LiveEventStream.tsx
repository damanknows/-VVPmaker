"use client";

import { ShieldCheck, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface EventItem {
  id: string;
  time: string;
  category: "SOLAR" | "BESS" | "GRID" | "VPP";
  message: string;
  severity: "INFO" | "SUCCESS" | "WARN";
}

export function LiveEventStream() {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "ev-1",
      time: "14:32:05",
      category: "VPP",
      message: "VPP Controller synchronized with Rajasthan DTE campus bus",
      severity: "SUCCESS",
    },
    {
      id: "ev-2",
      time: "14:30:12",
      category: "SOLAR",
      message: "Solar Rooftop Array operating at peak 120.5 kW generation",
      severity: "INFO",
    },
    {
      id: "ev-3",
      time: "14:28:45",
      category: "BESS",
      message: "BESS #1 automated pre-charge initiated from solar surplus (+14.3 kW)",
      severity: "SUCCESS",
    },
    {
      id: "ev-4",
      time: "14:25:00",
      category: "GRID",
      message: "Zero utility grid draw achieved (Campus 100% self-sufficient)",
      severity: "SUCCESS",
    },
  ]);

  // Periodically push simulated live events
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      const sampleEvents: Omit<EventItem, "id" | "time">[] = [
        { category: "SOLAR", message: "Inverter MPPT tracking active • 98.6% efficiency", severity: "INFO" },
        { category: "BESS", message: "Battery cell temperature stable at 26.4°C", severity: "INFO" },
        { category: "VPP", message: "Calculated ₹420 rupee savings in last 30 minutes", severity: "SUCCESS" },
        { category: "GRID", message: "Frequency response locked at 50.01 Hz", severity: "SUCCESS" },
      ];

      const chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setEvents((prev) => [
        { id: `ev-${Date.now()}`, time: timeStr, ...chosen },
        ...prev.slice(0, 6),
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scada-panel rounded-none p-4 font-mono space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-500" />
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">VPP Event & Control Stream</h3>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-500">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-none" />
          <span>REALTIME BUS</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between rounded-none border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[10px]">{ev.time}</span>
              <span
                className={`text-[9px] font-bold px-1 py-0.2 border ${
                  ev.category === "VPP"
                    ? "border-indigo-500/50 bg-indigo-950 text-indigo-300"
                    : ev.category === "SOLAR"
                    ? "border-amber-500/50 bg-amber-950 text-amber-500"
                    : ev.category === "BESS"
                    ? "border-emerald-500/50 bg-emerald-950 text-emerald-400"
                    : "border-orange-500/50 bg-orange-950 text-orange-400"
                }`}
              >
                {ev.category}
              </span>
              <span className="text-zinc-300 text-[11px] font-mono">{ev.message}</span>
            </div>

            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
