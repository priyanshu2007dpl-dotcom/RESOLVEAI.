# OmniResolve AI — AI Complaint Investigation & Resolution Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **"Every Complaint. Any Domain. One Intelligent Resolution Platform."**  
> *Secondary Tagline: "Companies manage less. We investigate, route and resolve more — at lower operational cost."*  
> *Product Statement: "You submit the complaint. We investigate it. The right expert solves it. Your organization gets the insight."*

---

## 🌟 Executive Overview & Business Value
**OmniResolve AI** is an enterprise B2B complaint-management outsourcing and autonomous AI investigation SaaS platform. 

Instead of an enterprise building and maintaining separate, high-overhead internal customer care, IT, hardware, electrical, mechanical, and escalation teams, organizations outsource complaint intake, multi-domain investigation, intelligent solver matching, and preventive analytics to OmniResolve AI.

### Traditional Company Model vs. OmniResolve AI Platform
```
Traditional In-House Model:
Company → Complaints → Tier 1 Customer Care → General Tech → Hardware Silo / Software Silo / Mechanical Silo → Escalation → High Delay & Fixed Cost

OmniResolve Outsourced Platform:
Company → Inflow → OmniResolve AI Core → Universal Taxonomy Classification → Causal Root-Cause Graph → Operational Solver Matching → Certified Expert Resolution → Prevention Intelligence
```
*Note: All projected internal workload savings are model-based estimates based on standard cross-functional triaging overhead versus automated AI routing.*

---

## 🎯 Key Differentiators & USPs
1. **Three-Sided Ecosystem**: Dedicated, role-isolated portals for **Customer**, **Solver / Expert Investigator**, and **Company Client**, backed by **Platform SuperAdmin**.
2. **Universal Cross-Domain Support**: Spans technical domains (*Mechanical, Electrical, Hardware, Software, Electronics, Networking, Industrial Equipment, Automotive, Appliances*) and non-technical domains (*Billing & Payment, Refunds, Delivery, Customer Service*).
3. **Cross-Domain Coupling Engine**: Identifies multi-domain failure coupling (e.g. Mechanical bearing friction leading to an Electrical thermal overload breaker trip).
4. **Interactive Root-Cause Causal Graph**: Interactive DAG visualizer tracing:
   $$\text{Customer Complaint} \longrightarrow \text{Observed Symptom} \longrightarrow \text{Process Stage} \longrightarrow \text{Component} \longrightarrow \text{Failure Mode} \longrightarrow \text{Contributing Factor} \longrightarrow \text{Probable Root Cause}$$
5. **Complaint Genealogy & Clustering**: Semantic token and vector similarity detecting related complaints even with varied customer phrasing, automatically linking cases into Incident Clusters (e.g. `INC-2047`).
6. **AI Solver Copilot**: Grounded RAG assistant citing engineering service bulletins, torque specifications, and historical precedent resolutions.
7. **Counterfactual "What-If" Simulator**: Evaluates operational policy shifts (accelerated SLA, automated verification, component upgrades) with model-based confidence intervals and assumption disclosures.
8. **Process Mining Module**: Event-log trace reconstruction identifying verification bottlenecks and loop-back rework cycles.
9. **Multi-Tenant Security**: Strict tenant isolation via `organization_id`, Argon2/bcrypt hashing, SHA-256 cryptographic evidence hashing, and complete audit logging.
10. **B2B Integration**: REST API (`POST /api/v1/external/complaints`), API key management, and webhook delivery.

---

## 🏗️ Architecture & Technology Stack

```
ai-complaint-platform/
├── backend/
│   ├── app/
│   │   ├── api/             # REST Endpoints (Auth, Complaints, Investigations, Solvers, Incidents, Company, B2B API, Audit)
│   │   ├── core/            # Config, Security (Bcrypt/JWT), Database Session
│   │   ├── models/          # SQLAlchemy Relational Models (User, Org, Solver, Complaint, Evidence, Investigation, Incident, Audit)
│   │   ├── schemas/         # Pydantic v2 Models & API Contracts
│   │   ├── services/        # AI Classifier, Genealogy Engine, Routing Engine, Process Mining, What-If Simulator, Copilot RAG
│   │   ├── seed/            # Multi-Domain Demo Data Seeder
│   │   └── main.py          # FastAPI Application Entrypoint & Middleware
│   ├── tests/               # Pytest Automated Test Suite (100% Passing)
│   ├── requirements.txt     # Python Dependencies
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Commercial SaaS Landing Page
│   │   ├── customer/        # Customer Submission & Tracking Portal
│   │   ├── solver/          # Solver Workspace with Root-Cause Graph & Copilot
│   │   ├── company/         # Company Operations, Efficiency & What-If Dashboard
│   │   ├── admin/           # Platform SuperAdmin & Solver Network Capacity
│   │   ├── demo/            # 11-Step Interactive Hackathon WOW Demo Flow
│   │   └── layout.tsx       # Root Layout with Demo Persona Quick-Switcher
│   ├── components/          # Reusable UI & Visualization Components
│   └── lib/                 # API Client, Auth Context, Utilities
├── docker/
│   ├── Dockerfile.backend   # Python 3.12 Slim Container
│   ├── Dockerfile.frontend  # Node 20 Multi-Stage Next.js Container
│   └── docker-compose.yml   # Multi-Container Orchestration with PostgreSQL
└── README.md
```

