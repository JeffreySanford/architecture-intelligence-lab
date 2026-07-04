import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/auth/auth.store';
import { NestApiFacade, type RealtimeEventDto, type RedisAdapterStatus } from '../../core/api/nest-api.facade';

type CacheTelemetryVm = {
  key: string;
  ttl: string;
  state: 'hit' | 'miss' | 'preview';
  description: string;
};

type EventChartBarVm = {
  label: string;
  count: number;
  width: number;
};


@Component({
  standalone: true,
  selector: 'app-realtime-lab-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './realtime-lab.page.html',
  styleUrl: './realtime-lab.page.scss',
})
export class RealtimeLabPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);
  private readonly nestApi = inject(NestApiFacade);

  protected readonly events = signal<RealtimeEventDto[]>([]);
  protected readonly redisAdapterStatus = signal<RedisAdapterStatus>({
    mode: 'unknown',
    connected: false,
    redisUrl: null,
    message: 'Redis adapter status is unknown.',
  });
  protected readonly filterText = signal('');
  protected readonly loading = signal(false);
  protected readonly emitting = signal(false);
  protected readonly bursting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly lastAppliedEventId = signal<string | null>(null);
  protected readonly rowsPerPageOptions = [5, 10, 20];

  protected readonly canEmit = computed(() => this.authStore.hasPermission('realtime:emit'));
  protected readonly totalEvents = computed(() => this.events().length);
  protected readonly latestEvent = computed(() => this.events()[0] ?? null);
  protected readonly socketEventCount = computed(
    () => this.events().filter((event) => event.source === 'socket').length,
  );
  protected readonly redisAdapterStatusLabel = computed(() => {
    const status = this.redisAdapterStatus();
    if (status.mode === 'redis') {
      return 'Redis adapter connected';
    }

    if (status.mode === 'in-process') {
      return 'In-process adapter fallback';
    }

    return 'Redis adapter unknown';
  });
  protected readonly redisAdapterTagSeverity = computed(() => {
    const mode = this.redisAdapterStatus().mode;
    return mode === 'redis' ? 'success' : mode === 'in-process' ? 'warn' : 'info';
  });
  protected readonly httpEventCount = computed(
    () => this.events().filter((event) => event.source === 'mock-http').length,
  );
  protected readonly uniqueLoanCount = computed(
    () => new Set(this.events().map((event) => event.loanId)).size,
  );

  protected readonly filteredEvents = computed(() => {
    const text = this.filterText().trim().toLowerCase();

    return this.events().filter((event) => {
      if (!text) {
        return true;
      }

      return [
        event.eventId,
        event.type,
        event.loanId,
        event.loanNumber,
        event.previousStatus,
        event.nextStatus,
        event.source,
        event.observedAt,
      ].some((value) => value.toLowerCase().includes(text));
    });
  });

  protected readonly cacheTelemetry = computed<CacheTelemetryVm[]>(() => {
    const latest = this.latestEvent();

    return [
      {
        key: 'socket:events:last',
        ttl: latest ? '10 seconds' : 'n/a',
        state: latest ? 'preview' : 'miss',
        description: latest
          ? `Last emitted event preview is ${latest.eventId}.`
          : 'No realtime event has been loaded into the lab yet.',
      },
      {
        key: 'dashboard:snapshot:small',
        ttl: '30 seconds',
        state: this.totalEvents() > 0 ? 'hit' : 'miss',
        description: 'Derived cache demonstration for dashboard refresh after realtime activity.',
      },
      {
        key: 'redis-adapter:socket-io',
        ttl: 'session',
        state: this.socketEventCount() > 0 ? 'hit' : 'preview',
        description: 'Socket.IO Redis adapter readiness is visible here once live socket events arrive.',
      },
    ];
  });

  protected readonly eventChartBars = computed<EventChartBarVm[]>(() => {
    const counts = new Map<string, number>();
    for (const event of this.events()) {
      counts.set(event.nextStatus, (counts.get(event.nextStatus) ?? 0) + 1);
    }

    const max = Math.max(...counts.values(), 1);
    return Array.from(counts.entries()).map(([label, count]) => ({
      label,
      count,
      width: Math.max(8, Math.round((count / max) * 100)),
    }));
  });

  ngOnInit(): void {
    this.loadHistory();
    this.loadRedisAdapterStatus();
  }

  protected loadHistory(): void {
    this.loading.set(true);
    this.error.set(null);

    this.nestApi
      .getRealtimeEventHistory()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (history) => this.events.set(history.events),
        error: () => {
          this.events.set([]);
          this.error.set('Realtime event history is unavailable. Start nest-api or use Docker compose to populate this lab.');
        },
      });
  }

  protected loadRedisAdapterStatus(): void {
    this.nestApi
      .getRealtimeRedisAdapterStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => this.redisAdapterStatus.set(status),
        error: () =>
          this.redisAdapterStatus.set({
            mode: 'unknown',
            connected: false,
            redisUrl: null,
            message: 'Unable to load Redis adapter status. Backend may be offline.',
          }),
      });
  }

  protected emitOne(): void {
    if (!this.canEmit()) {
      return;
    }

    this.emitting.set(true);
    this.error.set(null);

    this.nestApi
      .emitLoanStatusEvent(this.nextEventRequest(0))
      .pipe(
        finalize(() => this.emitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (event) => this.prependEvent(event),
        error: () => this.error.set('Realtime emit endpoint is unavailable. Start nest-api or Docker compose before emitting events.'),
      });
  }

  protected emitBurst(): void {
    if (!this.canEmit()) {
      return;
    }

    this.bursting.set(true);
    this.error.set(null);

    forkJoin([0, 1, 2].map((index) => this.nestApi.emitLoanStatusEvent(this.nextEventRequest(index))))
      .pipe(
        finalize(() => this.bursting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (events) => events.reverse().forEach((event) => this.prependEvent(event)),
        error: () => this.error.set('Burst emit failed. Verify the Nest realtime endpoint is running.'),
      });
  }

  protected eventSourceSeverity(source: RealtimeEventDto['source']): 'success' | 'info' {
    return source === 'socket' ? 'success' : 'info';
  }

  protected cacheSeverity(state: CacheTelemetryVm['state']): 'success' | 'warn' | 'info' {
    if (state === 'hit') {
      return 'success';
    }

    return state === 'miss' ? 'warn' : 'info';
  }

  private prependEvent(event: RealtimeEventDto): void {
    this.events.update((events) => [
      event,
      ...events.filter((existing) => existing.eventId !== event.eventId),
    ]);
    this.lastAppliedEventId.set(event.eventId);
  }

  private nextEventRequest(index: number) {
    const nextStatuses = ['In Review', 'Approved', 'Clear To Close'];

    return {
      loanId: `loan-00${index + 1}`,
      loanNumber: `TL-100${index + 1}`,
      previousStatus: index === 0 ? 'Submitted' : 'In Review',
      nextStatus: nextStatuses[index] ?? 'In Review',
    };
  }
}
