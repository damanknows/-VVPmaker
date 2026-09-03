import { Campus, CurrentTelemetry, ForecastItem, Recommendation, ScenarioPreset } from "@/types/telemetry";

export const RAJASTHAN_CAMPUSES: Campus[] = [
  {
    id: "mnit-jaipur",
    name: "MNIT Jaipur - Main Campus",
    city: "Jaipur",
    capacity_kw: 600,
    solar_installed_kw: 400,
    battery_capacity_kwh: 750,
  },
  {
    id: "gec-ajmer",
    name: "Govt. Engineering College Ajmer",
    city: "Ajmer",
    capacity_kw: 380,
    solar_installed_kw: 240,
    battery_capacity_kwh: 450,
  },
  {
    id: "gec-bikaner",
    name: "GEC Bikaner - Main Campus",
    city: "Bikaner",
    capacity_kw: 350,
    solar_installed_kw: 220,
    battery_capacity_kwh: 400,
  },
  {
    id: "mbm-jodhpur",
    name: "MBM University - Jodhpur",
    city: "Jodhpur",
    capacity_kw: 500,
    solar_installed_kw: 310,
    battery_capacity_kwh: 600,
  },
  {
    id: "rtu-kota",
    name: "RTU Kota - Technical Campus",
    city: "Kota",
    capacity_kw: 450,
    solar_installed_kw: 250,
    battery_capacity_kwh: 500,
  },
  {
    id: "ctae-udaipur",
    name: "CTAE Udaipur - Green Campus",
    city: "Udaipur",
    capacity_kw: 300,
    solar_installed_kw: 180,
    battery_capacity_kwh: 350,
  },
];

// Helper to generate 24h forecast curve based on scenario and campus capacity
export function generate24hForecast(scenario: ScenarioPreset, campus?: Campus): ForecastItem[] {
  const items: ForecastItem[] = [];

  const scaleSolar = campus ? campus.solar_installed_kw / 220 : 1;
  const scaleDemand = campus ? campus.capacity_kw / 350 : 1;

  for (let h = 0; h < 24; h++) {
    const hourStr = `${h.toString().padStart(2, "0")}:00`;
    const isPeakTariff = h >= 18 && h <= 22; // 6 PM to 10 PM peak tariff in Rajasthan

    let solar_kw = 0;
    let wind_kw = 0;
    let demand_kw = (120 + Math.sin((h - 8) / 3) * 35) * scaleDemand; // diurnal campus load curve

    if (scenario === "SUNNY_PEAK") {
      // High solar bell curve peaking at 13:00
      if (h >= 6 && h <= 18) {
        const solarFactor = Math.sin(((h - 6) / 12) * Math.PI);
        solar_kw = Math.round(210 * Math.pow(solarFactor, 1.2) * scaleSolar);
      }
      wind_kw = Math.round(20 + (h % 5) * 3);
    } else if (scenario === "CLOUDY_AFTERNOON") {
      // Dips in solar due to cloud cover, wind moderate
      if (h >= 6 && h <= 18) {
        const solarFactor = Math.sin(((h - 6) / 12) * Math.PI);
        const cloudDip = (h >= 12 && h <= 15) ? 0.35 : 0.8;
        solar_kw = Math.round(140 * solarFactor * cloudDip * scaleSolar);
      }
      wind_kw = Math.round(35 + (h % 7) * 3);
    } else if (scenario === "WINDY_NIGHT") {
      // Low solar, high nighttime wind generation
      if (h >= 7 && h <= 17) {
        solar_kw = Math.round(60 * Math.sin(((h - 7) / 10) * Math.PI) * scaleSolar);
      }
      wind_kw = Math.round(110 + Math.sin(h / 3) * 25);
      demand_kw = Math.max(90 * scaleDemand, demand_kw * 0.85); // lower night load
    }

    const totalGreen = solar_kw + wind_kw;
    const isSurplus = totalGreen > demand_kw;

    // Simulate battery SoC changes across 24h
    let battery_soc = 50;
    if (h < 6) battery_soc = Math.max(30, 70 - h * 4);
    else if (h >= 11 && h <= 15) battery_soc = Math.min(95, 55 + (h - 10) * 8);
    else if (h >= 18 && h <= 22) battery_soc = Math.max(25, 85 - (h - 17) * 12);
    else battery_soc = 65;

    let grid_import_kw = 0;
    if (totalGreen < demand_kw) {
      grid_import_kw = Math.max(0, Math.round(demand_kw - totalGreen - (isPeakTariff ? 25 : 10)));
    }

    items.push({
      hour: hourStr,
      solar_kw: Math.max(0, Math.round(solar_kw)),
      wind_kw: Math.max(0, Math.round(wind_kw)),
      demand_kw: Math.round(demand_kw),
      battery_soc: Math.round(battery_soc),
      grid_import_kw: Math.round(grid_import_kw),
      is_surplus: isSurplus,
      is_peak_tariff: isPeakTariff,
    });
  }

  return items;
}

