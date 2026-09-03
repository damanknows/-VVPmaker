"""
optimizer.py — VPP PuLP Linear Programming Optimization Engine
Formulates a 24-hour rolling-horizon MPC (Model Predictive Control) optimization:
  - Minimizes: Electricity Bill + Carbon Cost - Grid Export Revenue
  - Constrains: Battery SoC bounds (15%-95%), round-trip efficiency (94%),
                energy balance, and RERC HT-2 Time-of-Day peak-avoidance rules.
"""

import sys
import io
import math
from typing import Optional
import pulp

# ── RERC HT-2 Time-of-Day Tariff Structure ──────────────────────────────────
def _tariff(hour: int) -> float:
    if 18 <= hour < 22:
        return 8.68   # Peak window (+15% surcharge)
    if 22 <= hour or hour < 6:
        return 6.42   # Off-Peak window (-15% rebate)
    return 7.55       # Normal base rate


# ── Battery (BESS) Hardware Parameters ──────────────────────────────────────
BESS_CAPACITY_KWH   = 200.0   # Default 200 kWh battery
BESS_MAX_CHARGE_KW  = 60.0    # C-rate ~0.3
BESS_MAX_DISCH_KW   = 60.0
BESS_EFF_CHARGE     = 0.94    # 94% charging efficiency
BESS_EFF_DISCH      = 0.94    # 94% discharging efficiency
BESS_SOC_MIN        = 0.15    # 15% minimum DoD safety threshold
BESS_SOC_MAX        = 0.95    # 95% maximum SoC threshold
CARBON_COST_RS      = 0.50    # ₹/kg CO2 internal shadow carbon penalty
EXPORT_RATE_RS      = 4.50    # ₹/kWh feed-in tariff for exporting to grid


# ── Core 24-Hour Optimization Solver ────────────────────────────────────────
def optimize(
    forecasts:   list[dict],
    init_soc:    float = 0.50,
    campus_id:   str   = "MBM_Jodhpur",
    bess_cap_kwh: Optional[float] = None,
) -> dict:
    """
    Solves the 24-hour Linear Program and returns optimal hourly dispatch schedule.
    """
    cap = bess_cap_kwh or BESS_CAPACITY_KWH
    T   = min(24, len(forecasts))

    # 1. Initialize LP Problem
    prob = pulp.LpProblem("VPP_Energy_Optimizer", pulp.LpMinimize)

    # 2. Decision Variables
    grid_buy   = [pulp.LpVariable(f"grid_buy_{t}",   lowBound=0) for t in range(T)]
    grid_sell  = [pulp.LpVariable(f"grid_sell_{t}",  lowBound=0) for t in range(T)]
    bess_chg   = [pulp.LpVariable(f"bess_chg_{t}",   lowBound=0, upBound=BESS_MAX_CHARGE_KW) for t in range(T)]
    bess_disch = [pulp.LpVariable(f"bess_disch_{t}", lowBound=0, upBound=BESS_MAX_DISCH_KW)  for t in range(T)]
    soc        = [pulp.LpVariable(f"soc_{t}", lowBound=BESS_SOC_MIN * cap, upBound=BESS_SOC_MAX * cap) for t in range(T)]
    mode       = [pulp.LpVariable(f"mode_{t}", cat="Binary") for t in range(T)]  # 1=charge, 0=discharge

    # 3. Objective Function
    prob += pulp.lpSum(
        _tariff(forecasts[t]["hour"]) * grid_buy[t]
        + forecasts[t]["carbon_intensity"] * CARBON_COST_RS * grid_buy[t]
        - EXPORT_RATE_RS * grid_sell[t]
        for t in range(T)
    )

    # 4. Constraints
    for t in range(T):
        f   = forecasts[t]
        gen = f["solar_kw"] + f["wind_kw"]
        dem = f["demand_kw"]

        # A. Power Balance: Generation + Grid Buy + BESS Discharge = Demand + BESS Charge + Grid Sell
        prob += (gen + grid_buy[t] + bess_disch[t] * BESS_EFF_DISCH
                 == dem + bess_chg[t] / BESS_EFF_CHARGE + grid_sell[t])

        # B. Battery State of Charge (SoC) Transition
        if t == 0:
            prob += soc[t] == init_soc * cap + bess_chg[t] - bess_disch[t]
        else:
            prob += soc[t] == soc[t-1] + bess_chg[t] - bess_disch[t]

        # C. Big-M Anti-Simultaneous Charge/Discharge Constraint (M = 120)
        M = 120
        prob += bess_chg[t]   <= M * mode[t]
        prob += bess_disch[t] <= M * (1 - mode[t])

        # D. Peak Avoidance Rules
        hr = f["hour"]
        if 18 <= hr < 22:
            prob += mode[t] == 0        # Force discharge mode
            prob += bess_disch[t] >= 15 # Minimum 15 kW peak shaving
        if 22 <= hr or hr < 6:
            prob += mode[t] == 1        # Force charging mode
            prob += bess_chg[t] >= 10   # Minimum 10 kW off-peak top-up

    # 5. Solve via CBC Solver
    solver = pulp.PULP_CBC_CMD(msg=0, timeLimit=20)
    status = prob.solve(solver)

    # 6. Extract Schedule Results
    schedule            = []
    total_cost          = 0.0
    total_export_rev    = 0.0
    total_renewable_kwh = 0.0

    for t in range(T):
        f      = forecasts[t]
        hr     = f["hour"]
        tariff = _tariff(hr)

        gb = max(0.0, pulp.value(grid_buy[t]) or 0.0)
        gs = max(0.0, pulp.value(grid_sell[t]) or 0.0)
        bc = max(0.0, pulp.value(bess_chg[t]) or 0.0)
        bd = max(0.0, pulp.value(bess_disch[t]) or 0.0)
        sv = max(BESS_SOC_MIN * cap, min(BESS_SOC_MAX * cap, pulp.value(soc[t]) or init_soc * cap))
        soc_pct = round((sv / cap) * 100.0, 1)

        cost_hr        = tariff * gb
        rev_hr         = EXPORT_RATE_RS * gs
        gen_hr         = f["solar_kw"] + f["wind_kw"]
        renewable_self = min(gen_hr, f["demand_kw"] + bc)

        total_cost          += cost_hr
        total_export_rev    += rev_hr
        total_renewable_kwh += renewable_self

        # Plain-Language Operator Recommendation
        if 18 <= hr < 22:
            status_label = "🔴 PEAK — Discharge BESS"
            action = f"Discharge BESS {bd:.1f} kW to avoid ₹8.68/kWh peak tariff"
        elif 22 <= hr or hr < 6:
            status_label = "🟢 OFF-PEAK — Charge BESS"
            action = f"Charge BESS {bc:.1f} kW at cheap ₹6.42/kWh off-peak rate"
        elif gen_hr > f["demand_kw"]:
            status_label = "⚡ SOLAR SURPLUS — Export"
            action = f"Export {gs:.1f} kW surplus to grid at ₹{EXPORT_RATE_RS}/kWh"
        else:
            status_label = "🟡 NORMAL — Self-Consume"
            action = f"Self-consume solar+wind ({gen_hr:.1f} kW), BESS {soc_pct}%"

        schedule.append({
            "hour":              hr,
            "time":              f.get("hour_label", f"{hr:02d}:00"),
            "solar_kw":          round(f["solar_kw"], 1),
            "wind_kw":           round(f["wind_kw"], 1),
            "demand_kw":         round(f["demand_kw"], 1),
            "grid_buy_kw":       round(gb, 1),
            "grid_sell_kw":      round(gs, 1),
            "bess_charge_kw":    round(bc, 1),
            "bess_discharge_kw": round(bd, 1),
            "soc_pct":           soc_pct,
            "tariff":            tariff,
            "cost_rs":           round(cost_hr, 2),
            "status":            status_label,
            "action":            action,
        })

    # Baseline Cost (No-solar, no-battery unmanaged grid draw)
    baseline_cost = sum(_tariff(forecasts[t]["hour"]) * forecasts[t]["demand_kw"] for t in range(T))
    savings_rs    = round(baseline_cost - total_cost, 2)
    carbon_saved  = round(total_renewable_kwh * 0.81, 2)

    return {
        "status":               pulp.LpStatus[status],
        "schedule":             schedule,
        "total_cost_rs":        round(total_cost, 2),
        "export_rev_rs":        round(total_export_rev, 2),
        "savings_rs":           savings_rs,
        "baseline_cost_rs":     round(baseline_cost, 2),
        "carbon_saved_kg":      carbon_saved,
        "renewable_kwh":        round(total_renewable_kwh, 2),
        "self_sufficiency_pct": round(total_renewable_kwh / max(1, sum(f["demand_kw"] for f in forecasts)) * 100, 1),
        "recommendations":      _generate_recommendations(schedule, savings_rs, carbon_saved),
    }


