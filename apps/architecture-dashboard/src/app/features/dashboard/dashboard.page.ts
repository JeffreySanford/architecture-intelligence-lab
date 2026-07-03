import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, CurrencyPipe, CardModule, ChipModule, TableModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly displayedColumns = [
    'loanNumber',
    'borrowerName',
    'amount',
    'statusLabel',
    'documentCount',
    'riskBand',
  ];

  ngOnInit(): void {
    this.dashboardStore
      .loadSnapshot('small')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
