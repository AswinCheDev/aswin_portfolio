# Gov Vision

## Elevator Pitch
Gov Vision is a full-stack platform for enterprise and government analytics that integrates real-time event tracking, AI anomaly detection, and predictive forecasting to enable data-driven decision-making.

## Overview
Gov Vision is a comprehensive web application tailored for government and enterprise analytics. It provides a real-time analytics dashboard, an AI-powered insights engine for risk scoring and forecasting, and automated background jobs for recurring report generation. The project uses a React frontend, Node.js/Express backend for business logic and data aggregation (MongoDB/Redis), and a separate Python FastAPI microservice for scikit-learn anomaly detection and Prophet forecasting models. As of the latest commit (2026-06-25), the project is actively maintained.

## Architecture

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Frontend   │──────▶│   Backend (Node) │──────▶│    MongoDB       │
│  React/Vite  │ :5173 │   Express        │ :5002 │  govvision DB    │
│  (port 5173) │       │   (port 5002)    │       │  (port 27017)    │
└──────────────┘       └───────┬──────────┘       └──────────────────┘
                               │                           ▲
                               │ REST /api/*               │
                               ▼                           │
                       ┌──────────────────┐                │
                       │   Redis Cache    │                │
                       │   (port 6379)    │                │
                       └──────────────────┘                │
                                                           │
                       ┌──────────────────┐                │
                       │  AI Microservice  │───────────────┘
                       │  FastAPI (Python) │
                       │  (port 8000)      │
                       └──────────────────┘
```

**Three-tier architecture:**
1. **Frontend**: React SPA using Vite, serving the UI dashboards and handling user interaction.
2. **Backend**: Express server running on port 5002. Handles all main REST API endpoints, user authentication (JWT), caching layer via Redis, database operations via Mongoose, and background scheduling via `node-cron`. It communicates internally with the AI microservice via HTTP requests (using `ML_SERVICE_URL`).
3. **AI Microservice**: Python FastAPI service running on port 8000. Handles computationally expensive data science workloads: Scikit-learn (Isolation Forest) for anomaly detection and Prophet for time-series forecasting. It connects directly to MongoDB for some training tasks but otherwise exposes endpoints for the Express backend to query.

**Why this architecture**: 
The separation of the AI microservice from the core backend isolates heavy ML tasks (Python ecosystem) from primary web request handling (Node.js event loop). Redis is used to cache expensive aggregation queries required by the frontend dashboards to ensure sub-second rendering.

## Tech Stack

### Frontend
| Technology | Version | Source |
|---|---|---|
| React | ^19.2.0 | `client/package.json` |
| TypeScript | ~5.9.3 | `client/package.json` |
| Vite | ^7.3.1 | `client/package.json` |
| Tailwind CSS | ^3.4.17 | `client/package.json` |
| React Router DOM | ^7.13.1 | `client/package.json` |
| ECharts | ^6.0.0 | `client/package.json` |
| Recharts | ^3.8.0 | `client/package.json` |
| Axios | ^1.13.6 | `client/package.json` |
| html2canvas | ^1.4.1 | `client/package.json` |

### Backend
| Technology | Version | Source |
|---|---|---|
| Node.js | v18+ | `README.md` |
| Express | ^5.2.1 | `server/package.json` |
| Mongoose | ^9.3.0 | `server/package.json` |
| ioredis | ^5.8.2 | `server/package.json` |
| jsonwebtoken | ^9.0.3 | `server/package.json` |
| bcrypt | ^6.0.0 | `server/package.json` |
| node-cron | ^4.2.1 | `server/package.json` |
| nodemailer | ^8.0.7 | `server/package.json` |
| json2csv | ^6.0.0-alpha.2 | `server/package.json` |
| jspdf | ^4.2.1 | `server/package.json` |

### AI Microservice
| Technology | Version | Source |
|---|---|---|
| Python | 3.9+ | `README.md` |
| FastAPI | (unpinned) | `ml_service/requirements.txt` |
| Uvicorn | (unpinned) | `ml_service/requirements.txt` |
| Scikit-Learn | (unpinned) | `ml_service/requirements.txt` |
| Prophet | (unpinned) | `ml_service/requirements.txt` |
| PyMongo | (unpinned) | `ml_service/requirements.txt` |
| Pandas | (unpinned) | `ml_service/requirements.txt` |
| NumPy | (unpinned) | `ml_service/requirements.txt` |

## External Dependencies & Integrations

### Third-party APIs
| Service | Purpose | Source |
|---|---|---|
| **MongoDB** | Primary datastore | `server/.env` |
| **Redis** | Query result caching | `server/.env` |
| **Gmail SMTP** | Email delivery | `server/.env` |

### Required Environment Variables
Source: `server/.env` and `ml_service/.env`

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (both server and ml_service) |
| `REDIS_URL` | Redis connection string (server) |
| `JWT_SECRET` | Secret key for signing Auth JWTs (server) |
| `SERVICE_KEY` | Shared secret for internal API auth between Node and FastAPI |
| `ML_SERVICE_URL` | URL of the Python FastAPI service (server) |
| `PORT` | Web server bind port (server and ml_service) |
| `SMTP_HOST/PORT/USER/PASS` | Mail transport credentials (server) |
| `IF_CONTAMINATION` | Configuration parameter for the Isolation Forest model (ml_service) |

## Security & Secrets Handling

### Credential Management
Secrets are intended to be managed via `.env` files loaded by `dotenv`. The AI microservice uses `python-dotenv` explicitly loading `.env` from its local folder.

### Hardcoded Secrets & Credentials Found in Repo

| What | File | Line | Detail |
|---|---|---|---|
| **SMTP Password** | `server/.env` | 10 | `SMTP_PASS=tmdf xpwu podd nrhg` — Appears to be an active Gmail app password. Checked into git. |
| **SMTP Email** | `server/.env` | 9 | `SMTP_USER=flylude01@gmail.com` |
| **Service Key** | `server/.env` and `ml_service/.env` | 4 and 2 | `SERVICE_KEY=ffb2709a1c4d6d5efa8` — Shared secret committed to repo |
| **JWT Secret** | `server/.env` | 3 | `JWT_SECRET=test_secret` — Committed to repo |
| **Test JWT Secret** | `server/__tests__/routes/authRoutes.test.ts` | 8 | `process.env.JWT_SECRET = 'test-secret-key'` |

### Authentication & Authorization Logic
| Mechanism | What it protects | Implementation | Gaps |
|---|---|---|---|
| **Email/password auth** | User accounts | `POST /api/auth/login` | Uses proper hashing via bcrypt (referenced by package.json). |
| **JWT Middleware** | API Routes | `validateJWT` middleware attached to protected endpoints | JWT secret is hardcoded in version control. |
| **Role-Based Access Control** | Sensitive routes | `requireRole(['admin', 'manager', 'analyst'])` middleware | — |
| **Service Key** | Internal AI API | `require_service_key` Dependency in `ml_service/main.py` checks `x-service-key` header | Secret is hardcoded in version control, defeating the purpose. |

## Core Features

### Implemented and Working (traced to code)
| Feature | Implementation Location |
|---|---|
| **Organization-wide KPI Summary** | `server/routes/analyticsRoutes.ts` `/kpi-summary` (line 29) — Uses `aggregateOrgKPI` and caches in Redis for 300s. |
| **Department KPI Summary** | `server/routes/analyticsRoutes.ts` `/kpi-summary/:deptId` (line 58) |
| **Decision Volume Tracking** | `server/routes/analyticsRoutes.ts` `/decision-volume` (line 87) — Aggregates records grouped by granularity. |
| **Risk Heatmap** | `server/routes/analyticsRoutes.ts` `/risk-heatmap` (line 338) — Aggregates KPISnapshots into risk bands (Low, Med, High, Critical). |
| **AI Anomaly Detection** | `ml_service/main.py` `/ml/anomaly/predict` (line 141) — Scores batches of decisions via Scikit-Learn |
| **Time-Series Forecasting** | `ml_service/main.py` `/ml/forecast/predict` (line 183) — Serves Prophet models for `volume`, `delay`, `approval_rate`, etc. |
| **Automated Retraining Jobs** | `ml_service/main.py` `/ml/models/train` and `/ml/forecast/train` — Spawns background subprocesses to run Python training scripts |

## Feature Inventory (Full List)

### User-Facing Features (Web Interface)
- **Authentication**: 
  - Login Page: User authentication portal (`client/src/pages/LoginPage.tsx`)
- **Dashboards & Overviews**:
  - Main Dashboard: High-level KPI and system overview (`client/src/pages/Dashboard.tsx`)
- **Analytics & Insights**:
  - Decision Analytics: Decision volume and cycle time breakdowns (`client/src/pages/DecisionAnalytics.tsx`)
  - Compliance Analytics: Compliance rate trends over time (`client/src/pages/ComplianceAnalytics.tsx`)
  - Department Performance: Department-specific comparisons (`client/src/pages/DepartmentPerformance.tsx`)
- **AI & Risk Models**:
  - Anomaly Detection: Identifying outliers and data anomalies (`client/src/pages/AnomalyDetection.tsx`)
  - Predictive Forecast: Predicting future metrics like workload and delay (`client/src/pages/ForecastPage.tsx`)
  - Risk Heatmap: Evaluating risk levels across departments (`client/src/pages/RiskPage.tsx`)
  - AI Insights Panel: Dedicated detailed AI insights (`client/src/pages/AIInsightsPanel.tsx`)
- **Reporting Engine**:
  - Report Builder: Interactive creation of custom reports (`client/src/pages/ReportBuilder.tsx`)
  - Report History: Log of previously generated reports (`client/src/pages/ReportHistory.tsx`)
  - Report Schedules: Configuring recurring automated reports (`client/src/pages/ReportSchedules.tsx`)
- **Placeholders/Stubs**:
  - Settings: User/App settings (Stubbed in `client/src/pages/PlaceholderPage.tsx`)
  - Support: Help/support page (Stubbed in `client/src/pages/PlaceholderPage.tsx`)

### System/Internal Features (Backend & APIs)
- **Admin Configuration**:
  - KPI Configuration: Admin-only route to tune key performance indicators (`client/src/pages/KPIConfig.tsx`, `server/routes/kpiConfigRoutes.ts`)
- **Event Ingestion (API)**:
  - Decision & Compliance Updates: Webhook endpoints (`/decision-update`, `/compliance-update`) to ingest real-time data (`server/routes/eventRoutes.ts`)
- **Background Jobs (node-cron)**:
  - Anomaly detection, Forecast generation, Risk scoring, and Model Retraining jobs (`server/package.json` scripts)

## Key Modules / Files

| File/Folder | What it does | Why it matters |
|---|---|---|
| `server/server.ts` | Node.js application entry point | Initializes Express, connects to DB/Redis, and mounts all backend routes. |
| `ml_service/main.py` | FastAPI application entry point | Serves the Python ML models over HTTP to the Node backend. |
| `server/routes/analyticsRoutes.ts` | Analytics endpoints (461 lines) | Core dashboard data provider, heavily relies on Redis caching (`getOrSet`). |
| `server/models/` | Mongoose schema definitions | Maps TypeScript types to MongoDB collections for data persistence. |
| `client/src/App.tsx` | React Router definitions | Defines the client-side routing and view architecture. |

## Data Model

Source: Mongoose schemas in `server/models/`.

### `m3_anomalies` Collection
```typescript
// server/models/Anomaly.ts
{
  decisionId: ObjectId, // ref: "m1_decisions"
  department: String,
  anomalyScore: Number,
  severity: String,     // "Low" | "Medium" | "High" | "Critical" | "Normal"
  isAcknowledged: Boolean,
  acknowledgedBy: ObjectId, // ref: "users"
  acknowledgedAt: Date,
  description: String,
  featureValues: Mixed
}
```

### `users` Collection
```typescript
// server/models/User.ts
{
  email: String,        // required, unique, lowercase
  passwordHash: String, // required
  role: String,         // "admin" | "manager" | "analyst" | "executive"
  department: String
}
```
*(Other key models include: Forecast, KPIConfig, KPI_Snapshot, Report, ReportSchedule, ReportTemplate, m1Decisions, m1TrainingDecisions, m2Violations)*

## APIs / Interfaces

### Backend REST API (Express, port 5002)

#### Analytics (`server/routes/analyticsRoutes.ts`)
| Method | Endpoint | Input | Output |
|---|---|---|---|
| GET | `/api/analytics/kpi-summary` | `?dateFrom&dateTo` | Org-wide KPIs |
| GET | `/api/analytics/kpi-summary/:deptId` | `?dateFrom&dateTo` | Dept-specific KPIs |
| GET | `/api/analytics/decision-volume` | `?granularity&deptId` | Aggregated volume counts |
| GET | `/api/analytics/cycle-time-histogram`| `?deptId` | Array of time buckets |
| GET | `/api/analytics/rejection-reasons` | `?dateFrom&dateTo` | Rejection breakdown |
| GET | `/api/analytics/top-violated-policies`| — | Top 10 policies |
| GET | `/api/analytics/compliance-trend` | `?deptIds&dateFrom` | Compliance over time |
| GET | `/api/analytics/risk-heatmap` | `?dateFrom&dateTo` | Risk scores by dept |
| GET | `/api/analytics/forecast` | `?deptId&horizon&target` | Fetches pre-computed forecast |

### AI Microservice API (Flask/FastAPI, port 8000)

Source: `ml_service/main.py`
| Method | Endpoint | Input | Output |
|---|---|---|---|
| GET | `/health` | — | `{ status, service }` |
| POST | `/ml/anomaly/predict` | `AnomalyRequest` | `{ results }` |
| POST | `/ml/models/train` | — | `{ status, script }` (Background job) |
| POST | `/ml/forecast/train`| — | `{ status, script }` (Background job) |
| POST | `/ml/forecast/predict`| `ForecastRequest` | `ForecastResponse` (Array of data points) |
| POST | `/ml/risk/score` | `RiskScoreRequest` | `{ scores }` |

## Algorithms & Models

### Isolation Forest Anomaly Detection
- **Model**: Scikit-Learn's Isolation Forest algorithm (implied by `IF_CONTAMINATION` in `ml_service/.env` and `train_isolation_forest.py`).
- **Use Case**: Used by `/ml/anomaly/predict` to flag outlier decisions based on cycle times, rejection counts, and SLA misses.
- **Background Training**: Handled by subprocesses via `/ml/models/train`.

### Prophet Time-Series Forecasting
- **Model**: Facebook/Meta Prophet.
- **Use Case**: Forecasts volume, delay, approval_rate, rejection_rate, pending_workload, and sla_misses. Valid horizons are restricted strictly to 7, 14, or 30 days (`main.py` line 190).
- **Background Training**: Triggered via `/ml/forecast/train` using `train_prophet.py`.

## Testing & CI/CD

### Test Framework
- **Frontend**: Vitest and React Testing Library (`client/package.json` line 49)
- **Backend**: Jest (`server/package.json` line 57)
- **ML Service**: Pytest and pytest-cov (`ml_service/requirements.txt` line 12)

### What Exists
- Test suites exist under `server/__tests__/routes/` (e.g. `authRoutes.test.ts`, `analyticsRoutes.test.ts`) and middleware (`validateJWT.test.ts`).

### What's Not Tested
- Overall test coverage percentage is unmeasured as no active CI runs produce a coverage report.

### CI/CD
- Absent. No `.github/workflows` or `.gitlab-ci.yml` found in the repository.

## Metrics & Performance

### Repo Scale
Source: `git rev-list --count HEAD`, `git ls-files`

| Metric | Value | Source |
|---|---|---|
| **Total files** | 303 | `git ls-files` |
| **Total commits** | 33 | `git rev-list --count HEAD` |
| **Repo age** | ~3.5 months (2026-03-06 → 2026-06-25) | First and last commit dates |

### Needs Measurement
- No benchmark files, test output logs, or performance test results exist in the repository.

## Setup & Environment
Source: `README.md`
1. **Prerequisites**: Node.js 18+, Python 3.9+, MongoDB, and Redis.
2. **Server**: `cd server && npm install && npm run dev`
3. **ML Service**: `cd ml_service && pip install -r requirements.txt && uvicorn main:app --reload`
4. **Client**: `cd client && npm install && npm run dev`

## Deployment
- Unconfirmed. The repository operates locally via `npm run dev` and `uvicorn`. No Dockerfiles or deployment workflows exist in the repository tree.

## Known Limitations / Tech Debt
| Issue | Evidence | Severity |
|---|---|---|
| **Hardcoded secrets in `.env` files** | `server/.env` and `ml_service/.env` are checked into source control with active keys. | Critical |
| **Service Key vulnerability** | The internal API `x-service-key` auth mechanism relies on a static key checked into git, negating its security value. | High |
| **Missing CI/CD pipeline** | No automated tests run on commit. | Medium |

## Decisions & Trade-offs
| Decision | Rationale (inferred) | Evidence |
|---|---|---|
| **Microservice Segregation** | Prevent heavy ML processing (Scikit-Learn/Prophet) from blocking the Express event loop | Architecture splits Node and Python into distinct services |
| **Redis Caching** | Dashboard aggregation queries are expensive; Redis prevents DB overload | `getOrSet` wrapper used extensively in `server/routes/analyticsRoutes.ts` |
| **Background subprocesses for ML training** | FastAPI avoids blocking by wrapping training scripts in `subprocess.Popen` | `ml_service/main.py` line 61 (`_spawn_training_script`) |

## Timeline
Source: `git log`

| Date | Milestone |
|---|---|
| **2026-03-06** | First commit |
| **2026-06-25** | Last recorded commit |

## Code Quality Assessment
| Criterion | Rating | Evidence |
|---|---|---|
| **Test coverage** | Moderate | Dedicated test suites exist (`server/__tests__`), but coverage reports are absent. |
| **Secrets management** | Poor | Hardcoded `.env` files with active keys tracked in git. |
| **Code organization** | Excellent | Strict MVC-style folder structure (`routes/`, `models/`, `services/`) and multi-tier separation. |
| **Dependency hygiene** | Fair | Lockfiles present but no automated audit pipelines. |

## Interview Talking Points
1. **"How do the Node.js server and Python ML service communicate, and how do you handle training model latency?"** → See *Algorithms & Models* and *Decisions & Trade-offs* (FastAPI spawns `subprocess.Popen` for training tasks to avoid blocking).
2. **"Why use Redis alongside MongoDB for analytics?"** → See *Architecture* and *Decisions & Trade-offs* (Caching expensive Mongoose aggregations for sub-second dashboard rendering).
3. **"How does the ML Service authenticate requests from the Node server?"** → See *Security & Secrets Handling* (The `x-service-key` header dependency, noting the critical tech debt of checking the key into git).

## Resume Bullets
- Architected a multi-tier analytics platform using Node.js and React, integrating a separate Python FastAPI microservice for AI-driven risk scoring.
- Implemented time-series forecasting using Prophet and anomaly detection using Scikit-Learn to predict delays and highlight operational risks.
- Developed automated background jobs using `node-cron` for scheduled report generation (PDF/CSV) and model retraining.
- Optimized dashboard performance by implementing a Redis caching layer around complex MongoDB aggregation queries.

## Confidence Notes
- **Git History / Authorship**: Accurate basic metrics retrieved, but `git shortlog -sn` timeout means specific contributor counts are omitted.
- **Sampling**: Due to repository size, directories like `client/src/components` were sampled rather than read line-by-line. Detailed API endpoints were explicitly extracted from `analyticsRoutes.ts` and `ml_service/main.py`.
- **Root Project Name**: Determined from the repository folder name `gov_vision` as no root `package.json` exists.
