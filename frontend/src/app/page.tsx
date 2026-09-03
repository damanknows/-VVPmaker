"use client";

import { BatteryGauge } from "@/components/BatteryGauge";
import { EnergyFlowHero } from "@/components/EnergyFlowHero";
import { ForecastChart } from "@/components/ForecastChart";
import { Header } from "@/components/Header";
import { LiveEventStream } from "@/components/LiveEventStream";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { TelemetryBar } from "@/components/TelemetryBar";
import { useMicrogridData } from "@/hooks/useMicrogridData";

export default function DashboardPage() {
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans scada-grid-bg selection:bg-zinc-800 selection:text-white">
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header isLiveBackend={isLiveBackend} scenario={currentScenario} />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 space-y-4">
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
          <EnergyFlowHero telemetry={telemetry} />

          {/* Middle Section: 24h Forecast Chart & Battery Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* 24-Hour Forecast Overlay Chart (2 Columns) */}
            <div className="lg:col-span-2">
              <ForecastChart
                forecast={forecast}
                currentHour={currentHour}
                onHourChange={setCurrentHour}
              />
            </div>

            {/* Battery BESS SoC Radial Meter (1 Column) */}
            <div className="lg:col-span-1">
              <BatteryGauge
                soc={telemetry.battery_soc}
                powerKw={telemetry.battery_power_kw}
                capacityKwh={selectedCampus.battery_capacity_kwh}
              />
            </div>
          </div>

          {/* Bottom Section: Actionable Facility Staff Recommendations & Realtime Event Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Actionable Facility Staff Recommendations (2 Columns) */}
            <div className="lg:col-span-2">
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
        <footer className="border-t border-zinc-800 bg-[#18181b] py-3 text-center text-xs font-mono text-zinc-400">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-none" />
              SYSTEM OPERATIONAL • SVH26004 • RAJASTHAN DTE VPP BUS
            </span>
            <span className="text-zinc-500">
              SCADA CONTROL SYSTEM v2.4 • PAIR C ENGINE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