---

## 🚀 Quickstart Guide

### Option 1: Local Development (Instant Zero-Dependency Execution)

#### 1. Backend (FastAPI + Python 3.12 via `uv`):
```powershell
cd backend
# Create virtual environment and install dependencies
uv venv .venv --python 3.12
uv pip install -r requirements.txt

# Start backend server (Runs on port 8000 with auto-seeding)
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

#### 2. Frontend (Next.js 14 + Tailwind CSS):
```powershell
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

### Option 2: Docker Compose (Production Deployment with PostgreSQL)
```bash
docker compose -f docker/docker-compose.yml up --build
```
This launches:
- `PostgreSQL 16` on port `5432`
- `FastAPI Backend` on port `8000`
- `Next.js Frontend` on port `3000`

---

## 🌍 Cloud Deployment (Vercel & Render)

OmniResolve AI is designed for seamless, zero-config deployment to modern cloud platforms.

### 1. Frontend (Vercel)
- **Platform:** [Vercel](https://vercel.com)
- **Root Directory:** `frontend`
- **Framework Preset:** Next.js (Auto-detected)
- **Build Command:** `npm run build` (Default)
- **Environment Variables:** Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL.

### 2. Backend (Render Web Service)
- **Platform:** [Render](https://render.com)
- **Type:** Web Service
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- *(Note: Render automatically injects the `$PORT` variable)*

---

## 🎭 Pre-Configured Demo Personas
The application includes a **Demo Persona Quick-Switcher** banner at the top of every screen:

| Role | Persona Name | Email | Password | Primary Domain / Focus |
|---|---|---|---|---|
| **Customer** | Elena Vance | `elena.vance@example.com` | `password123` | Vance Precision Tooling |
| **Solver / Expert** | Dr. Marcus Vance (PE) | `dr.marcus.vance@omnisolver.com` | `password123` | Mechanical & Electrical PE |
| **Company Client** | Apex Dynamics Leadership | `admin@apexdynamics.com` | `password123` | Apex Operations & Analytics |
| **Platform Admin** | OmniResolve SuperAdmin | `platform.admin@omniresolve.ai` | `password123` | Cross-Tenant Infrastructure |

---

## ⚡ 11-Step Hackathon WOW Demo Scenario
Visit `http://localhost:3000/demo` to trigger the interactive walkthrough:
1. **Intake**: Customer submits industrial extruder stoppage with motor photo, audio recording, and maintenance log.
2. **AI Detection**: Engine detects **Mechanical (Primary)** + **Electrical (Contributing)** cross-domain coupling.
3. **Genealogy**: Scans history and matches **32 related cases**.
4. **Root Cause**: Identifies mineral grease viscosity loss inducing friction and thermal relay trip.
5. **Interactive Graph**: Visual DAG displays complete failure progression with clickable nodes.
6. **Incident Linking**: Associates with active cluster **INC-2047**.
7. **Smart Routing**: Transparently matches Dr. Marcus Vance based on 98% skill affinity and available workload.
8. **Solver Copilot**: Solver queries Grounded RAG for torque specs and synthetic lubricant replacement kits.
9. **Resolution**: Solver executes corrective bearing flush and clears fault code E-42.
10. **Customer Confirmation**: Customer verifies trial run and confirms resolution with 5 stars.
11. **Prevention Intelligence**: Company dashboard updates with permanent prevention recommendation and computes internal workload hours avoided.

---

## 🔒 Security & Data Isolation
- **Tenant Isolation**: Every company query is scoped by `organization_id`. Company A cannot view Company B data.
- **Evidence Integrity**: Every uploaded file is cryptographically hashed with SHA-256. Raw paths are never exposed.
- **Role Isolation**: Customers can never view internal solver engineering notes or private company cost analytics.
- **Audit Trails**: All logins, submissions, solver assignments, and resolutions are recorded in immutable audit logs.
