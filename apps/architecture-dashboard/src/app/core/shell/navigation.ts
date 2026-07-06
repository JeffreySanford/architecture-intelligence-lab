import { CurrentUserDto } from '../api/lab-api.models';
import { permissionRequirementMatches, type PermissionRequirement } from '../auth/permission.utils';

export type LabNavItem = {
  label: string;
  route: string;
  description: string;
  permission: PermissionRequirement;
  icon: string;
  assignedRoles?: string[];
  assignedPersonas?: string[];
};

const GENERAL_LEARNER_ROLES = ['viewer', 'reviewer', 'approver'];
const ADMIN_ROLES = ['admin'];

export const LAB_NAV_ITEMS: LabNavItem[] = [
  {
    label: 'Dashboard',
    route: '/lab/dashboard',
    description: 'Loan workspace',
    permission: 'dashboard:view',
    icon: 'pi pi-chart-bar',
    assignedRoles: [
      ...GENERAL_LEARNER_ROLES,
      ...ADMIN_ROLES,
      'diagnostics-admin',
      'contract-admin',
      'mcp-explorer',
      'realtime-operator',
    ],
  },
  {
    label: 'Security Search',
    route: '/lab/security-search',
    description: 'Security and disclosure table',
    permission: 'loans:view',
    icon: 'pi pi-search',
    assignedRoles: [...GENERAL_LEARNER_ROLES, ...ADMIN_ROLES],
  },
  {
    label: 'Capital Markets',
    route: '/lab/capital-markets',
    description: 'Commitment sample',
    permission: 'loans:view',
    icon: 'pi pi-briefcase',
    assignedRoles: [...GENERAL_LEARNER_ROLES, ...ADMIN_ROLES],
  },
  {
    label: 'Map Inspector',
    route: '/lab/map-inspector',
    description: 'Map and Set indexes',
    permission: 'dashboard:view',
    icon: 'pi pi-map',
    assignedRoles: [...GENERAL_LEARNER_ROLES, ...ADMIN_ROLES, 'diagnostics-admin'],
  },
  {
    label: 'SignalStore Inspector',
    route: '/lab/signal-store-inspector',
    description: 'Computed state',
    permission: 'diagnostics:view',
    icon: 'pi pi-sliders-h',
    assignedRoles: [...ADMIN_ROLES, 'diagnostics-admin'],
  },
  {
    label: 'Architecture Flow',
    route: '/lab/architecture-flow',
    description: 'Backend request paths',
    permission: 'dashboard:view',
    icon: 'pi pi-sitemap',
    assignedRoles: [
      ...GENERAL_LEARNER_ROLES,
      ...ADMIN_ROLES,
      'diagnostics-admin',
      'contract-admin',
      'mcp-explorer',
      'realtime-operator',
    ],
  },
  {
    label: 'Backend Comparison',
    route: '/lab/backend-comparison',
    description: 'Spring, Nest, proxy',
    permission: ['backend-comparison:view', 'realtime:view'],
    icon: 'pi pi-sync',
    assignedRoles: [...ADMIN_ROLES, 'diagnostics-admin', 'realtime-operator'],
  },
  {
    label: 'Metrics History',
    route: '/lab/metrics-history',
    description: 'Comparison trends',
    permission: 'backend-comparison:view',
    icon: 'pi pi-chart-line',
    assignedRoles: [...ADMIN_ROLES, 'diagnostics-admin'],
  },
  {
    label: 'Infrastructure',
    route: '/lab/infrastructure',
    description: 'Docker and tooling health',
    permission: ['diagnostics:view', 'admin:view'],
    icon: 'pi pi-server',
    assignedRoles: [...ADMIN_ROLES, 'diagnostics-admin'],
  },
  {
    label: 'Realtime Lab',
    route: '/lab/realtime',
    description: 'Socket.IO and Redis',
    permission: 'realtime:view',
    icon: 'pi pi-wifi',
    assignedRoles: [...ADMIN_ROLES, 'realtime-operator'],
  },
  {
    label: 'OpenAPI',
    route: '/lab/openapi',
    description: 'Contracts and clients',
    permission: { anyOf: ['contracts:view', 'admin:view'] },
    icon: 'pi pi-code',
    assignedRoles: [...ADMIN_ROLES, 'contract-admin'],
  },
  {
    label: 'MCP Dashboard',
    route: '/lab/mcp',
    description: 'Angular CLI MCP',
    permission: { allOf: ['developer:view', 'mcp:view'] },
    icon: 'pi pi-cog',
    assignedRoles: [...ADMIN_ROLES, 'mcp-explorer'],
    assignedPersonas: ['henry-mcp-explorer'],
  },
  {
    label: 'Glossary',
    route: '/lab/glossary',
    description: 'Fintech and Angular terms',
    permission: 'developer:view',
    icon: 'pi pi-book',
    assignedRoles: [...ADMIN_ROLES, 'mcp-explorer'],
    assignedPersonas: ['henry-mcp-explorer'],
  },
  {
    label: 'Admin',
    route: '/lab/admin',
    description: 'Roles and personas',
    permission: 'admin:view',
    icon: 'pi pi-shield',
    assignedRoles: ADMIN_ROLES,
  },
  {
    label: 'Phase 6.5 Threat Model',
    route: '/lab/security-threat-model',
    description: 'OpenAPI threat artifact',
    permission: 'admin:view',
    icon: 'pi pi-exclamation-triangle',
    assignedRoles: ADMIN_ROLES,
  },
  {
    label: 'Phase 6.5 Security Risk Map',
    route: '/lab/security-risk-map',
    description: 'Security risk artifact',
    permission: 'admin:view',
    icon: 'pi pi-map',
    assignedRoles: ADMIN_ROLES,
  },
];

export function visibleLabNavItems(
  currentUser: CurrentUserDto | null,
  hasPermission: (permission: string) => boolean,
): LabNavItem[] {
  if (!currentUser) {
    return [];
  }

  return LAB_NAV_ITEMS.filter(
    (item) =>
      isAssignedToUser(item, currentUser) &&
      permissionRequirementMatches(hasPermission, item.permission),
  );
}

function isAssignedToUser(item: LabNavItem, currentUser: CurrentUserDto): boolean {
  const assignedRoles = new Set((item.assignedRoles ?? []).map(normalizeRole));
  const assignedPersonas = new Set(item.assignedPersonas ?? []);

  if (assignedRoles.size === 0 && assignedPersonas.size === 0) {
    return true;
  }

  const personaId = currentUser.persona?.id;
  if (personaId && assignedPersonas.has(personaId)) {
    return true;
  }

  const userRoles = [
    ...(currentUser.roles ?? []),
    currentUser.persona?.role,
  ]
    .filter((role): role is string => typeof role === 'string' && role.length > 0)
    .map(normalizeRole);

  return userRoles.some((role) => assignedRoles.has(role));
}

function normalizeRole(role: string): string {
  return role.trim().toLowerCase().replace(/\s+/g, '-');
}
