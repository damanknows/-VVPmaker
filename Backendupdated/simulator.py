"""
simulator.py — VPP IoT Telemetry & Modbus/MQTT Simulator
Simulates live sensor feeds from:
  - Solar PV Inverters (250 kWp array)
  - Wind Turbine Controller (50 kW)
  - Battery BMS (200 kWh BESS with real SoC state tracking)
  - Campus Smart Meter (Demand load)
  - Grid Meter (Import/Export power)

Includes Piecewise Linear (Finite-Difference) Interpolation for missing sensor data.
"""

import math
import time
import random
import requests
import json
import threading
import sys
from datetime import datetime, timezone

# ── Simulator Configuration ──────────────────────────────────────────────────
API_URL        = "http://127.0.0.1:8000/api/telemetry"
TICK_INTERVAL  = 2          # 2 seconds between sensor updates
CAMPUS_ID      = "MBM_Jodhpur"


# ── Simulator State ──────────────────────────────────────────────────────────
class SimState:
    def __init__(self):
        self.soc_pct  = 55.0      # Initial Battery SoC (%)
        self.scenario = "normal"  # normal | cloud_cover | wind_gust | tariff_spike
        self.lock     = threading.Lock()

    def set_scenario(self, s: str):
        with self.lock:
            self.scenario = s
            print(f"[sim] Switched scenario to -> {s}")

STATE = SimState()


# ── 1. Finite-Difference Interpolation (Missing Data Patching) ───────────────
def interpolate_missing(readings: list[float]) -> list[float]:
    """
    Auto-patches missing NaN or None values in a telemetry stream using
    piecewise linear interpolation across the gap.
    """
    arr = list(readings)
    n   = len(arr)
    i   = 0
    while i < n:
        if arr[i] is None or math.isnan(arr[i]):
            # Find next valid point
            j = i + 1
            while j < n and (arr[j] is None or math.isnan(arr[j])):
                j += 1
            
            # Find boundary values
            left_val  = arr[i - 1] if i > 0 else (arr[j] if j < n else 0.0)
            right_val = arr[j] if j < n else left_val
            
            # Interpolate linearly across missing window
            gap = j - (i - 1)
            for k in range(i, j):
                frac = (k - (i - 1)) / gap
                arr[k] = round(left_val + frac * (right_val - left_val), 2)
            i = j
        else:
            i += 1
    return arr


# ── 2. Physics-Based Sensor Generators ───────────────────────────────────────
def _solar_kw(hour_f: float, month: int, cloud_pct: float) -> float:
    """Bell-curve solar PV model tuned for Rajasthan STC."""
    if hour_f < 6.0 or hour_f > 19.0:
        return 0.0
    peak_irr = 850.0 * (1.0 + 0.08 * (month in [4, 5, 6]))
    bell     = math.sin(math.pi * (hour_f - 6.0) / 13.0)
    irr      = peak_irr * bell * (1.0 - cloud_pct / 100.0)
    return max(0.0, 250.0 * 0.20 * (irr / 1000.0) + random.gauss(0, 2.5))


def _wind_kw(wind_mps: float, rho: float = 1.18) -> float:
    """Betz power-curve (50 kW rated)."""
    if wind_mps < 3.0 or wind_mps > 25.0:
        return 0.0
    if wind_mps >= 12.0:
        return 50.0 * (rho / 1.225)
    return 50.0 * ((wind_mps**3 - 27.0) / (1728.0 - 27.0)) * (rho / 1.225)


def _demand_kw(hour_f: float, is_weekend: bool) -> float:
    """Diurnal campus load profile."""
    profile = [
        0.50, 0.45, 0.43, 0.42, 0.44, 0.50,
        0.65, 0.82, 0.92, 0.97, 1.00, 0.99,
        0.93, 0.95, 0.98, 0.97, 0.95, 0.90,
        0.96, 1.00, 0.98, 0.90, 0.78, 0.62
    ]
    h    = int(hour_f) % 24
    base = 180.0 if is_weekend else 260.0
    return max(40.0, base * profile[h] + random.gauss(0, 4.0))


# ── 3. Main Telemetry Generation Tick ────────────────────────────────────────
_prev_readings = []

