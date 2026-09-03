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
      colors: ["#2563eb", "#10b981", "#f59e0b"],
    });
  };

  const getTypeBadge = (type: Recommendation["type"]) => {
    switch (type) {
      case "LOAD_SHIFT":
        return { label: "Load Shift", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "BATTERY_DISCHARGE":
        return { label: "Grid Avoidance", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "BATTERY_CHARGE":
        return { label: "Solar Pre-Charge", bg: "bg-cyan-50 text-cyan-700 border-cyan-200" };
      case "CURTAILMENT":
        return { label: "Demand Staggering", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all font-sans space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-600">
            <Zap className="h-4 w-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-mono">
            Actionable Facility Staff Recommendations
          </h2>
        </div>
        <span className="text-xs font-sans font-medium px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">
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
              className={`border rounded-xl p-4 bg-white transition-all shadow-xs hover:shadow-sm ${
                isApplied
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200/80"
              }`}
            >
              {/* Header Tags */}
              <div className="flex items-center justify-between mb-2.5 font-sans">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 border rounded-full ${typeBadge.bg}`}>
                  {typeBadge.label}
                </span>

                <span
                  className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                    rec.priority === "HIGH"
                      ? "border-red-200 bg-red-50 text-red-700 font-semibold"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              {/* Title & Action Detail */}
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{rec.title}</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{rec.action}</p>

              {/* Impact Indicators Strip */}
              <div className="grid grid-cols-2 gap-2 my-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
                  <span>{rec.financial_impact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{rec.carbon_impact}</span>
                </div>
              </div>

              {/* Action Button */}
              {isApplied ? (
                <div className="flex items-center justify-center gap-1.5 w-full bg-emerald-100 border border-emerald-200 py-2 rounded-xl text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Scheduled & Applied to VPP Controller</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyClick(rec.id)}
                  className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 border border-blue-600 py-2 rounded-xl text-xs font-sans font-semibold text-white transition-all shadow-xs cursor-pointer"
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
