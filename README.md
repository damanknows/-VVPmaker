# VVP-Maker • SVH26004 Eco-Hackathon 🌍⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2015-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![ML](https://img.shields.io/badge/ML-scikit--learn-F7931E)

An intelligent Energy Management System & Virtual Power Plant (EMS/VPP) Orchestration Platform developed for the Rajasthan Technical Education Department (Problem Statement: SVH26004). 

The VVP-Maker platform is designed to optimize energy consumption, intelligently manage battery storage, and orchestrate solar and wind power generation across multiple university campuses.

## 🏗️ Repository Architecture

Our solution is divided into three main components:

```text
d:\VVP SVH\
├── frontend/             # Next.js 15 App Router Dashboard UI
│   ├── src/app/          # App Router Pages & API Routes
│   ├── src/components/   # TelemetryBar, EnergyFlowHero, ForecastChart, BatteryGauge, etc.
│   └── src/hooks/        # Unified data fetching hooks
│
├── backend/              # FastAPI Python Backend
│   ├── main.py           # API Endpoints (Forecast, Telemetry, Recommendations)
│   ├── requirements.txt  # Python Dependencies
│   └── run.bat           # Setup & Run Script
│
└── trainee/              # Machine Learning & Simulation Engine
    ├── fetch_weather.py  # Weather data ingestion
    ├── train_model.py    # Model training pipeline
    └── *.pkl             # Trained model artifacts (Solar, Wind, Demand)
```

## ✨ Key Features

- **Real-Time Telemetry:** Live dashboard tracking solar, wind, battery SoC, and grid import/export.
- **Smart Forecasting:** 24-hour predictive models for energy generation and consumption based on ML.
- **Actionable Recommendations:** Automated AI-driven suggestions for load shifting, battery pre-charging/discharging, and peak shaving.
- **Microgrid Orchestration:** Simulates and manages campus-wide energy resources to maximize carbon reduction and financial savings.

---

## 🚀 Getting Started

### 1. Running the FastAPI Backend

The backend provides the API endpoints serving telemetry, forecasting, and recommendations data.

```bash
cd backend

# On Windows (using the provided script):
run.bat

# Manual Setup:
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
python main.py
```
> The API will be available at `http://localhost:8000`

### 2. Running the Next.js Frontend

The dashboard consumes the backend API to visualize the energy data.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) to view the VPP Dashboard.

### 3. ML Models & Simulator (Optional)

If you wish to retrain the models or generate new historical datasets:

```bash
cd trainee
pip install -r requirements.txt  # (Ensure you have pandas, scikit-learn, xgboost installed)
python train_model.py
```

## 📡 API Endpoints (Backend)

The FastAPI server exposes the following routes:
- `GET /api/telemetry/current` - Real-time metrics (solar kW, wind kW, demand, battery SoC).
- `GET /api/forecast/24h` - Hourly forecasts for generation vs. consumption.
- `GET /api/recommendations` - AI-generated energy management tasks (Load Shift, Curtailment, etc).

## 📄 License
This project is licensed under the MIT License.
