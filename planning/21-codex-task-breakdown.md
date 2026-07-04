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

- [X] Comparison module
- [X] Mock-mode direct/proxy loan comparison endpoints
- [X] Realtime module with Socket.IO gateway skeleton
- [X] Mock-mode realtime emit and event history endpoints
- [X] Live Spring proxy reads with degraded fallback rows
- [X] Redis Socket.IO adapter wiring
- [X] Nest Swagger UI
- [ ] Live loans module
- [X] Diagnostics module
- [X] Landing page backend mode wiring for Spring direct, Nest direct, Nest proxy, and Compare all

Do not touch:

- [ ] Spring business write ownership.

Test command:

- [X] `pnpm nx test nest-api`
- [X] `pnpm nx lint nest-api`
- [X] `pnpm nx build nest-api`
- [X] `pnpm nx e2e nest-api-e2e`

Acceptance criteria:

- [X] Mock direct endpoint works for Phase 5 loan comparison.
- [X] Mock proxy endpoint works for Phase 5 loan comparison.
- [X] Mock comparison endpoint works and returns stable path metrics.
- [ ] Live direct endpoint works against parity data.
- [X] Live proxy endpoint works against Spring API and falls back cleanly when Spring is unavailable.
- [X] Live comparison endpoint works against Spring direct, Nest direct, and Nest proxy paths.
- [X] Socket.IO gateway route exists for `/gateway/realtime` and broadcasts `loan.status.updated`.
- [X] Gateway metrics expose enough mock-mode data for the Phase 5 visualization: latency, payload size, record count, error state, and source path.
- [X] Gateway metrics expose live runtime measurements for Spring direct, Nest direct, and Nest proxy paths.
- [X] Realtime emit endpoint returns an event id that can be correlated with Socket.IO event history in Angular.
- [X] Realtime event history endpoint drives the Phase 5 PrimeNG event history table.
- [X] Phase 5 emit control calls the realtime emit endpoint and prepends the returned event to the table.
- [X] Angular live Socket.IO client appends events from the gateway without a history refresh.
- [X] Phase 5 backend comparison route is covered by Playwright.
- [X] Phase 5 persona access restrictions are covered by Playwright.
- [X] Phase 5 OpenAPI route contract admin access is covered by Playwright.
- [X] Phase 5 realtime route placeholder access is covered by Playwright.
- [X] Nest e2e covers gateway health, comparison metrics, and realtime event creation.
- [X] Phase 5 realtime route guard redirects unauthorized personas to the dashboard.
- [X] Phase 5 page unit tests exist for deliverables, access rules, runtime flow, comparison metrics, realtime history, HTTP-triggered emits, error handling, and selected path state.
- [X] Placeholder tests exist for future live Socket.IO browser subscription append behavior.

## Task 7: Add Angular Shell

Expected files:

- [X] Standalone routes
- [X] Shell
- [X] Landing page
- [X] Public landing persona setup
- [X] Guards
- [X] Infrastructure status UI (`/lab/infrastructure`)
- [X] PrimeUI runtime license registration through local `.env` and ignored `env.js`
- [ ] Interceptors

Do not touch:

- [ ] Deep visualization implementations.

Test command:

- [X] `pnpm nx run architecture-dashboard:test`

Acceptance criteria:

- [X] Temporary persona flow enters permissive `/lab` routes.
- [X] Persona flow enters protected lab routes.
- [X] PrimeUI license is passed into `providePrimeNG` without committing the key to tracked source.
- [X] Infrastructure health, route map, and port mapping use Prime cards, tags, spinner, and tables.
- [X] Landing view exposes only public persona setup controls before lab entry.
- [X] Protected lab routes and sidebar links require selected-user permissions.

## Task 8: Add Generated Clients

Expected files:

- [X] Generated Spring Angular client
- [X] Generated Nest Angular client
- [X] Data-access facades
- [X] Contract drift check command
- [X] Facade tests proving components/stores do not inject generated services directly

Do not touch:

- [ ] Manual edits inside generated output.

Test command:

- [X] `pnpm nx run spring-api-client:generate`
- [X] `pnpm nx run nest-api-client:generate`
- [X] Client generation and build command.

Acceptance criteria:

- [X] Facades compile against generated clients.
- [X] Spring API access in Angular flows through facade-wrapped generated services.
- [X] Nest comparison and realtime DTOs are generated before Phase 5 removes local DTO interfaces.
- [X] Generated output is reproducible and not manually edited.
- [X] OpenAPI Contract Lab lists generated client metadata and facade ownership.
- [ ] OpenAPI Contract Lab surfaces explicit generated contract drift watch status.
- [ ] Frontend state tests cover OpenAPI drift metadata and filter state.
- [ ] Playwright covers contract drift warning details in the OpenAPI lab.

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
- [ ] `borrowersById` tests pass.
- [ ] `documentsByLoanId` tests pass.
- [ ] `statusByCode` tests pass.
- [ ] Permission Set tests pass.
- [ ] Visible nav filtering tests pass.
- [ ] Loan/security row fallback tests pass for missing borrower/status data.

