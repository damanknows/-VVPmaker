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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-4xl border border-slate-200 bg-white p-6 shadow-2xl rounded-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 font-sans">
            <div className="flex h-10 w-10 items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-wide">4-Tier Vendor-Neutral VPP Architecture</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Problem Statement SVH26004 • Zero-Capex Campus Microgrid Orchestration Stack
              </p>
            </div>
          </div>

          {/* Architecture Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Tier 1 */}
            <div className="border border-amber-200 bg-amber-50/40 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider px-2 py-0.5 bg-amber-100 rounded-full border border-amber-300">
                    Tier 1
                  </span>
                  <CloudSun className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-1 font-mono">Telemetric Ingestion</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Vendor-agnostic Modbus/MQTT/REST adapters capturing Solar, Wind & Smart Meters.
                </p>
              </div>
              <ul className="text-[11px] text-amber-700 space-y-1 font-mono font-medium">
                <li>• 1-sec telemetry polling</li>
                <li>• Modbus-RTU over IP</li>
                <li>• Inverter AGNOSTIC</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="border border-sky-200 bg-sky-50/40 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider px-2 py-0.5 bg-sky-100 rounded-full border border-sky-300">
                    Tier 2
                  </span>
                  <Activity className="h-5 w-5 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-1 font-mono">AI 24h Forecasting</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  LightGBM & Prophet models predicting solar curves & campus peak demand.
                </p>
              </div>
              <ul className="text-[11px] text-sky-700 space-y-1 font-mono font-medium">
                <li>• Weather API integration</li>
                <li>• Peak tariff probability</li>
                <li>• 94.2% MAPE accuracy</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="border border-emerald-200 bg-emerald-50/40 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider px-2 py-0.5 bg-emerald-100 rounded-full border border-emerald-300">
                    Tier 3
                  </span>
                  <BatteryCharging className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-1 font-mono">VPP Optimization</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Mixed-Integer Linear Program (MILP) solving battery BESS schedule & load shifts.
                </p>
              </div>
              <ul className="text-[11px] text-emerald-700 space-y-1 font-mono font-medium">
                <li>• Maximize rupee savings</li>
                <li>• Battery health protection</li>
                <li>• Automated dispatching</li>
              </ul>
            </div>

            {/* Tier 4 */}
            <div className="border border-blue-200 bg-blue-50/40 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider px-2 py-0.5 bg-blue-100 rounded-full border border-blue-300">
                    Tier 4
                  </span>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-1 font-mono">Campus Dispatch</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Zero-jargon UI dashboard for facility staff & automated relay controls.
                </p>
              </div>
              <ul className="text-[11px] text-blue-700 space-y-1 font-mono font-medium">
                <li>• 1-Click Load Shift</li>
                <li>• Instant visual alerts</li>
                <li>• Audit logs & compliance</li>
              </ul>
            </div>
          </div>

          {/* Key Differentiators Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-slate-50 p-4 rounded-xl font-sans">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-slate-700 font-medium">
                Zero-Capex Software Layer • Works with existing inverter brands (Schneider, Luminous, Havells, Delta)
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer"
            >
              <span>Back to Dashboard</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
