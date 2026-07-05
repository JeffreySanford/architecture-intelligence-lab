# 22 PI And Sprint Plan

## Purpose

This file turns the architecture roadmap into a PI and sprint plan. Use `[X]` for completed work and `[ ]` for work that still needs to be completed.

## PI Objective

- [ ] Deliver the first complete version of `architecture-intelligence-lab`: a Docker Compose based Nx training system where a user can select a persona, inspect Capital Markets-style security/pool/commitment/disclosure workflows in PrimeNG, inspect DTO-to-ViewModel mapping, compare Spring and Nest backend paths, trigger realtime Socket.IO events backed by Redis, inspect OpenAPI contracts, and run the core test suite.

## Stack Strategy

- [X] Current branch keeps the modern lab stack: Angular 22, Nx 23 beta, TypeScript 6, Spring Boot 4.x, Java 17, NestJS 11, PostgreSQL, Redis, Docker, OpenAPI, D3, and PrimeNG 22 RC.
- [X] Enterprise baseline is documented for job-prep comparison: Angular 18/19/20, PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI.
- [X] PrimeNG version strategy is resolved for this branch by upgrading to Angular-22-aligned `primeng@22.0.0-rc.1`.
- [X] PrimeNG 22 RC behavior is validated against the current app before broad use of newer APIs.
- [X] PrimeUI license registration is wired through ignored local runtime config and `providePrimeNG`.

## PI Success Measures

- [X] One-command startup script exists: `pnpm run start:all`.
- [ ] `docker compose up --build` starts the complete final system.
- [ ] Browser entrypoint serves Angular through Nginx at `/`.
- [X] Persona selection sets httpOnly cookie and `/api/me` works.

### Current implementation snapshot

- Core Angular shell, landing persona flow, route guards, and protected lab routing are implemented.
- Phase 5 and OpenAPI routes use D3 visuals, PrimeIcons iconography, and native Angular animation hooks.
- MCP dashboard and OpenAPI contract labs are present and access-controlled through permissions.
- Local `/api/personas` proxy persona load is validated; refresh hardening and landing redirect behavior are regression-tested.
- [X] Unit and Playwright coverage exists for landing persona entry, protected lab route guard behavior, Phase 5 D3/PrimeIcons visuals, OpenAPI contract route access, and developer-only MCP access.
- Remaining work focuses on live Nest direct parity, Docker/Nginx full runtime, and Phase 6.5 backend/CORS/CSRF hardening.
- [X] Small, Medium, Large, and Stress dataset options exist.
- [X] Cards and tables use SignalStore computed ViewModels.
- [X] Key indexes and permission Set are visible.
- [X] Phase 5 comparison/realtime topology has a D3 visualization surface.
- [X] Phase 5 comparison endpoint metrics render as a D3 grouped bar chart.
- [X] Phase 5 access rules are visible in a PrimeNG role matrix.
- [X] Phase 5 mock comparison metrics drive a PrimeNG metrics table and D3 selected-path state.
- [X] Phase 5 mock realtime event history drives a PrimeNG event table.
- [X] Phase 5 can trigger a mock realtime event through the HTTP gateway path and prepend it to the event table.
- [X] PrimeNG Security Search table exists for Capital Markets study workflows.
- [X] Current Angular views have been reviewed for Prime UI coverage and documented.
- [X] Angular app shell now includes a Material icon brand and route transition animations for better UI/UX.
- [X] Phase 5 and OpenAPI visuals use D3/PrimeNG charts, PrimeIcons route iconography, and Angular native `animate.enter` / `animate.leave` transitions.
- [X] Local persona load through `/api/personas` and landing page auth flow are validated in the current Angular runtime.
- [X] Public landing view is limited to persona setup; protected lab pages appear only after a persona is selected.
- [X] Direct refresh of protected lab routes clears stale auth state and redirects to landing.
- [X] Angular landing persona load and `/api/personas` proxy flows have been validated in the local runtime.
- [X] Route and sidebar visibility are enforced through selected-user permissions.
- [X] Direct refresh of protected lab routes is regression-tested and clears stale auth state.
- [X] Map/Set/ViewModel unit coverage proves lookup, grouping, permissions, and fallback behavior.
- [X] Generated clients are real, buildable, and consumed through facades.
- [X] Spring direct, Nest direct, Nest proxy, Compare all work.
- [X] Socket.IO event updates UI state.
- [X] Redis cache/pub-sub behavior is inspectable through derived Realtime Lab telemetry and Redis Insight links.
- [X] Spring and Nest OpenAPI views are linked and explained.
- [X] Unit, integration, and Playwright coverage exists for core flow.
- [X] Developer-only Glossary view explains fintech, Angular, and contract terminology with code-section references.

## Planning status