def _generate_recommendations(schedule: list, savings_rs: float, carbon_kg: float) -> list[dict]:
    recs = []
    peak_grid = sum(s["grid_buy_kw"] for s in schedule if 18 <= s["hour"] < 22)
    if peak_grid > 50:
        recs.append({
            "priority": "HIGH",
            "icon": "🔴",
            "title": "Peak Grid Draw Alert",
            "body": f"Campus importing {peak_grid:.0f} kW during peak window. Stagger heavy loads before 18:00."
        })

    offpeak = [s for s in schedule if (22 <= s["hour"] or s["hour"] < 6) and s["bess_charge_kw"] > 20]
    if offpeak:
        recs.append({
            "priority": "LOW",
            "icon": "🟢",
            "title": "Off-Peak Arbitrage Active",
            "body": f"BESS pre-charging at ₹6.42/kWh. Projected daily savings: ₹{savings_rs:,.0f}."
        })

    if not recs:
        recs.append({
            "priority": "LOW",
            "icon": "✅",
            "title": "System Optimal",
            "body": f"Operating within target parameters. Carbon offset: {carbon_kg:.1f} kg CO₂."
        })
    return recs


if __name__ == "__main__":
    from predictor import forecast_24h
    from datetime import datetime
    now = datetime.now()
    dummy_weather = [
        {"hour": h, "month": now.month, "hour_label": f"{h:02d}:00",
         "temperature_2m": 35, "cloudcover": 15, "uv_index": max(0.0, (8 - abs(h - 12)) * 1.2),
         "windspeed_10m": 20, "surface_pressure": 942, "relative_humidity_2m": 30}
        for h in range(24)
    ]
    fc = forecast_24h(dummy_weather)
    result = optimize(fc)
    print(f"\n[optimizer] LP Solver Status : {result['status']}")
    print(f"[optimizer] Optimized Cost   : Rs {result['total_cost_rs']:,.2f}")
    print(f"[optimizer] Net Savings vs 0 : Rs {result['savings_rs']:,.2f}")
    print(f"[optimizer] Carbon Avoided   : {result['carbon_saved_kg']:.1f} kg CO2")
