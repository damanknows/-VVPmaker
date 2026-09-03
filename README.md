# VVP-Maker • SVH26004 Eco-Hackathon

Energy Management System & Virtual Power Plant (EMS/VPP) Orchestration Platform built for the Rajasthan Technical Education Department (Problem Statement: SVH26004).

## Repository Architecture

```text
d:\VVP SVH\
├── frontend/             # Pair C: Next.js 15 App Router Dashboard UI
│   ├── src/
│   │   ├── app/          # App Router Pages & API Routes
│   │   ├── components/   # TelemetryBar, EnergyFlowHero, ForecastChart, BatteryGauge, RecommendationsPanel
│   │   ├── hooks/        # useMicrogridData unified fetch hook & backend fallback
│   │   ├── lib/          # Mock data service & 24h scenario generator
│   │   └── types/        # Data contract TypeScript interfaces
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── backend/              # Pair B: FastAPI / ML Engine (Incoming Integration)
```

## Running Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the VPP Dashboard.