- [X] Core Phase 0-4 foundation is completed, including Angular shell, PrimeNG UI, D3 visuals, and route/animation UX.
- [X] Phase 6.5 risk artifacts are documented with security risk map, threat model, and a deferred follow-up backlog note.
- [X] Phase 6.5 developer-only MCP and admin boundaries are covered by unit and e2e model tests.
- [X] All remaining active work is expected to include targeted unit and e2e coverage before completion.
- [ ] Active work remains in Sprint 14/15: backend parity, generated OpenAPI clients, and Phase 6.5 hardening.
- [ ] Future/deferred work remains in Sprint 17: optional metrics dashboards and long-term enterprise enhancements.

## PI Timeline

- [X] Sprint 0: Architecture and documentation.
- [X] Sprint 1 foundation: Workspace rename, pnpm, Docker shell, and baseline verification.
- [X] Sprint 2: Infrastructure and source-of-truth API.
- [ ] Sprint 3: Gateway, comparison, and contracts.
- [X] Sprint 4: Angular lab shell, dashboard mapping, and PrimeNG Security Search.
- [ ] Sprint 5: Visual labs, backend comparison, and realtime.
- [ ] Sprint 6: Contract/MCP labs and hardening.
- [ ] Sprint 14: Backend parity, generated OpenAPI clients, and live audit coverage.
- [ ] Sprint 15: Phase 6.5 security hardening, contract drift risk, and production-safe runtime safeguards.
- [X] Sprint 16: Documentation closure, planning alignment, and backlog cleanup.
- [ ] Sprint 17: Deferred metrics/dashboard follow-up and long-term enterprise enhancement backlog.

> Note: The current branch has completed the earlier foundation and Phase 13 styling work. The canonical remaining sprint details live below in Sprint 14, Sprint 15, Sprint 16, and Sprint 17.
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

Goal: Add NestJS comparison paths and generate frontend clients with capital markets data shapes in mind.

Stories:

- [ ] As a learner, I can compare Spring direct, Nest direct, and Nest proxy paths for portfolio, commitment, and disclosure data.
- [ ] As a capital markets analyst, I can validate backend paths for securities, pools, and commitment state.
- [ ] As a compliance reviewer, I can inspect persona access and API contract behavior across backend paths.
- [ ] As a frontend developer, I can consume generated Angular clients through facades and map them to PrimeNG-friendly DTOs.
- [ ] As a developer, I can keep the study lab focused on capital markets workflow state without modeling full mortgage compliance.

Deliverables:

- [X] Mock-mode Nest direct read endpoint
- [X] Mock-mode Nest proxy endpoint
- [X] Mock-mode backend comparison endpoint
- [X] Socket.IO gateway skeleton
- [X] HTTP realtime emit endpoint
- [X] HTTP realtime event history endpoint
- [X] Landing page backend mode selection for Spring direct, Nest direct, Nest proxy, and Compare all
- [X] Landing page dataset size selection is preserved into dashboard state
- [X] Landing page persona selection dropdown shows all selectable users
- [X] Live Nest direct read endpoint
- [X] Live Nest proxy endpoint
- [X] Live backend comparison endpoint
- [X] Redis adapter wiring
- [X] Nest Swagger UI
- [X] Spring and Nest generated clients
- [X] Data-access facade skeletons
- [ ] PrimeNG-compatible facade contracts for security, commitment, and disclosure objects

Acceptance criteria:

- [X] Mock comparison endpoint returns latency, payload size, record count, and error state.
- [X] Mock comparison endpoint response drives the Phase 5 PrimeNG metrics table without frontend shape guessing.
- [X] Mock comparison response includes stable path labels for Spring direct, Nest direct, and Nest proxy.
- [X] Live comparison endpoint returns measured latency, payload size, record count, and error state.
- [ ] Both Swagger UIs are reachable through Nginx.
- [X] Phase 5 backend comparison route and graph are covered by Playwright.
- [X] Phase 5 persona access guard behavior is covered by Playwright.
- [X] Phase 5 realtime placeholder route is covered by Playwright.
- [X] Phase 5 realtime permission guard redirects viewers without realtime access.
- [X] Phase 5 OpenAPI route contract admin access is covered by Playwright.
- [ ] Placeholder Playwright coverage exists for the future live Socket.IO browser event UI update path.
- [X] Angular unit tests cover persona-selected route guard and auth facade persona switching.
- [X] Nest unit tests cover mock comparison service/controller behavior.
- [X] Nest unit tests cover realtime service/controller emit and history behavior.
- [X] Nest e2e tests cover gateway health, comparison metrics, and realtime event creation.
- [X] Angular unit tests cover comparison facade binding, error handling, and selected path state.
- [X] Angular unit tests cover auth facade persona switching and currentUser permission updates.
- [X] Angular unit tests cover realtime history binding and failure state.
- [X] Playwright covers Phase 5 mock comparison metrics and realtime history rendering.
- [X] Generated clients build and are not manually edited.
- [ ] API contract shapes support security pools, commitments, disclosures, and workflow status needed by PrimeNG tables.

