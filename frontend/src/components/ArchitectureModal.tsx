"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, BatteryCharging, Building2, ChevronRight, CloudSun, ShieldAlert, Sparkles, X } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-4xl border border-slate-700 bg-slate-900 p-5 shadow-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 border border-slate-700 p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-none"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-700">
            <div className="flex h-9 w-9 items-center justify-center bg-slate-950 text-indigo-400 border border-slate-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">4-Tier Vendor-Neutral VPP Architecture</h2>
              <p className="text-xs text-slate-400 font-mono">
                Problem Statement SVH26004 • Zero-Capex Campus Microgrid Orchestration Stack
              </p>
            </div>
          </div>

          {/* Architecture Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative font-mono">
            {/* Tier 1 */}
            <div className="border border-amber-600/50 bg-slate-950 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider px-1.5 py-0.5 bg-amber-950 border border-amber-600/50">
                    Tier 1
                  </span>
                  <CloudSun className="h-4 w-4 text-amber-500" />
                </div>
                <h3 className="font-bold text-white text-xs mb-1 font-mono">Telemetric Ingestion</h3>
                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-sans">
                  Vendor-agnostic Modbus/MQTT/REST adapters capturing Solar, Wind & Smart Meters.
                </p>
              </div>
              <ul className="text-[10px] text-amber-500 space-y-1 font-mono">
                <li>• 1-sec telemetry polling</li>
                <li>• Modbus-RTU over IP</li>
                <li>• Inverter AGNOSTIC</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="border border-sky-600/50 bg-slate-950 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider px-1.5 py-0.5 bg-sky-950 border border-sky-600/50">
                    Tier 2
                  </span>
                  <Activity className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="font-bold text-white text-xs mb-1 font-mono">AI 24h Forecasting</h3>
                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-sans">
                  LightGBM & Prophet models predicting solar curves & campus peak demand.
                </p>
              </div>
              <ul className="text-[10px] text-sky-400 space-y-1 font-mono">
                <li>• Weather API integration</li>
                <li>• Peak tariff probability</li>
                <li>• 94.2% MAPE accuracy</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="border border-emerald-600/50 bg-slate-950 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider px-1.5 py-0.5 bg-emerald-950 border border-emerald-600/50">
                    Tier 3
                  </span>
                  <BatteryCharging className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className="font-bold text-white text-xs mb-1 font-mono">VPP Optimization</h3>
                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-sans">
                  Mixed-Integer Linear Program (MILP) solving battery BESS schedule & load shifts.
                </p>
              </div>
              <ul className="text-[10px] text-emerald-500 space-y-1 font-mono">
                <li>• Maximize rupee savings</li>
                <li>• Battery health protection</li>
                <li>• Automated dispatching</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="border border-indigo-600/50 bg-slate-950 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider px-1.5 py-0.5 bg-indigo-950 border border-indigo-600/50">
                    Tier 4
                  </span>
                  <Building2 className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-xs mb-1 font-mono">Campus Dispatch</h3>
                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-sans">
                  Zero-jargon UI dashboard for facility staff & automated relay controls.
                </p>
              </div>
              <ul className="text-[10px] text-indigo-300 space-y-1 font-mono">
                <li>• 1-Click Load Shift</li>
                <li>• Instant visual alerts</li>
                <li>• Audit logs & compliance</li>
              </ul>
            </div>
          </div>

          {/* Key Differentiators Banner */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-slate-700 bg-slate-950 p-3 font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-slate-300 font-sans">
                Zero-Capex Software Layer • Works with existing inverter brands (Schneider, Luminous, Havells, Delta)
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-none"
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
