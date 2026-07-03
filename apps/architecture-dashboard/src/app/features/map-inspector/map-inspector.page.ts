import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AuthStore } from '../../core/auth/auth.store';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

@Component({
  standalone: true,
  selector: 'app-map-inspector-page',
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './map-inspector.page.html',
  styleUrl: './map-inspector.page.scss',
})
export class MapInspectorPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authStore = inject(AuthStore);
  protected readonly dashboardStore = inject(DashboardStore);

  ngOnInit(): void {
    if (!this.dashboardStore.snapshot()) {
      this.dashboardStore
        .loadSnapshot('small')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }
}