## Sprint 4: Angular Shell, Auth Flow, And Dashboard Mapping

Goal: Build the usable frontend lab shell, main dashboard mapping, and the first PrimeNG-heavy Capital Markets workflow screen.

Stories:

- [X] As a user, I can select a persona and enter the lab.
- [X] As a learner, I can toggle Explain Mode.
- [X] As a learner, I can change dataset size and backend mode.
- [X] As a capital markets user, I can inspect security pools, commitment status, and disclosure metadata in a PrimeNG grid.
- [X] As a developer, I can see how commitment and delivery workflow state is represented with status tags and filters.
- [X] As a developer, I can inspect Map/Set indexes derived from DTO state.
- [X] As a developer, I can explain table query state, row ViewModels, and lazy loading without relying on template-only filtering.

Deliverables:

- [X] Angular standalone route shell
- [X] Landing command center
- [X] Public landing command center limited to persona, dataset, backend mode, and Explain Mode controls
- [X] Authenticated route and nav access for Viewer, Diagnostics Admin, Realtime Operator, Contract Admin, Admin/Security Admin, and MCP Explorer
- [X] Developer-only Glossary view for fintech, Angular, and OpenAPI contract terms
- [X] Persona cards
- [X] Protected lab routes
- [X] `AuthStore`
- [X] `DashboardStore`
- [X] Map and Set indexes
- [X] Loan cards and PrimeNG table
- [X] `/lab/security-search`
- [X] Lazy PrimeNG security/pool table
- [X] Security search query-state facade
- [X] Security detail dialog
- [X] Row actions for detail and export placeholders
- [X] Loading, empty, and error states
- [X] Prime UI runtime config reader and ignored local license file
- [X] Infrastructure Prime tables/tags for route and port status
- [X] Chart.js summary charts
- [X] PrimeNG table and filter skeleton for capital markets-style search and disclosure workflows
- [X] Commitment status tags, export actions, and file metadata display for disclosure results

Acceptance criteria:

- [X] `/lab` is accessible in the temporary unauthenticated shell.
- [X] Dashboard renders Small dataset.
- [X] Permission Set controls visible nav items.
- [X] Map inspector displays `loansById`, `borrowersById`, `documentsByLoanId`, `statusByCode`, and `permissionSet`.
- [X] Unit tests cover `borrowersById`, `documentsByLoanId`, `statusByCode`, permission Set membership, visible nav filtering, and fallback rows.
- [X] PrimeNG tables support sort/filter/pagination for security and commitment rows.
- [X] Disclosure and commitment state is visible with status chips, dates, and audit-friendly metadata.
- [X] Prime UI usage review covers Landing, Shell, Dashboard, Map Inspector, Infrastructure, Capital Markets, Security Search, Phase 5, and Placeholder views.
- [X] Sprint 1-5 context and specific user-role access expectations are preserved in planning docs and authenticated lab views, not exposed as protected page links on the public landing view.
- [X] Sidebar navigation hides every protected lab link unless the selected user has a matching permission.
- [X] Glossary route is restricted to developer personas and hidden from viewer personas.
- [X] Playwright covers Security Search empty state, filters, row action, detail dialog, export feedback, and reduced-motion table/overlay behavior.

Current note:

- [X] Phase 9A Security Search implementation is complete and unit-tested.
- [X] App shell route transition wiring has begun with shared route transition classes.
- [X] Route transition wrapper now includes page header and protected lab page content.
- [X] Route transition wrapper now resets its animation state after each page change.
- [X] Shared style tokens are scaffolded and core lab views now use the shared design tokens.
- [X] Remaining Phase 9 realtime dashboard animation follow-through is covered by the Phase 10 Realtime Lab dashboard.
- [X] Playwright visual smoke coverage includes route transition and reduced-motion behavior.
- [X] Playwright smoke coverage for permission-driven nav visibility and protected lab page content updates has been added.
- [X] Playwright smoke coverage now includes the protected backend comparison route transition.
- [X] Playwright mobile sidebar nav and protected route transition smoke has been added.
- [X] Playwright smoke coverage now includes OpenAPI route transition and reduced-motion verification.
- [X] Playwright smoke coverage now includes Infrastructure route transition and reduced-motion verification.
- [X] Playwright smoke now covers Security Search overlay detail transitions and table interactions.
- [X] Playwright smoke now covers Dashboard chart reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 graph reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 D3 selection highlight and chart highlight updates.
- [X] Playwright smoke now covers Phase 5 chart legend reduced-motion behavior.
- [X] Playwright smoke now covers Phase 5 flow graph reduced-motion behavior.
- [X] Playwright smoke now covers OpenAPI card hover reduced-motion behavior.
- [X] Playwright smoke now covers Infrastructure card hover reduced-motion behavior.
- [X] Playwright smoke now covers Security Search overlay reduced-motion behavior.
- [X] `pnpm nx run architecture-dashboard-e2e:e2e-ci--src/visual-smoke.spec.ts` passes on port 4201 across Chromium, Firefox, and WebKit.

