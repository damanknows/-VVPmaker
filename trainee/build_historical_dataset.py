import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Step 2: Fetch 30 days of actual historical weather for Jodhpur
end_date = datetime.now().date()
start_date = end_date - timedelta(days=30)

url = (
    f"https://archive-api.open-meteo.com/v1/archive?"
    f"latitude=26.2389&longitude=73.0243&"
    f"start_date={start_date}&end_date={end_date}&"
    f"hourly=temperature_2m,cloudcover,windspeed_10m,windgusts_10m&"
    f"timezone=Asia/Kolkata"
)

response = requests.get(url)
data = response.json()["hourly"]
df = pd.DataFrame(data)

# Rename features to match the exact Step 1 feature list
df.rename(columns={
    "time": "timestamp",
    "temperature_2m": "temp_c",
    "cloudcover": "cloud_pct",
    "windspeed_10m": "wind_speed",
    "windgusts_10m": "wind_gust"
}, inplace=True)

df["timestamp"] = pd.to_datetime(df["timestamp"])

# Step 1: Feature Engineering
df["hour_of_day"] = df["timestamp"].dt.hour
df["day_of_year"] = df["timestamp"].dt.dayofyear
df["day_of_week"] = df["timestamp"].dt.dayofweek

# Campus specific demand features (0-4 are Mon-Fri)
df["is_lab_hour"] = ((df["hour_of_day"] >= 9) & (df["hour_of_day"] <= 17) & (df["day_of_week"] < 5)).astype(int)
df["is_hostel_peak"] = ((df["hour_of_day"] >= 18) & (df["hour_of_day"] <= 23)).astype(int)

# Create labeled targets based on physical relationships with the real weather data
# Solar: Heavily penalized by actual cloud cover
sun_angle = np.maximum(0, 10 * (1 - np.abs(12 - df["hour_of_day"])/6))
df["solar_kw"] = np.maximum(0, (sun_angle * 20) - (df["cloud_pct"] * 0.8) + np.random.normal(0, 2, len(df))).round(1)

# Wind: Based strictly on historical wind speed and gusts
df["wind_kw"] = np.maximum(0, (df["wind_speed"] * 1.5) + (df["wind_gust"] * 0.5) - 10 + np.random.normal(0, 2, len(df))).round(1)

# Demand: Base load + Lab usage + Evening hostel surge + HVAC (Temp) load
base_load = 50
hvac_load = np.maximum(0, df["temp_c"] - 25) * 5 
df["demand_kw"] = (base_load + (df["is_lab_hour"] * 100) + (df["is_hostel_peak"] * 80) + hvac_load + np.random.normal(0, 5, len(df))).round(1)

# Save the final labeled dataset
df.to_csv("real_historical_training_data.csv", index=False)
print(f"Dataset generated with {len(df)} real historical hours.")
print(df[["timestamp", "temp_c", "solar_kw", "wind_kw", "demand_kw"]].head(10))