## Task 9A: Add Security Search PrimeNG Table

Expected files:

- [X] `/lab/security-search` route
- [X] Security search facade
- [X] Typed table query state
- [X] `SecuritySearchRowVm`
- [X] Detail dialog component or section
- [X] Unit tests
- [ ] Playwright tests

Do not touch:

- [ ] Do not add finance math beyond display-friendly workflow fields.
- [ ] Do not use local template filtering as the main table model.

Test command:

- [X] `pnpm nx test architecture-dashboard`
- [ ] Focused Playwright spec for security search

Acceptance criteria:

- [X] Lazy table state includes page, page size, sort, status filters, date filters, and numeric filters.
- [X] Rows show security, pool, coupon, commitment status, disclosure status, settlement date, amount/balance, and audit metadata.
- [X] Row actions include detail and export placeholders.
- [X] Loading, empty, and error states are visible.
- [X] Unit tests cover query-state projection, filtering, sorting, detail state, and export action behavior.

## Task 10: Add Visualizations

Expected files:

- [X] Phase 5 D3 comparison/realtime topology graph
- [ ] Architecture D3 graph
- [ ] SignalStore D3 graph
- [ ] OpenAPI D3 contract tree
- [ ] Chart.js charts
- [ ] PrimeNG dashboard components
- [ ] Shared animation tokens or utility classes for Angular native `animate.enter` / `animate.leave` usage
- [ ] Route/page transition styles for landing, lab dashboard, and protected feature pages
- [ ] Sidebar and permission-aware navigation enter/exit transitions
- [ ] Landing selector transitions for persona, dataset, backend mode, Compare all, and Explain Mode state changes
- [ ] PrimeNG table row, loading, empty, filter-result, and dialog transitions
- [ ] D3/SVG request-path, metric-bar, selected-path, and realtime-event transitions
- [ ] Map inspector, SignalStore inspector, and OpenAPI tree expand/collapse transitions
- [ ] Toast, inline error, health-check, and status-banner enter/exit transitions
- [ ] Reduced-motion CSS coverage for route, list, table, chart, and SVG animation surfaces
- [X] Prime UI view review and route coverage notes
- [X] PrimeNG Security Search table screen
- [X] Phase 5 PrimeNG deliverables table
- [X] Phase 5 PrimeNG acceptance criteria table
- [X] Phase 5 role/persona access matrix
- [X] Phase 5 PrimeNG comparison metrics table
- [X] Phase 5 D3 measured metrics chart
- [X] Phase 5 PrimeNG realtime event history table
- [X] Phase 5 D3 selected-path highlighting from comparison metrics

Do not touch:

- [ ] Backend business rules.

Test command:

- [X] `pnpm nx lint architecture-dashboard`
- [X] `pnpm nx build architecture-dashboard`
- [X] Angular tests.
- [X] Focused Playwright Phase 5 e2e spec.
- [ ] Playwright visual smoke where applicable.
- [ ] Playwright animation smoke for desktop, mobile, route transition, permission change, and reduced-motion paths.
- [ ] Unit tests for animation-related state projection where ViewModels decide visible rows, cards, routes, or graph nodes.

Acceptance criteria:

- [X] Phase 5 visualization route is permission guarded.
- [X] D3 is used for topology, not for simple tabular status.
- [X] PrimeNG is used for access/status data where scanning matters.
- [X] PrimeNG table work is prioritized for dense Capital Markets workflows before broad additional D3 expansion.
- [X] Existing Angular views are reviewed for Prime UI usage and documented in the knowledgebase.
- [X] Unit tests cover Phase 5 deliverable filtering, runtime checklist visibility, graph helpers, and permission guard redirects.
- [X] E2E tests cover Diagnostics Admin access plus Viewer, Realtime Operator, and Contract Admin redirect behavior for `/lab/backend-comparison`.
- [X] E2E tests cover Phase 5 comparison metrics rendering with mocked Nest comparison data.
- [X] Unit tests cover Phase 5 D3 measured metrics visualization rendering.
- [ ] Main visualizations render without overlap.
- [X] Mock comparison data binds without replacing the Phase 5 view model structure.
- [X] Mock realtime event history binds without replacing the Phase 5 view model structure.
- [X] Live comparison and realtime data can be bound without replacing the Phase 5 view model structure.
- [ ] Angular native enter/exit animations are wired through state-driven DOM insertion/removal, not imperative timers.
- [ ] Animation tokens keep durations and easing consistent across app shell, tables, cards, charts, and overlays.
- [ ] Animated route, nav, table, chart, dialog, and status changes honor `prefers-reduced-motion`.
- [ ] Animated views avoid layout shift, clipped text, and overlapping content at desktop and mobile breakpoints.
- [ ] Playwright covers at least one animated route transition, one permission-driven nav change, one table row/list update, and one reduced-motion assertion.

