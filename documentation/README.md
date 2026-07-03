# Architecture Intelligence Lab Documentation

This folder contains the Markdown architecture documentation for `architecture-intelligence-lab`, a Docker-first Nx training lab that uses mortgage-like data to teach full-stack architecture.

Mermaid diagrams are embedded directly in the relevant Markdown files. Step-by-step execution plans live in the root [planning](../planning/README.md) folder.

## Reading Order

1. [00 Executive Summary](00-executive-summary.md)
2. [01 System Architecture](01-system-architecture.md)
3. [02 Nx Monorepo Structure](02-nx-monorepo-structure.md)
4. [03 Docker Runtime Plan](03-docker-runtime-plan.md)
5. [04 Postgres, Flyway, And Seed Data](04-postgres-flyway-seed-data.md)
6. [05 Redis Realtime And Cache Plan](05-redis-realtime-cache-plan.md)
7. [19 Testing Strategy](19-testing-strategy.md)

## Locked Decisions

| Area | Decision |
| --- | --- |
| Project name | `architecture-intelligence-lab` |
| Required app names | `architecture-dashboard`, `spring-api`, `nest-api`, `postgres`, `redis` |
| Package manager | pnpm |
| Tone | Training-lab / guided architecture workshop |
| Runtime | Docker Compose first |
| Repo management | Nx monorepo |
| Frontend | Angular 22 standalone |
| State | NgRx SignalStore |
| UI | PrimeNG, D3, Chart.js, Angular 22 native animations, CSS transitions |
| Source-of-truth backend | Spring Boot Maven API |
| Comparison backend | NestJS API, gateway, Socket.IO realtime |
| Database | PostgreSQL |
| Realtime/cache | Redis |
| Inspection tools | pgAdmin and Redis Insight |
| Auth | Persona selector plus httpOnly-cookie JWT |
| Contracts | Swagger/OpenAPI for Spring and Nest |
| Generated clients | Angular models and services from both APIs |
| Testing | Angular unit, Spring integration, Nest tests, Playwright E2E |

## Current Repo Note

The repository uses the locked target app names:

- `architecture-dashboard`
- `spring-api`
- `nest-api`
- `postgres`
- `redis`

The initial scaffolded app names have been replaced with the final target names. Future work should keep source files under `apps/` and add infrastructure assets under `apps/postgres` and `apps/redis`.

## Current Implementation Checkpoint

- Angular 22 routed shell exists.
- `/lab` is guarded by `/api/me`, but `/api/me` currently defaults to Alice Viewer when no cookie exists so the lab remains demo-accessible.
- Persona selection calls Spring `POST /api/dev-auth/personas/{personaId}/select`; Spring sets an httpOnly `access_token` cookie containing the selected persona id until signed JWT auth exists.
- Angular `AuthStore` uses Spring `/api/personas`, persona selection, and `/api/me`; permission state filters visible sidebar items.
- Spring minimal API surface exists: `/api/health`, `/api/personas`, `/api/me`, `/api/dev-auth/personas/{personaId}/select`, and `/api/dashboard/snapshot?dataset=small`.
- Flyway migration `V1__create_lab_seed.sql` creates users, roles, permissions, personas, role joins, and seeded Small dashboard tables.
- Angular dashboard and Map Inspector load the Spring Small snapshot through `DashboardStore` and computed Map indexes.
- Angular animation planning uses `animate.enter` and `animate.leave`, not `@angular/animations`.
- Angular MCP config exists at `.vscode/mcp.json`.
- Generated client placeholder libraries exist at `libs/generated/spring-api-client` and `libs/generated/nest-api-client`.
- Nginx route skeleton exists at `apps/architecture-dashboard/nginx/default.conf`.
- Local environment defaults are documented in `.env.example`.
- Current state-store implementation uses Angular signals directly. `@ngrx/signals` remains the target once an Angular 22-compatible package is available.
