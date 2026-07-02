# 20 Build Phases And Acceptance Criteria

## Purpose

This file turns the architecture into build phases. Use `[X]` for completed work and `[ ]` for work that still needs to be completed.

## Phase 0: Documentation

Goal: Define the architecture before adding more code.

Deliverables:

- [X] `/documentation` folder
- [X] Markdown architecture files
- [X] Embedded Mermaid diagrams
- [X] `/planning` folder
- [X] PI and sprint plan

Acceptance criteria:

- [X] Docs explain all locked decisions.
- [X] Docs include implementation order.
- [X] Documentation folder contains Markdown documentation files only.

Grill-me questions:

- [X] What is still ambiguous?
- [X] Which docs would a new developer read first?

Answers:

- Still ambiguous: whether pgAdmin and Redis Insight are proxied through Nginx in v1 or exposed on local ports first, and whether CSRF token handling is implemented in v1 or documented as v1.1 hardening.
- New developer reading order: start with `documentation/README.md`, then `documentation/00-executive-summary.md`, `documentation/01-system-architecture.md`, `documentation/09-angular-standalone-architecture.md`, and `planning/20-build-phases-and-acceptance-criteria.md`.

## Phase 1: Nx Workspace Scaffolding

Goal: Align the workspace with target project names and boundaries.

Deliverables:

- [X] Rename scaffolded apps to final target names
- [X] `architecture-dashboard`
- [X] `spring-api`
- [X] `nest-api`
- [X] `postgres`
- [X] `redis`
- [X] Generated-client library placeholders

Acceptance criteria:

- [X] `pnpm nx show projects` lists all intended projects.
- [X] Existing scaffold differences are resolved or documented.
- [X] pnpm is the workspace package manager.

## Phase 2: Docker Compose Skeleton

Goal: Create the Docker shell without full service implementation.

Deliverables:

- [X] `docker-compose.yml`
- [X] Dockerfiles for Angular, Nest, and Spring
- [X] Root Maven Wrapper
- [X] Nginx route skeleton
- [X] `.env.example`
- [X] Network and volume definitions

Acceptance criteria:

- [X] Compose file validates.
- [X] Service names match documentation.
- [X] `docker compose build` succeeds.
- [X] `pnpm run lint:all` passes.
- [X] `pnpm run test:all` passes.

## Phase 3: Infrastructure Containers

Goal: Start PostgreSQL, Redis, pgAdmin, and Redis Insight.

Deliverables:

- [X] Postgres container
- [X] Redis container
- [X] Postgres init folder placeholder
- [X] Redis config folder placeholder
- [X] Health checks for Postgres and Redis
- [X] Volumes
- [ ] pgAdmin container
- [ ] Redis Insight container
- [ ] Inspection tool routes or ports

Acceptance criteria:

- [ ] `docker compose up --build` starts full infrastructure.
- [ ] pgAdmin is reachable.
- [ ] Redis Insight is reachable.

## Phase 4: Spring Boot Source-Of-Truth API

Goal: Implement durable schema and source-of-truth endpoints.

Deliverables:

- [X] Flyway migrations
- [ ] JPA entities
- [X] DTO records
- [X] Persona auth
- [X] Dashboard endpoints
- [ ] Spring Swagger UI

Acceptance criteria:

- [X] `/api/me` works after persona selection.
- [X] `/api/dashboard/snapshot` returns DTO payload.
- [ ] Spring OpenAPI is reachable.

## Phase 5: NestJS Comparison And Realtime API

Goal: Implement gateway, comparison, diagnostics, and Socket.IO.

Deliverables:

- [ ] Direct read endpoints
- [ ] Proxy endpoints
- [ ] Comparison endpoint
- [ ] Socket.IO gateway
- [ ] Redis adapter
- [ ] Nest Swagger UI

Acceptance criteria:

- [ ] Spring direct, Nest direct, and Nest proxy can be compared.
- [ ] Realtime event endpoint emits Socket.IO events.

## Phase 6: OpenAPI Generated Clients

Goal: Generate Angular models and services from both APIs.

Deliverables:

- [ ] `libs/generated/spring-api-client`
- [ ] `libs/generated/nest-api-client`
- [ ] Generation scripts
- [ ] Drift check command
- [ ] Data-access facades

Acceptance criteria:

- [ ] Generated clients build.
- [ ] Components do not inject generated services directly.

## Phase 7: Angular Standalone Shell

Goal: Create the core lab UI and route structure.

Deliverables:

- [X] `app.config.ts`
- [X] `app.routes.ts`
- [X] Material shell
- [X] Landing page
- [X] Persona selector
- [X] Backend selector
- [X] Explain Mode toggle
- [X] Protected lab routes

Acceptance criteria:

- [X] User can select persona and enter `/lab`.
- [X] Routes load lazily.

Current note:

- [X] `/lab` now calls `/api/me`; no-cookie requests use the demo Alice Viewer fallback until signed JWT auth is added.

## Phase 8: Signal Store Dashboard

Goal: Implement DTO-to-ViewModel state flow.

Deliverables:

- [X] DashboardStore
- [X] Map indexes
- [X] Permission Set
- [X] Loan cards
- [X] Loan table
- [ ] Chart.js dashboard charts

Acceptance criteria:

- [ ] Dataset size selector changes loaded data.
- [X] Map inspector reflects current state.

Current note:

- [X] The current stores use Angular signals directly. `@ngrx/signals` remains the target once an Angular 22-compatible package is available.

## Phase 9: Visualizations

Goal: Add D3 and Explain Mode learning visuals.

Deliverables:

- [ ] Architecture graph
- [ ] Map bucket diagram
- [ ] SignalStore graph
- [ ] Request path animation using Angular 22 native enter/leave APIs and CSS transitions
- [ ] OpenAPI contract tree

Acceptance criteria:

- [ ] Explain Mode overlays connect to real state.
- [ ] Visuals render on desktop and mobile without overlap.

## Phase 10: Realtime Redis Lab

Goal: Complete event-driven dashboard updates.

Deliverables:

- [ ] Socket client
- [ ] Event controls
- [ ] Event history
- [ ] Cache hit/miss panels
- [ ] Redis Insight links

Acceptance criteria:

- [ ] Emitted event updates card, table, and chart.
- [ ] Burst mode remains observable.

## Phase 11: OpenAPI And MCP Dashboards

Goal: Complete contract and developer-tooling education views.

Deliverables:

- [ ] Contract lab
- [ ] Swagger links
- [ ] Generated client status
- [ ] MCP setup checklist
- [ ] Command guide

Acceptance criteria:

- [ ] Contract lab explains drift boundaries clearly.
- [ ] MCP dashboard does not execute arbitrary browser commands.

## Phase 12: Full Test Suite

Goal: Prove the architecture end to end.

Deliverables:

- [ ] Angular unit tests for lab logic
- [ ] Spring integration tests for source-of-truth API
- [ ] Nest tests for gateway and realtime API
- [ ] Playwright E2E tests
- [ ] Docker smoke test

Acceptance criteria:

- [ ] Main quality gates pass after full implementation.
- [ ] Playwright covers the core learner journey.
