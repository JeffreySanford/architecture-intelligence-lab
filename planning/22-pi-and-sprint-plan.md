# 22 PI And Sprint Plan

## Purpose

This file turns the architecture roadmap into a PI and sprint plan. Use `[X]` for completed work and `[ ]` for work that still needs to be completed.

## PI Objective

- [ ] Deliver the first complete version of `architecture-intelligence-lab`: a Docker Compose based Nx training system where a user can select a persona, open the Angular lab, inspect DTO-to-ViewModel mapping, compare Spring and Nest backend paths, trigger realtime Socket.IO events backed by Redis, inspect OpenAPI contracts, and run the core test suite.

## PI Success Measures

- [X] One-command startup script exists: `pnpm run start:all`.
- [ ] `docker compose up --build` starts the complete final system.
- [ ] Browser entrypoint serves Angular through Nginx at `/`.
- [X] Persona selection sets httpOnly cookie and `/api/me` works.
- [ ] Small, Medium, Large, and Stress dataset options exist.
- [X] Cards and tables use SignalStore computed ViewModels.
- [X] Key indexes and permission Set are visible.
- [ ] Spring direct, Nest direct, Nest proxy, Compare all work.
- [ ] Socket.IO event updates UI state.
- [ ] Redis cache/pub-sub behavior is inspectable.
- [ ] Spring and Nest OpenAPI views are linked and explained.
- [ ] Unit, integration, and Playwright coverage exists for core flow.

## PI Timeline

- [X] Sprint 0: Architecture and documentation.
- [X] Sprint 1 foundation: Workspace rename, pnpm, Docker shell, and baseline verification.
- [ ] Sprint 2: Infrastructure and source-of-truth API.
- [ ] Sprint 3: Gateway, comparison, and contracts.
- [ ] Sprint 4: Angular lab shell and dashboard.
- [ ] Sprint 5: Visual labs and realtime.
- [ ] Sprint 6: Contract/MCP labs and hardening.

## Sprint 0: Architecture And Documentation

Goal: Create the documentation checkpoint before more implementation.

Stories:

- [X] As a developer, I can read the executive summary and understand the purpose of the lab.
- [X] As a developer, I can inspect diagrams for system context, Docker topology, routing, data flow, auth, realtime, and testing.
- [X] As a developer, I can follow the task breakdown without guessing the next safe step.

Deliverables:

- [X] Documentation folder
- [X] Markdown architecture files
- [X] Embedded Mermaid diagrams in Markdown files
- [X] PI and sprint plan
- [X] Planning folder

Acceptance criteria:

- [X] Documentation covers all locked decisions.
- [X] Planning lives in `planning/`.
- [X] Documentation lives in `documentation/`.

## Sprint 1: Workspace And Runtime Shell

Goal: Align the Nx workspace and create the Docker shell.

Stories:

- [X] As a developer, I can list Nx projects and see the target app boundaries.
- [X] As a developer, I can validate the Docker Compose configuration.
- [X] As a developer, I can see Nginx routes planned in config.

Deliverables:

- [X] Target app projects
- [X] `architecture-dashboard`
- [X] `spring-api`
- [X] `nest-api`
- [X] `postgres`
- [X] `redis`
- [X] Docker Compose skeleton
- [X] Dockerfiles for Angular, Nest, and Spring
- [X] Root Maven Wrapper
- [X] Generated-client library placeholders
- [X] Nginx route skeleton
- [X] `.env.example`

Acceptance criteria:

- [X] `pnpm nx show projects` works.
- [X] `docker compose config --quiet` passes.
- [X] `docker compose build` passes.
- [X] `pnpm run lint:all` passes.
- [X] `pnpm run test:all` passes.

## Sprint 2: Infrastructure And Spring Source Of Truth

Goal: Bring up durable infrastructure and the source-of-truth API.

Stories:

- [X] As a developer, I can start PostgreSQL, Redis, pgAdmin, and Redis Insight.
- [X] As a learner, I can inspect seeded database data.
- [X] As a user, I can select a persona and load `/api/me`.
- [X] As a frontend consumer, I can request a dashboard snapshot DTO.

Deliverables:

- [X] Postgres migrations
- [X] Seed users, roles, permissions, personas, loans, borrowers, documents, status codes
- [X] Redis config
- [X] pgAdmin container
- [X] Redis Insight container
- [X] Spring Boot DTO endpoints
- [X] Persona httpOnly-cookie auth
- [X] Nginx proxy routes for pgAdmin and Redis Insight
- [X] `/lab/infrastructure` status view
- [ ] Spring Swagger UI

Acceptance criteria:

- [X] Flyway migrations run on startup.
- [X] `/api/dev-auth/personas/{personaId}/select` sets cookie.
- [X] `/api/me` returns roles and permissions.
- [X] `/api/dashboard/snapshot` returns data for at least the Small dataset.
- [X] pgAdmin is reachable at `http://127.0.0.1:5050`.
- [X] Redis Insight is reachable at `http://127.0.0.1:5540`.

