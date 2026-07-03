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
    guards/
    interceptors/
    shell/
    layout/
    tokens/
  features/
    landing/
    architecture-flow/
    dashboard/
    map-inspector/
    signal-store-inspector/
    backend-comparison/
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
| `/lab/architecture-flow` | System architecture visualization. |
| `/lab/dashboard` | Main loan dashboard. |
| `/lab/map-inspector` | Map and Set index inspector. |
| `/lab/signal-store-inspector` | SignalStore state and computed graph. |
| `/lab/backend-comparison` | Spring vs Nest vs proxy comparison. |
| `/lab/realtime` | Socket.IO and Redis realtime lab. |
| `/lab/openapi` | OpenAPI contract lab. |
| `/lab/mcp` | MCP guidance dashboard. |
| `/lab/admin` | Persona and admin exercises. |

## Current Shell Checkpoint

The current Angular shell is intentionally permissive while the Spring persona auth API is still pending. `/lab` is accessible without a route guard for now. The landing page exposes documented persona cards and setup controls so the eventual JWT-authenticated user flow has a visible UI surface before backend auth exists.

When `/api/dev-auth/personas/{personaId}/select` and `/api/me` are implemented, replace the temporary local persona selection with `AuthStore` state and add the protected `/lab` route guard.

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
