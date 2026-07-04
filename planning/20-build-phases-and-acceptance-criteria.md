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
- [X] Current modern stack strategy documented
- [X] Enterprise baseline stack documented for job-prep comparison
- [X] Capital Markets vocabulary document

Acceptance criteria:

- [X] Docs explain all locked decisions.
- [X] Docs include implementation order.
- [X] Documentation folder contains Markdown documentation files only.
- [X] Docs explain that Angular 22/Nx 23 beta remain the current modern lab stack.
- [X] Docs record the PrimeNG 22 RC upgrade path for Angular 22.
- [X] Docs lock the shared vocabulary: `Security`, `Pool`, `Loan`, `Borrower`, `DisclosureFile`, `Commitment`, `TradeEvent`, `BackendComparisonMetric`, and `ContractSnapshot`.

Grill-me questions:

- [X] What is still ambiguous?
- [X] Which docs would a new developer read first?

Answers:

- Still ambiguous: whether CSRF token handling is implemented in v1 or documented as v1.1 hardening. Proxy routing for pgAdmin and Redis Insight is now resolved in v1.
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
- [X] pgAdmin container
- [X] Redis Insight container
- [X] Proxy routes for `/pgadmin` and `/redis-insight`
- [X] Infrastructure status view in the dashboard
- [X] Infrastructure route topology and port mapping card
- [X] Links or routes for pgAdmin and Redis Insight
- [X] Implementation note: add `/lab/infrastructure` dashboard route that checks `/api/health` and exposes pgAdmin/Redis Insight links

Acceptance criteria:

- [X] `docker compose up --build` starts full infrastructure.
- [X] pgAdmin is reachable at `http://127.0.0.1:5050`.
- [X] Redis Insight is reachable at `http://127.0.0.1:5540`.
- [X] The dashboard includes an infrastructure status view showing service health and tooling links.
- [X] The dashboard shows direct ports and Nginx proxy paths for infrastructure services.
- [X] Infrastructure routes/ports are documented for quick access.
- [X] `/lab/infrastructure` can be opened from the lab shell and shows Spring API health plus local tool URLs.

## Phase 4: Spring Boot Source-Of-Truth API

Goal: Implement durable schema and source-of-truth endpoints.

Deliverables:

- [X] Flyway migrations
- [X] JPA entities
- [X] DTO records
- [X] Persona auth
- [X] Dashboard endpoints
- [X] Spring Swagger UI

Acceptance criteria:

- [X] `/api/me` works after persona selection.
- [X] `/api/dashboard/snapshot` returns DTO payload.
- [X] Spring OpenAPI is reachable at `/v3/api-docs`.
- [X] Spring API integration tests cover `/api/me`, `/api/dashboard/snapshot`, and `/v3/api-docs`.

## Phase 5: NestJS Comparison And Realtime API

Goal: Implement gateway, comparison, diagnostics, Socket.IO, and the learner-facing visualization surface that explains those paths before and after the live APIs are wired.

Visualization methodology:

- Use a single Phase 5 control view at `/lab/backend-comparison` as the primary learner entrypoint for comparison and realtime delivery concepts.
- Use D3/SVG for relationship-heavy topology: Angular, Spring direct reads, Nest direct reads, Nest proxy, comparison endpoint, Socket.IO gateway, Redis adapter, and Nest Swagger UI.
- Use PrimeNG tables, tags, chips, and summary cards for sprint deliverables, acceptance criteria, persona access, and implementation status.
- Keep visual state role-aware. Personas should only see deliverables they have permission to inspect, while the role matrix explains why other Phase 5 surfaces are restricted.
- Treat the first visualization pass as a static control surface, then progressively bind it to live comparison metrics, realtime event history, Redis adapter health, and Swagger/contract health checks.
- Bind the first live-data layer through a typed Nest comparison facade that can run in deterministic mock mode until Spring/Nest parity reads are fully wired.
- Bind the realtime layer in two steps: first expose Socket.IO gateway/emit/history contracts, then add the Angular live socket client and Redis scale-out adapter.
- Keep local and Docker runtime routing explicit. Local `nx serve` should proxy Spring through `localhost:18080`; Docker compose should set `SPRING_API_TARGET=http://spring-api:8080`.

Deliverables:

