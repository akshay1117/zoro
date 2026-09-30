# AGENTS.md

## ZORO - AI Agent Development Guidelines

This document contains rules, instructions, and context for AI coding assistants working on the ZORO project.

### 1. Project Context
ZORO is a personal Life OS application for college students with a modern, dark, cinematic, premium UI.
It features modules for Tasks, Habits, Expenses, Fitness, Trading, Cybersecurity, and Notes, all orchestrated by an AI companion.

### 2. Tech Stack
**Frontend:**
- React 18+ (Vite)
- TypeScript
- Tailwind CSS (v4)
- Zustand (State management)
- TanStack Query (Data fetching)
- React Router DOM (Routing)
- Framer Motion (Animations)

**Backend:**
- Python 3.11+
- FastAPI
- SQLAlchemy 2.0 (Async)
- Alembic
- PostgreSQL 16+
- Pydantic v2

### 3. Architecture Rules
- Use `apps/web` for frontend code.
- Use `apps/api` for backend code.
- NEVER invent new architectural patterns outside of what is specified in the `docs/` folder.
- Always check `docs/16_PROJECT_STRUCTURE.md` for proper placement of files.

### 4. Code Quality Standards
- Strict TypeScript must be used. No `any` types unless absolutely necessary.
- Follow PEP 8 via Ruff and Black equivalents for Python code.
- Use Prettier for frontend formatting and ESLint for linting.
- Write Pytest tests for backend logic with >85% coverage.
- Write Vitest tests for frontend logic.

### 5. UI/UX Rules
- Prioritize a "dark, cinematic, premium" feel. Avoid generic dashboard looks.
- Use Lucide React for icons.
- Ensure all views are responsive (mobile-first approach).

### 6. Do Not's
- Do not deploy or modify deployment configuration unless explicitly asked.
- Do not implement new business logic without corresponding tests.
- Do not introduce new third-party dependencies unless approved in the architecture docs.
