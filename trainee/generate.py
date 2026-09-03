import pandas as pd
import numpy as np

# Generate 1 year of hourly timestamps
dates = pd.date_range(start="2025-01-01", periods=8760, freq="h")
df = pd.DataFrame({"timestamp": dates})

df["hour"] = df["timestamp"].dt.hour
df["month"] = df["timestamp"].dt.month

# Generate realistic weather features
df["temp_c"] = np.random.normal(loc=25, scale=8, size=8760).round(1) # Rajasthan gets hot
df["cloud_pct"] = np.random.uniform(0, 100, size=8760).round(1)
df["wind_speed_kmh"] = np.random.uniform(5, 45, size=8760).round(1)

# Calculate Air Density approximation (kg/m^3) based on temperature
# Standard pressure approximation divided by (Gas Constant * Temp in Kelvin)
df["air_density"] = (101325 / (287.05 * (df["temp_c"] + 273.15))).round(3)

# Generate UV Index (bell curve peaking at noon, 0 at night)
df["uv_index"] = np.where(
    (df["hour"] >= 6) & (df["hour"] <= 18),
    np.maximum(0, 10 * (1 - np.abs(12 - df["hour"])/6) - (df["cloud_pct"]/20)),
    0
).round(1)

# Generate Targets (Solar highly dependent on UV/Clouds; Wind dependent on speed)
df["solar_kw"] = np.maximum(0, (df["uv_index"] * 25) - (df["cloud_pct"] * 0.5) + np.random.normal(0, 5, 8760)).round(1)
df["wind_kw"] = np.maximum(0, (df["wind_speed_kmh"] * 1.5) + (df["air_density"] * 10) - 15 + np.random.normal(0, 3, 8760)).round(1)

# Save exactly as the training script expects
df.to_csv("historical_campus_energy_data.csv", index=False)
print("Successfully generated historical_campus_energy_data.csv with 8,760 rows.")