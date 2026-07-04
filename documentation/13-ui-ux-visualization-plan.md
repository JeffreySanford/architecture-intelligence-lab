# 13 UI, UX, And Visualization Plan

## Purpose

The UI should feel like a guided architecture workshop. It should be professional, practical, and inspectable. It should avoid marketing-page structure and instead put the usable lab on screen immediately.

## Visualization Roles

| Tool | Best use |
| --- | --- |
| PrimeNG | Enterprise workflow UI: lazy tables, filters, row actions, dialogs, status tags, shell, forms. |
| Chart.js | Standard charts such as status distribution, latency trends, payload sizes. |
| D3/SVG | Educational architecture diagrams, dependency graphs, request animations. |
| Angular 22 native animations | Route/content enter and leave transitions with `animate.enter` and `animate.leave`. |
| CSS transitions and keyframes | Small state-change pulses, request path movement, and Explain Mode overlays. |

## PrimeNG Priority

PrimeNG-heavy workflow screens have higher near-term study value than additional decorative visualization work. `/lab/security-search` is now the first dedicated Capital Markets table lab with lazy loading, server-side-style paging and sorting state, status/date/numeric filters, row actions, detail dialog, export action, loading state, and empty state.

D3 remains important for topology and relationship explanations. It should not displace PrimeNG work for data-heavy business screens where table state, filters, permissions, actions, and ViewModel projection are the real enterprise skills.

## Material Design 3 Express Styling System

The styling system should make the app feel vibrant, consistent, and purposeful while preserving the density expected from Capital Markets and architecture-lab workflows. Material Design 3 Express is the visual direction, applied through shared SCSS tokens and component overrides rather than page-by-page styling.

`apps/architecture-dashboard/src/styles.scss` should remain the global entrypoint and load the shared layers from `apps/architecture-dashboard/src/styles/` with Sass `@use` in this order:

- `_colors.scss`
- `_vars.scss`
- `_typography.scss`
- `_accessibility.scss`
- `_surfaces.scss`
- `_components.scss`
- `_charts.scss`
- `_animations.scss`

Style responsibilities:

- `_colors.scss`: MD3 Express source colors, semantic roles, status colors, chart palettes, and PrimeNG token mappings.
- `_vars.scss`: spacing, sizing, breakpoints, radius, elevation, z-index, density, focus rings, and layout constants.
- `_typography.scss`: display, headline, title, body, label, numeric, and table text scales.
- `_accessibility.scss`: contrast, focus-visible, high-contrast, disabled, error, warning, success, selected, and reduced-motion guardrails.
- `_surfaces.scss`: app shell, route backgrounds, page bands, cards, panels, sidebars, toolbars, and section layouts.
- `_components.scss`: PrimeNG and Material-compatible overrides for buttons, inputs, tables, chips, tags, dialogs, menus, tooltips, toasts, and overlays.
- `_charts.scss`: D3, Chart.js, topology graph, comparison metrics, realtime markers, and status visualization tokens.
- `_animations.scss`: MD3 Express motion tokens, Angular enter/exit classes, local transition helpers, D3/SVG timing variables, and reduced-motion fallbacks.

Implementation rules:

- Do not introduce one-off palette colors, shadows, breakpoints, radii, animation timings, or focus styles in a feature stylesheet when a shared token exists.
- PrimeNG tables, filters, dialogs, menus, tooltips, toasts, cards, status tags, and inputs should inherit the same visual language as the app shell.
- D3/SVG and Chart.js visuals should use shared chart/status tokens so diagrams and operational charts feel like part of the same product.
- Validate text and icon contrast for default, hover, active, focus, disabled, error, warning, success, info, and selected states.
- Preserve keyboard focus visibility and overlay readability on all dark or saturated surfaces.
- Keep Phase 9 enter/exit and reduced-motion behavior intact during the styling pass.

## Phase 5 Visualization Methodology

Phase 5 starts with a visualization-first control surface at `/lab/backend-comparison`. The page should teach the architecture before every backend endpoint is complete, then accept live data without a redesign.

Use D3/SVG for the Phase 5 topology graph:

- Angular Phase 5 view
- Spring direct reads
- Nest direct API
- Nest proxy
- Comparison endpoint
- Socket.IO gateway
- Redis adapter
- Nest Swagger UI

Use PrimeNG for dense status and access surfaces:

