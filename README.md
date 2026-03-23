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
- [Data Files](#data-files)
- [Troubleshooting](#troubleshooting)

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
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── prisma/
│   └── package.json
├── backend/
│   ├── routers/
│   ├── services/
│   ├── data/
│   ├── main.py
│   ├── generate_clusters.py
│   └── requirements.txt
└── README.md
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

Metrics are computed by the backend evaluator and served from `/api/metrics` as percentage values.

Primary values:

- `top1_accuracy`
- `top5_accuracy`
- `macro_f1`
- `binary_top1`

Supporting values:

- `evaluated_rows`
- `skipped_rows`
- `split.training_rows`
- `split.test_rows`

## Data Files

Place the following files in `backend/data`:

- `dataset.csv`
- `Symptom-severity.csv`
- `symptom_Description.csv`
- `symptom_precaution.csv`

Generated file:

- `cluster_config.json` (created via `python generate_clusters.py`)

## Troubleshooting

### Build fails with EPERM on Windows

Close running dev servers, delete `.next`, and build again.

### Unauthorized diagnosis requests

Check `BETTER_AUTH_SECRET` in `frontend/.env.local` and confirm Prisma migration is complete.

### Frontend cannot reach backend

Ensure backend is running on `http://127.0.0.1:8000`.

### Diagnosis output is empty or invalid

Confirm all required CSV files exist in `backend/data` and rerun:

```bash
python generate_clusters.py
```
