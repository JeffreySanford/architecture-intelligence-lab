import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../auth/auth.store';

type LabNavItem = {
  label: string;
  route: string;
  description: string;
  permission: string | string[];
};

@Component({
  standalone: true,
  selector: 'app-lab-shell',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
  ],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.scss',
})
export class LabShellComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly currentUser = this.authStore.currentUser;
  protected readonly visibleNavItems = computed(() =>
    this.currentUser()
      ? this.navItems.filter((item) =>
          this.asPermissions(item.permission).some((permission) =>
            this.authStore.hasPermission(permission),
          ),
        )
      : [],
  );

  protected readonly navItems: LabNavItem[] = [
    {
      label: 'Architecture Flow',
      route: '/lab/architecture-flow',
      description: 'System graph',
      permission: 'dashboard:view',
    },
    {
      label: 'Dashboard',
      route: '/lab/dashboard',
      description: 'Loan workspace',
      permission: 'dashboard:view',
    },
    {
      label: 'Capital Markets',
      route: '/lab/capital-markets',
      description: 'Security commitments and disclosure sample',
      permission: 'loans:view',
    },
    {
      label: 'Security Search',
      route: '/lab/security-search',
      description: 'Lazy security and disclosure table',
      permission: 'loans:view',
    },
    {
      label: 'Map Inspector',
      route: '/lab/map-inspector',
      description: 'Map and Set indexes',
      permission: 'dashboard:view',
    },
    {
      label: 'SignalStore Inspector',
      route: '/lab/signal-store-inspector',
      description: 'Computed state',
      permission: 'diagnostics:view',
    },
    {
      label: 'Backend Comparison',
      route: '/lab/backend-comparison',
      description: 'Spring, Nest, proxy',
      permission: ['backend-comparison:view', 'realtime:view'],
    },
    {
      label: 'Infrastructure Status',
      route: '/lab/infrastructure',
      description: 'Docker and tooling health',
      permission: ['diagnostics:view', 'admin:view'],
    },
    {
      label: 'Realtime Lab',
      route: '/lab/realtime',
      description: 'Socket.IO and Redis',
      permission: 'realtime:view',
    },
    {
      label: 'OpenAPI Contract Lab',
      route: '/lab/openapi',
      description: 'Contracts and clients',
      permission: 'contracts:view',
    },
    {
      label: 'MCP Dashboard',
      route: '/lab/mcp',
      description: 'Angular CLI MCP',
      permission: 'mcp:view',
    },
    {
      label: 'Admin Security Monitoring',
      route: '/lab/admin',
      description: 'OpenAPI security and permission status',
      permission: 'admin:view',
    },
    {
      label: 'Phase 6.5 Threat Model',
      route: '/lab/security-threat-model',
      description: 'Open the Phase 6.5 OpenAPI threat model artifact',
      permission: 'admin:view',
    },
    {
      label: 'Phase 6.5 Security Risk Map',
      route: '/lab/security-risk-map',
      description: 'Open the Phase 6.5 security risk map artifact',
      permission: 'admin:view',
    },
  ];

  private asPermissions(permission: string | string[]): string[] {
    return Array.isArray(permission) ? permission : [permission];
  }
}
