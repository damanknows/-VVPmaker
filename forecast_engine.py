import requests
import pandas as pd
import joblib
from datetime import datetime

def forecast_next_24_hours(lat=26.2389, lon=73.0243):
    # Step 6: Fetch live forecast for the next couple of days
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"hourly=temperature_2m,cloudcover,windspeed_10m,windgusts_10m&"
        f"forecast_days=2&timezone=Asia/Kolkata"
    )
    response = requests.get(url)
    df = pd.DataFrame(response.json()["hourly"])
    
    # Clean and feature engineer exactly like your training script
    df.rename(columns={
        "time": "timestamp",
        "temperature_2m": "temp_c",
        "cloudcover": "cloud_pct",
        "windspeed_10m": "wind_speed",
        "windgusts_10m": "wind_gust"
    }, inplace=True)
    
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    
    # Filter to only keep the next 24 hours from right now
    now = pd.Timestamp.now()
    df = df[df["timestamp"] >= now].head(24).copy()
    
    # Apply features
    df["hour_of_day"] = df["timestamp"].dt.hour
    df["day_of_year"] = df["timestamp"].dt.dayofyear
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["is_lab_hour"] = ((df["hour_of_day"] >= 9) & (df["hour_of_day"] <= 17) & (df["day_of_week"] < 5)).astype(int)
    df["is_hostel_peak"] = ((df["hour_of_day"] >= 18) & (df["hour_of_day"] <= 23)).astype(int)
    
    # Load models
    solar_rf = joblib.load("solar_model.pkl")
    wind_rf = joblib.load("wind_model.pkl")
    demand_rf = joblib.load("demand_model.pkl")
    
    # Predict
    df["solar_kw"] = solar_rf.predict(df[["hour_of_day", "cloud_pct", "temp_c", "day_of_year"]]).round(1)
    df["wind_kw"] = wind_rf.predict(df[["wind_speed", "wind_gust", "hour_of_day"]]).round(1)
    df["demand_kw"] = demand_rf.predict(df[["hour_of_day", "day_of_week", "is_lab_hour", "is_hostel_peak", "temp_c"]]).round(1)
    
    # Step 5: Format into a clean JSON contract for Pair B
    forecast_output = []
    for _, row in df.iterrows():
        forecast_output.append({
            "timestamp": row["timestamp"].isoformat(),
            "predicted_solar_kw": max(0.0, row["solar_kw"]),
            "predicted_wind_kw": max(0.0, row["wind_kw"]),
            "predicted_demand_kw": max(0.0, row["demand_kw"])
        })
        
    return forecast_output

if __name__ == "__main__":
    predictions = forecast_next_24_hours()
    print("--- UPCOMING 3 HOUR FORECAST ---")
    for p in predictions[:3]: 
        print(p)