- [X] Phase 5 routed visualization view
- [X] D3 runtime flow graph for comparison and realtime paths
- [X] PrimeNG deliverables, acceptance criteria, and role access matrix
- [X] Permission-guarded route access for protected Phase 5 views
- [X] Mock-mode Nest direct read endpoint for Phase 5 loan comparison
- [X] Mock-mode Nest proxy read endpoint for Phase 5 loan comparison
- [X] Mock-mode comparison endpoint with stable Spring direct, Nest direct, and Nest proxy metrics
- [X] Angular comparison facade and PrimeNG metrics table binding
- [X] D3 measured metrics visualization for latency, payload size, and record count across Spring direct, Nest direct, and Nest proxy
- [X] D3 request path highlighting driven by selected comparison metrics
- [X] Landing page backend mode selector wires Spring direct, Nest direct, Nest proxy, and Compare all into Phase 5
- [X] Landing page dataset dropdown shows all dataset sizes and registers selection into shared dashboard state
- [X] Landing page backend dropdown shows all backend modes and registers selection into shared dashboard state
- [X] Landing page persona dropdown shows all selectable users and registers selection into the auth flow
- [X] Live Spring direct read endpoint comparison
- [ ] Live Nest direct read endpoint backed by parity data
- [X] Live Nest proxy endpoint backed by Spring API
- [X] Live comparison endpoint that measures real Spring direct, Nest direct, and Nest proxy paths
- [X] Socket.IO gateway skeleton for `loan.status.updated`
- [X] HTTP realtime emit endpoint that broadcasts through the Socket.IO gateway
- [X] HTTP realtime event history endpoint for Phase 5 visualization binding
- [X] Angular realtime event history facade and PrimeNG event history table
- [X] Permission-gated Phase 5 emit control that prepends the returned realtime event into the history table
- [X] Angular live Socket.IO client subscription
- [X] Redis adapter with local fallback when Redis is unavailable
- [X] Nest Swagger UI

Acceptance criteria:

- [X] Diagnostics persona can open `/lab/backend-comparison`.
- [X] Phase 5 view displays backend comparison, realtime, Redis, and Swagger topology.
- [X] Phase 5 view displays current persona identity and runtime summary access cards.
- [X] Phase 5 view shows which roles should have access to comparison, realtime emit, and contract inspection work.
- [X] Contract Admin can open the OpenAPI Contract Lab placeholder from Phase 5 route permissions.
- [X] Realtime Operator can open the Realtime Lab placeholder from Phase 5 route permissions.
- [X] Realtime route is permission guarded and redirects unauthorized personas to the dashboard.
- [X] Spring direct, Nest direct, and Nest proxy can be compared in the same topology view with Phase 5 metrics.
- [X] A comparison endpoint exposes measured metrics for Spring direct, Nest direct, and Nest proxy paths.
- [X] A Socket.IO gateway endpoint can emit `loan.status.updated` messages through a test-covered HTTP trigger.
- [X] The Phase 5 visualization can trigger the HTTP realtime emit endpoint and update event history state from the returned event.
- [X] A placeholder exists for future live Socket.IO browser subscription UI updates.
- [X] Comparison metrics update the PrimeNG status table and D3 request path state.
- [X] Comparison endpoint metrics render as a D3 grouped bar chart for latency, payload size, and record count.
- [X] Live comparison metrics are validated against real Spring direct, Nest direct, and Nest proxy runtime paths, with degraded fallback rows when Spring is unavailable.
- [X] Landing page backend dashboard mode control is validated for both Spring and Nest comparison modes.
- [X] Placeholder coverage exists for future live Socket.IO browser subscription updates.
- [X] Socket.IO event history updates the realtime portion of the Phase 5 visualization through the history facade.
- [X] Live browser Socket.IO subscription appends new events without a manual history refresh.
- [X] Local dev and Docker compose routing are validated for Phase 5 runtime paths:
  - local proxy uses `localhost:18080` for Spring API access
  - Docker uses `SPRING_API_TARGET=http://spring-api:8080`

Unit and e2e coverage:

- [X] Landing page unit tests verify persona loading and `enterLab()` navigation.
- [X] Phase 5 page unit tests verify deliverables, persona-specific access, and runtime summary behavior.
- [X] Phase 5 page unit tests verify the full runtime acceptance checklist is exposed by the view model.
- [X] Phase 5 page unit tests verify comparison metrics load, error handling, and selected D3 path state.
- [X] Phase 5 page unit tests verify the D3 measured metrics visualization renders for comparison data.
- [X] Nest comparison unit tests verify mock direct, proxy, health, and comparison endpoint behavior.
- [X] Nest realtime unit tests verify event history and HTTP-triggered Socket.IO broadcast behavior.
- [X] Nest e2e tests verify gateway health, comparison metrics, and realtime event creation.
- [X] Phase 5 page unit tests verify realtime event history load and failure states.
- [X] Phase 5 page unit tests verify HTTP-triggered realtime emits prepend events into the history table.
- [X] Permission guard unit tests verify allowed, missing-permission, and current-user-load-failure behavior.
- [X] Playwright e2e covers landing page persona load and successful dashboard entry.
- [X] Playwright e2e covers Phase 5 backend comparison access, identity, and persona guard behavior.
- [X] Playwright e2e covers focused Phase 5 core route with comparison metrics, live reads, and realtime history.
- [X] Playwright e2e covers Phase 5 checklist, comparison metrics, and realtime event history rendering without requiring live Spring or Nest containers by mocking persona/current-user/dashboard/Nest gateway API calls.

## Phase 30.5: Phase 5 Tables and Data Visualizations

Goal: Standardize Phase 5 frontend tables and charts so the learner-facing comparison view is consistent, discoverable, and interactive.

Deliverables:

- [X] PrimeNG `p-table` used for all Phase 5 tabular views instead of plain HTML tables.
- [X] Shared `table-toolbar` utility class applied across Phase 5, dashboard, infrastructure, map inspector, and capital markets table filters.
- [X] Default sort state configured for all tables using a stable unique identifier when available.
- [X] Table UI supports pagination, column sorting, and global filtering for all Phase 5 datasets.
- [X] Phase 5 comparison metrics table binds to live or mock comparison path data.
- [X] Phase 5 realtime history table binds to emitted Socket.IO events and supports filter/search.
- [X] Phase 5 deliverables, acceptance criteria, and role access matrix tables are searchable and paginated.
- [X] Existing D3 phase 5 graphs remain in place and are augmented by the new table state where appropriate.
- [X] Data visualization planning notes are added to the Phase 5 implementation plan for future `p-chart` or D3 expansions.

Acceptance criteria:

- [X] All Phase 5 table views are implemented as `p-table` with consistent toolbar styling.
- [X] Every Phase 5 table defaults to sorting by a unique identifier or a stable primary key.
- [X] Table filtering behavior is consistent across Phase 5 views and the broader dashboard app.
- [X] Phase 5 comparison and realtime data are visible in both tables and D3 visuals on the same page.
- [X] Users can page through Phase 5 tables without losing filter or sort state.
- [X] The shared `table-toolbar` class is documented in the global frontend styles.
- [X] Phase 5 data visualizations are explicitly planned for additional chart types if needed.

### Phase 30.5 implementation notes

- Use PrimeNG `p-table` for all Phase 5 tabular data and keep the toolbar consistent with the shared `.table-toolbar` pattern.
- Prefer PrimeNG `p-dropdown` or `p-multiSelect` for table filter controls where the dataset is categorical.
- Use `p-calendar` for date range filters on any time-based columns.
- Consider `p-chip` and `p-tag` for status/badge rendering inside table cells.
- Use `p-dialog` for detail drill-ins on rows where more metadata is required.
- Retain D3 graphs for topological and relationship-heavy visuals, especially the runtime flow map and comparison path highlight.
- Plan future chart expansion with PrimeNG `p-chart` for standard analytics views such as:
  - bar chart for comparison latency/payload/record metrics,
  - line chart for realtime event frequency or trend over time,
  - pie/donut chart for status distribution or access matrix breakdown.
- Keep Phase 5 data binding declarative: table data should update from the same facade/store used by D3 visuals to ensure consistency.

## Phase 6: OpenAPI Generated Clients

Goal: Generate Angular models and services from both APIs and force frontend access through facades.

Deliverables:

- [X] `libs/generated/spring-api-client`
- [X] `libs/generated/nest-api-client`
- [X] Generation scripts
- [X] Drift check command
- [X] Data-access facades
- [X] OpenAPI Contract Lab scaffold
- [X] OpenAPI Contract Lab shows generated client service/DTO coverage
- [X] OpenAPI Contract Lab surfaces explicit contract drift watch status
- [X] OpenAPI Contract Lab shows signal/store mapping for generated contract metadata
- [X] OpenAPI store signal state is unit tested
- [X] OpenAPI store persistence is verified across component recreation
- [X] Playwright covers generated contract drift details beyond row visibility
- [ ] Remaining Phase 11 OpenAPI dashboard enhancements are tracked as follow-up work

Acceptance criteria:

- [X] Generated clients build.
- [X] Components do not inject generated services directly.
- [X] Spring generated services are wrapped by Angular facades before use in stores/components.
- [X] Nest generated DTOs include comparison metrics and realtime events before replacing local Phase 5 interfaces.
- [X] OpenAPI Contract Lab exists in the workspace.
- [X] OpenAPI Contract Lab displays actual generated client names and service coverage.
- [X] OpenAPI Contract Lab shows explicit contract drift watch status and boundary coverage.
- [X] OpenAPI Contract Lab includes signal/store state for drift metadata.
- [X] OpenAPI Contract Lab explicitly validates OpenApiStore signal persistence.
- [X] Playwright verifies generated contract drift warning details.

### Phase 6 completion summary
- Phase 6 is effectively complete: generated clients are built, Angular services are accessed through facades, the OpenAPI Contract Lab exists, and contract drift state is surfaced and tested.
- The remaining work is explicitly Phase 11 follow-up dashboard enhancement scope, not a Phase 6 functional gap.
- Phase 6.5 should now own security monitoring and risk mitigation for OpenAPI credential, contract, and boundary issues.

## Phase 6.5: OpenAPI Security Mapping

Goal: Identify and map security problems introduced by the OpenAPI generated clients, the contract lab surface, and the facade boundary between Angular, Nest, and Spring APIs.

Deliverables:

- [X] Threat model for OpenAPI contract drift, generated client DTO assumptions, and frontend-to-backend boundary risks
- [X] Security risk map for auth, authorization, CORS, CSRF, contract drift, and metadata exposure
- [X] Inventory of OpenAPI client surface risks including missing auth headers, unsafe response assumptions, and generated DTO validation gaps
- [X] Admin security monitoring page created with issue/watch risk items and remediation owners
- [X] Permission-gated OpenAPI Contract Lab page for `contracts:view`
- [X] OpenAPI docs endpoint protection behind auth or role-based access
- [X] Spring OpenAPI docs security tests cover `/v3/api-docs` and `/swagger-ui`
- [X] Nest Swagger docs security tests cover `/swagger` and `/swagger-json`
- [X] GitHub issue created to track Phase 6.5 security work
- [X] Targeted Playwright e2e security checks exist for OpenAPI credential forwarding, guarded docs access, and protected realtime route behavior
- [X] Formal Phase 6.5 remediation backlog documented with prioritized follow-up tasks, owners, and next-sprint actions

Acceptance criteria:

- [X] Security problem areas are documented in the Phase 6.5 plan.
- [X] Contract drift boundary risk is explicit and mapped to the affected components.
- [X] Dashboard UI does not expose generated client internals or raw OpenAPI metadata without explicit permission.
- [X] Authentication and authorization gaps are mapped for Spring API, Nest gateway, and Angular lab flows.
- [X] Security remediation tasks are actionable and prioritized for the next sprint.

### Immediate Phase 6.5 findings

- Angular Spring/Nest generated client configuration now passes `withCredentials: true`, and lab API calls for `/api/me` and `/api/dashboard/snapshot` are wired to send cookies/credentials.
- The Nest gateway and realtime endpoints are currently exposed without auth guards, and the WebSocket gateway allows `origin: '*'`, which is an acceptable dev tradeoff only if documented and tightened before any broader exposure.
- Spring dev auth uses a plain `access_token` persona id cookie with no signature or token integrity verification; this is a dev-only auth model and should be locked down if the lab is ever treated as more than a local training environment.
- The OpenAPI docs endpoints (`/v3/api-docs`, `/swagger-json`) are linked from the contract lab, and Spring/Nest backend protections have been added so only authorized personas can access raw contract metadata.
- The OpenAPI Contract Lab is permission-gated, and backend raw docs protection is now implemented; production-grade auth review remains follow-up hardening.