// Generate instantaneous telemetry based on scenario, hour, and campus
export function getTelemetryForHour(
  scenario: ScenarioPreset,
  hour: number = 14,
  campus?: Campus
): CurrentTelemetry {
  const forecast = generate24hForecast(scenario, campus);
  const current = forecast[Math.min(23, Math.max(0, hour))];

  const totalGen = current.solar_kw + current.wind_kw;
  const netPower = totalGen - current.demand_kw;

  let battery_power_kw = 0; // positive = charging, negative = discharging
  let grid_import_kw = 0;
  let grid_export_kw = 0;

  if (netPower > 0) {
    // Surplus energy -> charge battery first up to 45 kW rate, remainder exported to grid
    battery_power_kw = Math.min(45, Math.round(netPower));
    grid_export_kw = Math.max(0, Math.round(netPower - battery_power_kw));
  } else {
    // Deficit energy -> discharge battery to meet demand
    const deficit = Math.abs(netPower);
    battery_power_kw = -Math.min(40, Math.round(deficit));
    grid_import_kw = Math.max(0, Math.round(deficit - Math.abs(battery_power_kw)));
  }

  // Base cumulative daily savings metrics scaled by campus
  const scale = campus ? campus.capacity_kw / 350 : 1;
  const rupees_saved = Math.round((3800 + hour * 240 + (scenario === "SUNNY_PEAK" ? 850 : 200)) * scale);
  const co2_saved_kg = Number(((280 + hour * 18.5 + (scenario === "WINDY_NIGHT" ? 45 : 15)) * scale).toFixed(1));

  const now = new Date();
  now.setHours(hour, 30, 0, 0);

  return {
    timestamp: now.toISOString(),
    solar_kw: current.solar_kw,
    wind_kw: current.wind_kw,
    demand_kw: current.demand_kw,
    battery_soc: current.battery_soc,
    battery_power_kw,
    grid_import_kw,
    grid_export_kw,
    co2_saved_kg,
    rupees_saved,
  };
}

// Initial Recommendations Mock List
export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    type: "LOAD_SHIFT",
    priority: "HIGH",
    title: "Shift Heavy Mechanical Workshop Load",
    action: "Schedule CNC milling & electric furnace operation between 12:30 - 15:00 during Solar Surplus Window.",
    financial_impact: "Save ₹1,850 in peak tariff surcharges",
    carbon_impact: "54 kg CO₂ avoided today",
    status: "PENDING",
  },
  {
    id: "rec-2",
    type: "BATTERY_DISCHARGE",
    priority: "HIGH",
    title: "Pre-Discharge BESS #1 for Evening Peak Tariff",
    action: "Discharge 120 kWh BESS into campus microgrid from 18:30 to 21:00 to avoid expensive grid draw.",
    financial_impact: "Save ₹2,400 during peak ₹11.5/kWh rate",
    carbon_impact: "78 kg CO₂ avoided",
    status: "PENDING",
  },
  {
    id: "rec-3",
    type: "BATTERY_CHARGE",
    priority: "MEDIUM",
    title: "Pre-Charge Battery Array using Solar Over-Generation",
    action: "Ramp charging rate to +35 kW between 11:00 and 14:00 to store excess solar production.",
    financial_impact: "Utilize ₹950 of zero-cost solar power",
    carbon_impact: "38 kg CO₂ sequestered equivalent",
    status: "PENDING",
  },
  {
    id: "rec-4",
    type: "CURTAILMENT",
    priority: "LOW",
    title: "Smart HVAC Staggering in Library Block",
    action: "Stagger 4x 15-ton chiller startups by 15 minutes to reduce campus peak demand spike.",
    financial_impact: "Reduce maximum demand charge by ₹1,120/mo",
    carbon_impact: "22 kg CO₂ avoided",
    status: "PENDING",
  },
];
