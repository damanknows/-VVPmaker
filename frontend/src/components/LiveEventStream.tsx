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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
            <Terminal className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">VPP Event & Control Stream</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 rounded-full">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>REALTIME BUS</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 font-mono">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between border border-slate-200/80 bg-slate-50 px-3 py-2 rounded-xl text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400 text-[10px]">{ev.time}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  ev.category === "VPP"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : ev.category === "SOLAR"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : ev.category === "BESS"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-orange-200 bg-orange-50 text-orange-700"
                }`}
              >
                {ev.category}
              </span>
              <span className="text-slate-700 text-[11px] font-mono">{ev.message}</span>
            </div>

            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
