import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthResetService } from './core/auth/auth-reset.service';
import { AuthStore } from './core/auth/auth.store';
import { visibleLabNavItems } from './core/shell/navigation';

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

  readonly visibleNavItems = computed(() =>
    this.currentUser() && !this.isLandingRoute()
      ? visibleLabNavItems(this.currentUser(), this.authStore.hasPermission.bind(this.authStore))
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
