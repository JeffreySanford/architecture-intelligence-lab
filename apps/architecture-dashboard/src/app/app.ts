import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthResetService } from './core/auth/auth-reset.service';
import { AuthStore } from './core/auth/auth.store';
import { permissionRequirementMatches, type PermissionRequirement } from './core/auth/permission.utils';

type AppNavItem = {
  label: string;
  route: string;
  description: string;
  permission: PermissionRequirement;
  icon: string;
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
  private readonly authResetService = inject(AuthResetService);
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
      icon: 'pi pi-chart-bar',
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
      label: 'Admin',
      route: '/lab/admin',
      description: 'Roles and personas',
      permission: 'admin:view',
      icon: 'pi pi-shield',
    },
  ];

  readonly visibleNavItems = computed(() =>
    this.currentUser() && !this.isLandingRoute()
      ? this.navItems.filter((item) =>
          permissionRequirementMatches(
            this.authStore.hasPermission.bind(this.authStore),
            item.permission,
          ),
        )
      : [],
  );

  readonly isLandingRoute = computed(() => this.currentUrl() === '/');

  ngOnInit(): void {
    this.markBrowserUnloadForReloadDetection();

    const currentPath = window.location.pathname;
    if (this.isReloadNavigation() && currentPath !== '/') {
      this.authResetService.resetAuth();
      return;
    }

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

  private isReloadNavigation(): boolean {
    if (this.consumeReloadMarker()) {
      return true;
    }

    if (typeof performance === 'undefined') {
      return false;
    }

    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0] as PerformanceNavigationTiming;
      return entry.type === 'reload';
    }

    const nav = (performance as unknown as { navigation?: { type: number } }).navigation;
    return nav?.type === 1;
  }

  private markBrowserUnloadForReloadDetection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const markUnloadPath = () => {
      try {
        window.sessionStorage.setItem('lab:browser-unload-path', window.location.pathname);
      } catch {
        // ignore storage access failures in constrained environments
      }
    };

    window.addEventListener('beforeunload', markUnloadPath, { once: true });
    window.addEventListener('pagehide', markUnloadPath, { once: true });
  }

  private consumeReloadMarker(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const marker = window.sessionStorage.getItem('lab:browser-unload-path');
      window.sessionStorage.removeItem('lab:browser-unload-path');
      return marker === window.location.pathname;
    } catch {
      return false;
    }
  }

}