def generate_telemetry() -> dict:
    now      = datetime.now()
    hour_f   = now.hour + now.minute / 60.0
    month    = now.month
    is_wkend = now.weekday() >= 5
    scenario = STATE.scenario

    cloud_pct = 15.0
    wind_mps  = 5.5 + math.sin(hour_f * 0.4) * 2.0
    temp_c    = 34.0 + 6.0 * math.sin(2 * math.pi * (hour_f - 14) / 24) + random.gauss(0, 1)

    # Apply Scenarios
    if scenario == "cloud_cover":
        cloud_pct = 85.0 + random.uniform(-5, 5)
    elif scenario == "wind_gust":
        wind_mps  = 16.0 + random.uniform(-2, 4)
    elif scenario == "tariff_spike":
        hour_f    = 19.5  # Simulate evening peak

    solar  = round(_solar_kw(hour_f, month, cloud_pct), 2)
    wind   = round(_wind_kw(wind_mps), 2)
    demand = round(_demand_kw(hour_f, is_wkend), 2)
    
    # 5% artificial sensor dropout test (missing data injection)
    patched = False
    global _prev_readings
    if random.random() < 0.05 and _prev_readings:
        # Inject NaN and immediately patch with finite-difference interpolation
        series = _prev_readings[-5:] + [float('nan')]
        patched_series = interpolate_missing(series)
        solar = patched_series[-1]
        patched = True
    
    _prev_readings.append(solar)
    if len(_prev_readings) > 20:
        _prev_readings.pop(0)

    # Battery & Grid Power Flow Physics
    net_green = solar + wind
    deficit   = demand - net_green

    with STATE.lock:
        soc = STATE.soc_pct
        if deficit > 0:  # Generation deficit -> Battery discharges or grid imports
            if (18 <= now.hour < 22) and soc > 20.0:  # Peak window -> prefer battery
                bess_power = min(deficit, 50.0)
                grid_imp   = max(0.0, deficit - bess_power)
                grid_exp   = 0.0
                STATE.soc_pct = max(15.0, soc - (bess_power * TICK_INTERVAL / 3600.0 / 200.0) * 100.0)
            else:
                bess_power = 0.0
                grid_imp   = deficit
                grid_exp   = 0.0
        else:  # Generation surplus -> Charge battery or export to grid
            surplus = abs(deficit)
            if soc < 92.0:
                bess_power = -min(surplus, 50.0)
                grid_exp   = max(0.0, surplus - abs(bess_power))
                grid_imp   = 0.0
                STATE.soc_pct = min(95.0, soc + (abs(bess_power) * TICK_INTERVAL / 3600.0 / 200.0) * 100.0)
            else:
                bess_power = 0.0
                grid_exp   = surplus
                grid_imp   = 0.0

    return {
        "campus_id":       CAMPUS_ID,
        "timestamp":       now.isoformat(),
        "solar_kw":        solar,
        "wind_kw":         wind,
        "demand_kw":       demand,
        "bess_soc_pct":    round(STATE.soc_pct, 1),
        "bess_power_kw":   round(bess_power, 2),
        "grid_import_kw":  round(grid_imp, 2),
        "grid_export_kw":  round(grid_exp, 2),
        "temperature_c":   round(temp_c, 1),
        "cloud_cover_pct": round(cloud_pct, 1),
        "wind_speed_mps":  round(wind_mps, 1),
        "voltage_pv_v":    400.0 + random.uniform(-3, 3),
        "frequency_hz":    50.0 + random.uniform(-0.04, 0.04),
        "scenario":        scenario,
        "missing_patched": patched,
    }


# ── 4. Main Streaming Loop ───────────────────────────────────────────────────
def run_simulator():
    if len(sys.argv) > 1:
        STATE.set_scenario(sys.argv[1])

    print(f"[simulator] Starting IoT Telemetry Stream -> {API_URL}")
    print(f"[simulator] Scenario: {STATE.scenario} | Push interval: {TICK_INTERVAL}s")
    
    count = 0
    while True:
        try:
            payload = generate_telemetry()
            resp    = requests.post(API_URL, json=payload, timeout=3)
            count  += 1
            print(f"[{payload['timestamp'][:19]}] Solar: {payload['solar_kw']:5.1f}kW | "
                  f"Wind: {payload['wind_kw']:4.1f}kW | Dem: {payload['demand_kw']:5.1f}kW | "
                  f"BESS: {payload['bess_soc_pct']:4.1f}% | Grid Imp: {payload['grid_import_kw']:5.1f}kW")
        except requests.exceptions.ConnectionError:
            print("[simulator] Backend offline. Waiting for API server on port 8000 ...")
        except Exception as e:
            print(f"[simulator] Error: {e}")
        time.sleep(TICK_INTERVAL)


if __name__ == "__main__":
    run_simulator()