## PrimeNG Capital Markets Study Task

Goal: Build a small practice screen that uses PrimeNG table and form patterns for capital markets workflows.

Task:

- [X] Create a `SecuritySearch` story or note that describes a page with:
  - a `p-table` for securities or pools
  - server-side pagination, sorting, and filtering
  - status tags for commitment/delivery state
  - filters for coupon, issue date, and disclosure status
  - row actions for details, export, or correction
- [X] Define example DTO names such as `SecurityDto`, `PoolDto`, `CommitmentDto`, `DisclosureFileDto`, and `PricingGridDto`.
- [X] Document the sample PrimeNG state pattern:
  - typed query state in Signals/RxJS
  - lazy table request event handling
  - derived view models for row rendering
  - audit-friendly metadata display for file exports and validation results
- [X] Capture capital markets and PrimeNG study vocabulary in [documentation/20-capital-markets-primeng-knowledgebase.md](../documentation/20-capital-markets-primeng-knowledgebase.md).
- [X] Lock shared DTO vocabulary in [documentation/21-capital-markets-vocabulary.md](../documentation/21-capital-markets-vocabulary.md).
- [X] Implement the `SecuritySearch` screen beyond the current dashboard-derived PrimeNG demo.
- [X] Upgrade PrimeNG to an Angular-22-aligned version for this branch.
- [X] Validate PrimeNG 22 RC current app behavior.
- [X] Register PrimeUI license locally through `.env`, ignored `env.js`, and `providePrimeNG({ license })`.
- [X] Review current Angular route views for Prime UI fit and capture next user stories.
- [ ] Revisit once a stable PrimeNG 22 release is published.

Acceptance criteria:

- [X] The task is clearly documented in the plan.
- [X] It is linked to PrimeNG table/filter patterns, not generic Material-style behavior.
- [X] It reinforces capital markets terms like security pool, commitment status, disclosure file, and pricing grid.

## Sprint 5: Visual Labs And Realtime

Goal: Make architecture, state, comparison, and realtime behavior visible through a visualization-first methodology.

Stories:

- [X] As a learner, I can see a D3 architecture flow diagram.
- [X] As a learner, I can inspect SignalStore raw and computed state.
- [X] As a learner, I can see route, data, permission, and realtime state changes through clear enter/exit animation instead of abrupt content swaps.
- [X] As a keyboard or reduced-motion user, I can use animated views with motion reduced and state changes still visible.
- [X] As a diagnostics persona, I can open a Phase 5 D3 topology view for Spring direct, Nest direct, Nest proxy, comparison, Socket.IO, Redis, and Swagger paths.
- [X] As a learner, I can see which roles should have access to Phase 5 comparison, realtime, and contract inspection surfaces.
- [X] As a learner with emit permission, I can trigger a mock realtime event and watch the Phase 5 event history update.
- [X] As a learner, I can see derived Redis cache hit/miss behavior in the Realtime Lab.

Deliverables:

- [X] Phase 5 routed comparison/realtime visualization view
- [X] D3 comparison/realtime topology graph
- [X] PrimeNG deliverables table filtered by persona permission
- [X] PrimeNG comparison metrics table bound to the Nest comparison facade
- [X] D3 measured metrics chart bound to the Nest comparison facade
- [X] PrimeNG realtime event history table bound to the Nest gateway facade
- [X] PrimeNG role/persona access matrix
- [X] Route-level permission guards for Phase 5 protected views
- [X] D3 architecture graph
- [X] SignalStore graph
- [ ] Optional Grafana/Chart.js/Highcharts dashboard once comparison metrics are persisted beyond the live response
- [X] Backend comparison UI with mock metrics
- [ ] Backend comparison UI with live Spring/Nest/proxy metrics
- [X] Realtime HTTP emit control for Phase 5 event history
- [ ] Realtime live socket controls
- [X] Socket.IO client
- [ ] Copy-on-write Map update
- [X] Redis cache hit/miss panel
- [X] Angular native enter/exit animation utilities for shared app-shell, list, table, card, and overlay patterns
- [X] Route transitions for landing, dashboard, backend comparison, realtime, contract, Map, and SignalStore views
- [X] Permission-aware sidebar/nav enter/exit transitions when selected persona changes visible routes
- [X] Landing selector transitions for persona, dataset size, backend mode, Compare all, and Explain Mode changes
- [X] Dashboard metric/card/chart transitions when dataset or backend mode changes
- [ ] PrimeNG table, loading, empty, filtered-result, and detail-dialog transitions for Security Search and Contract Lab
- [X] D3/SVG transitions for architecture links, request paths, comparison bars, selected backend path, realtime markers, SignalStore nodes, and OpenAPI tree nodes
- [X] Health-check, inline error, runtime status, and partial status overlay transitions
- [ ] Reduced-motion fallback styles and Playwright checks for key animated flows

