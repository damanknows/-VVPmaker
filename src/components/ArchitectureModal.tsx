"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, BatteryCharging, Building2, ChevronRight, CloudSun, ShieldAlert, Sparkles, X, Zap } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">4-Tier Vendor-Neutral VPP Architecture</h2>
              <p className="text-xs text-slate-400">
                Problem Statement SVH26004 • Zero-Capex Campus Microgrid Orchestration Stack
              </p>
            </div>
          </div>

          {/* Architecture Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Tier 1 */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20">
                    Tier 1
                  </span>
                  <CloudSun className="h-4 w-4 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Telemetric Ingestion</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Vendor-agnostic Modbus/MQTT/REST adapters capturing Solar, Wind & Smart Meters.
                </p>
              </div>
              <ul className="text-[11px] text-amber-300/80 space-y-1 font-mono">
                <li>• 1-sec telemetry polling</li>
                <li>• Modbus-RTU over IP</li>
                <li>• Inverter AGNOSTIC</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20">
                    Tier 2
                  </span>
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">AI 24h Forecasting</h3>
                <p className="text-xs text-slate-400 mb-3">
                  LightGBM & Prophet models predicting solar curves & campus peak demand.
                </p>
              </div>
              <ul className="text-[11px] text-cyan-300/80 space-y-1 font-mono">
                <li>• Weather API integration</li>
                <li>• Peak tariff probability</li>
                <li>• 94.2% MAPE accuracy</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20">
                    Tier 3
                  </span>
                  <BatteryCharging className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">VPP Optimization</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Mixed-Integer Linear Program (MILP) solving battery BESS schedule & load shifts.
                </p>
              </div>
              <ul className="text-[11px] text-emerald-300/80 space-y-1 font-mono">
                <li>• Maximize rupee savings</li>
                <li>• Battery health protection</li>
                <li>• Automated dispatching</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20">
                    Tier 4
                  </span>
                  <Building2 className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Campus Dispatch</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Zero-jargon UI dashboard for facility staff & automated relay controls.
                </p>
              </div>
              <ul className="text-[11px] text-indigo-300/80 space-y-1 font-mono">
                <li>• 1-Click Load Shift</li>
                <li>• Instant visual alerts</li>
                <li>• Audit logs & compliance</li>
              </ul>
            </div>
          </div>

          {/* Key Differentiators Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-300">
                Zero-Capex Software Layer • Works with existing inverter brands (Schneider, Luminous, Havells, Delta)
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Back to Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