Phase 5 visualization methodology:

- Start with an implementation-control view that mirrors the sprint deliverables and acceptance criteria.
- Model graph nodes and links as typed ViewModels before rendering D3.
- Keep D3 DOM work inside the component lifecycle and keep PrimeNG tables declarative in Angular templates.
- Filter deliverables by current persona permissions, and show the full role matrix so access behavior is explainable.
- Add live data in layers: mock comparison metrics first, live comparison metrics second, then event history, then Redis adapter/cache health.
- Validate local runtime through both direct Spring (`localhost:18080`) and proxied Angular (`localhost:4200/api`) paths.

Phase 9 animation candidates:

- Use `.enter` and `.exit` classes with Angular native enter/leave APIs for route shell, dashboard sections, permission-gated navigation, and selector summary changes.
- Use PrimeNG-compatible CSS classes for Security Search and Contract Lab table row insert/remove, filtered-result swaps, loading skeletons, empty states, and detail dialogs.
- Use D3/SVG transitions for request path movement, selected backend path highlighting, comparison metric bars, realtime event markers, architecture links, SignalStore nodes, and OpenAPI tree expansion.
- Use lightweight CSS transitions for toast messages, inline errors, health banners, Explain Mode callouts, status chips, and card state changes.
- Keep animation connected to typed ViewModels so persona, dataset, backend mode, realtime history, Map buckets, SignalStore recomputation, and OpenAPI drift state are testable before rendering.
- Add reduced-motion styles before broad rollout so Playwright and manual checks can prove motion can be disabled without hiding state changes.

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

## Task 12: Add Material Design 3 Express Styling System

Expected files:

- [ ] `apps/architecture-dashboard/src/styles.scss`
- [ ] `apps/architecture-dashboard/src/styles/_colors.scss`
- [ ] `apps/architecture-dashboard/src/styles/_vars.scss`
- [ ] `apps/architecture-dashboard/src/styles/_typography.scss`
- [ ] `apps/architecture-dashboard/src/styles/_surfaces.scss`
- [ ] `apps/architecture-dashboard/src/styles/_components.scss`
- [ ] `apps/architecture-dashboard/src/styles/_animations.scss`
- [ ] `apps/architecture-dashboard/src/styles/_charts.scss`
- [ ] `apps/architecture-dashboard/src/styles/_accessibility.scss`
- [ ] Updated route/page/component SCSS for landing, dashboard, security search, backend comparison, realtime, OpenAPI contract, Map inspector, SignalStore inspector, MCP, and admin/persona views.
- [ ] Playwright visual smoke coverage for desktop, mobile, overlays, tables, charts, route shell, and reduced-motion paths.

Do not touch:

- [ ] Backend business rules.
- [ ] DTO contracts or generated clients unless a style-only import path needs to move.
- [ ] Existing permission logic except where visual state classes need to bind to already-computed visibility.

Test command:

- [ ] `pnpm nx lint architecture-dashboard`
- [ ] `pnpm nx test architecture-dashboard`
- [ ] `pnpm nx build architecture-dashboard`
- [ ] `pnpm nx e2e architecture-dashboard-e2e`

Acceptance criteria:

- [ ] `styles.scss` is the single global entrypoint and imports style partials in this order: colors, vars, typography, accessibility, surfaces, components, charts, animations.
- [ ] Colors, spacing, elevation, radius, typography, density, focus rings, z-index, animation timing, and chart palettes are centralized in the `styles` folder.
- [ ] Angular views do not introduce one-off palette colors, shadows, breakpoints, or animation timings when a shared token exists.
- [ ] PrimeNG tables, filters, dialogs, menus, tooltips, toasts, cards, buttons, inputs, chips, and tags follow the MD3 Express token system.
- [ ] D3/SVG and Chart.js visuals use the shared chart/status tokens and remain readable on desktop and mobile.
- [ ] Contrast is checked for default, hover, active, focus, disabled, error, warning, success, info, and selected states.
- [ ] Phase 9 enter/exit animation classes and reduced-motion behavior still work after the style migration.
- [ ] Playwright visual smoke proves key routes, overlays, tables, charts, and mobile navigation do not overlap or clip text.
