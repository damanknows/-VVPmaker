export type ScenarioPreset = "SUNNY_PEAK" | "CLOUDY_AFTERNOON" | "WINDY_NIGHT";

export interface CurrentTelemetry {
  timestamp: string;
  solar_kw: number;
  wind_kw: number;
  demand_kw: number;
  battery_soc: number; // 0 - 100%
  battery_power_kw: number; // positive = charging, negative = discharging
  grid_import_kw: number;
  grid_export_kw: number;
  co2_saved_kg: number;
  rupees_saved: number;
}

export interface ForecastItem {
  hour: string; // "00:00" to "23:00"
  solar_kw: number;
  wind_kw: number;
  demand_kw: number;
  battery_soc: number;
  grid_import_kw: number;
  is_surplus: boolean;
  is_peak_tariff: boolean;
}

export type RecommendationType = "LOAD_SHIFT" | "BATTERY_DISCHARGE" | "BATTERY_CHARGE" | "CURTAILMENT";
export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";
export type RecommendationStatus = "PENDING" | "APPLIED";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: PriorityLevel;
  title: string;
  action: string;
  financial_impact: string;
  carbon_impact: string;
  status: RecommendationStatus;
}

export interface Campus {
  id: string;
  name: string;
  city: string;
  capacity_kw: number;
  solar_installed_kw: number;
  battery_capacity_kwh: number;
}

export interface MicrogridState {
  currentScenario: ScenarioPreset;
  currentHour: number; // 0 - 23
  selectedCampus: Campus;
  telemetry: CurrentTelemetry;
  forecast: ForecastItem[];
  recommendations: Recommendation[];
}
