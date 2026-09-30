# Changelog

All notable changes to **ZORO** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-09-30

### Initial Architectural Blueprint & Specification Release

This release establishes the authoritative product, UX, technical, database, AI agent, and deployment blueprints for ZORO before implementation begins.

#### Added
- **Product Requirements Document (`docs/01_PRD.md`):** Complete problem definition, college student persona ("Akshay"), P0/P1/P2 feature priority matrix, user stories across all 8 modules, functional and non-functional requirements.
- **Technical Requirements Document (`docs/02_TRD.md`):** End-to-end architecture diagram, tech stack selection (React, Vite, Tailwind, shadcn/ui, Framer Motion, FastAPI, SQLAlchemy 2.0, PostgreSQL 16), provider abstraction layer, and architectural trade-off rationales.
- **Application User & Data Flows (`docs/03_APP_FLOW.md`):** Detailed Mermaid sequences and flowcharts for onboarding, task/habit/expense/workout/trade logging, AI command processing, destructive confirmation, and auth lifecycle.
- **Information Architecture (`docs/04_INFORMATION_ARCHITECTURE.md`):** Desktop vs mobile navigation models, secondary console routing via quick-action bottom sheets, route patterns, and `Cmd+K` command palette design.
- **UI/UX & Central Orb Specification (`docs/05_UI_UX_SPECIFICATION.md`):** Comprehensive motion and visual specs for the Central ZORO Radial Core across 6 states (`IDLE`, `LISTENING`, `THINKING`, `EXECUTING`, `SUCCESS`, `ERROR`), card elevation, typography, and mobile touch gestures.
- **Design System (`docs/06_DESIGN_SYSTEM.md`):** Complete design tokens for OLED dark mode (`#08080A`), cyber-violet palette (`#8B5CF6`, `#A855F7`), typography scales, 4px modular grid, ambient glow shadows, and z-index layers.
- **Database Schema & DDL (`docs/07_DATABASE_SCHEMA.md`):** Relational schema covering 22 tables (`users`, `profiles`, `tasks`, `habits`, `expenses`, `workouts`, `trades`, `cybersecurity`, `notes`, `ai_actions`, etc.) with UUIDv4 keys, indices, and a complete Mermaid ER diagram.
- **Backend Architecture (`docs/08_BACKEND_ARCHITECTURE.md`):** Clean 4-tier architecture (API, Services, Repositories, Models), request lifecycle, dependency injection patterns, and standard JSON response envelopes.
- **AI Agent Architecture (`docs/09_AI_AGENT_ARCHITECTURE.md`):** Deterministic tool-grounded agent architecture, dynamic context assembler, sliding window token budgeting, and safety guardrails.
- **AI Tools Specification (`docs/10_AI_TOOLS_SPECIFICATION.md`):** Formal JSON Schema contracts, input/output validation, and execution rules for 23 domain tools.
- **RESTful API Specification (`docs/11_API_SPECIFICATION.md`):** Complete OpenAPI 3.1 endpoint specification with request payloads, status codes, and error representations.
- **Security Architecture (`docs/12_SECURITY_ARCHITECTURE.md`):** Argon2id password hashing parameters, dual-token JWT/HttpOnly cookie strategy, prompt injection defenses, SQL injection prevention, and CORS policies.
- **Authentication Specification (`docs/13_AUTHENTICATION.md`):** User registration, silent token refresh, session lifecycle, and data privacy controls.
- **Notification System (`docs/14_NOTIFICATION_SYSTEM.md`):** In-app notification center, Web Push (VAPID) service worker integration, and Do Not Disturb (DND) scheduling.
- **PWA & Mobile Strategy (`docs/15_PWA_MOBILE_STRATEGY.md`):** Web App Manifest, Workbox caching policies, 48px touch targets, and iOS safe area padding.
- **Project Structure (`docs/16_PROJECT_STRUCTURE.md`):** Monorepo directory map for `apps/web`, `apps/api`, `docs`, `scripts`, and `tests`.
- **Engineering Roadmap & Phases (`docs/17_DEVELOPMENT_PHASES.md`):** 11 sequential 3–4 day phases with explicit dependencies, tasks, acceptance criteria, and definitions of done.
- **Testing Strategy (`docs/18_TESTING_STRATEGY.md`):** Pytest, Vitest, and Playwright E2E test suites, including automated benchmarks for natural language tool extraction.
- **Deployment Architecture (`docs/19_DEPLOYMENT_ARCHITECTURE.md`):** Vercel edge deployment, Cloud Run multi-stage Docker build, managed PostgreSQL provisioning, and zero-downtime Alembic migrations.
- **Environment Configuration (`docs/20_ENVIRONMENT_CONFIGURATION.md`):** Comprehensive `.env.example` templates for frontend and backend with strict Pydantic startup validation.
- **Standardized Error Handling (`docs/21_ERROR_HANDLING.md`):** Error code taxonomy and structured error envelopes.
- **Logging & Observability (`docs/22_LOGGING_MONITORING.md`):** Structured JSON logging (`structlog`), telemetry tracing, and slow query monitoring.
- **Strategic Product Roadmap (`docs/23_FUTURE_ROADMAP.md`):** Horizons 0 (MVP), 1 (Connected OS - Google Calendar, Market Data, Voice), and 2 (Local LLMs, Knowledge Graphs, Multi-Agent).
- **Master README (`README.md`):** Comprehensive project documentation, architectural overview, local setup guide, and development commands.