- Deliverables table
- Acceptance criteria table
- Role/persona access matrix
- Comparison metrics table
- Realtime event history table
- Future Redis adapter/cache status table

The graph and tables should be backed by typed ViewModels. D3 should render from node/link data, while Angular templates render PrimeNG tables from ordinary arrays and computed state. This keeps visualization code replaceable when static Phase 5 data becomes live API data.

Phase 5 visuals must be role-aware. The current persona controls which deliverables are visible, and the role matrix explains the intended access for Diagnostics Admin, Realtime Operator, Contract Admin, Admin, and general learner personas.

## Animation Rule

Use Angular 22's native `animate.enter` and `animate.leave` APIs for DOM insertion and removal transitions. Do not add animation triggers from the deprecated `@angular/animations` package for new lab features.

Use CSS transitions or keyframes for local visual feedback such as selected cards, realtime pulses, request path movement, and Explain Mode callouts. Keep D3/SVG animation logic inside visualization components when the animation is tied to graph layout or path state.

The app should not depend on `@angular/animations` unless a third-party library requires it and there is no Angular 22-native alternative.

## Phase 9 Enter/Exit Animation Plan

Phase 9 should use `.enter` and `.exit` class patterns through Angular native enter/leave APIs in places where the UI is already adding or removing meaningful state. Animation should clarify what changed, not decorate stable content.

Priority surfaces:

- Route/page shell transitions when moving between landing, dashboard, backend comparison, realtime, contract, Map, and SignalStore views.
- Sidebar navigation transitions when the selected persona changes which protected routes are visible.
- Landing selector summaries for persona, dataset size, backend mode, Compare all, and Explain Mode state.
- Dashboard cards, status panels, charts, and metric groups when dataset or backend mode changes.
- PrimeNG table rows, filtered results, loading states, empty states, and detail dialogs in Security Search and OpenAPI Contract Lab.
- D3/SVG request paths, architecture links, comparison metric bars, selected backend path highlights, realtime event markers, SignalStore nodes, and OpenAPI tree nodes.
- Map inspector bucket/key changes during copy-on-write updates.
- Toasts, inline errors, runtime health banners, generated-client status, contract drift warnings, and Explain Mode callouts.

Implementation guardrails:

- Centralize animation duration, easing, stagger, and reduced-motion tokens.
- Drive visibility from typed ViewModels, route data, signals, or facade state.
- Honor `prefers-reduced-motion` across route, list, table, card, SVG, dialog, and overlay animations.
- Keep animated elements dimensionally stable so text does not clip and controls do not shift unpredictably.
- Prefer CSS transitions for ordinary enter/exit states and D3 transitions only where graph geometry or path state is the concept being taught.
- Add unit tests for state projection and Playwright smoke tests for route transitions, permission-driven nav changes, table/list updates, mobile layout, and reduced-motion behavior.

## Main Views

| View | Purpose |
| --- | --- |
| Landing command center | Select persona, dataset size, backend mode, Explain Mode. |
| Security search | PrimeNG-heavy Capital Markets table for securities, pools, commitments, disclosures, filters, row actions, and details. |
| Architecture flow | D3 system graph from Postgres to UI. |
| Dashboard | Cards, table, filters, charts, status chips. |
| Map inspector | Show `Map` and `Set` contents and consumers. |
| SignalStore inspector | Show raw state, computed state, methods, recomputation. |
| Backend comparison | Compare Spring, Nest direct, Nest proxy, and all paths. |
| Realtime lab | Trigger events and observe state updates. |
| OpenAPI contract lab | Inspect contracts, DTOs, generated clients, drift checks. |
| MCP dashboard | Explain MCP setup and developer workflow guidance. |
| Admin/persona lab | Demonstrate roles, permissions, admin-only actions. |

## Explain Mode

Explain Mode is a global toggle. When off, the app should behave like a polished dashboard. When on, it should reveal learning overlays:

- DTO flow labels
- Map lookup notes
- SignalStore dependency graph
- OpenAPI anti-drift explanation
- JWT cookie explanation
- Backend request path overlays
- Redis cache hit/miss callouts

## What This Teaches

- A training app can still look like a real tool.
- Visuals should explain architecture, not decorate the page.
- Explain Mode lets the same UI serve portfolio and learning goals.
- D3 should be used where custom relationships matter, not for every chart.
- PrimeNG should carry operational status, access, and metrics because those are scanning tasks.
- Static teaching visuals are acceptable when they establish the ViewModel contract for later live data.
