import { ActivatedRoute } from '@angular/router';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DashboardStore, type BackendMode, type DatasetSize } from '../../core/dashboard/dashboard.store';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, CurrencyPipe, FormsModule, InputTextModule, CardModule, ChipModule, TableModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly globalFilter = signal('');
  protected rowsPerPageOptions: number[] = [5, 10, 25];

  protected readonly filteredLoanCards = computed(() => {
    const filterText = this.globalFilter().trim().toLowerCase();

    return this.dashboardStore.loanCards().filter((loan) => {
      return (
        !filterText ||
        [loan.loanNumber, loan.borrowerName, loan.statusLabel, loan.riskBand]
          .some((value) => value.toLowerCase().includes(filterText))
      );
    });
  });

  protected readonly displayedColumns = [
    'loanNumber',
    'borrowerName',
    'amount',
    'statusLabel',
    'documentCount',
    'riskBand',
  ];

  ngOnInit(): void {
    const queryDataset = this.route.snapshot.queryParamMap.get('dataset') as DatasetSize | null;
    const queryBackend = this.route.snapshot.queryParamMap.get('backend') as BackendMode | null;

    if (queryDataset && ['small', 'medium', 'large', 'stress'].includes(queryDataset)) {
      this.dashboardStore.selectedDataset.set(queryDataset);
    }

    if (queryBackend && ['spring-direct', 'nest-direct', 'nest-proxy', 'compare-all'].includes(queryBackend)) {
      this.dashboardStore.selectedBackendMode.set(queryBackend);
    }

    this.dashboardStore
      .loadSnapshot(this.dashboardStore.selectedDataset())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
