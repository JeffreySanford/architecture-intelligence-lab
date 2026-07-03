# Architecture Intelligence Lab Planning

This folder contains step-by-step execution planning for `architecture-intelligence-lab`.

Architecture explanations belong in [documentation](../documentation/README.md). This folder is for build phases, Codex task sequencing, PI objectives, sprint plans, acceptance criteria, and unresolved delivery questions.

## Current Strategy

The current branch remains the modern study stack: Angular 22, Nx 23 beta, TypeScript 6, Spring Boot 4.x, Java 17, NestJS 11, PostgreSQL, Redis, Docker, OpenAPI, D3, and PrimeNG 22 RC. PrimeNG has been upgraded to the Angular 22-aligned release-candidate line, so follow-on work must validate the actual components used by the app before leaning on new PrimeNG APIs broadly.

For enterprise job-prep discussion, keep the conservative baseline visible: Angular 18/19/20, PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI.

Planning priority after the current Security Search slice:

1. Map/Set/ViewModel tests for dashboard projection and visible nav filtering.
2. Real OpenAPI generation and facade-wrapped generated clients.
3. Live backend comparison paths.
4. Realtime event patching into dashboard state.
5. Replace Security Search mock facade data with generated-client-backed API data.

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
- [X] Phase 5 visualization view exists at `/lab/backend-comparison`.
- [X] Phase 5 uses D3 for comparison/realtime topology and PrimeNG for deliverables, acceptance criteria, and role access.
- [X] Phase 5 mock comparison metrics bind into a PrimeNG metrics table and selected D3 request path state.
- [X] Phase 5 mock realtime event history binds into a PrimeNG event history table.
- [X] Phase 5 has a permission-gated HTTP emit control that prepends the returned realtime event into the event history table.
- [X] Phase 5 protected routes use route-level permission guards in addition to shell nav filtering.
- [X] Phase 5 unit tests cover the view model, runtime checklist, comparison metrics, realtime history, HTTP-triggered emits, selected path state, and permission guard behavior.
- [X] Phase 5 Playwright tests cover access, redirects, placeholder route permissions, identity display, graph rendering, checklist rendering, comparison metrics, and realtime history with mocked API data.
- [X] Nest unit tests cover the mock comparison service/controller endpoints.
- [X] Nest unit tests cover the Socket.IO gateway emit/history service and controller path.
- [X] Local Angular proxy and Docker proxy behavior are separated with `SPRING_API_TARGET`.
- [X] Angular animation planning uses `animate.enter` and `animate.leave`, not `@angular/animations`.
- [X] Angular MCP config exists.
- [X] Generated-client library placeholders exist.
- [X] Nginx route skeleton exists.
- [X] `.env.example` exists.
- [X] pgAdmin and Redis Insight service configuration and proxy routes exist.
- [X] pgAdmin and Redis Insight are reachable on localhost ports 5050 and 5540.
- [X] Capital markets and PrimeNG knowledgebase note exists at [documentation/20-capital-markets-primeng-knowledgebase.md](../documentation/20-capital-markets-primeng-knowledgebase.md).
- [X] Shared Capital Markets vocabulary is locked at [documentation/21-capital-markets-vocabulary.md](../documentation/21-capital-markets-vocabulary.md).
- [X] PrimeNG version strategy is resolved for this branch by upgrading to Angular-22-aligned `primeng@22.0.0-rc.1`.
- [X] PrimeNG 22 RC validation passes for current tables, tags, buttons, cards, selects, toggle switch, and route screens.
- [X] PrimeUI license registration is wired through ignored local `.env`/`env.js` runtime config and `providePrimeNG`.
- [X] Current Angular views have been reviewed for Prime UI coverage; next component upgrade stories are captured in the knowledgebase and sprint plan.
- [X] Public landing view is limited to persona setup and does not advertise protected lab pages.
- [X] Authenticated lab navigation filters every protected link by the selected user's permissions.
- [X] `/lab/security-search` PrimeNG Capital Markets table exists with lazy loading, filters, row actions, details, loading, and empty states.
- [ ] Map/Set/ViewModel tests cover borrower lookup, documents by loan/security, status lookup, permission membership, and fallback rows.
- [ ] Generated OpenAPI clients are real, buildable, and consumed only through Angular facades.

## Phase 5 Visualization Planning Checkpoint

The current Phase 5 plan uses a visualization-first control surface:

- [X] D3/SVG shows relationships between Angular, Spring direct reads, Nest direct reads, Nest proxy, comparison endpoint, Socket.IO gateway, Redis adapter, and Nest Swagger UI.
- [X] PrimeNG tables and tags show deliverables, acceptance criteria, and role/persona access.
- [X] Persona permissions filter what a user can inspect while keeping the full access model explainable.
- [X] Deterministic mock comparison metrics bind into the existing Phase 5 tables and graph.
- [X] Deterministic mock realtime event history binds into the existing Phase 5 methodology.
- [X] HTTP-triggered mock realtime emits update Phase 5 history state without a live browser socket subscription.
- [X] Live comparison metrics replace mock values without changing the Phase 5 view model shape.
- [X] Angular live Socket.IO subscription and Redis adapter wiring bind into the same Phase 5 methodology instead of becoming disconnected pages.
- [X] Phase 5 Nest unit, build, lint, and e2e checks pass through Nx.
