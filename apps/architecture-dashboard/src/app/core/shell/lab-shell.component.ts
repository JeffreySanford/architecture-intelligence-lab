import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../auth/auth.store';
import { permissionRequirementMatches, type PermissionRequirement } from '../auth/permission.utils';

type LabNavItem = {
  label: string;
  route: string;
  description: string;
  permission: PermissionRequirement;
  icon: string;
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
          permissionRequirementMatches(
            this.authStore.hasPermission.bind(this.authStore),
            item.permission,
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
      icon: 'pi pi-sitemap',
    },
    {
      label: 'Dashboard',
      route: '/lab/dashboard',
      description: 'Loan workspace',
      permission: 'dashboard:view',
      icon: 'pi pi-chart-bar',
    },
    {
      label: 'Capital Markets',
      route: '/lab/capital-markets',
      description: 'Security commitments and disclosure sample',
      permission: 'loans:view',
      icon: 'pi pi-briefcase',
    },
    {
      label: 'Security Search',
      route: '/lab/security-search',
      description: 'Lazy security and disclosure table',
      permission: 'loans:view',
      icon: 'pi pi-search',
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
      label: 'Backend Comparison',
      route: '/lab/backend-comparison',
      description: 'Spring, Nest, proxy',
      permission: ['backend-comparison:view', 'realtime:view'],
      icon: 'pi pi-sync',
    },
    {
      label: 'Infrastructure Status',
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
      label: 'OpenAPI Contract Lab',
      route: '/lab/openapi',
      description: 'Contracts and clients',
      permission: 'contracts:view',
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
      label: 'Admin Security Monitoring',
      route: '/lab/admin',
      description: 'OpenAPI security and permission status',
      permission: 'admin:view',
      icon: 'pi pi-shield',
    },
    {
      label: 'Phase 6.5 Threat Model',
      route: '/lab/security-threat-model',
      description: 'Open the Phase 6.5 OpenAPI threat model artifact',
      permission: 'admin:view',
      icon: 'pi pi-exclamation-triangle',
    },
    {
      label: 'Phase 6.5 Security Risk Map',
      route: '/lab/security-risk-map',
      description: 'Open the Phase 6.5 security risk map artifact',
      permission: 'admin:view',
      icon: 'pi pi-map',
    },
  ];

}
