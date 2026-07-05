# 21 Codex Task Breakdown

## Purpose

This file breaks the project into safe future Codex tasks. Use `[X]` for completed work and `[ ]` for work that still needs to be completed.

## Execution Style

- [X] Create documentation first.
- [X] Keep docs implementation-ready.
- [X] Summarize created files after each task.
- [X] Use data visualization, iconography, and Angular animation patterns to improve UI/UX.
- [X] Ask before starting each major new implementation phase.

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

Current status:

- Core Spring APIs and Flyway migrations are implemented; `/api/personas`, `/api/me`, and `/api/dashboard/snapshot` are validated.
- Remaining backend work includes entity/repository completion and security guard hardening for live production risk scenarios.

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
- [X] Live direct endpoint works against parity data.
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
- [X] Phase 5 realtime route guard redirects unauthorized personas to the landing page.
- [X] Phase 5 page unit tests exist for deliverables, access rules, runtime flow, comparison metrics, realtime history, HTTP-triggered emits, error handling, and selected path state.
- [X] Placeholder tests exist for future live Socket.IO browser subscription append behavior.

## Task 7: Add Angular Shell

Expected files:

- [X] Standalone routes
- [X] Shell
- [X] Landing page
- [X] Public landing persona setup
- [X] Guards
- [X] Developer-only glossary route with term detail subview and code-section references
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
- [X] Glossary route is available to developer personas through `developer:view` and hidden from viewer personas.

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
- [X] OpenAPI Contract Lab surfaces explicit generated contract drift watch status.
- [X] Frontend state tests cover OpenAPI drift metadata and filter state.
- [X] Playwright covers contract drift warning details in the OpenAPI lab.

## Task 9: Add SignalStore Mapping

Expected files:

- [X] SignalStores
- [X] Computed Map indexes
- [X] ViewModels
- [X] Unit tests

Do not touch:

- [ ] Backend schema unless DTO contract requires it.

Test command:

- [X] Angular unit tests.

Acceptance criteria:

- [X] Map joins pass.
- [X] `borrowersById` tests pass.
- [X] `documentsByLoanId` tests pass.
- [X] `statusByCode` tests pass.
- [X] Permission Set tests pass.
- [X] Visible nav filtering tests pass.
- [X] Loan/security row fallback tests pass for missing borrower/status data.

## Current Codex task status

- The Angular shell, landing persona flow, Spring API connectivity, Phase 5 D3 visuals, OpenAPI lab, and UI animation patterns are implemented.
- The current UI uses mat-icons in navigation, PrimeNG charts/tables, and Angular native `animate.enter` / `animate.leave` route/content transitions.
- The remaining active Codex work is backend parity for Nest direct reads, generated client drift guard coverage, and Phase 6.5 runtime auth/CORS/CSRF hardening.
- Existing unit tests cover landing persona flow, permission guards, Phase 5 comparison metrics, OpenAPI drift status, MCP access, and route refresh hardening.
- Playwright coverage exists for landing persona entry, protected lab route access, `/lab/mcp` reload regression, Phase 5 access, and OpenAPI/contract route guard behavior.
- [X] All new feature and hardening work should include targeted unit tests and e2e coverage before closure.
- Remaining planning updates should keep Phase 6.5 artifacts current while tracking live backend parity and security hardening in active Sprint 14/15.

## Current Backlog Mapping

This file tracks Codex task readiness and open work. The remaining incomplete items are mapped to the active/deferred sprint structure in `planning/20-build-phases-and-acceptance-criteria.md`:

- Active Sprint 14: backend parity, generated OpenAPI clients, live comparison metrics, Docker/Nginx startup, and data seed parity.
- Active Sprint 15: backend guards, CORS/CSRF/runtime origin improvements, and contract drift risk management.
- Completed Sprint 16: documentation closure, planning alignment, and backlog cleanup.
- Deferred Sprint 17: optional metrics/dashboard follow-up and long-term enterprise study work.

Open items still in active Sprint 14/15 backlog:

- [ ] `apps/postgres/src/migrations` and `apps/postgres/src/seed` content.
- [ ] `apps/spring-api` entities, repositories, and runtime security model.
- [ ] Nest live loans module and generated client drift watch integration.
- [X] Map/Set/ViewModel test coverage for borrower lookup, documents by loan, status lookup, permission membership, and fallback rows.
- [X] OpenAPI Contract Lab drift warning metadata and route coverage.
- [X] CSRF/same-site or runtime cookie guard documentation.
- [X] Formalize Phase 6.5 UI/UX security callouts in admin and contract lab pages after the current route/animation enhancements.
- [X] Phase 6.5 risk map and threat model artifact pages exist, with an active/deferred follow-up backlog note in `planning/phase-6-5-follow-up.md`.
- [X] Phase 6.5 unit and e2e coverage is now added for the new security artifact pages.

Deferred Sprint 17 items:

- [ ] Optional historical comparison metrics dashboard after metrics persistence exists.
- [ ] Long-term enterprise baseline variants or migration branches beyond the current modern study stack.
- [ ] Public-hardening issue tracking beyond the local training-lab runtime.

