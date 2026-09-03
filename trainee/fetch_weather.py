import requests
import pandas as pd

def fetch_campus_weather(lat=26.2389, lon=73.0243): # Jodhpur Campus
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"hourly=temperature_2m,cloudcover,uv_index,windspeed_10m,surface_pressure,relative_humidity_2m&"
        f"timezone=Asia/Kolkata"
    )
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()["hourly"]
        df = pd.DataFrame(data)
        df.rename(columns={
            "time": "timestamp",
            "temperature_2m": "temp_c",
            "cloudcover": "cloud_pct",
            "windspeed_10m": "wind_speed_kmh"
        }, inplace=True)
        return df
    else:
        raise Exception("Failed to fetch weather data")

if __name__ == "__main__":
    df_weather = fetch_campus_weather()
    print(df_weather.head())