## Phase 7: Angular Standalone Shell

Goal: Create the core lab UI and route structure.

Deliverables:

- [X] `app.config.ts`
- [X] `app.routes.ts`
- [X] PrimeNG shell
- [X] Landing page
- [X] Persona selector
- [X] Backend selector
- [X] Explain Mode toggle
- [X] Protected lab routes
- [X] Permission-filtered sidebar navigation

Acceptance criteria:

- [X] User can select persona and enter `/lab`.
- [X] Routes load lazily.
- [X] Public landing route shows only persona setup and public entry controls.
- [X] Protected lab routes require route-level permission metadata and `permissionGuard`.
- [X] Sidebar navigation hides protected lab links unless the selected user has a matching permission.

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
- [ ] Unit tests for `borrowersById`, `documentsByLoanId`, and `statusByCode`
- [ ] Unit tests for permission Set membership
- [X] Unit tests for visible nav filtering
- [ ] Unit tests for loan/security row fallback behavior
- [ ] Chart.js dashboard charts

Acceptance criteria:

- [ ] Dataset size selector changes loaded data.
- [X] Map inspector reflects current state.
- [ ] Tests prove what changes in computed state after persona, dataset, backend, or realtime actions.

Current note:

- [X] The current stores use Angular signals directly. `@ngrx/signals` remains the target once an Angular 22-compatible package is available.

## Phase 9: Visualizations

Goal: Add D3 and Explain Mode learning visuals across the lab after the PrimeNG-heavy Capital Markets table workflow is underway. Phase 5 owns the first implemented D3 control surface for backend comparison and realtime topology.

Deliverables:

- [X] Phase 5 D3 comparison/realtime topology graph
- [X] Phase 5 D3 measured metrics chart for backend comparison endpoint data
- [ ] Architecture graph
- [ ] Map bucket diagram
- [ ] SignalStore graph
- [ ] Request path animation using Angular 22 native enter/leave APIs and CSS transitions
- [ ] OpenAPI contract tree
- [ ] Optional Grafana/Chart.js/Highcharts dashboard for historical comparison metrics after metrics are persisted

Acceptance criteria:

- [X] The Phase 5 topology renders on desktop and mobile without blocking the route.
- [ ] Explain Mode overlays connect to real state.
- [ ] Visuals render on desktop and mobile without overlap.

## Phase 9A: PrimeNG Capital Markets Table Lab

Goal: Build `/lab/security-search` as the highest-value PrimeNG study screen before expanding broad D3 work.

Deliverables:

- [X] Security search route
- [X] Lazy `p-table`
- [X] Server-side-style query state facade with deterministic local data
- [X] Status filters
- [X] Settlement date filter
- [X] Coupon numeric filter and balance display
- [X] Row action buttons
- [X] Detail dialog
- [X] Export action
- [X] Loading, empty, and error states

Acceptance criteria:

- [X] Table state is represented as a typed query object, not ad hoc template state.
- [X] Rows use `SecuritySearchRowVm` or equivalent ViewModel shape.
- [X] Filters, sorting, pagination, and row actions are unit tested where practical.
- [ ] Playwright covers loading, empty state, filter interaction, row action, and detail dialog.
- [X] The screen uses Capital Markets vocabulary: security, pool, commitment, disclosure, settlement, coupon, and audit metadata.

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
- [ ] `/v3/api-docs` endpoint health check
- [ ] Generated models vs local app shape summary
- [ ] MCP setup checklist
- [ ] Command guide
- [ ] OpenAPI contract drift dashboard
- [ ] Performance note for OpenAPI dashboard render and filter latency
- [ ] Filter performance benchmarking for large contract lists

Acceptance criteria:

- [ ] Contract lab explains drift boundaries clearly.
- [ ] OpenAPI Contract Lab shows generated client status.
- [ ] OpenAPI Contract Lab compares Spring API endpoints vs generated DTOs.
- [ ] OpenAPI Contract Lab surfaces contract drift/warnings.
- [ ] MCP dashboard does not execute arbitrary browser commands.
- [ ] OpenAPI dashboard performance is considered for large contract lists.

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
