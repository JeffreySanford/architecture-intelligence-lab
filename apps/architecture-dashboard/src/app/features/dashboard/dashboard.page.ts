import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { DashboardStore } from '../../core/dashboard/dashboard.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe, MatCardModule, MatChipsModule, MatTableModule],
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
