# MedDiagnose

A full-stack medical decision-support web application that combines fuzzy logic with Bayesian inference to rank likely diseases from user-selected symptoms.

MedDiagnose is built as an academic soft computing project. It is designed for explainability and learning, not for clinical use.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)

## Contents

- [What MedDiagnose Does](#what-meddiagnose-does)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Fuzzy-Bayesian Pipeline](#fuzzy-bayesian-pipeline)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Setup](#local-setup)
- [How to Run](#how-to-run)
- [API Overview](#api-overview)
- [Data Files](#data-files)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)
- [Academic Context](#academic-context)
- [Disclaimer](#disclaimer)

## What MedDiagnose Does

Given a list of symptoms, MedDiagnose:

1. Converts symptom severity into fuzzy memberships (LOW, MEDIUM, HIGH).
2. Computes per-symptom evidence scores.
3. Runs Bayesian inference over disease candidates.
4. Returns ranked disease probabilities (including top 5 and full ranking).
5. Displays interpretable evidence, cluster activations, and disease details.

The current dataset and pipeline are configured around:

- 131 symptoms
- 41 diseases
- 4,920 records

## Core Features

- Authenticated user flow (sign up, sign in, session-based access).
- Symptom selection and diagnosis run from dashboard UI.
- Top-ranked disease results with probability breakdown.
- Fuzzy analysis panel with membership values and evidence metrics.
- Cluster activation panel for syndrome-level grouping.
- Detailed disease information and precautions.
- Diagnosis history per user, persisted in PostgreSQL via Prisma.
- Metrics endpoint support from backend evaluator.

## System Architecture

### Frontend

- Next.js App Router (TypeScript)
- UI built with Tailwind CSS and shadcn components
- API route handlers under frontend/app/api act as a backend gateway
- Better Auth for user session handling

### Backend

- FastAPI service exposing symptoms, diagnosis, and metrics routes
- Data loader for dataset, severity map, descriptions, and precautions
- Fuzzy engine + Bayesian network + evaluator services
- Cluster configuration generated from dataset

### Database

- PostgreSQL (Neon supported)
- Prisma ORM for user, session, account, and diagnosis persistence

## Fuzzy-Bayesian Pipeline

MedDiagnose uses a five-step inference flow:

1. Fuzzification
   - Maps symptom severity weights to LOW/MEDIUM/HIGH membership values.
2. Input centroid / severity weighting
   - Produces a continuous input score from fuzzy memberships.
3. Conditional probability estimation
   - Uses Laplace-smoothed estimates from training data.
4. Evidence scoring
   - Combines fuzzy score and conditional probability.
5. Bayesian aggregation and normalization
   - Uses log-space accumulation for numerical stability and normalizes to final probabilities.

High-level flow:

```text
Selected Symptoms
  -> Fuzzy Memberships (L/M/H)
  -> Weighted Input / Centroid
  -> P(S|D) with smoothing
  -> Evidence per symptom-disease pair
  -> Bayesian log aggregation
  -> Normalized disease probabilities
```

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

## Repository Structure

```text
SC-Innovative/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
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

Install these first:

- Node.js 20+
- Python 3.10+
- PostgreSQL connection (Neon works well)
- Git

Package manager:

- npm is fully supported
- Bun is also supported if preferred

## Environment Configuration

Create the following files before running the app.

### frontend/.env

Used by Prisma CLI:

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

### frontend/.env.local

Used by Next.js runtime and auth:

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-strong-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### backend/.env

```env
FRONTEND_URL="http://localhost:3000"
```

## Local Setup

1. Clone repository

```bash
git clone <your-repo-url>
cd SC-Innovative
```

2. Install frontend dependencies

Using npm:

```bash
cd frontend
npm install
```

Using Bun:

```bash
cd frontend
bun install
```

3. Initialize Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

If using Bun:

```bash
bunx prisma migrate dev --name init
bunx prisma generate
```

4. Set up backend virtual environment

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

5. Install backend dependencies

```bash
pip install -r requirements.txt
```

6. Place required dataset files in backend/data

See [Data Files](#data-files).

7. Generate cluster config

```bash
python generate_clusters.py
```

## How to Run

Use two terminals.

### Terminal A (Backend)

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Terminal B (Frontend)

```bash
cd frontend
npm run dev
```

If using Bun:

```bash
cd frontend
bun dev
```

### Default local URLs

- Frontend: http://localhost:3000
- FastAPI docs: http://localhost:8000/docs
- FastAPI health: http://localhost:8000/health

## API Overview

### Backend (FastAPI)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Service health check |
| GET | /api/symptoms | List all supported symptoms |
| POST | /api/diagnosis/diagnose | Run diagnosis for selected symptoms |
| GET | /api/metrics | Return evaluation metrics |

### Frontend API Routes (Next.js)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/symptoms | Proxies to backend symptoms service |
| POST | /api/diagnose | Auth-guarded diagnosis call + persistence |
| GET | /api/metrics | Proxies backend metrics |
| ALL | /api/auth/[...all] | Better Auth handlers |

## Data Files

Place these files under backend/data:

- dataset.csv
- Symptom-severity.csv
- symptom_Description.csv
- symptom_precaution.csv

At runtime, cluster configuration is expected in:

- cluster_config.json

Generate it with:

```bash
python generate_clusters.py
```

## Troubleshooting

### 1. Build fails with EPERM on Windows

If Next.js cannot remove files inside .next, close running dev servers and remove .next manually, then build again.

### 2. Auth errors or unauthorized diagnosis requests

- Confirm BETTER_AUTH_SECRET is set in frontend/.env.local.
- Confirm database migrations completed successfully.

### 3. Backend not reachable from frontend

- Ensure backend is running at http://127.0.0.1:8000.
- Check the diagnosis route dependencies are installed and virtual environment is active.

### 4. Empty or broken diagnosis output

- Verify all required CSV files are present in backend/data.
- Re-run python generate_clusters.py after dataset changes.

### 5. Font download warnings in restricted networks

The project is configured to use local/system fallbacks so it can run even when Google Fonts are blocked.

## Roadmap Ideas

- Export diagnosis reports as PDF.
- Add confidence calibration plots and reliability curves.
- Add clinician-friendly explanation cards per disease.
- Add automated integration tests across frontend and backend.
- Add deployment recipes for Vercel + Render/Fly.io.

## Academic Context

This project was developed as a soft computing assignment to demonstrate practical integration of:

- Fuzzy set modeling for vagueness
- Bayesian reasoning for uncertainty-aware ranking

It is intended to showcase system design, inference explainability, and end-to-end engineering.

## Disclaimer

MedDiagnose is an educational and research-oriented system. It is not a medical device and must not be used as a substitute for professional clinical diagnosis or treatment advice.
