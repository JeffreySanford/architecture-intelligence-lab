import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from './core/auth/auth.store';

type AppNavItem = {
  label: string;
  route: string;
  description: string;
  permission: string | string[];
};

type PageChrome = {
  title: string;
  eyebrow: string;
  description: string;
};

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authStore.currentUser;
  readonly currentUrl = signal(this.router.url);
  readonly pageChrome = signal<PageChrome>({
    title: 'Architecture Intelligence Lab',
    eyebrow: 'Training workspace',
    description: 'Select a persona, inspect architecture flows, and compare full-stack runtime paths.',
  });
  readonly currentYear = new Date().getFullYear();

  readonly navItems: AppNavItem[] = [
    {
      label: 'Dashboard',
      route: '/lab/dashboard',
      description: 'Loan workspace',
      permission: 'dashboard:view',
    },
    {
      label: 'Security Search',
      route: '/lab/security-search',
      description: 'Security and disclosure table',
      permission: 'loans:view',
    },
    {
      label: 'Capital Markets',
      route: '/lab/capital-markets',
      description: 'Commitment sample',
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
      label: 'Architecture Flow',
      route: '/lab/architecture-flow',
      description: 'Backend request paths',
      permission: 'dashboard:view',
    },
    {
      label: 'Backend Comparison',
      route: '/lab/backend-comparison',
      description: 'Spring, Nest, proxy',
      permission: ['backend-comparison:view', 'realtime:view'],
    },
    {
      label: 'Infrastructure',
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
      label: 'OpenAPI',
      route: '/lab/openapi',
      description: 'Contracts and clients',
      permission: 'contracts:view',
    },
    {
      label: 'Admin',
      route: '/lab/admin',
      description: 'Roles and personas',
      permission: 'admin:view',
    },
  ];

  readonly visibleNavItems = computed(() =>
    this.currentUser() && !this.isLandingRoute()
      ? this.navItems.filter((item) =>
          this.asPermissions(item.permission).some((permission) =>
            this.authStore.hasPermission(permission),
          ),
        )
      : [],
  );

  readonly isLandingRoute = computed(() => this.currentUrl() === '/');

  ngOnInit(): void {
    this.updateChrome();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.updateChrome();
      });
  }

  private updateChrome(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.data;
    this.pageChrome.set({
      title: (data['title'] as string | undefined) ?? 'Architecture Intelligence Lab',
      eyebrow: (data['eyebrow'] as string | undefined) ?? 'Training workspace',
      description:
        (data['description'] as string | undefined) ??
        'Select a persona, inspect architecture flows, and compare full-stack runtime paths.',
    });
  }

  private asPermissions(permission: string | string[]): string[] {
    return Array.isArray(permission) ? permission : [permission];
  }
}
