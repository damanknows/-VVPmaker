# VVP-Maker FastAPI Backend ⚡

This directory contains the Python FastAPI backend for the VVP-Maker Energy Management System.

## Features
- **FastAPI Framework:** Fast, modern, and asynchronous API.
- **Microgrid Telemetry:** Provides live and mocked current telemetry data for the dashboard.
- **24-Hour Forecasting:** Generates solar, wind, and demand forecasts dynamically based on scenarios (`SUNNY_PEAK`, `CLOUDY_AFTERNOON`, `WINDY_NIGHT`).
- **Recommendations Engine:** Serves actionable insights to minimize grid import and carbon emissions.

## Installation & Setup

1. **Create a Virtual Environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate the Virtual Environment:**
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server:**
   ```bash
   python main.py
   # OR use uvicorn directly:
   # uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

*(For Windows users, you can also simply double-click or run `run.bat` to automatically perform the above steps!)*

## API Documentation
Once the server is running, FastAPI automatically generates interactive API documentation. Visit:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
