# 09 Angular Standalone Architecture

## Purpose

The frontend uses Angular standalone APIs. There is no `AppModule`. The app still keeps enterprise feature boundaries through routes, folders, providers, stores, guards, and shared UI libraries.

Standalone removes NgModule ceremony. It does not remove architecture.

## Target App Structure

```text
apps/architecture-dashboard/src/app/
  app.component.ts
  app.config.ts
  app.routes.ts
  core/
    auth/
    interceptors/
    shell/
    layout/
    tokens/
  features/
    landing/
    security-search/
    architecture-flow/
    dashboard/
    map-inspector/
    signal-store-inspector/
    phase-five/
    realtime-lab/
    openapi-contract-lab/
    mcp-dashboard/
    admin/
  shared/
    ui/
    charts/
    d3/
    primeng/
    models/
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing command center and persona selection. |
| `/lab` | Protected lab shell. |
| `/lab/security-search` | PrimeNG Capital Markets table lab for securities, pools, commitments, and disclosures. |
| `/lab/architecture-flow` | System architecture visualization. |
| `/lab/dashboard` | Main loan dashboard and source DTO projection surface. |
| `/lab/map-inspector` | Map and Set index inspector. |
| `/lab/signal-store-inspector` | SignalStore state and computed graph. |
| `/lab/backend-comparison` | Phase 5 Spring/Nest/proxy comparison and realtime topology visualization. |
| `/lab/realtime` | Socket.IO and Redis realtime lab. |
| `/lab/openapi` | OpenAPI contract lab. |
| `/lab/mcp` | MCP guidance dashboard. |
| `/lab/admin` | Persona and admin exercises. |

## Current Shell Checkpoint

The current Angular shell uses Spring persona state. The landing page loads personas from `/api/personas`, posts selections to `/api/dev-auth/personas/{personaId}/select`, and `/lab` is guarded through `personaSelectedGuard`.

The shell also filters visible navigation by permission. Phase 5 adds route-level permission enforcement through `permissionGuard`, so hidden links cannot be opened directly by URL.

The landing page also serves as the command center for dataset and backend mode selection. It should let the user pick a persona, dataset size, and backend mode, and persist those selections into shared dashboard state before opening `/lab/dashboard`.

Protected Phase 5 route permissions:

| Route | Permission |
| --- | --- |
| `/lab/backend-comparison` | `backend-comparison:view` |
| `/lab/realtime` | `realtime:view` |
| `/lab/openapi` | `contracts:view` |
| `/lab/mcp` | `mcp:view` |
| `/lab/admin` | `admin:view` |

Capital Markets table routes should use ordinary app permissions such as `dashboard:view` at first, then move to a dedicated permission when row actions become role-sensitive. The initial `/lab/security-search` work should focus on PrimeNG table state, query ViewModels, and facade boundaries rather than admin/security behavior.

## Route Example

```ts
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'lab',
    loadComponent: () =>
      import('./core/shell/lab-shell.component').then((m) => m.LabShellComponent),
    canActivate: [personaSelectedGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
    ],
  },
];
```

## What This Teaches

- Standalone Angular can still be clean and enterprise-ready.
- Route-level boundaries replace feature module boundaries.
- Feature-local stores keep state ownership close to the UI that uses it.
- Shared UI components should stay dumb and reusable.
- Nav filtering is a usability feature; route guards are the access boundary inside the Angular app.
