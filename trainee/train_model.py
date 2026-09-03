import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import root_mean_squared_error
import joblib

# Load historical weather generation dataset
df = pd.read_csv("historical_campus_energy_data.csv")

# Feature Matrix (X) and Target Vector (y)
features = ["temp_c", "cloud_pct", "uv_index", "wind_speed_kmh", "air_density", "hour", "month"]
X = df[features]
y_solar = df["solar_kw"]
y_wind = df["wind_kw"]

# Train/Test Split
X_train, X_test, y_train_solar, y_test_solar = train_test_split(X, y_solar, test_size=0.2, random_state=42)

# Train XGBoost Solar Model
solar_model = XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=5)
solar_model.fit(X_train, y_train_solar)

# Evaluate Model
preds = solar_model.predict(X_test)
rmse = root_mean_squared_error(y_test_solar, preds)
print(f"Solar Model RMSE: {rmse:.2f} kW")

# Serialize Models for FastAPI Deployment
joblib.dump(solar_model, "solar_xgb_model.pkl")
print("Model saved successfully as solar_xgb_model.pkl")