## Sprint 3: Nest Gateway, Comparison, And Generated Contracts

Goal: Add NestJS comparison paths and generate frontend clients.

Stories:

- [ ] As a learner, I can compare Spring direct, Nest direct, and Nest proxy paths.
- [ ] As a capital markets analyst, I can compare backend paths for portfolio data and see latency, payload, and contract differences.
- [ ] As a compliance reviewer, I can inspect persona access and API contract behavior across backend paths.
- [ ] As a frontend developer, I can consume generated Angular clients through facades.
- [ ] As a developer, I can keep the study lab focused on capital markets concepts without modeling full mortgage compliance.

Deliverables:

- [ ] Nest direct read endpoint
- [ ] Nest proxy endpoint
- [ ] Backend comparison endpoint
- [ ] Socket.IO gateway skeleton
- [ ] Redis adapter wiring
- [ ] Spring and Nest generated clients
- [ ] Data-access facade skeletons

Acceptance criteria:

- [ ] Comparison endpoint returns latency, payload size, record count, and error state.
- [ ] Both Swagger UIs are reachable through Nginx.
- [ ] Generated clients build and are not manually edited.

## Sprint 4: Angular Shell, Auth Flow, And Dashboard Mapping

Goal: Build the usable frontend lab shell and main dashboard.

Stories:

- [X] As a user, I can select a persona and enter the lab.
- [X] As a learner, I can toggle Explain Mode.
- [X] As a learner, I can change dataset size and backend mode.
- [X] As a developer, I can inspect Map/Set indexes derived from DTO state.

Deliverables:

- [X] Angular standalone route shell
- [X] Landing command center
- [X] Persona cards
- [X] Protected lab routes
- [X] `AuthStore`
- [X] `DashboardStore`
- [X] Map and Set indexes
- [X] Loan cards and PrimeNG table
- [ ] Chart.js summary charts

Acceptance criteria:

- [X] `/lab` is accessible in the temporary unauthenticated shell.
- [X] Dashboard renders Small dataset.
- [X] Permission Set controls visible nav items.
- [X] Map inspector displays `loansById`, `borrowersById`, `documentsByLoanId`, `statusByCode`, and `permissionSet`.

## Sprint 5: Visual Labs And Realtime

Goal: Make architecture, state, comparison, and realtime behavior visible.

Stories:

- [ ] As a learner, I can see a D3 architecture flow diagram.
- [ ] As a learner, I can inspect SignalStore raw and computed state.
- [ ] As a learner, I can trigger a realtime event and watch the UI update.
- [ ] As a learner, I can see Redis cache hit/miss behavior.

Deliverables:

- [ ] D3 architecture graph
- [ ] SignalStore graph
- [ ] Backend comparison UI
- [ ] Realtime controls
- [ ] Socket.IO client
- [ ] Copy-on-write Map update
- [ ] Redis cache hit/miss panel

Acceptance criteria:

- [ ] Realtime `loan.status.updated` event updates card, table, and chart.
- [ ] Compare-all mode renders metrics for all backend modes.
- [ ] Explain Mode overlays connect visual explanations to live state.

## Sprint 6: Contract Lab, MCP Dashboard, Tests, And Hardening

Goal: Complete the educational surface and prove the core flow.

Stories:

- [ ] As a learner, I can understand how Flyway, OpenAPI, ViewModel tests, and Playwright prevent different drift types.
- [ ] As a developer, I can view MCP guidance without executing browser-side commands.
- [ ] As a maintainer, I can run core quality gates.

Deliverables:

- [ ] OpenAPI contract lab
- [ ] MCP dashboard
- [ ] Angular unit tests
- [ ] Spring integration tests
- [ ] Nest tests
- [ ] Playwright E2E flow
- [ ] Docker smoke test
- [ ] Responsive UI polish

Acceptance criteria:

- [ ] Playwright covers persona selection, Explain Mode, backend comparison, Map inspector, realtime event, and OpenAPI lab.
- [ ] Unit tests cover Map joins, Set permissions, and ViewModel projection.
- [ ] Docker smoke test validates startup and key health endpoints.

## PI Risks

- [ ] Scope grows beyond training-lab v1. Mitigation: keep Redis, MCP, and visualizations scoped to explicit teaching goals.
- [X] Project names drift from final names. Mitigation applied: Nx project names and app folders now use the locked names.
- [ ] Generated clients become hard to maintain. Mitigation: use facades and never inject generated services directly into components.
- [ ] Realtime state becomes confusing. Mitigation: keep Spring as durable source of truth and Redis as transient coordination only.
- [ ] Stress dataset slows development. Mitigation: make Stress an explicit mode, not the default.

## Unresolved Questions

- [X] pgAdmin and Redis Insight should be proxied through Nginx in v1 while keeping direct local ports available for learners.
- [ ] Should CSRF token handling be implemented in v1 or documented as a v1.1 hardening task?
