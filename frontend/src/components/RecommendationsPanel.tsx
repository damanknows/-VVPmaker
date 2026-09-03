"use client";

import { Recommendation } from "@/types/telemetry";
import confetti from "canvas-confetti";
import { CheckCircle2, ChevronRight, IndianRupee, Leaf, Zap } from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  onApply: (id: string) => void;
}

export function RecommendationsPanel({ recommendations, onApply }: RecommendationsPanelProps) {
  const handleApplyClick = (id: string) => {
    onApply(id);

    // Celebratory confetti effect for presentation feedback
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#22c55e", "#eab308", "#6366f1"],
    });
  };

  const getTypeBadge = (type: Recommendation["type"]) => {
    switch (type) {
      case "LOAD_SHIFT":
        return { label: "Load Shift", bg: "bg-indigo-950 text-indigo-300 border-indigo-500/50" };
      case "BATTERY_DISCHARGE":
        return { label: "Grid Avoidance", bg: "bg-emerald-950 text-emerald-300 border-emerald-500/50" };
      case "BATTERY_CHARGE":
        return { label: "Solar Pre-Charge", bg: "bg-teal-950 text-teal-300 border-teal-500/50" };
      case "CURTAILMENT":
        return { label: "Demand Staggering", bg: "bg-amber-950 text-amber-300 border-amber-500/50" };
    }
  };

  return (
    <div className="scada-panel rounded-none p-4 font-mono space-y-3">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
            Actionable Facility Staff Recommendations
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400">
          AI Optimization Engine
        </span>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        {recommendations.map((rec) => {
          const typeBadge = getTypeBadge(rec.type);
          const isApplied = rec.status === "APPLIED";

          return (
            <div
              key={rec.id}
              className={`rounded-none border p-3 bg-zinc-950 transition-none ${
                isApplied
                  ? "border-emerald-500/60 bg-emerald-950/20"
                  : "border-zinc-800"
              }`}
            >
              {/* Header Tags */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 border ${typeBadge.bg}`}>
                  {typeBadge.label}
                </span>

                <span
                  className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border ${
                    rec.priority === "HIGH"
                      ? "border-red-500/50 bg-red-950/60 text-red-400"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              {/* Title & Action Detail */}
              <h3 className="font-bold text-white text-xs mb-1 font-mono">{rec.title}</h3>
              <p className="text-[11px] text-zinc-300 mb-2.5 font-sans leading-relaxed">{rec.action}</p>

              {/* Impact Indicators Strip */}
              <div className="grid grid-cols-2 gap-2 my-2 bg-zinc-900 p-2 border border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <IndianRupee className="h-3 w-3" />
                  <span>{rec.financial_impact}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-bold">
                  <Leaf className="h-3 w-3" />
                  <span>{rec.carbon_impact}</span>
                </div>
              </div>

              {/* Action Button */}
              {isApplied ? (
                <div className="flex items-center justify-center gap-1.5 w-full rounded-none bg-emerald-950 border border-emerald-500/50 py-1.5 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Scheduled & Applied to VPP Controller</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyClick(rec.id)}
                  className="flex items-center justify-center gap-1 w-full rounded-none bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500 py-1.5 text-xs font-mono font-bold text-emerald-200 transition-none cursor-pointer"
                >
                  <span>Accept & Auto-Schedule</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
