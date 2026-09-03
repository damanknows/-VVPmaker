"use client";

import { Recommendation } from "@/types/telemetry";
import confetti from "canvas-confetti";
import { AlertCircle, CheckCircle2, ChevronRight, IndianRupee, Leaf, Sparkles } from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  onApply: (id: string) => void;
}

export function RecommendationsPanel({ recommendations, onApply }: RecommendationsPanelProps) {
  const handleApplyClick = (id: string) => {
    onApply(id);

    // Trigger celebratory confetti effect for hackathon presentation wow factor
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#10b981", "#f59e0b", "#6366f1"],
    });
  };

  const getTypeBadge = (type: Recommendation["type"]) => {
    switch (type) {
      case "LOAD_SHIFT":
        return { label: "Load Shift", bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" };
      case "BATTERY_DISCHARGE":
        return { label: "Grid Avoidance", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      case "BATTERY_CHARGE":
        return { label: "Solar Pre-Charge", bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
      case "CURTAILMENT":
        return { label: "Demand Staggering", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Actionable Facility Staff Recommendations
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          AI Optimization Engine
        </span>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const typeBadge = getTypeBadge(rec.type);
          const isApplied = rec.status === "APPLIED";

          return (
            <div
              key={rec.id}
              className={`group relative rounded-xl border p-4 transition-all duration-300 ${
                isApplied
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-md"
                  : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
              }`}
            >
              {/* Header Tags */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${typeBadge.bg}`}>
                  {typeBadge.label}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    rec.priority === "HIGH"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              {/* Title & Action Detail */}
              <h3 className="font-semibold text-white text-sm mb-1.5">{rec.title}</h3>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{rec.action}</p>

              {/* Impact Indicators Strip */}
              <div className="grid grid-cols-2 gap-2 my-3 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span>{rec.financial_impact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>{rec.carbon_impact}</span>
                </div>
              </div>

              {/* Action Button */}
              {isApplied ? (
                <div className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-emerald-500/20 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Scheduled & Applied to VPP Controller</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyClick(rec.id)}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Accept & Auto-Schedule</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
