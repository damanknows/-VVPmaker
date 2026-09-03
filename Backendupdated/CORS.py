import os 
import sys
import math
import json
import sqlite3
import threading
import csv
import io
from datetime import datetime, timezone, timedelta
from typing import Optional

import requests as http_req
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

from predictor import forecast_24h
from optimizer import optimize

app = FastAPI(title = "VPP Orchestrator API",
version = "1.0.0",
description = "Virtual Power Plant (VPP) API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173", "http://localhost:8000"],
    allow_credentials = True,
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers = ["Authorization", "Content-Type"],
)

# ── SQLite Database Setup ───────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "vpp_data.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # 1. Telemetry table for historical sensor time-series
    c.execute("""
        CREATE TABLE IF NOT EXISTS telemetry (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            ts          TEXT NOT NULL,
            campus_id   TEXT,
            solar_kw    REAL,
            wind_kw     REAL,
            demand_kw   REAL,
            bess_soc    REAL,
            grid_imp    REAL,
            grid_exp    REAL,
            scenario    TEXT,
            patched     INTEGER
        )
    """)
    
    # 2. Settings table for dynamic threshold tuning
    c.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key  TEXT PRIMARY KEY,
            val  TEXT NOT NULL
        )
    """)
    
    # Default system settings
    defaults = {
        "min_soc_pct":     "15",
        "max_grid_kw":     "200",
        "peak_alert_kw":   "50",
        "campus_id":       "MBM_Jodhpur",
        "bess_cap_kwh":    "200",
        "export_enabled":  "true",
    }
    for k, v in defaults.items():
        c.execute("INSERT OR IGNORE INTO settings (key, val) VALUES (?, ?)", (k, v))
        
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# ── In-Memory Live State (Thread-Safe Cache) ────────────────────────────────
# Allows 2.5-second dashboard polling without hammering the disk
_live_state = {
    "solar_kw":        0.0,
    "wind_kw":         0.0,
    "demand_kw":       0.0,
    "bess_soc_pct":    55.0,
    "grid_import_kw":  0.0,
    "grid_export_kw":  0.0,
    "temperature_c":   32.0,
    "scenario":        "normal",
    "last_ts":         datetime.now().isoformat(),
}
_live_lock = threading.Lock()

# ── Pydantic Request Models ─────────────────────────────────────────────────

class TelemetryPayload(BaseModel):
    campus_id:       str
    timestamp:       str
    solar_kw:        float
    wind_kw:         float
    demand_kw:       float
    bess_soc_pct:    float
    bess_power_kw:   float = 0.0
    grid_import_kw:  float = 0.0
    grid_export_kw:  float = 0.0
    temperature_c:   float = 32.0
    cloud_cover_pct: float = 20.0
    wind_speed_mps:  float = 5.0
    voltage_pv_v:    float = 400.0
    frequency_hz:    float = 50.0
    scenario:        str   = "normal"
    missing_patched: bool  = False

class SettingsPayload(BaseModel):
    key: str
    val: str

class ScenarioPayload(BaseModel):
    scenario: str   # Options: "normal", "cloud_cover", "wind_gust", "tariff_spike"

class OptimizeRequest(BaseModel):
    campus_id: str   = "MBM_Jodhpur"
    init_soc:  float = 0.55


# ── Campus Hardware Benchmarks ──────────────────────────────────────────────
CAMPUS_BENCHMARKS = {
    "MBM_Jodhpur": {
        "name": "MBM University, Jodhpur",
        "category": "Premier Engineering University",
        "type_icon": "🎓",
        "solar_kwp": 250, "wind_kw": 50, "bess_kwh": 200, "annual_kwh": 465000,
        "grid_voltage_kv": 11.0, "power_factor": 0.98, "baseline_co2_t": 376.6
    },
    "MNIT_Jaipur": {
        "name": "MNIT Jaipur",
        "category": "Institute of National Importance",
        "type_icon": "🏛️",
        "solar_kwp": 300, "wind_kw": 20, "bess_kwh": 250, "annual_kwh": 480000,
        "grid_voltage_kv": 11.0, "power_factor": 0.99, "baseline_co2_t": 388.8
    },
    "BTU_Bikaner": {
        "name": "Bikaner Technical University",
        "category": "State Technical University",
        "type_icon": "🏛️",
        "solar_kwp": 180, "wind_kw": 80, "bess_kwh": 150, "annual_kwh": 385000,
        "grid_voltage_kv": 11.0, "power_factor": 0.97, "baseline_co2_t": 311.8
    },
    "RTU_Kota": {
        "name": "Rajasthan Technical University, Kota",
        "category": "State Technical University",
        "type_icon": "🏛️",
        "solar_kwp": 220, "wind_kw": 30, "bess_kwh": 180, "annual_kwh": 375000,
        "grid_voltage_kv": 11.0, "power_factor": 0.98, "baseline_co2_t": 303.7
    },
    "GEC_Ajmer": {
        "name": "Govt Engineering College, Ajmer",
        "category": "Government Engineering College",
        "type_icon": "🏫",
        "solar_kwp": 150, "wind_kw": 40, "bess_kwh": 120, "annual_kwh": 285000,
        "grid_voltage_kv": 11.0, "power_factor": 0.96, "baseline_co2_t": 230.8
    },
    "CTAE_Udaipur": {
        "name": "CTAE MPUAT, Udaipur",
        "category": "Government Engineering College",
        "type_icon": "🏫",
        "solar_kwp": 200, "wind_kw": 10, "bess_kwh": 150, "annual_kwh": 310000,
        "grid_voltage_kv": 11.0, "power_factor": 0.97, "baseline_co2_t": 251.1
    },
}

CAMPUS_COORDS = {
    "MBM_Jodhpur":  {"lat": 26.2389, "lon": 73.0243},
    "MNIT_Jaipur":  {"lat": 26.9124, "lon": 75.7873},
    "BTU_Bikaner":  {"lat": 28.0229, "lon": 73.3119},
    "RTU_Kota":     {"lat": 25.2138, "lon": 75.8648},
    "GEC_Ajmer":    {"lat": 26.4536, "lon": 74.7083},
    "CTAE_Udaipur": {"lat": 24.5854, "lon": 73.7125},
}


# ── Weather Ingestion (Open-Meteo API + Synthetic Fallback) ─────────────────
def _synthetic_weather(campus_id: str) -> list[dict]:
    import random
    now = datetime.now()
    m = now.month
    return [{
        "hour":                 h,
        "month":                m,
        "hour_label":           f"{h:02d}:00",
        "temperature_2m":       32 + 8 * math.sin(2 * math.pi * (h - 14) / 24) + (2 if m in [4, 5, 6] else 0),
        "cloudcover":           15 + 20 * random.random() + (30 if m in [7, 8, 9] else 0),
        "uv_index":             max(0, math.sin(math.pi * h / 12) * 9.5) if 6 <= h <= 18 else 0,
        "windspeed_10m":        18 + 10 * random.random() + (5 if m in [4, 5, 6] else 0),
        "surface_pressure":     940 + random.gauss(0, 3),
        "relative_humidity_2m": 30 + (20 if m in [7, 8, 9] else 0) + random.gauss(0, 3),
    } for h in range(24)]

def _fetch_weather(campus_id: str) -> list[dict]:
    coords = CAMPUS_COORDS.get(campus_id, {"lat": 26.2389, "lon": 73.0243})
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={coords['lat']}&longitude={coords['lon']}&"
        f"hourly=temperature_2m,cloudcover,uv_index,windspeed_10m,"
        f"surface_pressure,relative_humidity_2m&"
        f"timezone=Asia/Kolkata&forecast_days=1"
    )
    try:
        resp = http_req.get(url, timeout=6)
        resp.raise_for_status()
        data = resp.json()["hourly"]
        hours = []
        now = datetime.now()
        for i in range(24):
            hours.append({
                "hour":                 i,
                "month":                now.month,
                "hour_label":           f"{i:02d}:00",
                "temperature_2m":       data["temperature_2m"][i],
                "cloudcover":           data["cloudcover"][i],
                "uv_index":             data["uv_index"][i],
                "windspeed_10m":        data["windspeed_10m"][i],
                "surface_pressure":     data["surface_pressure"][i],
                "relative_humidity_2m": data["relative_humidity_2m"][i],
            })
        return hours
    except Exception as e:
        print(f"[weather] API error: {e} -> Using synthetic fallback.")
        return _synthetic_weather(campus_id)

# ── API Endpoints ───────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "VPP Orchestrator",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

# 1. Ingest Sensor Readings (from Simulator or IoT Gateways)
@app.post("/api/telemetry")
def ingest_telemetry(payload: TelemetryPayload):
    global _live_state
    with _live_lock:
        _live_state.update({
            "solar_kw":        payload.solar_kw,
            "wind_kw":         payload.wind_kw,
            "demand_kw":       payload.demand_kw,
            "bess_soc_pct":    payload.bess_soc_pct,
            "grid_import_kw":  payload.grid_import_kw,
            "grid_export_kw":  payload.grid_export_kw,
            "temperature_c":   payload.temperature_c,
            "cloud_cover_pct": payload.cloud_cover_pct,
            "wind_speed_mps":  payload.wind_speed_mps,
            "scenario":        payload.scenario,
            "last_ts":         payload.timestamp,
        })

    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        INSERT INTO telemetry
            (ts, campus_id, solar_kw, wind_kw, demand_kw, bess_soc, grid_imp, grid_exp, scenario, patched)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (payload.timestamp, payload.campus_id,
         payload.solar_kw, payload.wind_kw, payload.demand_kw,
         payload.bess_soc_pct, payload.grid_import_kw, payload.grid_export_kw,
         payload.scenario, int(payload.missing_patched))
    )
    conn.commit()
    conn.close()
    return {"ok": True, "received_ts": payload.timestamp}

# 2. Live State for Dashboard Polling (runs every 2.5s)
@app.get("/api/live")
def get_live():
    with _live_lock:
        state = dict(_live_state)
    state["renewable_kw"] = round(state["solar_kw"] + state["wind_kw"], 2)
    state["net_kw"]       = round(state["grid_import_kw"] - state["grid_export_kw"], 2)
    return state

# 3. Campus Metadata
@app.get("/api/campuses")
def get_campuses():
    return CAMPUS_BENCHMARKS

# ── 4. Scenario Trigger ───────────────────────────────────────────────────────
@app.post("/api/scenario")
def set_scenario(payload: ScenarioPayload):
    allowed = {"normal", "cloud_cover", "wind_gust", "tariff_spike"}
    if payload.scenario not in allowed:
        raise HTTPException(status_code=400, detail=f"Unknown scenario. Use one of: {allowed}")
    return {
        "ok": True,
        "scenario": payload.scenario,
        "message": f"Scenario '{payload.scenario}' activated."
    }

# ── 5. System Settings (CRUD) ─────────────────────────────────────────────────
@app.post("/api/settings")
def update_setting(payload: SettingsPayload):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO settings (key, val) VALUES (?, ?)",
        (payload.key, payload.val)
    )
    conn.commit()
    conn.close()
    return {"ok": True, "key": payload.key, "val": payload.val}

@app.get("/api/settings")
def get_settings():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT key, val FROM settings").fetchall()
    conn.close()
    return {k: v for k, v in rows}

# ── 6. Historical Telemetry for Charts ────────────────────────────────────────
@app.get("/api/history")
def get_history(limit: int = 120, campus_id: Optional[str] = None):
    conn = sqlite3.connect(DB_PATH)
    if campus_id:
        rows = conn.execute(
            "SELECT ts, solar_kw, wind_kw, demand_kw, bess_soc, grid_imp, grid_exp, scenario "
            "FROM telemetry WHERE campus_id=? ORDER BY id DESC LIMIT ?",
            (campus_id, limit)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT ts, solar_kw, wind_kw, demand_kw, bess_soc, grid_imp, grid_exp, scenario "
            "FROM telemetry ORDER BY id DESC LIMIT ?",
            (limit,)
        ).fetchall()
    conn.close()
    
    data = [{
        "ts":              r[0],
        "solar_kw":        r[1],
        "wind_kw":         r[2],
        "demand_kw":       r[3],
        "bess_soc":        r[4],
        "grid_import_kw":  r[5],
        "grid_export_kw":  r[6],
        "scenario":        r[7]
    } for r in reversed(rows)]
    
    return {"data": data, "count": len(data)}

# ── 7. Statutory Carbon Audit Report (CSV Download) ───────────────────────────
@app.get("/api/report/csv")
def export_report(campus_id: str = "MBM_Jodhpur", days: int = 30):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT ts, solar_kw, wind_kw, demand_kw, grid_imp, grid_exp, scenario "
        "FROM telemetry WHERE campus_id=? ORDER BY ts DESC LIMIT ?",
        (campus_id, days * 1440)
    ).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Timestamp", "Solar (kW)", "Wind (kW)", "Demand (kW)",
        "Grid Import (kW)", "Grid Export (kW)",
        "Renewable Gen (kWh)", "CO2 Prevented (kg)", "CO2 Prevented (tonnes)",
        "Tariff Savings (INR)", "Scenario"
    ])
    
    total_renewable = 0.0
    tick_interval_s = 2
    interval_h = tick_interval_s / 3600.0

    for r in reversed(rows):
        ts, sol, win, dem, gimp, gexp, scen = r
        renewable_kwh = (sol + win) * interval_h
        co2_kg        = round(renewable_kwh * 0.81, 4)
        co2_t         = round(co2_kg / 1000.0, 6)
        saving        = round((sol + win) * 7.55 * interval_h, 4)
        total_renewable += renewable_kwh
        writer.writerow([ts, sol, win, dem, gimp, gexp, round(renewable_kwh, 4), co2_kg, co2_t, saving, scen])

    # Append Statutory Summary Block
    writer.writerow([])
    writer.writerow(["--- STATUTORY AUDIT SUMMARY ---"])
    writer.writerow(["Campus", campus_id])
    writer.writerow(["Report Window (Days)", days])
    writer.writerow(["Total Clean Energy Generated (kWh)", round(total_renewable, 2)])
    writer.writerow(["Total CO2 Prevented (kg)", round(total_renewable * 0.81, 2)])
    writer.writerow(["Total CO2 Prevented (Metric Tons)", round(total_renewable * 0.81 / 1000.0, 4)])
    writer.writerow(["CEA Baseline Factor", "0.81 kg CO2 / kWh (Official CEA Baseline)"])
    writer.writerow(["Generated Timestamp", datetime.now().isoformat()])

    output.seek(0)
    filename = f"VPP_Carbon_Report_{campus_id}_{datetime.now().strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ── 8. 24-Hour ML Forecasting Endpoint ──────────────────────────────────────
@app.get("/api/forecast")
def get_forecast(campus_id: str = "MBM_Jodhpur"):
    weather = _fetch_weather(campus_id)
    fc = forecast_24h(weather)
    return {
        "campus_id": campus_id,
        "forecasts": fc,
        "weather_source": "Open-Meteo API + ML GradientBoosting"
    }

# ── 9. PuLP LP Optimization Endpoint ────────────────────────────────────────
@app.post("/api/optimize")
def run_optimize(req: OptimizeRequest):
    weather = _fetch_weather(req.campus_id)
    fc = forecast_24h(weather)
    bench = CAMPUS_BENCHMARKS.get(req.campus_id, CAMPUS_BENCHMARKS["MBM_Jodhpur"])
    
    result = optimize(
        forecasts=fc,
        init_soc=req.init_soc,
        campus_id=req.campus_id,
        bess_cap_kwh=bench["bess_kwh"],
    )
    return result

# ── 10. Health Check ──────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {
        "status":     "healthy",
        "database":   os.path.exists(DB_PATH),
        "timestamp":  datetime.now().isoformat(),
    }

# ── 11. Server Launcher ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



