"use client";

import { BatteryGauge } from "@/components/BatteryGauge";
import { EnergyFlowHero } from "@/components/EnergyFlowHero";
import { ForecastChart } from "@/components/ForecastChart";
import { Header } from "@/components/Header";
import { LiveEventStream } from "@/components/LiveEventStream";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { TelemetryBar } from "@/components/TelemetryBar";
import { useMicrogridData } from "@/hooks/useMicrogridData";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("sld");

  const {
    currentScenario,
    setScenario,
    currentHour,
    setCurrentHour,
    selectedCampus,
    setSelectedCampus,
    campuses,
    telemetry,
    forecast,
    recommendations,
    applyRecommendation,
    isLiveBackend,
  } = useMicrogridData();

  return (
    <div className="min-h-screen saas-dot-grid text-slate-900 antialiased font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header with Dynamic Campus Breadcrumb & Sub-Nav Tab Navigation */}
        <Header
          isLiveBackend={isLiveBackend}
          scenario={currentScenario}
          selectedCampus={selectedCampus}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 space-y-5">
          {/* Top Telemetry & Scenario Selector Bar */}
          <TelemetryBar
            campuses={campuses}
            selectedCampus={selectedCampus}
            onSelectCampus={setSelectedCampus}
            scenario={currentScenario}
            onSelectScenario={setScenario}
            telemetry={telemetry}
          />

          {/* Hero Visual Component: SCADA Single-Line Diagram Energy Flow */}
          <div
            id="sld-section"
            className={`transition-all duration-300 rounded-2xl ${
              activeTab === "sld" ? "ring-2 ring-blue-500/60" : ""
            }`}
          >
            <EnergyFlowHero telemetry={telemetry} />
          </div>

          {/* Middle Section: 24h Forecast Chart & Battery Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* 24-Hour Forecast Overlay Chart (2 Columns) */}
            <div
              id="forecast-section"
              className={`lg:col-span-2 transition-all duration-300 rounded-2xl ${
                activeTab === "forecast" ? "ring-2 ring-blue-500/60" : ""
              }`}
            >
              <ForecastChart
                forecast={forecast}
                currentHour={currentHour}
                onHourChange={setCurrentHour}
              />
            </div>

            {/* Battery BESS SoC Radial Meter (1 Column) */}
            <div
              id="bess-section"
              className={`lg:col-span-1 transition-all duration-300 rounded-2xl ${
                activeTab === "bess" ? "ring-2 ring-blue-500/60" : ""
              }`}
            >
              <BatteryGauge
                soc={telemetry.battery_soc}
                powerKw={telemetry.battery_power_kw}
                capacityKwh={selectedCampus.battery_capacity_kwh}
              />
            </div>
          </div>

          {/* Bottom Section: Actionable Facility Staff Recommendations & Realtime Event Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Actionable Facility Staff Recommendations (2 Columns) */}
            <div
              id="tariff-section"
              className={`lg:col-span-2 transition-all duration-300 rounded-2xl ${
                activeTab === "tariff" ? "ring-2 ring-blue-500/60" : ""
              }`}
            >
              <RecommendationsPanel
                recommendations={recommendations}
                onApply={applyRecommendation}
              />
            </div>

            {/* Live Microgrid Event Log Feed (1 Column) */}
            <div className="lg:col-span-1">
              <LiveEventStream />
            </div>
          </div>
        </main>

        {/* Technical Control Room Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs font-mono text-slate-500 mt-6">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              SYSTEM OPERATIONAL • SVH26004 • RAJASTHAN DTE VPP BUS
            </span>
            <span className="text-slate-400">
              SCADA CONTROL SYSTEM v2.4 • PAIR C ENGINE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
