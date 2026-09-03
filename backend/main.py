from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import math
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_24h_forecast(scenario: str):
    items = []
    for h in range(24):
        hour_str = f"{h:02d}:00"
        is_peak_tariff = 18 <= h <= 22
        
        solar_kw = 0
        wind_kw = 0
        demand_kw = 120 + math.sin((h - 8) / 3) * 35

        if scenario == "SUNNY_PEAK":
            if 6 <= h <= 18:
                solar_factor = math.sin(((h - 6) / 12) * math.pi)
                solar_kw = round(210 * math.pow(solar_factor, 1.2))
            wind_kw = round(20 + random.random() * 15)
        elif scenario == "CLOUDY_AFTERNOON":
            if 6 <= h <= 18:
                solar_factor = math.sin(((h - 6) / 12) * math.pi)
                cloud_dip = 0.35 if 12 <= h <= 15 else 0.8
                solar_kw = round(140 * solar_factor * cloud_dip)
            wind_kw = round(35 + random.random() * 20)
        elif scenario == "WINDY_NIGHT":
            if 7 <= h <= 17:
                solar_kw = round(60 * math.sin(((h - 7) / 10) * math.pi))
            wind_kw = round(110 + math.sin(h / 3) * 25)
            demand_kw = max(90, demand_kw * 0.85)

        total_green = solar_kw + wind_kw
        is_surplus = total_green > demand_kw

        battery_soc = 50
        if h < 6:
            battery_soc = max(30, 70 - h * 4)
        elif 11 <= h <= 15:
            battery_soc = min(95, 55 + (h - 10) * 8)
        elif 18 <= h <= 22:
            battery_soc = max(25, 85 - (h - 17) * 12)
        else:
            battery_soc = 65

        grid_import_kw = 0
        if total_green < demand_kw:
            grid_import_kw = max(0, round(demand_kw - total_green - (25 if is_peak_tariff else 10)))

        items.append({
            "hour": hour_str,
            "solar_kw": max(0, solar_kw),
            "wind_kw": max(0, wind_kw),
            "demand_kw": round(demand_kw),
            "battery_soc": round(battery_soc),
            "grid_import_kw": round(grid_import_kw),
            "is_surplus": is_surplus,
            "is_peak_tariff": is_peak_tariff,
        })
    return items

@app.get("/api/forecast/24h")
def get_forecast_24h(scenario: str = Query("SUNNY_PEAK")):
    return generate_24h_forecast(scenario)

@app.get("/api/recommendations")
def get_recommendations():
    return [
        {
            "id": "rec-1",
            "type": "LOAD_SHIFT",
            "priority": "HIGH",
            "title": "Shift Heavy Mechanical Workshop Load",
            "action": "Schedule CNC milling & electric furnace operation between 12:30 - 15:00 during Solar Surplus Window.",
            "financial_impact": "Save ₹1,850 in peak tariff surcharges",
            "carbon_impact": "54 kg CO₂ avoided today",
            "status": "PENDING",
        },
        {
            "id": "rec-2",
            "type": "BATTERY_DISCHARGE",
            "priority": "HIGH",
            "title": "Pre-Discharge BESS #1 for Evening Peak Tariff",
            "action": "Discharge 120 kWh BESS into campus microgrid from 18:30 to 21:00 to avoid expensive grid draw.",
            "financial_impact": "Save ₹2,400 during peak ₹11.5/kWh rate",
            "carbon_impact": "78 kg CO₂ avoided",
            "status": "PENDING",
        },
        {
            "id": "rec-3",
            "type": "BATTERY_CHARGE",
            "priority": "MEDIUM",
            "title": "Pre-Charge Battery Array using Solar Over-Generation",
            "action": "Ramp charging rate to +35 kW between 11:00 and 14:00 to store excess solar production.",
            "financial_impact": "Utilize ₹950 of zero-cost solar power",
            "carbon_impact": "38 kg CO₂ sequestered equivalent",
            "status": "PENDING",
        },
        {
            "id": "rec-4",
            "type": "CURTAILMENT",
            "priority": "LOW",
            "title": "Smart HVAC Staggering in Library Block",
            "action": "Stagger 4x 15-ton chiller startups by 15 minutes to reduce campus peak demand spike.",
            "financial_impact": "Reduce maximum demand charge by ₹1,120/mo",
            "carbon_impact": "22 kg CO₂ avoided",
            "status": "PENDING",
        },
    ]

@app.get("/api/telemetry/current")
def get_telemetry_current(scenario: str = Query("SUNNY_PEAK"), hour: int = Query(14)):
    forecast = generate_24h_forecast(scenario)
    
    # ensure hour is between 0 and 23
    hour = min(23, max(0, hour))
    current = forecast[hour]

    total_gen = current["solar_kw"] + current["wind_kw"]
    net_power = total_gen - current["demand_kw"]

    battery_power_kw = 0
    grid_import_kw = 0
    grid_export_kw = 0

    if net_power > 0:
        battery_power_kw = min(45, round(net_power))
        grid_export_kw = max(0, round(net_power - battery_power_kw))
    else:
        deficit = abs(net_power)
        battery_power_kw = -min(40, round(deficit))
        grid_import_kw = max(0, round(deficit - abs(battery_power_kw)))

    rupees_saved = round(3800 + hour * 240 + (850 if scenario == "SUNNY_PEAK" else 200))
    co2_saved_kg = round(280 + hour * 18.5 + (45 if scenario == "WINDY_NIGHT" else 15), 1)

    now = datetime.now()
    now = now.replace(hour=hour, minute=30, second=0, microsecond=0)

    return {
        "timestamp": now.isoformat(),
        "solar_kw": current["solar_kw"],
        "wind_kw": current["wind_kw"],
        "demand_kw": current["demand_kw"],
        "battery_soc": current["battery_soc"],
        "battery_power_kw": battery_power_kw,
        "grid_import_kw": grid_import_kw,
        "grid_export_kw": grid_export_kw,
        "co2_saved_kg": co2_saved_kg,
        "rupees_saved": rupees_saved,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
