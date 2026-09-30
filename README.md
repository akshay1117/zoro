# ZORO — Personal AI Life OS & Command Deck

> **ZORO** is an AI-powered personal Life OS and command center engineered for an ambitious college engineering student. Built on an OLED-inspired, cinematic dark aesthetic, ZORO unifies academic assignments, habit discipline, physical conditioning, INR expense tracking, trading logs, and cybersecurity learning into a single high-performance cockpit powered by a tool-calling AI agent.

---

## 1. Product Overview & Key Capabilities

- **ZORO Radial Command Core:** An animated multi-ring SVG visual identity in the center of the dashboard that pulses, rotates, and signals AI states (`IDLE`, `LISTENING`, `THINKING`, `EXECUTING`, `SUCCESS`, `ERROR`).
- **Natural Language First:** Log complex updates through text or voice (*"Spent ₹240 on lunch via UPI and did 4 sets of 80kg bench press"*).
- **Academic Tasks & Projects:** Priority management, course categorization, due date sorting, and assignment tracking.
- **Daily Discipline & Habits:** Habit checklist, rolling streak calculations, and completion heatmaps.
- **Financial Ledger (INR ₹ Native):** Expense tracking with payment modes (UPI, Cash, Card), category breakdowns, and monthly budget gauges.
- **Fitness & Conditioning:** Log multi-set workouts, track weights in kg, exercise repetitions, and personal records.
- **Specialized Student Consoles:**
  - **Trading Journal:** Setup strategies, trade entries/exits, risk:reward ratios, and PnL in ₹.
  - **Cybersecurity Lab Log:** Platform tracking (HackTheBox, TryHackMe, PortSwigger), lab hours, and writeups.
- **AI Agent with Safety Guard:** 23 domain tools executed strictly through backend services, with mandatory human confirmation for destructive or bulk operations.
- **Single-Codebase Mobile PWA:** Fullscreen standalone experience on mobile devices with 48px touch targets, gestures, and offline caching.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript 5, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Workbox PWA |
| **Backend API** | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0 (Async), Alembic, SlowAPI |
| **Database** | PostgreSQL 16+ (Managed on Supabase / Neon / Render) |
| **AI Layer** | Tool/Function Calling Agent, Multi-Provider Gateway (Gemini 1.5 Flash / OpenAI / Claude) |
| **Authentication**| Short-Lived JWT (In-Memory) + HttpOnly Secure Refresh Cookies + Argon2id Hashing |
| **Deployment** | Vercel (Frontend Global CDN), Google Cloud Run / Render (Backend Docker Container) |

---

## 3. High-Level Architecture

```
User (Web / PWA)
      │
      ▼
Vercel Edge / Cloud Run (FastAPI Gateway)
      │
      ├──> Auth & Rate Limit Middleware
      │
      ├──> Domain Services (Tasks, Habits, Expenses, Fitness, etc.)
      │       │
      │       ▼
      │    Repository Layer (SQLAlchemy 2.0) ──> PostgreSQL 16
      │
      └──> AI Agent Orchestrator
              │
              ├──> Context Assembler & Safety Guard
              │
              ▼
           LLM Provider (Gemini / OpenAI / Anthropic)
              │
              ▼
           Tool Registry ──> (Dispatches to Domain Services)
```

---

## 4. Repository & Implementation Blueprint Directory

```
zoro/
├── apps/
│   ├── web/                      # React 18 + Vite + Tailwind + PWA Client
│   └── api/                      # FastAPI + SQLAlchemy 2.0 + AI Agent Backend
├── docs/                         # Authoritative Architectural & Implementation Blueprints
│   ├── IMPLEMENTATION_AUDIT.md   # Current repository audit & gap analysis
│   ├── ARCHITECTURAL_DECISIONS.md# Architecture Decision Records (ADRs)
│   ├── IMPLEMENTATION_PLAN.md    # Master 22-Phase Implementation Roadmap (Phase 0 to 21)
│   ├── TASK_BACKLOG.md           # 90 Actionable Engineering Tasks (ZORO-001 to ZORO-090)
│   ├── DEPENDENCY_GRAPH.md       # End-to-End System & Phase Dependency Graphs
│   ├── REPOSITORY_STRUCTURE.md   # Monorepo Structure & Conventional Commits
│   ├── LOCAL_DEVELOPMENT.md      # Local Setup, Run, Test, and Build Commands
│   ├── FRONTEND_IMPLEMENTATION.md# 20-Step Frontend Construction Sequence
│   ├── ZORO_ANIMATION_SPEC.md    # Central ZORO Radial Core Motion Architecture
│   ├── BACKEND_IMPLEMENTATION.md # 4-Tier Clean Backend Code Architecture
│   ├── DATABASE_IMPLEMENTATION.md# Migration Sequence, Constraints & Seed Data
│   ├── API_IMPLEMENTATION.md     # RESTful Endpoint Contracts & Payloads
│   ├── AUTH_IMPLEMENTATION.md    # Dual-Token Auth & Argon2id Password Hashing
│   ├── AI_IMPLEMENTATION.md      # AI Provider Gateway & Tool Loop
│   ├── AI_TOOL_IMPLEMENTATION.md # 23 Domain Tool Schemas & Executions
│   ├── AI_CONFIRMATION_SYSTEM.md # Two-Tier Destructive Confirmation Safeguard
│   ├── AI_CONTEXT_SYSTEM.md      # Dynamic Context Assembler & Memory Slicing
│   ├── MOBILE_IMPLEMENTATION.md  # PWA Manifest, Workbox Caching & Safe Areas
│   ├── TEST_PLAN.md              # Test Matrix (Pytest, Vitest, Playwright, AI Bench)
│   ├── CICD.md                   # GitHub Actions Workflows & Quality Gates
│   ├── SECURITY_CHECKLIST.md     # Pre-Flight Security Hardening Certification
│   ├── OBSERVABILITY.md          # Structured JSON Logs, Telemetry & Tracing
│   ├── DEPLOYMENT_PLAN.md        # Vercel, Cloud Run & Managed Postgres Strategy
│   ├── PRODUCTION_CHECKLIST.md   # 20-Point Production Sign-off Verification
│   └── 01_PRD.md ... 23_FUTURE_ROADMAP.md # Original 23 Foundation Specifications
├── scripts/                      # DB Seeding & Setup Automation
├── tests/                        # Playwright E2E Test Suite
├── .env.example                  # Master Environment Configuration Template
├── CHANGELOG.md                  # Release Notes
└── README.md
```

