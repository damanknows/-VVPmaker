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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Gradient Mesh Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[600px] rounded-full bg-emerald-500/5 blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 h-[450px] w-[500px] rounded-full bg-indigo-500/5 blur-[130px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header isLiveBackend={isLiveBackend} scenario={currentScenario} />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
          {/* Top Telemetry & Scenario Selector Bar */}
          <TelemetryBar
            campuses={campuses}
            selectedCampus={selectedCampus}
            onSelectCampus={setSelectedCampus}
            scenario={currentScenario}
            onSelectScenario={setScenario}
            telemetry={telemetry}
          />

          {/* Hero Visual Component: Animated Live Energy Routing Graph */}
          <EnergyFlowHero telemetry={telemetry} />

          {/* Middle Section: 24h Forecast Chart & Battery Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              SVH26004 Eco-Hackathon • Rajasthan Technical Education Department
            </span>
            <span>
              Pair C Frontend Dashboard • Next.js 14 App Router
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
