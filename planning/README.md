# Architecture Intelligence Lab Planning

This folder contains step-by-step execution planning for `architecture-intelligence-lab`.

Architecture explanations belong in [documentation](../documentation/README.md). This folder is for build phases, Codex task sequencing, PI objectives, sprint plans, acceptance criteria, and unresolved delivery questions.

## Reading Order

1. [20 Build Phases And Acceptance Criteria](20-build-phases-and-acceptance-criteria.md)
2. [21 Codex Task Breakdown](21-codex-task-breakdown.md)
3. [22 PI And Sprint Plan](22-pi-and-sprint-plan.md)

## Checkbox Convention

- [X] Completed item
- [ ] Item that still needs to be completed

## Current Foundation Checkpoint

Completed foundation work:

- [X] Final app names are in use: `architecture-dashboard`, `spring-api`, `nest-api`, `postgres`, `redis`.
- [X] pnpm is the package manager.
- [X] Java, Nest, and Angular run through Docker containers while source stays under `apps/`.
- [X] `pnpm nx show projects` works.
- [X] `docker compose config --quiet` works.
- [X] `docker compose build` works.
- [X] `pnpm run lint:all` passes.
- [X] `pnpm run test:all` passes.
- [X] Angular 22 routed shell exists.
- [X] `/lab` is guarded by `/api/me`, with a demo fallback to Alice Viewer when no cookie exists.
- [X] Persona selection calls Spring and sets an httpOnly demo cookie.
- [X] Spring minimal endpoints exist for health, personas, current user, persona selection, and Small dashboard snapshot.
- [X] Flyway creates and seeds the initial lab schema.
- [X] Angular AuthStore and DashboardStore load real Spring DTOs.
- [X] Angular animation planning uses `animate.enter` and `animate.leave`, not `@angular/animations`.
- [X] Angular MCP config exists.
- [X] Generated-client library placeholders exist.
- [X] Nginx route skeleton exists.
- [X] `.env.example` exists.
