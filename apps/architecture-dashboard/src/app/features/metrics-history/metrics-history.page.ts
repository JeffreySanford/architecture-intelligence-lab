import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  NestApiFacade,
  type BackendComparisonResponseDto,
  type ComparisonHistory,
  type ComparisonHistorySummary,
  type ComparisonStatus,
} from '../../core/api/nest-api.facade';
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
  selector: 'app-metrics-history-page',
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule, TableModule, TagModule],
  templateUrl: './metrics-history.page.html',
  styleUrl: './metrics-history.page.scss',
})
export class MetricsHistoryPage implements OnInit, AfterViewInit {
  private readonly nestApi = inject(NestApiFacade);

  @ViewChild('latencyChart', { static: true })
  private readonly latencyChart?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'bar', number[], string>;

  protected readonly history = signal<ComparisonHistory | null>(null);
  protected readonly loading = signal(false);
  protected readonly capturing = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly filterText = signal('');
  protected readonly rowsPerPageOptions = [5, 10, 20];

  protected readonly summaryRows = computed(() => this.history()?.summary ?? []);
  protected readonly filteredSamples = computed(() => {
    const text = this.filterText().trim().toLowerCase();
    const samples = this.history()?.samples ?? [];

    if (!text) {
      return samples;
    }

    return samples.filter((sample) =>
      [sample.mode, sample.subject, sample.observedAt, ...sample.paths.map((path) => `${path.label} ${path.status}`)]
        .join(' ')
        .toLowerCase()
        .includes(text),
    );
  });
  protected readonly latestSample = computed(() => this.history()?.samples[0] ?? null);
  protected readonly sampleCount = computed(() => this.history()?.sampleCount ?? 0);

  constructor() {
    effect(() => this.updateChart());
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.updateChart();
  }

  protected loadHistory(): void {
    this.loading.set(true);
    this.error.set(null);

    this.nestApi
      .getLoanComparisonHistory()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (history) => this.history.set(history),
        error: () => {
          this.history.set(null);
          this.error.set('Historical comparison metrics are unavailable. Run Docker compose and capture a sample.');
        },
      });
  }

  protected captureSample(): void {
    this.capturing.set(true);
    this.error.set(null);

    this.nestApi
      .getLoanComparison()
      .pipe(
        switchMap(() => this.nestApi.getLoanComparisonHistory()),
        finalize(() => this.capturing.set(false)),
      )
      .subscribe({
        next: (history) => this.history.set(history),
        error: () => this.error.set('Unable to capture a new live comparison sample.'),
      });
  }

  protected statusSeverity(status: ComparisonStatus): 'success' | 'warn' | 'danger' {
    if (status === 'ok') {
      return 'success';
    }

    return status === 'warning' ? 'warn' : 'danger';
  }

  protected pathSummary(sample: BackendComparisonResponseDto): string {
    return sample.paths.map((path) => `${path.label}: ${path.status}`).join(', ');
  }

  protected maxAverageLatency(): number {
    return Math.max(...this.summaryRows().map((row: ComparisonHistorySummary) => row.averageLatencyMs), 1);
  }

  private createChart(): void {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Title, Tooltip);

    const canvas = this.latencyChart?.nativeElement;
    const context = canvas?.getContext('2d');
    if (!context) {
      return;
    }

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: this.summaryRows().map((row) => row.label),
        datasets: [
          {
            label: 'Average latency ms',
            data: this.summaryRows().map((row) => row.averageLatencyMs),
            backgroundColor: '#355f9f',
            borderColor: '#2563eb',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: this.prefersReducedMotion() ? false : { duration: 320, easing: 'easeOutQuart' },
        plugins: {
          title: {
            display: true,
            text: 'Average latency by backend path',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Latency ms',
            },
          },
        },
      },
    };

    this.chart = new Chart(context, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    this.chart.data.labels = this.summaryRows().map((row) => row.label);
    this.chart.data.datasets[0].data = this.summaryRows().map((row) => row.averageLatencyMs);
    this.chart.update();
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }
}