Acceptance criteria:

- [X] Diagnostics Admin sees the Backend Comparison route and Phase 5 graph.
- [X] Realtime Operator and Contract Admin access expectations are visible in the matrix.
- [X] Unit tests cover Phase 5 persona-specific deliverables, runtime checklist exposure, graph helpers, and permission guard redirects.
- [X] Unit tests cover Phase 5 comparison metric loading, failures, and selected path updates.
- [X] Unit tests cover Phase 5 realtime history loading and failure handling.
- [X] Unit tests cover Phase 5 HTTP-triggered realtime emits and table prepending.
- [X] Playwright covers Phase 5 access, redirects, placeholder routes, identity, checklist rendering, comparison metrics, and realtime history with mocked API data.
- [X] Spring direct, Nest direct, and Nest proxy can be compared in the same topology view with measured or degraded metrics.
- [X] A comparison endpoint exposes metrics for Spring direct, Nest direct, and Nest proxy paths.
- [X] A Socket.IO gateway endpoint emits realtime event messages through a test-covered HTTP trigger.
- [X] The Phase 5 control surface can invoke the HTTP realtime emit endpoint and prepend the returned event.
- [X] Comparison metrics update the PrimeNG status table and D3 request path state.
- [X] Comparison metrics render latency, payload size, and record count as a D3 grouped bar chart.
- [X] Live comparison metrics are validated against real Spring direct, Nest direct, and Nest proxy runtime paths.
- [X] Socket.IO event history updates the realtime portion of the Phase 5 visualization through the history facade.
- [X] Angular live Socket.IO client appends new gateway events without a history refresh.
- [X] Local dev and Docker compose routing are validated for Phase 5 runtime paths:
  - local proxy uses `localhost:18080` for Spring API access
  - Docker uses `SPRING_API_TARGET=http://spring-api:8080`
- [X] Realtime `loan.status.updated` event updates Realtime Lab cards, table, and chart.
- [X] Compare-all mode renders metrics for all backend modes.
- [X] Explain Mode overlays connect visual explanations to live state.
- [X] Enter/exit animation is used in multiple frontend surfaces: route shell, sidebar/nav, selector summaries, dashboard cards, PrimeNG tables, D3/SVG visuals, dialogs, and status messages.
- [X] Animated visibility is driven by current persona, permissions, dataset, backend mode, realtime events, or contract state rather than decorative timers.
- [X] Motion can be reduced through `prefers-reduced-motion` without losing route, permission, loading, error, or data-update meaning.
- [ ] Desktop and mobile Playwright smoke tests prove animated surfaces do not overlap, clip text, or block primary controls.
- [X] Unit tests cover animation-related ViewModel projection where state determines visible cards, rows, nav links, graph nodes, or warning panels.

Visualization methodology:

- Use D3 only where relationships, topology, or path movement are the main concept.
- Use PrimeNG for dense operational surfaces: deliverables, acceptance criteria, role access, event history, and metrics.
- Build each visual as a typed ViewModel first, then bind it to SVG/table rendering.
- Keep Phase 5 visuals role-aware. The current persona determines available deliverables, while the role matrix explains the full intended permission model.
- Ship the static learning surface before the backend is complete, bind deterministic mock comparison APIs first, bind realtime history second, then bind live APIs and socket subscriptions into the existing graph/table model.
- Runtime validation must check both `http://localhost:18080/api/personas` and `http://localhost:4200/api/personas` so local proxy and Docker proxy behavior do not drift.
- Use Angular native `animate.enter` and `animate.leave` with `.enter`/`.exit` CSS classes for DOM insertion/removal patterns before adding custom imperative animation.
- Keep animation tokens centralized so duration, easing, stagger, and reduced-motion behavior are consistent across app shell, PrimeNG, D3/SVG, and overlay surfaces.
- Treat D3 animation as part of graph state: request-path movement, node expansion, bar updates, and selected-path highlighting should derive from the same typed node/link/metric ViewModels as the static render.

## Sprint 6: Contract Lab, MCP Dashboard, Tests, And Hardening

Goal: Complete the educational surface and prove the core flow.

Stories:

- [X] As a learner, I can understand how Flyway, OpenAPI, ViewModel tests, and Playwright prevent different drift types.
- [X] As a developer, I can view MCP guidance without executing browser-side commands.
- [ ] As a maintainer, I can run core quality gates.

Deliverables:

- [X] OpenAPI contract lab
- [X] Phase 6.5 follow-up backlog note and security artifact page coverage
- [X] MCP dashboard
- [X] Angular unit tests
- [ ] Spring integration tests
- [ ] Nest tests
- [ ] Playwright E2E flow
- [ ] Docker smoke test
- [ ] Responsive UI polish