---

## 5. Local Development Setup

### Prerequisites
- Node.js 20+ and `npm`
- Python 3.11+
- PostgreSQL 16+ running locally or in Docker

### 5.1 Clone & Environment Setup
```bash
git clone https://github.com/akshay1117/zoro.git
cd zoro

# Copy master environment template
cp .env.example apps/api/.env
cp .env.example apps/web/.env
```
*Edit `apps/api/.env` to configure your `DATABASE_URL` and `AI_API_KEY`.*

### 5.2 Backend Setup (FastAPI)
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload --port 8000
```

### 5.3 Frontend Setup (Vite React)
```bash
# In a separate terminal
cd apps/web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Testing Commands

```bash
# Run Backend Unit & API Tests
cd apps/api
pytest -v --cov=app

# Run AI Tool Execution Tests
pytest tests/test_ai_tools.py -v

# Run Frontend Component Tests
cd apps/web
npm run test

# Run E2E Playwright Tests
cd ../../tests
npx playwright test
```

---

## 7. Master Implementation Phases Overview

| Phase | Title | Milestone Deliverable |
| :---: | :--- | :--- |
| **Phase 0** | Repository & Tooling Setup | Root workspaces, Vite, FastAPI venv, linters, formatters |
| **Phase 1** | Frontend Shell & Design System | OLED black theme, layout shells, Central ZORO Radial Core |
| **Phase 2** | Backend Foundation & Infrastructure | FastAPI factory, error handling, rate limiting, request ID tracing |
| **Phase 3** | Database & Migrations | PostgreSQL 16 async pool, 22 SQLAlchemy models, Alembic migrations |
| **Phase 4** | Authentication & User Profiles | Argon2id hashing, dual-token JWT/HttpOnly cookie, login views |
| **Phase 5** | Dashboard Command Center | Aggregation service, summary cards (tasks, habits, expenses) |
| **Phase 6** | Academic Tasks & Projects | Task CRUD, categories, priorities, due dates, swipe-to-complete |
| **Phase 7** | Daily Discipline & Habits Engine | Daily habit checklist, streak calculation engine, 30-day heatmap |
| **Phase 8** | Expenses & Financial Ledger | INR expense tracker, payment modes (UPI/Cash), budget gauge |
| **Phase 9** | Fitness & Workout Logger | Workout logger, multi-set exercises (kg/reps), volume math |
| **Phase 10**| Trading Journal & Console | Trade log, risk:reward ratios, win rate %, PnL curve in ₹ |
| **Phase 11**| Cybersecurity Lab Tracker | Platform logs (PortSwigger/HTB), study hours, lab notes |
| **Phase 12**| Notes & Knowledge Base | Split-pane markdown notes with PostgreSQL full-text search (FTS) |
| **Phase 13**| AI Gateway & Provider Abstraction| Unified LLM provider client (Gemini/OpenAI), chat drawer UI |
| **Phase 14**| AI Tool System & Execution | 23 Domain tools executing backend services with Pydantic schemas |
| **Phase 15**| AI Context, Memory & Confirmation | Dynamic context assembler, sliding memory, destructive safety cards |
| **Phase 16**| Notification System & Alerts | Notification center drawer, unread badge, Web Push (VAPID) |
| **Phase 17**| PWA, Mobile Polish & Touch Gestures| Workbox caching, PWA install prompt, bottom sheets, 48px hit areas |
| **Phase 18**| Comprehensive Testing & QA | Pytest (>85%), Vitest (>80%), Playwright E2E, AI benchmark (>95%) |
| **Phase 19**| Security Hardening & Audit | Bandit scan, CSP headers, prompt injection penetration testing |
| **Phase 20**| Production Deployment & CI/CD | GitHub Actions, Cloud Run Docker deployment, Vercel CDN deploy |
| **Phase 21**| Monitoring & Observability | Structured JSON logging, slow query alerts (>100ms), AI telemetry |

*Detailed task specifications (ZORO-001 through ZORO-090) are documented in [`docs/TASK_BACKLOG.md`](docs/TASK_BACKLOG.md).*

---

## 8. Architectural Rules for Development

1. **Do Not Over-Engineer the MVP:** Adhere strictly to the P0 feature set.
2. **AI Interacts Exclusively via Tools:** Never let the AI write arbitrary SQL or directly mutate database tables.
3. **Business Logic in Services:** Route handlers must remain thin controllers.
4. **No Secrets on Client:** Zero API keys or database passwords in the frontend bundle.
5. **Mobile Responsiveness is Mandatory:** Every page must work smoothly on a 375px viewport with $\ge$ 48px touch targets.
6. **Destructive Operations Require Confirmation:** Deletions must pass through the Confirmation Card state.