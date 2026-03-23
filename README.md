# MedDiagnose

MedDiagnose is a full-stack medical decision-support project that combines fuzzy logic and Bayesian inference to rank diseases from selected symptoms.

It is built for academic and research use.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)

## Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup](#setup)
- [Run Locally](#run-locally)
- [API Endpoints](#api-endpoints)
- [Evaluation Metrics](#evaluation-metrics)
- [How to Understand the Project](#how-to-understand-the-project)
- [Data Files](#data-files)

## Overview

MedDiagnose performs a five-step Fuzzy-Bayesian pipeline:

1. Fuzzification of symptom severity into LOW, MEDIUM, HIGH memberships.
2. Weighted severity/centroid computation.
3. Laplace-smoothed conditional probability estimation.
4. Symptom evidence scoring.
5. Bayesian aggregation and normalization to produce disease probabilities.

Current dataset scope:

- 131 symptoms
- 41 diseases
- 4,920 records

## Core Features

- Secure authentication (Better Auth).
- Symptom-based diagnosis workflow.
- Top-ranked disease predictions with probabilities.
- Fuzzy analysis details and cluster activations.
- Disease descriptions and precautions.
- Diagnosis history persisted to PostgreSQL.

## Architecture

### Frontend

- Next.js App Router (TypeScript)
- Tailwind CSS + shadcn/ui
- API routes in `frontend/app/api` as gateway layer

### Backend

- FastAPI service (`backend/main.py`)
- Routers for diagnosis and metrics
- Services: `data_loader`, `fuzzy_engine`, `bayesian_network`, `evaluator`

### Database

- PostgreSQL with Prisma ORM

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | Better Auth |
| Backend | FastAPI, Uvicorn |
| Data/ML | pandas, numpy, scikit-learn |
| Database | PostgreSQL |
| ORM | Prisma |
| Package Manager | Bun |

## Repository Structure

```text
MedDiagnose/
├── .gitignore
├── README.md
├── backend/
│   ├── data/
│   │   ├── Symptom-severity.csv
│   │   ├── __init__.py
│   │   ├── cluster_config.json
│   │   ├── dataset.csv
│   │   ├── symptom_Description.csv
│   │   └── symptom_precaution.csv
│   ├── generate_clusters.py
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── diagnosis.py
│   │   └── metrics.py
│   └── services/
│       ├── __init__.py
│       ├── bayesian_network.py
│       ├── data_loader.py
│       ├── evaluator.py
│       └── fuzzy_engine.py
└── frontend/
    ├── .gitignore
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── api/
    │   │   ├── auth/[...all]/route.ts
    │   │   ├── diagnose/route.ts
    │   │   ├── metrics/route.ts
    │   │   └── symptoms/route.ts
    │   ├── dashboard/
    │   │   ├── history/
    │   │   │   ├── loading.tsx
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── bun.lock
    ├── bunfig.toml
    ├── components/
    │   ├── disease-detail.tsx
    │   ├── disease-info-card.tsx
    │   ├── fuzzy-panel.tsx
    │   ├── history-list.tsx
    │   ├── navbar.tsx
    │   ├── results-panel.tsx
    │   ├── symptom-selector.tsx
    │   ├── theme-provider.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── chart.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── dialog.tsx
    │       ├── input-group.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── skeleton.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       └── textarea.tsx
    ├── components.json
    ├── eslint.config.mjs
    ├── lib/
    │   ├── auth-client.ts
    │   ├── auth.ts
    │   ├── prisma.ts
    │   ├── types.ts
    │   └── utils.ts
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma/
    │   ├── migrations/
    │   │   ├── 20260316180255_init/migration.sql
    │   │   ├── 20260317175942_better_auth_schema_alignment/migration.sql
    │   │   └── migration_lock.toml
    │   └── schema.prisma
    ├── prisma.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

## Prerequisites

- Node.js 20+
- Bun
- Python 3.10+
- PostgreSQL connection string
- Git

## Environment Variables

Create these files before running:

### `frontend/.env`

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

### `frontend/.env.local`

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-strong-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### `backend/.env`

```env
FRONTEND_URL="http://localhost:3000"
```

## Setup

1. Clone the repository.

```bash
git clone https://github.com/Monish0210/MedDiagnose.git
cd MedDiagnose
```

2. Install frontend dependencies.

```bash
cd frontend
bun install
```

3. Run Prisma migration and client generation.

```bash
bunx prisma migrate dev --name init
bunx prisma generate
```

4. Create Python virtual environment and install backend dependencies.

```bash
cd ../backend
python -m venv .venv
```

PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

5. Place required dataset files in `backend/data` and generate cluster config.

```bash
python generate_clusters.py
```

## Run Locally

Use two terminals.

### Terminal 1 (Backend)

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Terminal 2 (Frontend)

```bash
cd frontend
bun dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- Backend Docs: `http://localhost:8000/docs`

## API Endpoints

Only active project endpoints are listed below.

### Frontend API Routes (used by app)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/symptoms` | Fetch symptom list |
| POST | `/api/diagnose` | Run diagnosis and save user history |
| ALL | `/api/auth/[...all]` | Authentication handlers |

### Backend Service Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/diagnosis/diagnose` | Core diagnosis inference |
| GET | `/api/symptoms` | Symptom catalog |
| GET | `/api/metrics` | Evaluation metrics |

## Evaluation Metrics

Metrics below are from a real evaluator run on 2026-03-23 using the current project dataset and pipeline (not placeholder values).

### Scalar metrics (from `/api/metrics`)

| Metric | Value |
|---|---:|
| split.training_rows | 3936 |
| split.test_rows | 984 |
| split.evaluated_rows | 984 |
| evaluated_rows | 984 |
| skipped_rows | 0 |
| top1_accuracy | 95.1219512195122 |
| top5_accuracy | 100.0 |
| macro_f1 | 0.9349593495934959 |
| binary_top1 | 100.0 |

## Data Files

Place the following files in `backend/data`:

- `dataset.csv`
- `Symptom-severity.csv`
- `symptom_Description.csv`
- `symptom_precaution.csv`

Generated file:

- `cluster_config.json` (created via `python generate_clusters.py`)
