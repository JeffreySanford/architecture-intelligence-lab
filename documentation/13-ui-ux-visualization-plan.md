# 13 UI, UX, And Visualization Plan

## Purpose

The UI should feel like a guided architecture workshop. It should be professional, practical, and inspectable. It should avoid marketing-page structure and instead put the usable lab on screen immediately.

## Visualization Roles

| Tool | Best use |
| --- | --- |
| PrimeNG | Cards, tables, tabs, chips, sliders, forms, shell, dialogs. |
| Chart.js | Standard charts such as status distribution, latency trends, payload sizes. |
| D3/SVG | Educational architecture diagrams, dependency graphs, request animations. |
| Angular 22 native animations | Route/content enter and leave transitions with `animate.enter` and `animate.leave`. |
| CSS transitions and keyframes | Small state-change pulses, request path movement, and Explain Mode overlays. |

## Animation Rule

Use Angular 22's native `animate.enter` and `animate.leave` APIs for DOM insertion and removal transitions. Do not add animation triggers from the deprecated `@angular/animations` package for new lab features.

Use CSS transitions or keyframes for local visual feedback such as selected cards, realtime pulses, request path movement, and Explain Mode callouts. Keep D3/SVG animation logic inside visualization components when the animation is tied to graph layout or path state.

The app should not depend on `@angular/animations` unless a third-party library requires it and there is no Angular 22-native alternative.

## Main Views

| View | Purpose |
| --- | --- |
| Landing command center | Select persona, dataset size, backend mode, Explain Mode. |
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