Acceptance criteria:

- [X] Playwright covers persona selection, Explain Mode, backend comparison, Map inspector, realtime event, and OpenAPI lab.
- [X] MCP dashboard is implemented as read-only developer guidance and gated by persona permissions.
- [X] Unit tests cover Map joins, Set permissions, ViewModel projection, and Phase 6.5 security artifact pages.
- [ ] Docker smoke test validates startup, `/api/health`, and frontend entrypoint through Nginx.
- [X] Security documentation pages explicitly note the active Phase 6.5 follow-up backlog for auth guard, Socket.IO origin, CORS, and CSRF hardening.

## Sprint 7: Material Design 3 Express Styling System

Goal: Vibrantly restyle all Angular views with a consistent Material Design 3 Express visual language while keeping PrimeNG, D3, and dashboard surfaces aligned through shared SCSS tokens.

Stories:

- [ ] As a learner, I can move across landing, dashboard, lab, contract, realtime, Map, SignalStore, and admin views and see one cohesive visual system.
- [ ] As a maintainer, I can update colors, spacing, typography, elevation, radius, animation, and component overrides from shared SCSS partials instead of page-specific one-offs.
- [ ] As a learner, I can scan dense data screens faster because PrimeIcons identify navigation destinations, statuses, table actions, realtime/cache state, API contracts, security controls, and architecture nodes.
- [ ] As an accessibility-focused user, I can read text, identify focus, and use dialogs, menus, tables, charts, and status messages with sufficient contrast in default, hover, active, disabled, success, warning, and error states.

Deliverables:

- [ ] `apps/architecture-dashboard/src/styles.scss` becomes the global style entrypoint that loads the shared style layers with Sass `@use`.
- [X] `apps/architecture-dashboard/src/styles/_colors.scss` defines MD3 Express source colors, semantic roles, status colors, chart colors, and PrimeNG token mappings.
- [X] `apps/architecture-dashboard/src/styles/_vars.scss` defines spacing, sizing, breakpoints, border radius, elevation, z-index, density, focus rings, and layout constants.
- [X] `apps/architecture-dashboard/src/styles/_typography.scss` defines display, headline, title, body, label, numeric, and table text scales without viewport-based font scaling.
- [X] `apps/architecture-dashboard/src/styles/_surfaces.scss` defines page backgrounds, panels, cards, app shell, sidebars, toolbars, and section bands.
- [X] `apps/architecture-dashboard/src/styles/_components.scss` defines shared PrimeNG, Material-compatible, form, table, chip, button, dialog, tooltip, toast, and overlay overrides.
- [X] `apps/architecture-dashboard/src/styles/_animations.scss` centralizes MD3 Express motion tokens, Angular enter/exit classes, reduced-motion fallbacks, and D3/SVG animation variables.
- [X] `apps/architecture-dashboard/src/styles/_charts.scss` defines D3, Chart.js, status sparkline, topology graph, and comparison metric color/shape conventions.
- [X] `apps/architecture-dashboard/src/styles/_accessibility.scss` defines focus-visible, high-contrast, disabled, error, warning, success, and reduced-motion guardrails.
- [ ] PrimeIcons are mapped to route navigation, metric cards, table toolbars/actions, status tags, realtime/cache panels, D3 legends, OpenAPI contract panels, and admin/security workflows.
- [ ] All Angular views are audited and updated to remove hard-coded visual values that belong in shared tokens.
- [ ] PrimeNG tables, filters, dialogs, menus, tooltips, toasts, cards, and status tags match the MD3 Express token system.
- [ ] D3/SVG and Chart.js visuals use shared chart/status tokens rather than local color literals.
- [ ] Playwright visual smoke captures landing, dashboard, security search, backend comparison, realtime, OpenAPI contract, Map inspector, SignalStore inspector, and mobile sidebar layouts.

Acceptance criteria:

- [ ] Every frontend view uses shared style tokens for color, spacing, radius, elevation, focus, and animation.
- [ ] `styles.scss` loads the style partials with Sass `@use` in a predictable order: colors, vars, typography, accessibility, surfaces, components, charts, animations.
- [ ] No view-specific SCSS introduces new one-off palette colors, shadows, animation timings, or breakpoints without adding them to the shared style layer first.
- [ ] PrimeNG overlays, dialogs, dropdowns, tooltips, menus, and toast/snackbar-style messages have verified contrast against their surfaces.
- [ ] Icon-only controls have accessible names and tooltips, decorative PrimeIcons are hidden from assistive technology, and status meaning never relies on icon or color alone.
- [ ] Status colors remain distinguishable for success, warning, error, info, disabled, selected, hover, active, and focus states.
- [ ] Dashboard cards, tables, charts, and D3 visuals remain readable on desktop and mobile without text clipping or overlapping controls.
- [ ] Reduced-motion behavior from Phase 9 remains intact after the MD3 Express styling pass.
- [ ] Lint, unit tests, build, and Playwright visual smoke pass after the styling rollout.