Current note:

- [X] Implementation and unit tests are complete.
- [X] Focused Playwright coverage covers filters, empty state, detail dialog, export feedback, reduced-motion table/overlay behavior, and unauthorized protected route redirect regression.

Expected files:

- [X] `/lab/security-search` route
- [X] Security search facade
- [X] Typed table query state
- [X] `SecuritySearchRowVm`
- [X] Detail dialog component or section
- [X] Unit tests
- [X] Playwright tests

Do not touch:

- [ ] Do not add finance math beyond display-friendly workflow fields.
- [ ] Do not use local template filtering as the main table model.

Test command:

- [X] `pnpm nx test architecture-dashboard`
- [X] Focused Playwright spec for security search

Acceptance criteria:

- [X] Lazy table state includes page, page size, sort, status filters, date filters, and numeric filters.
- [X] Rows show security, pool, coupon, commitment status, disclosure status, settlement date, amount/balance, and audit metadata.
- [X] Row actions include detail and export placeholders.
- [X] Loading, empty, and error states are visible.
- [X] Unit tests cover query-state projection, filtering, sorting, detail state, and export action behavior.

Current note:

- [X] Phase 9A Security Search implementation is complete and has supporting Angular unit tests.
- [X] Remaining Phase 9 realtime dashboard animation follow-through is covered by the Phase 10 Realtime Lab dashboard.

## Task 10: Add Visualizations

Current note:

- [X] Phase 5 D3 comparison/realtime topology graph is implemented.
- [X] App shell animation wiring now uses native `animate.enter` / `animate.leave` helpers for page headers and permission-aware navigation.
- [X] UI/UX uses mat-icons and chart/graph visualizations across protected and landing route surfaces.
- [X] Added unit tests for auth refresh reset hardening and Playwright e2e coverage for `/lab/mcp` reload behavior.
- [X] Timer-driven route transition state was removed from the app shell.
- [X] Shared style tokens are scaffolded and core lab views now use the shared design tokens.
- [X] Remaining Phase 9 realtime dashboard animation follow-through is covered by the Phase 10 Realtime Lab dashboard.
- [X] Playwright visual smoke coverage includes route transition and reduced-motion assertions.
- [X] Playwright smoke for permission-driven nav changes and protected lab page content updates has been added.
- [X] Playwright smoke now covers the protected backend comparison route transition.
- [X] Playwright mobile sidebar nav and protected route transition smoke has been added.
- [X] Playwright smoke now includes OpenAPI route transition and reduced-motion verification.
- [X] Playwright smoke now includes Infrastructure route transition and reduced-motion verification.
- [X] Playwright smoke now covers Security Search overlay detail transitions and table interactions.
- [X] Playwright smoke now covers Dashboard chart reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 graph reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 D3 selection highlight and chart highlight updates.
- [X] Playwright smoke now covers Phase 5 chart legend reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 flow graph reduced-motion behavior.
- [X] Playwright smoke now covers OpenAPI card hover reduced-motion behavior.
- [X] Playwright smoke now covers Infrastructure card hover reduced-motion behavior.
- [X] Playwright smoke now covers Security Search overlay reduced-motion behavior.
- [X] Route transition wrapper now uses `will-change` hints for smoother page motion.
- [X] Latest Playwright visual-smoke rerun passes on port 4201 across Chromium, Firefox, and WebKit.

Expected files:

- [X] Phase 5 D3 comparison/realtime topology graph
- [X] Architecture D3 graph
- [X] SignalStore D3 graph
- [X] OpenAPI D3 contract tree
- [X] Chart.js charts
- [X] PrimeNG dashboard components
- [X] Shared animation tokens or utility classes for Angular native `animate.enter` / `animate.leave` usage
- [X] Route/page transition styles for landing, lab dashboard, and protected feature pages
- [X] Sidebar and permission-aware navigation enter/exit transitions
- [X] Landing selector transitions for persona, dataset, backend mode, Compare all, and Explain Mode state changes
- [X] PrimeNG table row, loading, empty, filter-result, and dialog transitions
- [X] D3/SVG request-path, metric-bar, selected-path, and realtime-event transitions
- [X] Map inspector, SignalStore inspector, and OpenAPI tree expand/collapse transitions
- [X] Inline error, health-check, and status-banner enter/exit transitions
- [X] Reduced-motion CSS coverage for route, list, table, chart, and SVG animation surfaces
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
- [X] Playwright visual smoke where applicable.
- [X] Playwright animation smoke for desktop, mobile, route transition, permission change, and reduced-motion paths.
- [X] Unit tests for animation-related state projection where ViewModels decide visible rows, cards, routes, or graph nodes.

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
- [X] Angular native enter/exit animations are wired through state-driven DOM insertion/removal, not imperative timers.
- [X] Animation tokens keep durations and easing consistent across app shell, tables, cards, charts, and overlays.
- [X] Animated route, nav, table, chart, dialog, and status changes honor `prefers-reduced-motion`.
- [ ] Animated views avoid layout shift, clipped text, and overlapping content at desktop and mobile breakpoints.
- [X] Playwright covers at least one animated route transition, one permission-driven nav change, one table row/list update, and one reduced-motion assertion.

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

