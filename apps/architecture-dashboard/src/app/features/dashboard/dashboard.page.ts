import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DashboardStore, type BackendMode, type DatasetSize } from '../../core/dashboard/dashboard.store';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, CurrencyPipe, FormsModule, InputTextModule, CardModule, ChipModule, TableModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly globalFilter = signal('');
  protected readonly explainMode = this.dashboardStore.explainMode;
  protected rowsPerPageOptions: number[] = [5, 10, 25];

  @ViewChild('dashboardChart', { static: true })
  private readonly dashboardChart?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'bar', number[], string>;

  protected readonly chartLabels = computed(() => this.dashboardStore.loanCards().map((loan) => loan.loanNumber));
  protected readonly chartData = computed(() => this.dashboardStore.loanCards().map((loan) => loan.amount));

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

    const queryExplain = this.route.snapshot.queryParamMap.get('explain');
    if (queryExplain === 'true') {
      this.dashboardStore.explainMode.set(true);
    } else if (queryExplain === 'false') {
      this.dashboardStore.explainMode.set(false);
    }

    this.dashboardStore
      .loadSnapshot(this.dashboardStore.selectedDataset())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.createChart();
    effect(
      () => {
        if (!this.chart) {
          return;
        }

        this.chart.data.labels = this.chartLabels();
        this.chart.data.datasets[0].data = this.chartData();
        this.chart.update();
      },
      { injector: this.injector },
    );
  }

  private createChart(): void {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Title, Tooltip);

    const canvas = this.dashboardChart?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const prefersReducedMotion = this.prefersReducedMotion();
    if (prefersReducedMotion) {
      canvas.dataset['prefersReducedMotion'] = 'true';
    }

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: this.chartLabels(),
        datasets: [
          {
            label: 'Loan amount',
            data: this.chartData(),
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: prefersReducedMotion ? false : { duration: 420, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Loan Amounts by Loan Number',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Loan Number',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount',
            },
            ticks: {
              callback: (value) => `$${value}`,
            },
          },
        },
      },
    };

    this.chart = new Chart(context, config);
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }
}
