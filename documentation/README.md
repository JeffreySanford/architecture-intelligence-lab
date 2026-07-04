# Architecture Intelligence Lab Documentation

This folder contains the Markdown architecture documentation for `architecture-intelligence-lab`, a Docker-first Nx training lab that uses loan, security, pool, commitment, disclosure, and realtime event data to teach full-stack Capital Markets-style architecture.

Mermaid diagrams are embedded directly in the relevant Markdown files. Step-by-step execution plans live in the root [planning](../planning/README.md) folder.

## Reading Order

1. [00 Executive Summary](00-executive-summary.md)
2. [01 System Architecture](01-system-architecture.md)
3. [02 Nx Monorepo Structure](02-nx-monorepo-structure.md)
4. [03 Docker Runtime Plan](03-docker-runtime-plan.md)
5. [04 Postgres, Flyway, And Seed Data](04-postgres-flyway-seed-data.md)
6. [05 Redis Realtime And Cache Plan](05-redis-realtime-cache-plan.md)
7. [13 UI, UX, And Visualization Plan](13-ui-ux-visualization-plan.md)
8. [15 Backend Comparison Lab](15-backend-comparison-lab.md)
9. [16 Realtime Socket.IO And Redis Lab](16-realtime-socketio-redis-lab.md)
10. [19 Testing Strategy](19-testing-strategy.md)
11. [20 Capital Markets And PrimeNG Knowledgebase](20-capital-markets-primeng-knowledgebase.md)
12. [21 Capital Markets Vocabulary](21-capital-markets-vocabulary.md)

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

## Stack Strategy

The current branch is intentionally the modern learning branch:

- Angular 22 standalone
- Nx 23 beta
- TypeScript 6
- Spring Boot 4.x
- Java 17 in the current Maven build
- NestJS 11
- PrimeNG 22 RC, aligned to Angular 22, with current app build/test validation complete
- PrimeUI runtime license registration through ignored local `.env` and Angular `providePrimeNG`

For job-prep conversations, keep a conservative enterprise baseline in view: Angular 18/19/20, PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI. That baseline maps well to many large enterprise Angular/Spring environments, while this repo remains the modern implementation lab.

PrimeNG has been upgraded from the previous v17 dependency to `22.0.0-rc.1`, which is the published Angular 22-aligned release-candidate line. Current Angular build and unit tests pass after migrating the app to the v22 entry points and theme provider. Treat broader new PrimeNG APIs as RC-sensitive until each feature validates them locally.

## Current Implementation Checkpoint

- Angular 22 routed shell exists.
- `/lab` is guarded by `/api/me`, but `/api/me` currently defaults to Alice Viewer when no cookie exists so the lab remains demo-accessible.
- The UI is PrimeNG-focused, with enterprise table/card patterns intended to support Capital Markets-style securities, pool, commitment, and disclosure workflows.
- Capital markets and PrimeNG study context is captured in [20 Capital Markets And PrimeNG Knowledgebase](20-capital-markets-primeng-knowledgebase.md).
- Shared DTO vocabulary is locked in [21 Capital Markets Vocabulary](21-capital-markets-vocabulary.md).
- Persona selection calls Spring `POST /api/dev-auth/personas/{personaId}/select`; Spring sets an httpOnly `access_token` cookie containing the selected persona id until signed JWT auth exists.
- Angular `AuthStore` uses Spring `/api/personas`, persona selection, and `/api/me`; permission state filters visible sidebar items.
- Route-level permission guards now protect Phase 5 routes in addition to sidebar filtering.
- Spring minimal API surface exists: `/api/health`, `/api/personas`, `/api/me`, `/api/dev-auth/personas/{personaId}/select`, and `/api/dashboard/snapshot?dataset=small`.
- Flyway migration `V1__create_lab_seed.sql` creates users, roles, permissions, personas, role joins, and seeded Small dashboard tables.
- Angular dashboard and Map Inspector load the Spring Small snapshot through `DashboardStore` and computed Map indexes.
- Phase 5 has a first visualization surface at `/lab/backend-comparison`: D3 renders comparison/realtime topology, while PrimeNG renders deliverables, acceptance criteria, and role access.
- Local Angular development uses an environment-aware proxy. `nx serve` defaults Spring traffic to `http://localhost:18080`; Docker compose sets `SPRING_API_TARGET=http://spring-api:8080`.
- Angular animation planning uses `animate.enter` and `animate.leave`, not `@angular/animations`.
- Angular MCP config exists at `.vscode/mcp.json`.
- Generated client libraries exist at `libs/generated/spring-api-client` and `libs/generated/nest-api-client`; both are generated and consumed through Angular facades for the current Spring dashboard/auth and Nest comparison/realtime calls.
- Nginx route skeleton exists at `apps/architecture-dashboard/nginx/default.conf`.
- Local environment defaults are documented in `.env.example`.
- Current state-store implementation uses Angular signals directly. `@ngrx/signals` remains the target once an Angular 22-compatible package is available.

## Phase 5 Documentation Alignment

The Phase 5 documentation now follows the planning methodology:

- D3 is used for topology and active path explanation.
- PrimeNG is used for operational status, deliverables, metrics, event history, and access matrices.
- The static Phase 5 learning surface ships before the Nest endpoints are complete, then live comparison and realtime data should bind into the same typed ViewModel structure.
- Access should remain explicit: Diagnostics Admin owns comparison inspection, Realtime Operator owns realtime view/emit, Contract Admin owns Swagger/OpenAPI inspection, and general learner roles should not receive Phase 5 controls by default.
