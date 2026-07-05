import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as d3 from 'd3';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/auth/auth.store';
import { RealtimeSocketService } from '../../core/realtime-socket/realtime-socket.service';
import { DashboardStore, type BackendMode } from '../../core/dashboard/dashboard.store';
import {
  BackendComparisonMetricDto,
  ComparisonPathId,
  GatewayLoanReadDto,
  NestApiFacade,
  RealtimeEventDto,
} from '../../core/api/nest-api.facade';

type PhaseStatus = 'planned' | 'ready' | 'blocked';

interface PhaseItem {
  label: string;
  area: string;
  permission: string;
  status: PhaseStatus;
  roleAccess: string[];
}

interface AccessRow {
  role: string;
  persona: string;
  permissions: string[];
  access: string;
}

interface FlowNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: 'client' | 'spring' | 'nest' | 'redis' | 'docs';
}

interface FlowLink extends d3.SimulationLinkDatum<FlowNode> {
  label: string;
  pathId?: ComparisonPathId | 'socket-event' | 'redis-adapter' | 'swagger-docs';
}

@Component({
  selector: 'app-phase-five-page',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, ChipModule, TableModule, TagModule],
  templateUrl: './phase-five.page.html',
  styleUrl: './phase-five.page.scss',
})
export class PhaseFivePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flowGraph', { static: true })
  private readonly flowGraph?: ElementRef<SVGSVGElement>;
  @ViewChild('comparisonChart', { static: true })
  private readonly comparisonChart?: ElementRef<SVGSVGElement>;

  private readonly authStore = inject(AuthStore);
  private readonly dashboardStore = inject(DashboardStore);
  private readonly nestApi = inject(NestApiFacade);
  private readonly realtimeSocket = inject(RealtimeSocketService);
  private readonly destroyRef = inject(DestroyRef);
  private resizeFrame = 0;
  private simulation?: d3.Simulation<FlowNode, FlowLink>;
  private socket?: ReturnType<RealtimeSocketService['createRealtimeSocket']>;

  protected readonly comparisonMetrics = signal<BackendComparisonMetricDto[]>([]);
  protected readonly comparisonError = signal<string | null>(null);
  protected readonly comparisonLoading = signal(false);
  protected readonly selectedComparisonPath = signal<ComparisonPathId | null>(null);
  protected readonly realtimeEvents = signal<RealtimeEventDto[]>([]);
  protected readonly realtimeError = signal<string | null>(null);
  protected readonly realtimeLoading = signal(false);
  protected readonly realtimeEmitLoading = signal(false);
  protected readonly highlightedRealtimeEventId = signal<string | null>(null);
  protected readonly socketConnected = signal(false);
  protected readonly socketError = signal<string | null>(null);
  protected readonly realtimeReadsLoading = signal(false);
  protected readonly nestDirectReads = signal<GatewayLoanReadDto | null>(null);
  protected readonly nestProxyReads = signal<GatewayLoanReadDto | null>(null);
  protected readonly selectedDataset = this.dashboardStore.selectedDataset;
  protected readonly selectedBackendMode = this.dashboardStore.selectedBackendMode;
  protected readonly explainMode = this.dashboardStore.explainMode;
  protected readonly currentUser = this.authStore.currentUser;
  protected readonly canViewComparison = computed(() =>
    this.authStore.hasPermission('backend-comparison:view'),
  );
  protected readonly canViewRealtime = computed(() =>
    this.authStore.hasPermission('realtime:view'),
  );
  protected readonly canEmitRealtime = computed(() =>
    this.authStore.hasPermission('realtime:emit'),
  );

  protected readonly canViewContracts = computed(() =>
    this.authStore.hasPermission('contracts:view'),
  );

  protected readonly swaggerUrl = '/gateway/swagger';

  protected readonly socketStatusLabel = computed(() =>
    this.socketConnected() ? 'Socket.IO connected' : 'Socket.IO disconnected',
  );

  protected readonly socketStatusSeverity = computed(() =>
    this.socketConnected() ? 'success' : this.socketError() ? 'warn' : 'info',
  );

  protected readonly deliverables: PhaseItem[] = [
    {
      label: 'Direct read endpoints',
      area: 'Spring direct and Nest direct',
      permission: 'backend-comparison:view',
      status: 'planned',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label: 'Proxy endpoints',
      area: 'Nest proxy to Spring',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label: 'Comparison endpoint',
      area: 'Spring direct vs Nest direct vs Nest proxy',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label: 'Socket.IO gateway',
      area: 'Realtime loan event stream',
      permission: 'realtime:view',
      status: 'ready',
      roleAccess: ['Realtime Operator'],
    },
    {
      label: 'Redis adapter',
      area: 'Socket.IO scale-out transport',
      permission: 'realtime:view',
      status: 'ready',
      roleAccess: ['Realtime Operator'],
    },
    {
      label: 'Nest Swagger UI',
      area: 'Gateway contract inspection',
      permission: 'contracts:view',
      status: 'ready',
      roleAccess: ['Contract Admin'],
    },
  ];

  protected readonly acceptanceCriteria: PhaseItem[] = [
    {
      label:
        'Spring direct, Nest direct, and Nest proxy can be compared in the same topology view.',
      area: 'Comparison workflow',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label:
        'A comparison endpoint exposes live metrics for Spring direct, Nest direct, and Nest proxy paths.',
      area: 'Comparison metrics',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label:
        'A Socket.IO gateway endpoint emits realtime event messages that update the Phase 5 visualization.',
      area: 'Realtime workflow',
      permission: 'realtime:emit',
      status: 'ready',
      roleAccess: ['Realtime Operator'],
    },
    {
      label:
        'A live Socket.IO browser client appends gateway events to the Phase 5 history.',
      area: 'Realtime workflow',
      permission: 'realtime:view',
      status: 'ready',
      roleAccess: ['Realtime Operator'],
    },
    {
      label:
        'Comparison metrics update the PrimeNG status tables and D3 request path state.',
      area: 'Visualization binding',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
    {
      label:
        'Socket.IO event history updates the realtime portion of the Phase 5 visualization.',
      area: 'Realtime history',
      permission: 'realtime:view',
      status: 'ready',
      roleAccess: ['Realtime Operator'],
    },
    {
      label:
        'Local proxy uses localhost:18080 and Docker uses SPRING_API_TARGET=http://spring-api:8080.',
      area: 'Runtime routing',
      permission: 'backend-comparison:view',
      status: 'ready',
      roleAccess: ['Diagnostics Admin'],
    },
  ];

  protected readonly accessRows: AccessRow[] = [
    {
      role: 'Diagnostics Admin',
      persona: 'Ethan Diagnostics Admin',
      permissions: ['backend-comparison:view', 'diagnostics:view', 'realtime:view'],
      access: 'Comparison, direct reads, proxy diagnostics',
    },
    {
      role: 'Realtime Operator',
      persona: 'Grace Realtime Operator',
      permissions: ['realtime:view', 'realtime:emit'],
      access: 'Realtime lab, Socket.IO event trigger',
    },
    {
      role: 'Contract Admin',
      persona: 'Fiona Contract Admin / Owen API Admin',
      permissions: ['contracts:view'],
      access: 'Nest Swagger UI and API contract checks',
    },
    {
      role: 'Admin',
      persona: 'Diana Admin / Morgan Platform Admin / Nora Security Admin',
      permissions: ['admin:view'],
      access: 'Admin persona lab only; no Phase 5 diagnostics permission yet',
    },
    {
      role: 'Viewer, Reviewer, Approver, Auditor',
      persona: 'General learning personas',
      permissions: ['dashboard:view'],
      access: 'No Phase 5 route access',
    },
    {
      role: 'MCP Explorer',
      persona: 'Henry MCP Explorer',
      permissions: ['developer:view', 'mcp:view'],
      access: 'Developer Glossary and MCP Dashboard access only; no Phase 5 diagnostics permission',
    },
  ];

  protected readonly visibleDeliverables = computed(() =>
    this.deliverables.filter((item) =>
      this.authStore.hasPermission(item.permission),
    ),
  );

  protected rowsPerPageOptions: number[] = [5, 10, 25];
  protected readonly comparisonFilter = signal('');
  protected readonly realtimeFilter = signal('');
  protected readonly deliverablesFilter = signal('');
  protected readonly acceptanceCriteriaFilter = signal('');
  protected readonly accessRowsFilter = signal('');

  protected readonly filteredComparisonMetrics = computed(() => {
    const filterText = this.comparisonFilter().trim().toLowerCase();
    return this.comparisonMetrics().filter((row) =>
      !filterText ||
      [row.label, row.latencyMs.toString(), row.payloadBytes.toString(), row.recordCount.toString(), row.status, row.observedAt]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly filteredRealtimeEvents = computed(() => {
    const filterText = this.realtimeFilter().trim().toLowerCase();
    return this.realtimeEvents().filter((event) =>
      !filterText ||
      [event.type, event.loanNumber, event.previousStatus, event.nextStatus, event.source, event.observedAt]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly filteredDeliverables = computed(() => {
    const filterText = this.deliverablesFilter().trim().toLowerCase();
    return this.visibleDeliverables().filter((item) =>
      !filterText ||
      [item.label, item.area, item.permission, item.status]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly filteredAcceptanceCriteria = computed(() => {
    const filterText = this.acceptanceCriteriaFilter().trim().toLowerCase();
    return this.acceptanceCriteria.filter((item) =>
      !filterText ||
      [item.label, item.area, item.permission, item.status, item.roleAccess.join(', ')]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly filteredAccessRows = computed(() => {
    const filterText = this.accessRowsFilter().trim().toLowerCase();
    return this.accessRows.filter((row) =>
      !filterText ||
      [row.role, row.persona, row.permissions.join(', '), row.access]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly loanReadFilter = signal('');

  protected readonly liveLoanReadRows = computed(() => {
    const rows: Array<{
      pathId: ComparisonPathId;
      label: string;
      mode: string;
      recordCount: number;
      errorMessage: string;
      observedAt: string;
    }> = [];

    const direct = this.nestDirectReads();
    const proxy = this.nestProxyReads();

    if (direct) {
      rows.push({
        pathId: direct.pathId,
        label: 'Nest direct',
        mode: direct.mode,
        recordCount: direct.recordCount,
        errorMessage: direct.errorMessage ?? '',
        observedAt: direct.observedAt,
      });
    }

    if (proxy) {
      rows.push({
        pathId: proxy.pathId,
        label: 'Nest proxy',
        mode: proxy.mode,
        recordCount: proxy.recordCount,
        errorMessage: proxy.errorMessage ?? '',
        observedAt: proxy.observedAt,
      });
    }

    if (!this.realtimeReadsLoading() && this.canViewComparison()) {
      if (!direct) {
        rows.push({
          pathId: 'nest-direct',
          label: 'Nest direct',
          mode: 'degraded',
          recordCount: 0,
          errorMessage: 'Live direct reads are unavailable.',
          observedAt: '',
        });
      }

      if (!proxy) {
        rows.push({
          pathId: 'nest-proxy',
          label: 'Nest proxy',
          mode: 'degraded',
          recordCount: 0,
          errorMessage: 'Live proxy reads are unavailable.',
          observedAt: '',
        });
      }
    }

    return rows;
  });

  protected readonly filteredLoanReadRows = computed(() => {
    const filterText = this.loanReadFilter().trim().toLowerCase();
    const rows = this.liveLoanReadRows();

    return rows.filter((row) =>
      !filterText ||
      [row.label, row.pathId, row.mode, row.recordCount.toString(), row.errorMessage, row.observedAt]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  ngOnInit(): void {
    this.loadComparisonMetrics();
    this.loadRealtimeHistory();
    this.loadLiveLoanReads();
    this.connectRealtimeSocket();
  }

  ngAfterViewInit(): void {
    this.renderFlowGraph();
    this.renderComparisonChart();
  }

  ngOnDestroy(): void {
    this.simulation?.stop();
    if (this.resizeFrame) {
      cancelAnimationFrame(this.resizeFrame);
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
    }
  }

  @HostListener('window:resize')
  protected queueGraphRender(): void {
    if (this.resizeFrame) {
      cancelAnimationFrame(this.resizeFrame);
    }

    this.resizeFrame = requestAnimationFrame(() => {
      this.renderFlowGraph();
      this.renderComparisonChart();
    });
  }

  protected statusSeverity(status: PhaseStatus): 'info' | 'success' | 'warn' {
    if (status === 'ready') {
      return 'success';
    }

    return status === 'blocked' ? 'warn' : 'info';
  }

  protected hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.authStore.hasPermission(permission));
  }

  protected selectComparisonPath(pathId: ComparisonPathId): void {
    this.selectedComparisonPath.set(pathId);
    this.renderFlowGraph();
    this.renderComparisonChart();
  }

  protected loadComparisonMetrics(): void {
    if (!this.canViewComparison()) {
      return;
    }

    this.comparisonLoading.set(true);
    this.comparisonError.set(null);

    this.nestApi
      .getLoanComparison()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.comparisonMetrics.set(response.paths);
          this.selectedComparisonPath.set(
            this.initialComparisonPath(response.paths, this.selectedBackendMode()),
          );
          this.comparisonLoading.set(false);
          this.renderFlowGraph();
          this.renderComparisonChart();
        },
        error: () => {
          this.comparisonMetrics.set([]);
          this.selectedComparisonPath.set(null);
          this.comparisonError.set(
            'Nest comparison metrics are unavailable. Start nest-api or use Docker compose to populate this table.',
          );
          this.comparisonLoading.set(false);
          this.renderFlowGraph();
          this.renderComparisonChart();
        },
      });
  }

  private renderComparisonChart(): void {
    const svgElement = this.comparisonChart?.nativeElement;

    if (!svgElement) {
      return;
    }

    const getCssVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '';

    const chartColors = {
      axis: getCssVar('--color-chart-axis') || '#374151',
      muted: getCssVar('--color-chart-muted') || '#5d6575',
      grid: getCssVar('--color-chart-grid') || '#cbd5e1',
      latency: getCssVar('--color-latency') || '#2563eb',
      payload: getCssVar('--color-payload') || '#7c3aed',
      records: getCssVar('--color-records') || '#15803d',
      surface: getCssVar('--color-surface') || '#ffffff',
    };

    const metrics = this.comparisonMetrics();
    const host = svgElement.parentElement;
    const width = Math.max(host?.clientWidth ?? 760, 360);
    const height = width < 680 ? 360 : 300;
    const margin = { top: 28, right: 24, bottom: 72, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const series = [
      { key: 'latencyMs', label: 'Latency ms', color: chartColors.latency },
      { key: 'payloadBytes', label: 'Payload bytes', color: chartColors.payload },
      { key: 'recordCount', label: 'Records', color: chartColors.records },
    ] as const;

    const prefersReducedMotion = this.prefersReducedMotion();
    svgElement.dataset['prefersReducedMotion'] = String(prefersReducedMotion);

    const svg = d3
      .select(svgElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr(
        'aria-label',
        'Grouped bar chart comparing latency, payload bytes, and record count for Spring direct, Nest direct, and Nest proxy',
      );

    svg.selectAll('*').remove();

    if (metrics.length === 0) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', chartColors.muted)
        .attr('font-size', 14)
        .text('No comparison metrics available');
      return;
    }

    const normalizedRows = metrics.flatMap((metric) =>
      series.map((item) => {
        const rawValue = Number(metric[item.key]);
        const maxForSeries = d3.max(metrics, (row) => Number(row[item.key])) ?? 1;

        return {
          pathId: metric.pathId,
          pathLabel: metric.label,
          series: item.label,
          rawValue,
          normalizedValue: maxForSeries > 0 ? rawValue / maxForSeries : 0,
          color: item.color,
        };
      }),
    );

    const xPath = d3
      .scaleBand<string>()
      .domain(metrics.map((metric) => metric.pathId))
      .range([0, innerWidth])
      .padding(0.24);

    const xSeries = d3
      .scaleBand<string>()
      .domain(series.map((item) => item.label))
      .range([0, xPath.bandwidth()])
      .padding(0.12);

    const y = d3.scaleLinear().domain([0, 1]).nice().range([innerHeight, 0]);
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xPath)
          .tickFormat((pathId) => metrics.find((metric) => metric.pathId === pathId)?.label ?? pathId),
      )
      .call((axis) => {
        axis.selectAll('path,line').attr('stroke', chartColors.grid);
        axis
          .selectAll('text')
          .attr('fill', chartColors.axis)
          .attr('font-size', 11)
          .attr('font-weight', 700);
      });

    chart
      .append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat((value) => `${Number(value) * 100}%`))
      .call((axis) => {
        axis.selectAll('path,line').attr('stroke', chartColors.grid);
        axis.selectAll('text').attr('fill', chartColors.muted).attr('font-size', 11);
      });

    chart
      .append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', chartColors.axis)
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .text('Normalized within each metric');

    const selectedPath = this.selectedComparisonPath();
    const barSelection = chart
      .selectAll<SVGRectElement, { pathId: ComparisonPathId; series: string }>('rect')
      .data(normalizedRows, (row) => `${row.pathId}-${row.series}`)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'phase-five__comparison-bar')
            .attr('x', (row) => (xPath(row.pathId) ?? 0) + (xSeries(row.series) ?? 0))
            .attr('y', innerHeight)
            .attr('width', xSeries.bandwidth())
            .attr('height', 0)
            .attr('rx', 4)
            .attr('fill', (row) => row.color)
            .attr('opacity', (row) => (row.pathId === selectedPath ? 1 : 0.64))
            .classed('phase-five__comparison-bar--selected', (row) => row.pathId === selectedPath)
            .call((enter) => {
              if (!prefersReducedMotion) {
                enter
                  .transition()
                  .duration(420)
                  .attr('y', (row) => y(row.normalizedValue))
                  .attr('height', (row) => innerHeight - y(row.normalizedValue));
              } else {
                enter
                  .attr('y', (row) => y(row.normalizedValue))
                  .attr('height', (row) => innerHeight - y(row.normalizedValue));
              }
            }),
        (update) =>
          update.call((update) => {
            update
              .attr('opacity', (row) => (row.pathId === selectedPath ? 1 : 0.64))
              .classed('phase-five__comparison-bar--selected', (row) => row.pathId === selectedPath);
            if (!prefersReducedMotion) {
              update
                .transition()
                .duration(320)
                .attr('x', (row) => (xPath(row.pathId) ?? 0) + (xSeries(row.series) ?? 0))
                .attr('y', (row) => y(row.normalizedValue))
                .attr('width', xSeries.bandwidth())
                .attr('height', (row) => innerHeight - y(row.normalizedValue));
            } else {
              update
                .attr('x', (row) => (xPath(row.pathId) ?? 0) + (xSeries(row.series) ?? 0))
                .attr('y', (row) => y(row.normalizedValue))
                .attr('width', xSeries.bandwidth())
                .attr('height', (row) => innerHeight - y(row.normalizedValue));
            }
          }),
        (exit) => exit.remove(),
      );

    barSelection.append('title').text((row) => `${row.pathLabel} ${row.series}: ${row.rawValue}`);

    chart
      .selectAll('text.phase-five__chart-value')
      .data(normalizedRows)
      .join('text')
      .attr('class', 'phase-five__chart-value')
      .attr('x', (row) => (xPath(row.pathId) ?? 0) + (xSeries(row.series) ?? 0) + xSeries.bandwidth() / 2)
      .attr('y', (row) => Math.max(y(row.normalizedValue) - 6, 10))
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', 10)
      .attr('font-weight', 700)
      .text((row) => this.formatChartValue(row.series, row.rawValue));

    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - 24})`);

    const legendItem = legend
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('transform', (_item, index) => `translate(${index * 150}, 0)`);

    legendItem
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 3)
      .attr('fill', (item) => item.color);

    legendItem
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('fill', chartColors.axis)
      .attr('font-size', 12)
      .text((item) => item.label);
  }

  private formatChartValue(series: string, value: number): string {
    if (series === 'Payload bytes') {
      return `${Math.round(value / 100) / 10}k`;
    }

    return String(value);
  }

  private initialComparisonPath(
    paths: BackendComparisonMetricDto[],
    backendMode: BackendMode,
  ): ComparisonPathId | null {
    if (backendMode === 'compare-all') {
      return paths[0]?.pathId ?? null;
    }

    return paths.some((path) => path.pathId === backendMode)
      ? backendMode
      : paths[0]?.pathId ?? null;
  }

  protected loadRealtimeHistory(): void {
    if (!this.canViewComparison() && !this.canViewRealtime()) {
      return;
    }

    this.realtimeLoading.set(true);
    this.realtimeError.set(null);

    this.nestApi
      .getRealtimeEventHistory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.realtimeEvents.set(response.events);
          this.realtimeLoading.set(false);
        },
        error: () => {
          this.realtimeEvents.set([]);
          this.realtimeError.set(
            'Nest realtime event history is unavailable. Start nest-api or use Docker compose to populate this table.',
          );
          this.realtimeLoading.set(false);
        },
      });
  }

  protected loadLiveLoanReads(): void {
    if (!this.canViewComparison()) {
      return;
    }

    this.realtimeReadsLoading.set(true);

    this.nestApi
      .getDirectLoanReads()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.nestDirectReads.set(response);
        },
        error: () => {
          this.nestDirectReads.set(null);
        },
      });

    this.nestApi
      .getProxyLoanReads()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.nestProxyReads.set(response);
          this.realtimeReadsLoading.set(false);
        },
        error: () => {
          this.nestProxyReads.set(null);
          this.realtimeReadsLoading.set(false);
        },
      });
  }

  protected emitRealtimeEvent(): void {
    if (!this.canEmitRealtime()) {
      return;
    }

    this.realtimeEmitLoading.set(true);
    this.realtimeError.set(null);

    this.nestApi
      .emitLoanStatusEvent({
        loanId: 'loan-001',
        loanNumber: 'TL-1001',
        previousStatus: 'Submitted',
        nextStatus: 'In Review',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          this.realtimeEvents.update((events) => [
            event,
            ...events.filter((existing) => existing.eventId !== event.eventId),
          ]);
          this.highlightedRealtimeEventId.set(event.eventId);
          setTimeout(() => this.highlightedRealtimeEventId.set(null), 1400);
          this.realtimeEmitLoading.set(false);
        },
        error: () => {
          this.realtimeError.set(
            'Nest realtime emit endpoint is unavailable. Start nest-api or use Docker compose before emitting events.',
          );
          this.realtimeEmitLoading.set(false);
        },
      });
  }

  private connectRealtimeSocket(): void {
    if (!this.canViewRealtime()) {
      return;
    }

    this.socketError.set(null);
    this.socket = this.realtimeSocket.createRealtimeSocket();

    this.socket.on('connect', () => {
      this.socketConnected.set(true);
    });

    this.socket.on('disconnect', () => {
      this.socketConnected.set(false);
    });

    this.socket.on('loan.status.updated', (event: RealtimeEventDto) => {
      this.realtimeEvents.update((events) => [event, ...events.filter((existing) => existing.eventId !== event.eventId)]);
      this.highlightedRealtimeEventId.set(event.eventId);
      setTimeout(() => this.highlightedRealtimeEventId.set(null), 1400);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.socketError.set(error.message ?? 'Socket connection failed.');
    });

    this.socket.open();
  }

  private renderFlowGraph(): void {
    const svgElement = this.flowGraph?.nativeElement;

    if (!svgElement) {
      return;
    }

    this.simulation?.stop();

    const host = svgElement.parentElement;
    const width = Math.max(host?.clientWidth ?? 760, 360);
    const height = width < 680 ? 430 : 360;
    const nodes: FlowNode[] = [
      { id: 'angular', label: 'Angular Phase 5 View', group: 'client' },
      { id: 'spring', label: 'Spring Direct Reads', group: 'spring' },
      { id: 'nest', label: 'Nest Direct API', group: 'nest' },
      { id: 'proxy', label: 'Nest Proxy', group: 'nest' },
      { id: 'compare', label: 'Comparison Endpoint', group: 'nest' },
      { id: 'socket', label: 'Socket.IO Gateway', group: 'nest' },
      { id: 'redis', label: 'Redis Adapter', group: 'redis' },
      { id: 'swagger', label: 'Nest Swagger UI', group: 'docs' },
    ];
    const links: FlowLink[] = [
      { source: 'angular', target: 'spring', label: 'direct', pathId: 'spring-direct' },
      { source: 'angular', target: 'nest', label: 'direct', pathId: 'nest-direct' },
      { source: 'angular', target: 'proxy', label: 'proxy', pathId: 'nest-proxy' },
      { source: 'spring', target: 'compare', label: 'baseline', pathId: 'spring-direct' },
      { source: 'nest', target: 'compare', label: 'candidate', pathId: 'nest-direct' },
      { source: 'proxy', target: 'compare', label: 'parity', pathId: 'nest-proxy' },
      { source: 'angular', target: 'socket', label: 'emit', pathId: 'socket-event' },
      { source: 'socket', target: 'redis', label: 'adapter', pathId: 'redis-adapter' },
      { source: 'nest', target: 'swagger', label: 'docs', pathId: 'swagger-docs' },
    ];

    const getCssVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '';

    const flowColors = {
      client: getCssVar('--color-flow-client') || '#2563eb',
      spring: getCssVar('--color-flow-spring') || '#15803d',
      nest: getCssVar('--color-flow-nest') || '#7c3aed',
      redis: getCssVar('--color-flow-redis') || '#dc2626',
      docs: getCssVar('--color-flow-docs') || '#b45309',
      link: getCssVar('--color-chart-flow-link') || '#b7c0d1',
      label: getCssVar('--color-text-muted') || '#4f5868',
      nodeStroke: getCssVar('--color-chart-node-stroke') || '#ffffff',
    };

    const color = d3
      .scaleOrdinal<FlowNode['group'], string>()
      .domain(['client', 'spring', 'nest', 'redis', 'docs'])
      .range([
        flowColors.client,
        flowColors.spring,
        flowColors.nest,
        flowColors.redis,
        flowColors.docs,
      ]);

    const prefersReducedMotion = this.prefersReducedMotion();
    svgElement.dataset['prefersReducedMotion'] = String(prefersReducedMotion);

    const svg = d3
      .select(svgElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr(
        'aria-label',
        'Phase 5 graph connecting Angular, Spring, Nest, Redis, Socket.IO, and Swagger',
      );

    svg.selectAll('*').remove();

    const linkGroup = svg
      .append('g')
      .attr('stroke', flowColors.link)
      .attr('stroke-width', 1.5);
    const labelGroup = svg.append('g').attr('fill', flowColors.label);
    const nodeGroup = svg.append('g');

    const link = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', flowColors.link)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (item) =>
        item.label === 'emit' || item.label === 'adapter' ? '5 5' : '0',
      );

    if (!prefersReducedMotion) {
      link
        .transition()
        .duration(260)
        .attr('stroke', (item) => this.linkStroke(item))
        .attr('stroke-width', (item) => this.linkStrokeWidth(item));
    } else {
      link
        .attr('stroke', (item) => this.linkStroke(item))
        .attr('stroke-width', (item) => this.linkStrokeWidth(item));
    }

    const linkLabel = labelGroup
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .attr('text-anchor', 'middle')
      .text((item) => item.label);

    const node = nodeGroup
      .selectAll('g')
      .data(nodes)
      .join('g');

    node
      .append('circle')
      .attr('r', 30)
      .attr('fill', (item) => color(item.group))
      .attr('stroke', flowColors.nodeStroke)
      .attr('stroke-width', 3);

    node
      .append('text')
      .attr('fill', '#ffffff')
      .attr('font-size', 10)
      .attr('font-weight', 700)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .selectAll('tspan')
      .data((item) => this.wrapLabel(item.label))
      .join('tspan')
      .attr('x', 0)
      .attr('dy', (_text, index) => (index === 0 ? '-0.3em' : '1.15em'))
      .text((text) => text);

    const fixedPositions = [
      [width * 0.18, height * 0.25],
      [width * 0.82, height * 0.25],
      [width * 0.18, height * 0.7],
      [width * 0.5, height * 0.7],
      [width * 0.82, height * 0.7],
      [width * 0.34, height * 0.12],
      [width * 0.15, height * 0.9],
      [width * 0.85, height * 0.12],
    ];

    if (prefersReducedMotion) {
      nodes.forEach((item, index) => {
        item.x = fixedPositions[index][0];
        item.y = fixedPositions[index][1];
      });

      link
        .attr('x1', (item) => this.nodeX(item.source))
        .attr('y1', (item) => this.nodeY(item.source))
        .attr('x2', (item) => this.nodeX(item.target))
        .attr('y2', (item) => this.nodeY(item.target));

      linkLabel
        .attr('x', (item) => (this.nodeX(item.source) + this.nodeX(item.target)) / 2)
        .attr('y', (item) => (this.nodeY(item.source) + this.nodeY(item.target)) / 2);

      node.attr(
        'transform',
        (item) =>
          `translate(${this.clamp(item.x ?? width / 2, 40, width - 40)}, ${this.clamp(
            item.y ?? height / 2,
            40,
            height - 40,
          )})`,
      );
    } else {
      this.simulation = d3
        .forceSimulation<FlowNode>(nodes)
        .force(
          'link',
          d3
            .forceLink<FlowNode, FlowLink>(links)
            .id((item) => item.id)
            .distance(width < 680 ? 92 : 130),
        )
        .force('charge', d3.forceManyBody().strength(-430))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide<FlowNode>().radius(48))
        .on('tick', () => {
          link
            .attr('x1', (item) => this.nodeX(item.source))
            .attr('y1', (item) => this.nodeY(item.source))
            .attr('x2', (item) => this.nodeX(item.target))
            .attr('y2', (item) => this.nodeY(item.target));

          linkLabel
            .attr(
              'x',
              (item) => (this.nodeX(item.source) + this.nodeX(item.target)) / 2,
            )
            .attr(
              'y',
              (item) => (this.nodeY(item.source) + this.nodeY(item.target)) / 2,
            );

          node.attr(
            'transform',
            (item) =>
              `translate(${this.clamp(item.x ?? width / 2, 40, width - 40)}, ${this.clamp(
                item.y ?? height / 2,
                40,
                height - 40,
              )})`,
          );
        });
    }
  }

  private wrapLabel(label: string): string[] {
    const words = label.split(' ');

    if (words.length <= 2) {
      return [label];
    }

    const midpoint = Math.ceil(words.length / 2);

    return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
  }

  private nodeX(node: string | number | FlowNode): number {
    return typeof node === 'object' ? (node.x ?? 0) : 0;
  }

  private nodeY(node: string | number | FlowNode): number {
    return typeof node === 'object' ? (node.y ?? 0) : 0;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private linkStroke(link: FlowLink): string {
    return link.pathId === this.selectedComparisonPath() ? '#2563eb' : '#b7c0d1';
  }

  private linkStrokeWidth(link: FlowLink): number {
    return link.pathId === this.selectedComparisonPath() ? 3 : 1.5;
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }
}
