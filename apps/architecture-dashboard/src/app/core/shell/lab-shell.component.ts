import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../auth/auth.store';

type LabNavItem = {
  label: string;
  route: string;
  description: string;
  permission?: string;
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
    this.navItems.filter(
      (item) => !item.permission || this.authStore.hasPermission(item.permission),
    ),
  );

  protected readonly navItems: LabNavItem[] = [
    {
      label: 'Architecture Flow',
      route: '/lab/architecture-flow',
      description: 'System graph',
    },
    {
      label: 'Dashboard',
      route: '/lab/dashboard',
      description: 'Loan workspace',
    },
    {
      label: 'Map Inspector',
      route: '/lab/map-inspector',
      description: 'Map and Set indexes',
    },
    {
      label: 'SignalStore Inspector',
      route: '/lab/signal-store-inspector',
      description: 'Computed state',
    },
    {
      label: 'Backend Comparison',
      route: '/lab/backend-comparison',
      description: 'Spring, Nest, proxy',
      permission: 'backend-comparison:view',
    },
    {
      label: 'Infrastructure Status',
      route: '/lab/infrastructure',
      description: 'Docker and tooling health',
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
      label: 'Admin And Persona Lab',
      route: '/lab/admin',
      description: 'Roles and permissions',
      permission: 'admin:view',
    },
  ];
}
