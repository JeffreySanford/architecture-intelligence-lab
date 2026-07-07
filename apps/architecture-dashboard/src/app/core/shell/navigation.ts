import { CurrentUserDto } from '../api/lab-api.models';
import { permissionRequirementMatches, type PermissionRequirement } from '../auth/permission.utils';

export type LabNavItem = {
  label: string;
  route: string;
  description: string;
  permission: PermissionRequirement;
  icon: string;
};

export const LAB_NAV_ITEMS: LabNavItem[] = [
  {
    label: 'Dashboard',
    route: '/lab/dashboard',
    description: 'Loan workspace',
    permission: 'dashboard:view',
    icon: 'pi pi-chart-bar',
  },
  {
    label: 'PrimeNG Encapsulation Lab',
    route: '/lab/primeng-encapsulation',
    description: 'PrimeNG style conflict and containment lab',
    permission: 'design:view',
    icon: 'pi pi-paint-brush',
  },
  {
    label: 'Security Search',
    route: '/lab/security-search',
    description: 'Security and disclosure table',
    permission: 'loans:view',
    icon: 'pi pi-search',
  },
  {
    label: 'Capital Markets',
    route: '/lab/capital-markets',
    description: 'Commitment sample',
    permission: 'loans:view',
    icon: 'pi pi-briefcase',
  },
  {
    label: 'Map Inspector',
    route: '/lab/map-inspector',
    description: 'Map and Set indexes',
    permission: 'dashboard:view',
    icon: 'pi pi-map',
  },
  {
    label: 'SignalStore Inspector',
    route: '/lab/signal-store-inspector',
    description: 'Computed state',
    permission: 'diagnostics:view',
    icon: 'pi pi-sliders-h',
  },
  {
    label: 'Architecture Flow',
    route: '/lab/architecture-flow',
    description: 'Backend request paths',
    permission: 'dashboard:view',
    icon: 'pi pi-sitemap',
  },
  {
    label: 'Backend Comparison',
    route: '/lab/backend-comparison',
    description: 'Spring, Nest, proxy',
    permission: ['backend-comparison:view', 'realtime:view'],
    icon: 'pi pi-sync',
  },
  {
    label: 'Metrics History',
    route: '/lab/metrics-history',
    description: 'Comparison trends',
    permission: 'backend-comparison:view',
    icon: 'pi pi-chart-line',
  },
  {
    label: 'Infrastructure',
    route: '/lab/infrastructure',
    description: 'Docker and tooling health',
    permission: ['diagnostics:view', 'admin:view'],
    icon: 'pi pi-server',
  },
  {
    label: 'Realtime Lab',
    route: '/lab/realtime',
    description: 'Socket.IO and Redis',
    permission: 'realtime:view',
    icon: 'pi pi-wifi',
  },
  {
    label: 'OpenAPI',
    route: '/lab/openapi',
    description: 'Contracts and clients',
    permission: { anyOf: ['contracts:view', 'admin:view'] },
    icon: 'pi pi-code',
  },
  {
    label: 'MCP Dashboard',
    route: '/lab/mcp',
    description: 'Angular CLI MCP',
    permission: { allOf: ['developer:view', 'mcp:view'] },
    icon: 'pi pi-cog',
  },
  {
    label: 'Glossary',
    route: '/lab/glossary',
    description: 'Fintech and Angular terms',
    permission: 'developer:view',
    icon: 'pi pi-book',
  },
  {
    label: 'Theme Governance',
    route: '/lab/theme',
    description: 'Zeroheight and Nora tokens',
    permission: { anyOf: ['developer:view', 'design:view'] },
    icon: 'pi pi-palette',
  },
  {
    label: 'Admin',
    route: '/lab/admin',
    description: 'Roles and personas',
    permission: 'admin:view',
    icon: 'pi pi-shield',
  },
  {
    label: 'Phase 6.5 Threat Model',
    route: '/lab/security-threat-model',
    description: 'OpenAPI threat artifact',
    permission: 'admin:view',
    icon: 'pi pi-exclamation-triangle',
  },
  {
    label: 'Phase 6.5 Security Risk Map',
    route: '/lab/security-risk-map',
    description: 'Security risk artifact',
    permission: 'admin:view',
    icon: 'pi pi-map',
  },
];

export function visibleLabNavItems(
  currentUser: CurrentUserDto | null,
  hasPermission: (permission: string) => boolean,
): LabNavItem[] {
  if (!currentUser) {
    return [];
  }

  return LAB_NAV_ITEMS.filter((item) =>
    permissionRequirementMatches(hasPermission, item.permission),
  );
}

export function firstVisibleLabNavRoute(
  currentUser: CurrentUserDto | null,
  hasPermission: (permission: string) => boolean,
): string | null {
  return visibleLabNavItems(currentUser, hasPermission)[0]?.route ?? null;
}