## Task 10B: Add Realtime Redis Lab Dashboard

Current note:

- [X] `/lab/realtime` is no longer a generic placeholder.
- [X] Realtime Lab loads event history through `NestApiFacade.getRealtimeEventHistory()`.
- [X] Realtime Lab emits one event through the generated Nest realtime facade.
- [X] Realtime Lab burst mode is implemented with repeated `loan-status` calls until a backend burst endpoint exists.
- [X] Realtime Lab summary cards, event table, status chart bars, and derived cache telemetry update from the same event state.
- [X] Angular unit tests cover history load, filter projection, emit-one, burst emit, chart/cache projections, and error state.
- [X] Playwright covers the dedicated `/lab/realtime` dashboard for Realtime Operator and guard redirect for Viewer.
- [ ] Backend Redis cache telemetry endpoint remains future work.

Expected files:

- [X] `/lab/realtime` dedicated page
- [X] Realtime summary cards
- [X] Realtime event controls
- [X] Realtime event history table
- [X] Realtime status chart bars
- [X] Derived cache hit/miss telemetry panels
- [X] Burst mode control
- [X] Unit tests
- [X] Playwright tests

Do not touch:

- [X] Do not make Redis the durable source of truth.
- [X] Do not add a parallel realtime DTO shape outside the generated Nest facade boundary.

Test command:

- [X] `pnpm nx test architecture-dashboard --watch=false`
- [X] `pnpm nx lint architecture-dashboard`
- [X] `pnpm nx lint architecture-dashboard-e2e`
- [X] `pnpm nx run architecture-dashboard-e2e:e2e-ci--src/comparison-and-realtime-api.spec.ts`

Acceptance criteria:

- [X] Realtime Operator can open `/lab/realtime`.
- [X] Viewer is redirected away from `/lab/realtime`.
- [X] Event history binds to generated Nest realtime DTOs.
- [X] Emitting one event updates card, table, and chart state.
- [X] Burst mode remains observable in the event table and chart.
- [X] Cache hit/miss panels render deterministic Redis telemetry from event state.
- [ ] Cache hit/miss panels render live backend Redis TTL and hit/miss metrics.

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

- [X] `apps/architecture-dashboard/src/styles.scss`
- [X] `apps/architecture-dashboard/src/styles/_colors.scss`
- [X] `apps/architecture-dashboard/src/styles/_vars.scss`
- [X] `apps/architecture-dashboard/src/styles/_typography.scss`
- [X] `apps/architecture-dashboard/src/styles/_surfaces.scss`
- [X] `apps/architecture-dashboard/src/styles/_components.scss`
- [X] `apps/architecture-dashboard/src/styles/_animations.scss`
- [X] `apps/architecture-dashboard/src/styles/_charts.scss`
- [X] `apps/architecture-dashboard/src/styles/_accessibility.scss`
- [ ] Updated route/page/component SCSS for landing, dashboard, security search, backend comparison, realtime, OpenAPI contract, Map inspector, SignalStore inspector, MCP, and admin/persona views.
- [ ] Updated Angular templates where Phase 13 adds PrimeIcons to navigation, page headers, status tags, metric summaries, table actions, empty states, realtime/cache panels, OpenAPI/security surfaces, and D3/SVG legends.
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

- [ ] `styles.scss` is the single global entrypoint and loads style partials with Sass `@use` in this order: colors, vars, typography, accessibility, surfaces, components, charts, animations.
- [ ] Colors, spacing, elevation, radius, typography, density, focus rings, z-index, animation timing, and chart palettes are centralized in the `styles` folder.
- [ ] Angular views do not introduce one-off palette colors, shadows, breakpoints, or animation timings when a shared token exists.
- [ ] PrimeNG tables, filters, dialogs, menus, tooltips, toasts, cards, buttons, inputs, chips, and tags follow the MD3 Express token system.
- [ ] PrimeIcons are used consistently for scannable actions and states: `pi pi-search`, `pi pi-filter`, `pi pi-download`, `pi pi-eye`, `pi pi-refresh`, `pi pi-check-circle`, `pi pi-exclamation-triangle`, `pi pi-times-circle`, `pi pi-info-circle`, `pi pi-database`, `pi pi-server`, `pi pi-wifi`, `pi pi-bolt`, and `pi pi-code`.
- [ ] D3/SVG and Chart.js visuals use the shared chart/status tokens and remain readable on desktop and mobile.
- [ ] Contrast is checked for default, hover, active, focus, disabled, error, warning, success, info, and selected states.
- [ ] Phase 9 enter/exit animation classes and reduced-motion behavior still work after the style migration.
- [ ] Playwright visual smoke proves key routes, overlays, tables, charts, and mobile navigation do not overlap or clip text.
