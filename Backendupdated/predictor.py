"""
predictor.py — VPP AI Forecasting Engine
Uses GradientBoostingRegressor (Scikit-Learn) with physics-informed feature engineering
to forecast:
  1. Solar PV Generation (kW)
  2. Wind Turbine Generation (kW)
  3. Campus Power Demand (kW)
"""

import os
import sys
import io
import math
import json
import numpy as np
import joblib
from datetime import datetime
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# ── Directory & Physical Constants ──────────────────────────────────────────
MODEL_DIR   = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

CEA_CARBON  = 0.81          # kg CO2 / kWh — Official Central Electricity Authority baseline
PANEL_EFF   = 0.20          # 20% solar panel efficiency
PANEL_AREA  = 1667          # m² ≈ 250 kWp array
TEMP_COEFF  = -0.004        # -0.4%/°C power loss above 25°C standard test condition (STC)


# ── 1. Moist-Air Density Calculator (Ideal Gas Law + Buck Equation) ─────────
def moist_air_density(pressure_hpa: float, temp_c: float, rh_pct: float) -> float:
    """
    Computes ambient air density (rho in kg/m³):
    rho = (P_dry / (Rd * T)) + (P_v / (Rv * T))
    Directly affects wind turbine kinetic energy capture!
    """
    T = temp_c + 273.15               # Kelvin
    P = pressure_hpa * 100.0          # Pascals
    
    # Saturation vapor pressure (Buck equation)
    Psat = 611.21 * math.exp((18.678 - temp_c / 234.5) * (temp_c / (257.14 + temp_c)))
    Pv   = (rh_pct / 100.0) * Psat
    Pd   = P - Pv
    
    Rd   = 287.058                    # Specific gas constant for dry air (J/(kg·K))
    Rv   = 461.495                    # Specific gas constant for water vapor (J/(kg·K))
    
    rho  = (Pd / (Rd * T)) + (Pv / (Rv * T))
    return round(rho, 4)


# ── 2. Feature Engineering (14-Dimensional Vector) ──────────────────────────
def _build_features(hour: int, month: int,
                    temp_c: float, cloud_pct: float, uv_index: float,
                    wind_kph: float, pressure_hpa: float, rh_pct: float) -> np.ndarray:
    """
    Encodes temporal cyclical features (sin/cos) and derived weather proxies.
    """
    rho    = moist_air_density(pressure_hpa, temp_c, rh_pct)
    sin_h  = math.sin(2 * math.pi * hour  / 24)
    cos_h  = math.cos(2 * math.pi * hour  / 24)
    sin_m  = math.sin(2 * math.pi * month / 12)
    cos_m  = math.cos(2 * math.pi * month / 12)
    irr    = max(0.0, uv_index * 25.0 * (1.0 - cloud_pct / 100.0))  # Estimated solar irradiance (W/m²)
    
    return np.array([
        temp_c, cloud_pct, uv_index, wind_kph, pressure_hpa, rh_pct,
        rho, irr, sin_h, cos_h, sin_m, cos_m, float(hour), float(month)
    ], dtype=float)


