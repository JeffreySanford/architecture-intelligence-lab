import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AuthStore } from '../../core/auth/auth.store';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

@Component({
  selector: 'app-map-inspector-page',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './map-inspector.page.html',
  styleUrl: './map-inspector.page.scss',
})
export class MapInspectorPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authStore = inject(AuthStore);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly displayedColumns = ['indexName', 'key', 'value'];

  ngOnInit(): void {
    if (!this.dashboardStore.snapshot()) {
      this.dashboardStore
        .loadSnapshot('small')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }
}
