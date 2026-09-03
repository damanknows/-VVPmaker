# VVP-Maker • SVH26004 Eco-Hackathon 🌍⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2015-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![ML](https://img.shields.io/badge/ML-scikit--learn-F7931E)

An intelligent Energy Management System & Virtual Power Plant (EMS/VPP) Orchestration Platform developed for the Rajasthan Technical Education Department (Problem Statement: SVH26004). 

The VVP-Maker platform is designed to optimize energy consumption, intelligently manage battery storage, and orchestrate solar and wind power generation across multiple university campuses.

## ⚠️ Data & Modeling Transparency Disclosure

> **Weather inputs are real historical observations for Jodhpur.** Power outputs are computed with peer-reviewed physical models (`pvlib` PVWatts-style PV performance, IEC 61400-12-1-style wind turbine power curve, and schedule-based institutional microgrid demand with non-linear HVAC chiller load) rather than measured campus meters, since no real smart-meter sub-meter data was available. The pipeline is designed to swap in real meter telemetry with zero code modifications once hardware sub-meters are installed.

---

## 🏗️ Repository Architecture

Our solution is divided into three main components:

```text
d:\VVP SVH\
├── frontend/             # Next.js 15 App Router Dashboard UI (SCADA Dark Theme)
│   ├── src/
│   │   ├── app/          # App Router Pages & API Routes
│   │   ├── components/   # TelemetryBar, EnergyFlowHero, ForecastChart, BatteryGauge, RecommendationsPanel
│   │   ├── hooks/        # useMicrogridData unified fetch hook & backend fallback
│   │   ├── lib/          # Mock data service & 24h scenario generator
│   │   └── types/        # Data contract TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── backend/              # FastAPI Python Backend
│   ├── main.py           # REST endpoints (/api/telemetry, /api/forecast, /api/recommendations)
│   ├── requirements.txt
│   └── run.bat           # Setup & Run Script
│
└── trainee/              # Physics Engine & Microgrid ML Forecasting Pipeline
    ├── physics.py        # Single source of truth (pvlib solar, aerodynamic wind curve, campus load)
    ├── build_historical_dataset.py # 2024 Jodhpur leap year archive fetch (8,784 hours)
    ├── generate.py       # Multi-scenario synthetic stress-test generator (heatwave, storm, drought)
    ├── train_real_models.py # RF vs. XGBoost time-series benchmark & model serializer
    ├── forecast_engine.py# 24-hour ahead predictive inference engine
    ├── simulator.py      # Real-time closed-loop telemetry stream
    ├── test_physics.py   # Unit test suite verifying physical invariants (pytest)
    └── model_metadata.json # Champion models, features, RMSE/R2, and version lock
```

## ✨ Key Features

- **Real-Time Telemetry:** Live dashboard tracking solar, wind, battery SoC, and grid import/export.
- **Smart Forecasting:** 24-hour predictive models for energy generation and consumption based on ML.
- **Actionable Recommendations:** Automated AI-driven suggestions for load shifting, battery pre-charging/discharging, and peak shaving.
- **Microgrid Orchestration:** Simulates and manages campus-wide energy resources to maximize carbon reduction and financial savings.

---

## Model Benchmark Results (Chronological 80/20 Test Split)

| Asset Target | Naive Hourly Baseline | Champion Model | Error Reduction | Test $R^2$ |
|---|---|---|---|---|
| **Solar Generation** | RMSE: 9.76 kW ($R^2$: 0.978) | **XGBoost (RMSE: 2.79 kW)** | **-71.4%** | **0.9982** |
| **Wind Generation** | RMSE: 19.59 kW ($R^2$: 0.041) | **Random Forest (RMSE: 0.78 kW)** | **-96.0%** | **0.9985** |
| **Campus Demand** | RMSE: 48.95 kW ($R^2$: 0.289) | **XGBoost (RMSE: 0.57 kW)** | **-98.8%** | **0.9999** |

---

## 🚀 Quickstart

### 1. Physics Engine & ML Forecasting (`trainee/`)

```bash
cd trainee

# Run physical invariant unit tests
pytest test_physics.py -v

# Fetch 8,784 hours of real 2024 Jodhpur weather & build ground-truth dataset
python build_historical_dataset.py

# Train & benchmark Random Forest vs XGBoost models
python train_real_models.py

# Execute 24-hour predictive forecast engine
python forecast_engine.py

# Run real-time closed-loop telemetry stream
python simulator.py
```

### 2. FastAPI Backend Engine (`backend/`)

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

**API Endpoints:**
- `GET /api/telemetry/current` - Real-time metrics
- `GET /api/forecast/24h` - Hourly forecasts
- `GET /api/recommendations` - AI-generated energy management tasks

### 3. Next.js Frontend Dashboard (`frontend/`)

The dashboard consumes the backend API to visualize the energy data.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

> Open [http://localhost:3000](http://localhost:3000) to launch the SCADA VPP Dashboard.

## 📄 License
This project is licensed under the MIT License.
