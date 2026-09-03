import time
import random
import datetime
# import requests  # We can comment this out until Pair B finishes the backend

# SERVER_URL = "http://localhost:8000/api/telemetry"

def generate_telemetry():
    now = datetime.datetime.now()
    hour = now.hour

    # Simulate solar generation (bell curve peaking at noon)
    is_day = 6 <= hour <= 18
    solar = max(0.0, round(200 * (1 - abs(12 - hour)/6) + random.uniform(-10, 10), 1)) if is_day else 0.0
    wind = round(random.uniform(15, 45), 1)
    load = round(150 + random.uniform(-20, 30), 1)

    return {
        "timestamp": now.isoformat(),
        "campus_id": "DTE_JODHPUR",
        "solar_kw": solar,
        "wind_kw": wind,
        "battery_soc_pct": round(random.uniform(40, 80), 1),
        "campus_load_kw": load
    }

# THIS IS THE LOOP YOU NEED:
while True:
    payload = generate_telemetry()
    print(f"[SIMULATOR STREAM] {payload}")
    time.sleep(1) # 1-second ticks