# ── 3. Physics-Informed Training Data Generator (8,760 Hours / 1 Year) ──────
def _generate_training_data(n_days: int = 365):
    """
    Simulates a full year of physics-grounded weather, generation, and campus demand.
    """
    rng = np.random.default_rng(42)
    X_solar,  y_solar  = [], []
    X_wind,   y_wind   = [], []
    X_demand, y_demand = [], []

    for day in range(n_days):
        month    = (day // 30) % 12 + 1
        is_wkend = (day % 7) >= 5
        
        for hour in range(24):
            # Synthetic climate baseline (Rajasthan profile)
            base_temp   = 28 + 10 * math.sin(2*math.pi*(month-1)/12) + 6 * math.sin(2*math.pi*(hour-14)/24) + rng.normal(0, 1.5)
            cloud_pct   = max(0, min(100, 20 + 30 * rng.random() + 20 * (month in [7,8,9])))
            uv_base     = max(0, math.sin(math.pi * hour / 12) * 10) if 6 <= hour <= 18 else 0.0
            uv_index    = max(0, uv_base * (1 - cloud_pct/100) + rng.normal(0, 0.3))
            wind_kph    = max(0, 18 + 12*rng.random() + 8*(month in [4,5,6]) + 4*math.sin(2*math.pi*hour/24) + rng.normal(0,2))
            pressure    = 940 + rng.normal(0, 3)
            rh_pct      = max(5, min(95, 30 + 25*(month in [7,8,9]) + rng.normal(0,5)))
            rho         = moist_air_density(pressure, base_temp, rh_pct)

            feats = _build_features(hour, month, base_temp, cloud_pct, uv_index, wind_kph, pressure, rh_pct)

            # 1. Physics PV Model (Derated for temperature)
            irr         = max(0, uv_index * 25.0 * (1 - cloud_pct/100))
            temp_derate = 1 + TEMP_COEFF * max(0, base_temp - 25)
            solar_kw    = max(0, (PANEL_EFF * PANEL_AREA * (irr/1000) * temp_derate) + rng.normal(0, 2))

            # 2. Betz Wind Turbine Curve (50 kW rated, cut-in 3 m/s, rated 12 m/s, cut-out 25 m/s)
            v = wind_kph / 3.6  # m/s
            v_ci, v_r, v_co = 3.0, 12.0, 25.0
            P_rated = 50.0
            if v < v_ci or v > v_co:
                wind_kw = 0.0
            elif v_ci <= v < v_r:
                wind_kw = P_rated * ((v**3 - v_ci**3) / (v_r**3 - v_ci**3))
            else:
                wind_kw = P_rated
            wind_kw = max(0, wind_kw * (rho / 1.225) + rng.normal(0, 1))

            # 3. Campus Electricity Demand Curve (HVAC temperature adjustment)
            base_demand = 280 if not is_wkend else 170
            hour_mult = {
                0:0.50, 1:0.45, 2:0.43, 3:0.42, 4:0.44, 5:0.50,
                6:0.65, 7:0.82, 8:0.92, 9:0.97, 10:1.0, 11:0.99,
                12:0.93, 13:0.95, 14:0.98, 15:0.97, 16:0.95, 17:0.90,
                18:0.96, 19:1.0, 20:0.98, 21:0.90, 22:0.78, 23:0.62
            }.get(hour, 0.70)
            temp_adj  = 1 + 0.012 * max(0, base_temp - 25)  # AC load increase
            demand_kw = max(50, base_demand * hour_mult * temp_adj + rng.normal(0, 5))

            X_solar.append(feats);  y_solar.append(solar_kw)
            X_wind.append(feats);   y_wind.append(wind_kw)
            X_demand.append(feats); y_demand.append(demand_kw)

    return (np.array(X_solar), np.array(y_solar),
            np.array(X_wind),  np.array(y_wind),
            np.array(X_demand),np.array(y_demand))


# ── 4. Model Training & Serialization ───────────────────────────────────────
def train_models():
    print("[predictor] Generating 8760 training samples ...")
    Xs, ys, Xw, yw, Xd, yd = _generate_training_data(365)

    models = {}
    for name, X, y in [("solar", Xs, ys), ("wind", Xw, yw), ("demand", Xd, yd)]:
        pipe = Pipeline([
            ("scaler", StandardScaler()),
            ("gbr", GradientBoostingRegressor(
                n_estimators=200,
                max_depth=5,
                learning_rate=0.08,
                subsample=0.8,
                random_state=42
            ))
        ])
        pipe.fit(X, y)
        path = os.path.join(MODEL_DIR, f"{name}_model.pkl")
        joblib.dump(pipe, path)
        preds = pipe.predict(X[:500])
        rmse  = np.sqrt(np.mean((preds - y[:500])**2))
        print(f"  [{name.upper()}] Trained & Saved -> RMSE: {rmse:.2f} kW -> {path}")
        models[name] = pipe

    print("[predictor] All 3 models trained and saved.")
    return models

# ── 5. Lazy Model Loader ────────────────────────────────────────────────────
_models = {}

def _get_models() -> dict:
    global _models
    if not _models:
        paths = {k: os.path.join(MODEL_DIR, f"{k}_model.pkl") for k in ("solar", "wind", "demand")}
        missing = [k for k, p in paths.items() if not os.path.exists(p)]
        if missing:
            print(f"[predictor] Models missing ({missing}). Training now ...")
            _models = train_models()
        else:
            _models = {k: joblib.load(p) for k, p in paths.items()}
            print("[predictor] Models loaded from disk.")
    return _models


# ── 6. Public 24-Hour Forecasting API ───────────────────────────────────────
def forecast_24h(weather_hours: list[dict]) -> list[dict]:
    """
    Takes 24 hourly weather dictionaries and predicts:
      solar_kw, wind_kw, demand_kw, rho, carbon_intensity
    """
    mdl = _get_models()
    results = []

    for w in weather_hours:
        feats = _build_features(
            hour         = w["hour"],
            month        = w["month"],
            temp_c       = w.get("temperature_2m", 32),
            cloud_pct    = w.get("cloudcover", 20),
            uv_index     = w.get("uv_index", 5.0),
            wind_kph     = w.get("windspeed_10m", 18.0),
            pressure_hpa = w.get("surface_pressure", 940),
            rh_pct       = w.get("relative_humidity_2m", 35),
        ).reshape(1, -1)

        solar  = max(0.0, float(mdl["solar"].predict(feats)[0]))
        wind   = max(0.0, float(mdl["wind"].predict(feats)[0]))
        demand = max(50.0, float(mdl["demand"].predict(feats)[0]))
        rho    = moist_air_density(
            w.get("surface_pressure", 940),
            w.get("temperature_2m", 32),
            w.get("relative_humidity_2m", 35)
        )

        # Dynamic grid carbon intensity (higher during evening peak stress)
        hr = w["hour"]
        ci = 0.91 if (18 <= hr < 22) else (0.88 if hr < 6 else 0.82)

        results.append({
            **w,
            "solar_kw":         round(solar, 2),
            "wind_kw":          round(wind, 2),
            "demand_kw":        round(demand, 2),
            "rho":              rho,
            "carbon_intensity": ci,
        })
    return results


if __name__ == "__main__":
    train_models()