## Sprint 14: Backend Parity, OpenAPI Contract Bridge, and Live Audit Coverage

Goal: Close the outstanding comparison, generated-client, contract, and backend parity gaps so the lab moves from mock and design-first surfaces to real backend metrics and contract-driven state.

Stories:

- [ ] As a learner, I can compare Spring direct, Nest direct, and Nest proxy paths with real backend metrics instead of mock data.
- [ ] As a security-aware user, I can understand the difference between raw OpenAPI metadata and facade-backed generated client contracts.
- [ ] As a developer, I can consume generated Angular clients through facades and preserve contract drift watch behavior.
- [ ] As a maintainer, I can run the complete final system through Docker Compose and Nginx at `/`.
- [ ] As a tester, I can prove Map/Set/ViewModel projection and contract drift warnings through unit and Playwright coverage.

Deliverables:

- [ ] `docker compose up --build` starts the full system, including Angular/Nginx, Spring, Nest, Postgres, Redis, pgAdmin, and Redis Insight.
- [ ] Browser entrypoint serves Angular through Nginx at `/`.
- [ ] Small, Medium, Large, and Stress dataset options exist and are documented in runtime config.
- [ ] `apps/postgres/src/migrations` and `apps/postgres/src/seed` are complete and source-controlled.
- [ ] Live Nest direct read endpoint works against parity data and is used by the Phase 5 comparison view.
- [ ] Live backend comparison endpoint measures Spring direct, Nest direct, and Nest proxy in one topology view.
- [ ] Generated Spring and Nest Angular clients are real, buildable, and consumed through facade services.
- [ ] OpenAPI Contract Lab links Spring and Nest docs, facades, and drift watch guidance.
- [ ] OpenAPI Contract Lab surfaces explicit generated contract drift watch status.
- [ ] Playwright covers contract drift warning behavior and protected OpenAPI route access.
- [ ] Map/Set/ViewModel tests prove borrower lookup, documents-by-loan/security, status lookup, permission membership, and fallback row behavior.
- [ ] Spring and Nest OpenAPI views are linked and explained in the UI and documentation.
- [ ] `pnpm nx lint architecture-dashboard`, `pnpm nx test architecture-dashboard`, `pnpm nx build architecture-dashboard`, and `pnpm nx e2e architecture-dashboard-e2e` pass.

Acceptance criteria:

- [ ] The full lab can be started in Docker Compose and navigated from `/` through Nginx.
- [ ] Generated client and facade consumption is documented and verified in the Contract Lab.
- [ ] Live backend comparison metrics drive the Phase 5 visualization and D3 grouped bar chart.
- [ ] Stress dataset is explicit and does not slow default development.
- [ ] OpenAPI docs are linked, explained, and protected by persona-based access.
- [ ] Playwright coverage includes contract drift and backend parity routes.

## Sprint 15: Security Hardening, Risk Management, and Safe Runtime Guards

Goal: Complete the Phase 6.5 security hardening work, document the remaining risk map, and make the runtime safer for local lab use.

Stories:

- [ ] As a security reviewer, I can see which auth, CORS, CSRF, and contract drift risks remain in the lab.
- [ ] As a developer, I can harden the Nest gateway, realtime, and docs routes with backend auth guards.
- [ ] As a maintainer, I can restrict Socket.IO and CORS to known local runtime origins.
- [ ] As a product owner, I can track remaining Phase 6.5 hardening through a GitHub issue and admin security monitoring page.

Deliverables:

- [X] Harden Spring `access_token` persona auth model and document its dev-only limits.
- [X] Add Nest gateway and realtime route auth guards for protected APIs.
- [X] Restrict Socket.IO origin handling to local/dev origins and remove wildcard origin policy in production-like config.
- [X] Validate CORS policy across Angular, Spring, and Nest clients.
- [X] Add CSRF mitigation or same-site cookie enforcement for state-changing endpoints.
- [X] Document admin security monitoring callouts for auth guard, origin, and cookie integrity issues.
- [X] Add a generated client drift watch item to the admin security monitoring page.
- [X] Create a tracked GitHub issue for the remaining Phase 6.5 hardening tasks.
- [X] Update the OpenAPI risk inventory and threat model docs with the actual hardening status.
- [X] Add Phase 6.5 risk map and threat model page coverage, plus an active/deferred follow-up backlog note.
- [X] Add Phase 6.5 artifact page unit and e2e coverage for the admin security workflow.
- [X] Update the planning folder to align Sprint 15 work with the remaining Phase 6.5 checklists.

Acceptance criteria:

- [X] Backend auth guards protect any protected route in Nest and Spring, not just UI navigation.
- [X] CORS and Socket.IO origins are restricted when running in local or Docker compose mode.
- [X] CSRF and same-site cookie behavior are documented and either implemented or explicitly scoped as follow-up mitigation.
- [X] Admin/security monitoring pages explicitly call out current hardening gaps and follow-up issue tracking.
- [X] Playwright or unit tests verify docs access and realtime emit access restrictions.
- [X] Risk inventory files are aligned with the current planned work and point to the shared GitHub issue.

## Sprint 16: Documentation Closure and Backlog Cleanup

Goal: Capture any remaining polish, finish documentation alignment, and scope optional historical metrics/backfill dashboards.

Stories:

- [ ] As a maintainer, I can close the planning backlog by updating the sprint plan, README, and relevant documentation files.
- [ ] As a learner, I can find the current lab state, remaining risks, and future work in the planning README.
- [ ] As a product owner, I can choose whether to add an optional historical metrics dashboard later.

Deliverables:

- [X] Update `planning/README.md` with the new Sprint 14/15/16 alignment and remaining backlog summary.
- [X] Mark completed planning items across `planning/20-*`, `planning/21-*`, and `planning/22-*` in a single alignment section.
- [X] Capture optional historical comparison metrics dashboard scope for future work using Grafana/Chart.js/Highcharts.
- [X] Audit all remaining unchecked planning items and classify them as active Sprint 14/15 work or deferred Sprint 17 work.

Acceptance criteria:

- [X] Planning and documentation markdown all reflect the same remaining sprint structure.
- [X] `planning/README.md` surfaces the new future sprint path through Sprint 16.
- [X] Remaining risk and backlog items are clearly labeled as either Sprint 14/15 work or deferred Sprint 17 work.
- [X] No open planning checklist items are left unaccounted for in the sprint plan.

## Sprint 17: Optional Metrics And Deferred Follow-Up

Goal: Reserve future follow-up work for non-blocking historical metrics dashboards and long-term enterprise enhancements that are not required for the current lab release path.

Stories:

- [ ] As a product owner, I can defer optional historical metrics dashboards without losing traceability.
- [ ] As an engineering lead, I can capture long-term enterprise follow-up items without mixing them into Sprint 14/15 active work.

Deliverables:

- [ ] Optional historical comparison metrics dashboard using Grafana, Chart.js, or Highcharts after metrics persistence exists.
- [X] Deferred backlog labeling separates optional metrics and long-term enterprise enhancements from active Sprint 14/15 implementation.
- [ ] Future issue tracking for long-term migration, public-hardening, and enterprise baseline variants.

Acceptance criteria:

- [X] Deferred work is documented separately from active backend parity and security-hardening scope.
- [X] Optional metrics/dashboard work stays optional and does not block the current lab release path.
- [X] Future backlog items are visible in planning docs and not intermixed with active Sprint 14/15 deliverables.

## PI Risks

- [ ] Scope grows beyond training-lab v1. Mitigation: keep Redis, MCP, and visualizations scoped to explicit teaching goals.
- [X] Project names drift from final names. Mitigation applied: Nx project names and app folders now use the locked names.
- [X] Generated clients become hard to maintain. Mitigation applied: generated clients are wrapped by facades and checked by `check:openapi-clients`.
- [X] PrimeNG 22 RC license/runtime behavior needs an explicit lab decision. Mitigation applied: local `.env` holds `PRIMEUI_LICENSE_KEY`, ignored `env.js` provides runtime config, and Angular passes it to `providePrimeNG`.
- [X] Realtime state becomes confusing. Mitigation applied: `/lab/realtime` keeps event state operational, Phase 5 keeps topology educational, and docs state Redis is transient coordination only.
- [ ] Stress dataset slows development. Mitigation: make Stress an explicit mode, not the default.
- [X] Local Angular dev proxy can drift from Docker service DNS. Mitigation applied: proxy config now defaults to `localhost:18080` and Docker compose overrides `SPRING_API_TARGET` to `http://spring-api:8080`.
- [X] Visualization scope can outrun backend readiness. Mitigation applied for comparison: Phase 5 graph/table surfaces now bind deterministic mock metrics behind typed ViewModels before live Spring/Nest parity work.
- [X] Realtime visualization scope can outrun gateway readiness. Mitigation applied: Socket.IO event history now binds behind the same typed ViewModel pattern before Redis scale-out polish.
- [ ] Angular live socket subscription can conflict with current app boundary rules. Mitigation: introduce an allowed realtime client boundary before importing `socket.io-client` into frontend feature code.

## Unresolved Questions

- [X] pgAdmin and Redis Insight should be proxied through Nginx in v1 while keeping direct local ports available for learners.
- [ ] Should CSRF token handling be implemented in v1 or documented as a v1.1 hardening task?
