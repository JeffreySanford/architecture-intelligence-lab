# 21 Codex Task Breakdown

## Purpose

This file breaks the project into safe future Codex tasks. Use `[X]` for completed work and `[ ]` for work that still needs to be completed.

## Execution Style

- [X] Create documentation first.
- [X] Keep docs implementation-ready.
- [X] Summarize created files after each task.
- [ ] Ask before starting each major new implementation phase.

## Task 1: Create Documentation Only

Expected files:

- [X] `documentation/*.md`

Do not touch:

- [X] Keep app source code separate from documentation task.

Test command:

- [X] File review only.

Acceptance criteria:

- [X] Locked architecture is documented.
- [X] Mermaid diagrams exist inside the relevant Markdown files.

## Task 2: Scaffold Nx Workspace

Expected files:

- [X] Target project configs for dashboard, APIs, and infrastructure apps.
- [X] Generated library placeholders.

Do not touch:

- [X] No business logic beyond placeholders.

Test command:

- [X] `pnpm nx show projects`

Acceptance criteria:

- [X] Target projects are discoverable by Nx.

## Task 3: Add Docker Compose Shell

Expected files:

- [X] `docker-compose.yml`
- [X] Dockerfiles for `architecture-dashboard`, `nest-api`, and `spring-api`.
- [X] Nginx skeleton config.
- [X] `.env.example`

Do not touch:

- [X] No backend business endpoints added in this task.

Test command:

- [X] `docker compose config --quiet`
- [X] `docker compose build`

Acceptance criteria:

- [X] Compose config validates.
- [X] App containers build.

## Task 4: Add Postgres And Redis Infrastructure

Expected files:

- [X] `apps/postgres/src/init`
- [ ] `apps/postgres/src/migrations`
- [ ] `apps/postgres/src/seed`
- [X] `apps/redis/src/config`
- [X] pgAdmin service config
- [X] Redis Insight service config

Do not touch:

- [X] Angular UI features.

Test command:

- [ ] `docker compose up --build postgres redis pgadmin redis-insight`

Acceptance criteria:

- [X] Infrastructure starts and health checks pass.
- [X] pgAdmin is reachable.
- [X] Redis Insight is reachable.

## Task 5: Add Spring Boot App

Expected files:

- [X] Spring controllers
- [X] DTOs
- [ ] Entities
- [ ] Repositories
- [ ] Security
- [X] Flyway config

Do not touch:

- [X] Nest comparison behavior except shared contract notes.

Test command:

- [X] `docker compose run --rm --no-deps spring-api ./mvnw -pl apps/spring-api test`

Acceptance criteria:

- [X] Persona auth works.
- [X] Dashboard snapshot works.

## Task 6: Add NestJS App

Expected files:

- [ ] Loans module
- [ ] Comparison module
- [ ] Realtime module
- [ ] Redis module
- [ ] Diagnostics module

Do not touch:

- [ ] Spring business write ownership.

Test command:

- [ ] `pnpm run test:nest-api`

Acceptance criteria:

- [ ] Direct endpoint works.
- [ ] Proxy endpoint works.
- [ ] Comparison endpoint works.
- [ ] Socket.IO route works.

## Task 7: Add Angular Shell

Expected files:

- [X] Standalone routes
- [X] Shell
- [X] Landing page
- [X] Guards
- [X] Infrastructure status UI (`/lab/infrastructure`)
- [ ] Interceptors

Do not touch:

- [ ] Deep visualization implementations.

Test command:

- [X] `pnpm nx run architecture-dashboard:test`

Acceptance criteria:

- [X] Temporary persona flow enters permissive `/lab` routes.
- [X] Persona flow enters protected lab routes.

## Task 8: Add Generated Clients

Expected files:

- [ ] Generated Spring Angular client
- [ ] Generated Nest Angular client
- [ ] Data-access facades

Do not touch:

- [ ] Manual edits inside generated output.

Test command:

- [ ] Client generation and build command.

Acceptance criteria:

- [ ] Facades compile against generated clients.

## Task 9: Add SignalStore Mapping

Expected files:

- [X] SignalStores
- [X] Computed Map indexes
- [X] ViewModels
- [ ] Unit tests

Do not touch:

- [ ] Backend schema unless DTO contract requires it.

Test command:

- [X] Angular unit tests.

Acceptance criteria:

- [X] Map joins pass.
- [ ] Permission Set tests pass.

## Task 10: Add Visualizations

Expected files:

- [ ] D3 graphs
- [ ] Chart.js charts
- [ ] PrimeNG dashboard components

Do not touch:

- [ ] Backend business rules.

Test command:

- [ ] Angular tests.
- [ ] Playwright visual smoke where applicable.

Acceptance criteria:

- [ ] Main visualizations render without overlap.

## Task 11: Add Tests

Expected files:

- [ ] Angular unit tests
- [ ] Spring integration tests
- [ ] Nest tests
- [ ] Playwright tests
- [ ] Docker smoke test script

Do not touch:

- [ ] Unrelated refactors.

Test command:

- [ ] Workspace quality gate command.

Acceptance criteria:

- [ ] Tests cover the accepted learner journey.
