import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AuthStore } from '../../core/auth/auth.store';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

@Component({
  standalone: true,
  selector: 'app-map-inspector-page',
  imports: [CommonModule, FormsModule, InputTextModule, CardModule, TableModule],
  templateUrl: './map-inspector.page.html',
  styleUrl: './map-inspector.page.scss',
})
export class MapInspectorPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authStore = inject(AuthStore);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly globalFilter = signal('');
  protected rowsPerPageOptions: number[] = [5, 10, 25];

  protected readonly filteredRows = computed(() => {
    const filterText = this.globalFilter().trim().toLowerCase();

    return this.dashboardStore.mapInspectorRows().filter((row) =>
      !filterText ||
      [row.indexName, row.key, row.value].some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  ngOnInit(): void {
    if (!this.dashboardStore.snapshot()) {
      this.dashboardStore
        .loadSnapshot('small')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }
}
