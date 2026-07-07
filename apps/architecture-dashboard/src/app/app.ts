import { Component, DestroyRef, ElementRef, OnInit, AfterViewInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
export class App implements OnInit, AfterViewInit {
  @ViewChild('brandLogo', { static: true }) private readonly brandLogo?: ElementRef<HTMLImageElement>;

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

  readonly hasNavItems = computed(() => this.visibleNavItems().length > 0);
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

  ngAfterViewInit(): void {
    console.log('Brand logo element detected:', this.brandLogo?.nativeElement?.src ?? 'MISSING');
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

}
