import { Routes } from '@angular/router';
import { permissionGuard } from './core/auth/permission.guard';
import { personaSelectedGuard } from './core/auth/persona-selected.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.page').then((m) => m.LandingPage),
    data: {
      title: 'Persona Setup',
      eyebrow: 'Public entry',
      description:
        'Choose a persona, dataset, backend mode, and Explain Mode before entering the lab.',
    },
  },
  {
    path: 'lab',
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
          import('./features/architecture-flow/architecture-flow.page').then(
            (m) => m.ArchitectureFlowPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Architecture Flow',
          eyebrow: 'System view',
          description:
            'D3 system graph showing browser, Angular, Spring, Nest, PostgreSQL, Redis, and inspection tools.',
          permission: 'dashboard:view',
        },
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Dashboard',
          eyebrow: 'DTO to ViewModel',
          description:
            'Inspect Spring snapshot data projected into loan cards, table rows, and computed indexes.',
          permission: 'dashboard:view',
        },
      },
      {
        path: 'capital-markets',
        loadComponent: () =>
          import('./features/capital-markets/capital-markets.page').then(
            (m) => m.CapitalMarketsPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Capital Markets',
          eyebrow: 'PrimeNG sample',
          description:
            'PrimeNG table demo for securities, commitments, and disclosure workflow status.',
          permission: 'loans:view',
        },
      },
      {
        path: 'security-search',
        loadComponent: () =>
          import('./features/security-search/security-search.page').then(
            (m) => m.SecuritySearchPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Security Search',
          eyebrow: 'Capital Markets workflow',
          description:
            'PrimeNG lazy table for securities, pools, commitments, disclosure files, filters, row actions, and details.',
          permission: 'loans:view',
        },
      },
      {
        path: 'map-inspector',
        loadComponent: () =>
          import('./features/map-inspector/map-inspector.page').then(
            (m) => m.MapInspectorPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Map Inspector',
          eyebrow: 'Computed indexes',
          description:
            'Review Map and Set state used by dashboard cards, table rows, permissions, and joins.',
          permission: 'dashboard:view',
        },
      },
      {
        path: 'signal-store-inspector',
        loadComponent: () =>
          import('./features/signal-store-inspector/signal-store-inspector.page').then(
            (m) => m.SignalStoreInspectorPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'SignalStore Inspector',
          eyebrow: 'State graph',
          description:
            'Show raw state, computed indexes, ViewModels, methods, and recomputation paths.',
          permission: 'diagnostics:view',
        },
      },
      {
        path: 'backend-comparison',
        loadComponent: () =>
          import('./features/phase-five/phase-five.page').then(
            (m) => m.PhaseFivePage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Backend Comparison',
          eyebrow: 'Spring and Nest',
          description:
            'Compare Spring direct, Nest direct, Nest proxy, and all backend paths with metrics.',
          permission: ['backend-comparison:view', 'realtime:view'],
        },
      },
      {
        path: 'infrastructure',
        loadComponent: () =>
          import('./features/infrastructure/infrastructure.page').then(
            (m) => m.InfrastructurePage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Infrastructure Status',
          eyebrow: 'Docker and tooling health',
          description:
            'Review Spring health and quick access links for pgAdmin, Redis Insight, and APIs.',
          permission: ['diagnostics:view', 'admin:view'],
        },
      },
      {
        path: 'metrics-history',
        loadComponent: () =>
          import('./features/metrics-history/metrics-history.page').then(
            (m) => m.MetricsHistoryPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Metrics History',
          eyebrow: 'Backend comparison',
          description:
            'Inspect rolling historical metrics for Spring direct, Nest direct, and Nest proxy paths.',
          permission: 'backend-comparison:view',
        },
      },
      {
        path: 'realtime',
        loadComponent: () =>
          import('./features/realtime-lab/realtime-lab.page').then(
            (m) => m.RealtimeLabPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Realtime Lab',
          eyebrow: 'Socket.IO and Redis',
          description:
            'Trigger loan status events and observe state updates, cache behavior, and event history.',
          permission: 'realtime:view',
        },
      },
      {
        path: 'openapi',
        loadComponent: () =>
          import('./features/openapi/openapi.page').then(
            (m) => m.OpenApiPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'OpenAPI Contract Lab',
          eyebrow: 'Anti-drift workflow',
          description:
            'Inspect Spring and Nest Swagger, generated client status, DTOs, endpoints, and drift checks.',
          permission: 'contracts:view',
        },
      },
      {
        path: 'security-risk-map',
        loadComponent: () =>
          import('./features/security-risk-map/security-risk-map.page').then(
            (m) => m.SecurityRiskMapPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Phase 6.5 Security Risk Map',
          eyebrow: 'Risk artifact',
          description:
            'Open the Phase 6.5 security risk map and planning issue placeholder.',
          permission: 'admin:view',
        },
      },
      {
        path: 'security-threat-model',
        loadComponent: () =>
          import('./features/security-threat-model/security-threat-model.page').then(
            (m) => m.SecurityThreatModelPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Phase 6.5 Threat Model',
          eyebrow: 'Threat artifact',
          description:
            'Open the Phase 6.5 OpenAPI security threat model and risk inventory artifacts.',
          permission: 'admin:view',
        },
      },
      {
        path: 'mcp',
        loadComponent: () =>
          import('./features/mcp-dashboard/mcp-dashboard.page').then(
            (m) => m.McpDashboardPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'MCP Dashboard',
          eyebrow: 'AI tooling',
          description:
            'Explain Angular CLI MCP setup, command references, prompts, and safe developer workflow boundaries.',
          permission: { allOf: ['developer:view', 'mcp:view'] },
        },
      },
      {
        path: 'glossary',
        loadComponent: () =>
          import('./features/glossary/glossary.page').then(
            (m) => m.GlossaryPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Developer Glossary',
          eyebrow: 'Fintech and Angular vocabulary',
          description:
            'Review capital-markets, Angular, and OpenAPI terms with code-section references.',
          permission: 'developer:view',
        },
      },
      {
        path: 'gloarry',
        redirectTo: 'glossary',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/admin/admin.page').then(
            (m) => m.AdminPage,
          ),
        canActivate: [permissionGuard],
        data: {
          title: 'Admin Security Monitoring',
          eyebrow: 'Roles and permissions',
          description:
            'Track OpenAPI security monitoring items, permissions, and risk status for generated client boundaries.',
          permission: 'admin:view',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
