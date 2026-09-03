import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
import joblib

# Load the historical dataset you just built
df = pd.read_csv("real_historical_training_data.csv")

# Ensure chronological order for time-series splitting
df = df.sort_values("timestamp").reset_index(drop=True)

# Define features strictly based on your friend's roadmap
solar_features = ["hour_of_day", "cloud_pct", "temp_c", "day_of_year"]
wind_features = ["wind_speed", "wind_gust", "hour_of_day"]
demand_features = ["hour_of_day", "day_of_week", "is_lab_hour", "is_hostel_peak", "temp_c"]

# 80/20 Time-based Split (NO random shuffle)
split_idx = int(len(df) * 0.8)
train_df = df.iloc[:split_idx]
test_df = df.iloc[split_idx:]

print("--- STEP 3: NAIVE BASELINE (Solar) ---")
# Naive assumption: Tomorrow's generation at a specific hour = average of that hour in the training set
naive_baseline = train_df.groupby("hour_of_day")["solar_kw"].mean()
test_df_baseline = test_df.copy()
test_df_baseline["naive_pred"] = test_df_baseline["hour_of_day"].map(naive_baseline)
naive_rmse = root_mean_squared_error(test_df_baseline["solar_kw"], test_df_baseline["naive_pred"])
print(f"Baseline Solar RMSE: {naive_rmse:.2f} kW\n")

print("--- STEP 4: TRAINING RANDOM FOREST MODELS ---")
# 1. Train Solar Model
solar_rf = RandomForestRegressor(n_estimators=50, random_state=42)
solar_rf.fit(train_df[solar_features], train_df["solar_kw"])
solar_rmse = root_mean_squared_error(test_df["solar_kw"], solar_rf.predict(test_df[solar_features]))
print(f"ML Solar RMSE: {solar_rmse:.2f} kW (vs Baseline: {naive_rmse:.2f} kW)")

# 2. Train Wind Model
wind_rf = RandomForestRegressor(n_estimators=50, random_state=42)
wind_rf.fit(train_df[wind_features], train_df["wind_kw"])
wind_rmse = root_mean_squared_error(test_df["wind_kw"], wind_rf.predict(test_df[wind_features]))
print(f"ML Wind RMSE: {wind_rmse:.2f} kW")

# 3. Train Demand Model
demand_rf = RandomForestRegressor(n_estimators=50, random_state=42)
demand_rf.fit(train_df[demand_features], train_df["demand_kw"])
demand_rmse = root_mean_squared_error(test_df["demand_kw"], demand_rf.predict(test_df[demand_features]))
print(f"ML Demand RMSE: {demand_rmse:.2f} kW\n")

# Serialize all three models for Pair B
joblib.dump(solar_rf, "solar_model.pkl")
joblib.dump(wind_rf, "wind_model.pkl")
joblib.dump(demand_rf, "demand_model.pkl")
print("All 3 models saved successfully as .pkl files.")