import { Routes } from '@angular/router';
import { personaSelectedGuard } from './core/auth/persona-selected.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'lab',
    loadComponent: () =>
      import('./core/shell/lab-shell.component').then(
        (m) => m.LabShellComponent,
      ),
    canActivate: [personaSelectedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'architecture-flow',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'Architecture Flow',
          eyebrow: 'System view',
          description:
            'D3 system graph showing browser, Angular, Spring, Nest, PostgreSQL, Redis, and inspection tools.',
        },
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'map-inspector',
        loadComponent: () =>
          import('./features/map-inspector/map-inspector.page').then(
            (m) => m.MapInspectorPage,
          ),
      },
      {
        path: 'signal-store-inspector',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'SignalStore Inspector',
          eyebrow: 'State graph',
          description:
            'Show raw state, computed indexes, ViewModels, methods, and recomputation paths.',
        },
      },
      {
        path: 'backend-comparison',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'Backend Comparison',
          eyebrow: 'Spring and Nest',
          description:
            'Compare Spring direct, Nest direct, Nest proxy, and all backend paths with metrics.',
        },
      },
      {
        path: 'realtime',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'Realtime Lab',
          eyebrow: 'Socket.IO and Redis',
          description:
            'Trigger loan status events and observe state updates, cache behavior, and event history.',
        },
      },
      {
        path: 'openapi',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'OpenAPI Contract Lab',
          eyebrow: 'Anti-drift workflow',
          description:
            'Inspect Spring and Nest Swagger, generated client status, DTOs, endpoints, and drift checks.',
        },
      },
      {
        path: 'mcp',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'MCP Dashboard',
          eyebrow: 'AI tooling',
          description:
            'Explain Angular CLI MCP setup, command references, prompts, and safe developer workflow boundaries.',
        },
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/placeholder/placeholder.page').then(
            (m) => m.PlaceholderPage,
          ),
        data: {
          title: 'Admin And Persona Lab',
          eyebrow: 'Roles and permissions',
          description:
            'Demonstrate persona selection, role permissions, admin-only workflows, and guarded UI behavior.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
