import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, type Type, type WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PhaseFivePage } from './phase-five/phase-five.page';
import { AuthStore } from '../core/auth/auth.store';
import { RealtimeSocketService } from '../core/realtime-socket/realtime-socket.service';
import { DashboardStore, type BackendMode, type DatasetSize } from '../core/dashboard/dashboard.store';
import {
  type BackendComparisonMetricDto,
  type ComparisonPathId,
  type GatewayLoanReadDto,
  type RealtimeEventDto,
  NestApiFacade,
} from '../core/api/nest-api.facade';

class MockAuthStore {
  currentUser = signal({
    persona: { name: 'Ethan Diagnostics Admin', role: 'Diagnostics Admin' },
    roles: ['Diagnostics Admin'],
    permissions: ['backend-comparison:view', 'diagnostics:view', 'realtime:view', 'realtime:emit'],
  });

  hasPermission = vi.fn((permission: string) =>
    ['backend-comparison:view', 'diagnostics:view', 'realtime:view', 'realtime:emit'].includes(permission),
  );
}

class MockRealtimeOperatorAuthStore {
  currentUser = signal({
    persona: { name: 'Grace Realtime Operator', role: 'Realtime Operator' },
    roles: ['Realtime Operator'],
    permissions: ['realtime:view', 'realtime:emit'],
  });

  hasPermission = vi.fn((permission: string) =>
    ['realtime:view', 'realtime:emit'].includes(permission),
  );
}

class MockContractAdminAuthStore {
  currentUser = signal({
    persona: { name: 'Fiona Contract Admin', role: 'Contract Admin' },
    roles: ['Contract Admin'],
    permissions: ['contracts:view'],
  });

  hasPermission = vi.fn((permission: string) => permission === 'contracts:view');
}

class MockNestApiFacade {
  getLoanComparison = vi.fn(() =>
    of({
      mode: 'mock',
      subject: 'loans',
      observedAt: '2026-07-03T00:00:00.000Z',
      paths: [
        {
          pathId: 'spring-direct',
          label: 'Spring direct',
          latencyMs: 42,
          payloadBytes: 768,
          recordCount: 2,
          status: 'ok',
          observedAt: '2026-07-03T00:00:00.000Z',
        },
        {
          pathId: 'nest-direct',
          label: 'Nest direct',
          latencyMs: 27,
          payloadBytes: 742,
          recordCount: 2,
          status: 'ok',
          observedAt: '2026-07-03T00:00:00.000Z',
        },
        {
          pathId: 'nest-proxy',
          label: 'Nest proxy',
          latencyMs: 58,
          payloadBytes: 790,
          recordCount: 2,
          status: 'ok',
          observedAt: '2026-07-03T00:00:00.000Z',
        },
      ],
    }),
  );

  getRealtimeEventHistory = vi.fn(() =>
    of({
      mode: 'mock',
      namespace: '/gateway/realtime',
      eventName: 'loan.status.updated',
      observedAt: '2026-07-03T00:00:00.000Z',
      events: [
        {
          eventId: 'event-seed-001',
          type: 'loan.status.updated',
          loanId: 'loan-001',
          loanNumber: 'TL-1001',
          previousStatus: 'Submitted',
          nextStatus: 'In Review',
          source: 'mock-http',
          observedAt: '2026-07-03T00:00:00.000Z',
        },
      ],
    }),
  );

  getDirectLoanReads = vi.fn(() =>
    of({
      pathId: 'nest-direct',
      mode: 'mock',
      recordCount: 2,
      records: [
        {
          id: 'loan-001',
          loanNumber: 'TL-1001',
          borrowerName: 'Maya Chen',
          amount: 325000,
          status: 'Submitted',
        },
      ],
      observedAt: '2026-07-03T00:00:00.000Z',
    }),
  );

  getProxyLoanReads = vi.fn(() =>
    of({
      pathId: 'nest-proxy',
      mode: 'mock',
      recordCount: 2,
      records: [
        {
          id: 'loan-002',
          loanNumber: 'TL-1002',
          borrowerName: 'Noah Patel',
          amount: 418500,
          status: 'In Review',
        },
      ],
      observedAt: '2026-07-03T00:00:00.000Z',
    }),
  );

  emitLoanStatusEvent = vi.fn(() =>
    of({
      eventId: 'event-001',
      type: 'loan.status.updated',
      loanId: 'loan-001',
      loanNumber: 'TL-1001',
      previousStatus: 'Submitted',
      nextStatus: 'In Review',
      source: 'mock-http',
      observedAt: '2026-07-03T00:01:00.000Z',
    }),
  );
}

class FailingNestApiFacade {
  getLoanComparison = vi.fn(() => throwError(() => new Error('unavailable')));
  getRealtimeEventHistory = vi.fn(() => throwError(() => new Error('unavailable')));
  getDirectLoanReads = vi.fn(() => throwError(() => new Error('unavailable')));
  getProxyLoanReads = vi.fn(() => throwError(() => new Error('unavailable')));
  emitLoanStatusEvent = vi.fn(() => throwError(() => new Error('unavailable')));
}

class MockDashboardStore {
  readonly selectedDataset = signal<DatasetSize>('small');
  readonly selectedBackendMode = signal<BackendMode>('spring-direct');
}

type SocketListener = (payload?: unknown) => void;

class MockSocket {
  private readonly listeners = new Map<string, SocketListener[]>();

  readonly open = vi.fn();
  readonly disconnect = vi.fn();
  readonly removeAllListeners = vi.fn(() => this.listeners.clear());

  on(eventName: string, listener: SocketListener): this {
    this.listeners.set(eventName, [
      ...(this.listeners.get(eventName) ?? []),
      listener,
    ]);

    return this;
  }

  emitEvent(eventName: string, payload?: unknown): void {
    for (const listener of this.listeners.get(eventName) ?? []) {
      listener(payload);
    }
  }
}

class MockRealtimeSocketService {
  readonly socket = new MockSocket();
  readonly createRealtimeSocket = vi.fn(() => this.socket);
}

type PhaseFivePageTestable = {
  visibleDeliverables: () => Array<{ permission: string; label: string }>;
  canViewComparison: () => boolean;
  canViewRealtime: () => boolean;
  canEmitRealtime: () => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  comparisonMetrics: WritableSignal<BackendComparisonMetricDto[]>;
  selectedComparisonPath: WritableSignal<ComparisonPathId | null>;
  comparisonError: WritableSignal<string | null>;
  realtimeEvents: WritableSignal<RealtimeEventDto[]>;
  realtimeError: WritableSignal<string | null>;
  realtimeEmitLoading: WritableSignal<boolean>;
  nestDirectReads: WritableSignal<GatewayLoanReadDto | null>;
  nestProxyReads: WritableSignal<GatewayLoanReadDto | null>;
  canViewContracts: () => boolean;
  liveLoanReadRows: () => Array<{
    pathId: ComparisonPathId;
    label: string;
    mode: string;
    recordCount: number;
    errorMessage: string;
    observedAt: string;
  }>;
  acceptanceCriteria: Array<{ label: string; permission: string }>;
  wrapLabel: (label: string) => string[];
  clamp: (value: number, min: number, max: number) => number;
  statusSeverity: (status: 'planned' | 'ready' | 'blocked') => 'info' | 'success' | 'warning';
  selectComparisonPath: (pathId: ComparisonPathId) => void;
  emitRealtimeEvent: () => void;
  loadLiveLoanReads: () => void;
  linkStroke: (link: { pathId: ComparisonPathId }) => string;
  linkStrokeWidth: (link: { pathId: ComparisonPathId }) => number;
};

describe('ComparisonAndRealtimeApi', () => {
  let fixture: ComponentFixture<PhaseFivePage>;
  let component: PhaseFivePage;
  let realtimeSocketService: MockRealtimeSocketService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseFivePage],
      providers: [
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: DashboardStore, useClass: MockDashboardStore },
        { provide: NestApiFacade, useClass: MockNestApiFacade },
        { provide: RealtimeSocketService, useClass: MockRealtimeSocketService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhaseFivePage);
    component = fixture.componentInstance;
    realtimeSocketService = TestBed.inject(
      RealtimeSocketService,
    ) as unknown as MockRealtimeSocketService;
    fixture.detectChanges();
  });

  async function createPageWithAuthStore(storeClass: Type<unknown>) {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PhaseFivePage],
      providers: [
        { provide: AuthStore, useClass: storeClass },
        { provide: DashboardStore, useClass: MockDashboardStore },
        { provide: NestApiFacade, useClass: MockNestApiFacade },
        { provide: RealtimeSocketService, useClass: MockRealtimeSocketService },
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(PhaseFivePage);
    localFixture.detectChanges();
    return localFixture.componentInstance as unknown as PhaseFivePageTestable;
  }

  it('should create the comparison and realtime API page', () => {
    expect(component).toBeTruthy();
  });

  it('should expose visible deliverables for diagnostics persona', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    expect(subject.visibleDeliverables().length).toBeGreaterThan(0);
    expect(subject.canViewComparison()).toBe(true);
    expect(subject.hasAnyPermission(['backend-comparison:view'])).toBe(true);
  });

  it('should load live comparison metrics from the Nest facade', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    expect(subject.comparisonMetrics().map((row) => row.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
    expect(subject.selectedComparisonPath()).toBe('spring-direct');
    expect(subject.comparisonError()).toBeNull();
  });

  it('should render the D3 measured metrics visualization for comparison paths', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Measured Metrics Visualization');
    expect(compiled.textContent).toContain(
      'D3 grouped bars for latency, payload size, and records returned by the comparison endpoint',
    );
    expect(
      compiled.querySelector(
        'svg[aria-label*="Grouped bar chart comparing latency, payload bytes, and record count"]',
      ),
    ).toBeTruthy();
  });

  it('should select comparison path rows for D3 highlighting', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    subject.selectComparisonPath('nest-proxy');

    expect(subject.selectedComparisonPath()).toBe('nest-proxy');
  });

  it('should highlight the selected live comparison path in link styles', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const springLink = { pathId: 'spring-direct' } as { pathId: ComparisonPathId };
    const proxyLink = { pathId: 'nest-proxy' } as { pathId: ComparisonPathId };

    expect(subject['linkStroke'](springLink)).toBe('#2563eb');
    expect(subject['linkStrokeWidth'](springLink)).toBe(3);
    expect(subject['linkStroke'](proxyLink)).toBe('#b7c0d1');
    expect(subject['linkStrokeWidth'](proxyLink)).toBe(1.5);

    subject.selectComparisonPath('nest-proxy');

    expect(subject.selectedComparisonPath()).toBe('nest-proxy');
    expect(subject['linkStroke'](proxyLink)).toBe('#2563eb');
    expect(subject['linkStrokeWidth'](proxyLink)).toBe(3);
  });

  it('should load realtime event history from the Nest facade', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    expect(subject.realtimeEvents()).toEqual([
      expect.objectContaining({
        eventId: 'event-seed-001',
        type: 'loan.status.updated',
        loanNumber: 'TL-1001',
        nextStatus: 'In Review',
      }),
    ]);
    expect(subject.realtimeError()).toBeNull();
  });

  it('should emit realtime events and prepend them to the history table', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    subject.emitRealtimeEvent();

    expect(subject.realtimeEvents()[0]).toEqual(
      expect.objectContaining({
        eventId: 'event-001',
        type: 'loan.status.updated',
        loanNumber: 'TL-1001',
      }),
    );
    expect(subject.realtimeEmitLoading()).toBe(false);
  });

  it('should append live Socket.IO events without reloading realtime history', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const initialEvents = subject.realtimeEvents();
    const socketEvent: RealtimeEventDto = {
      eventId: 'socket-event-001',
      type: 'loan.status.updated',
      loanId: 'loan-002',
      loanNumber: 'TL-1002',
      previousStatus: 'In Review',
      nextStatus: 'Approved',
      source: 'socket',
      observedAt: '2026-07-03T00:02:00.000Z',
    };

    realtimeSocketService.socket.emitEvent('loan.status.updated', socketEvent);

    expect(realtimeSocketService.createRealtimeSocket).toHaveBeenCalledOnce();
    expect(realtimeSocketService.socket.open).toHaveBeenCalledOnce();
    expect(subject.realtimeEvents()[0].source).toBe('socket');
    expect(subject.realtimeEvents()).toHaveLength(initialEvents.length + 1);
    expect(subject.realtimeEvents()[0].eventId).toBe('socket-event-001');

    realtimeSocketService.socket.emitEvent('loan.status.updated', socketEvent);

    expect(subject.realtimeEvents()).toHaveLength(initialEvents.length + 1);
  });

  it('should initialize the selected comparison path from landing backend mode state', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PhaseFivePage],
      providers: [
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: DashboardStore, useClass: MockDashboardStore },
        { provide: NestApiFacade, useClass: MockNestApiFacade },
        { provide: RealtimeSocketService, useClass: MockRealtimeSocketService },
      ],
    }).compileComponents();

    const dashboardStore = TestBed.inject(DashboardStore) as unknown as MockDashboardStore;
    dashboardStore.selectedBackendMode.set('nest-proxy');
    dashboardStore.selectedDataset.set('large');

    const localFixture = TestBed.createComponent(PhaseFivePage);
    localFixture.detectChanges();
    const subject = localFixture.componentInstance as unknown as PhaseFivePageTestable;
    const compiled = localFixture.nativeElement as HTMLElement;

    expect(subject.selectedComparisonPath()).toBe('nest-proxy');
    expect(compiled.textContent).toContain('nest-proxy');
    expect(compiled.textContent).toContain('landing backend mode · large');
  });

  it('should default Compare all mode to the first measured comparison path', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PhaseFivePage],
      providers: [
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: DashboardStore, useClass: MockDashboardStore },
        { provide: NestApiFacade, useClass: MockNestApiFacade },
        { provide: RealtimeSocketService, useClass: MockRealtimeSocketService },
      ],
    }).compileComponents();

    const dashboardStore = TestBed.inject(DashboardStore) as unknown as MockDashboardStore;
    dashboardStore.selectedBackendMode.set('compare-all');

    const localFixture = TestBed.createComponent(PhaseFivePage);
    localFixture.detectChanges();
    const subject = localFixture.componentInstance as unknown as PhaseFivePageTestable;

    expect(subject.selectedComparisonPath()).toBe('spring-direct');
  });

  it('should load live loan reads from the Nest facade', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    subject.loadLiveLoanReads();

    expect(subject.nestDirectReads()?.pathId).toBe('nest-direct');
    expect(subject.nestProxyReads()?.pathId).toBe('nest-proxy');
  });

  it('should expose live loan reads rows for the Phase 5 read status table', () => {
    const subject = component as unknown as PhaseFivePageTestable;

    subject.loadLiveLoanReads();

    const rows = subject.liveLoanReadRows();

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.pathId)).toEqual(['nest-direct', 'nest-proxy']);
  });

  it('should show comparison metric errors without breaking the page', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PhaseFivePage],
      providers: [
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: DashboardStore, useClass: MockDashboardStore },
        { provide: NestApiFacade, useClass: FailingNestApiFacade },
        { provide: RealtimeSocketService, useClass: MockRealtimeSocketService },
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(PhaseFivePage);
    localFixture.detectChanges();
    const subject = localFixture.componentInstance as unknown as PhaseFivePageTestable;

    expect(subject.comparisonMetrics()).toEqual([]);
    expect(subject.selectedComparisonPath()).toBeNull();
    expect(subject.comparisonError()).toContain('Nest comparison metrics are unavailable');
    expect(subject.realtimeEvents()).toEqual([]);
    expect(subject.realtimeError()).toContain('Nest realtime event history is unavailable');
  });

  it('should expose the Phase 5 runtime acceptance checklist', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const labels = subject.acceptanceCriteria.map((item: { label: string }) => item.label);

    expect(labels).toContain(
      'Spring direct, Nest direct, and Nest proxy can be compared in the same topology view.',
    );
    expect(labels).toContain(
      'A comparison endpoint exposes live metrics for Spring direct, Nest direct, and Nest proxy paths.',
    );
    expect(labels).toContain(
      'A Socket.IO gateway endpoint emits realtime event messages that update the Phase 5 visualization.',
    );
    expect(labels).toContain(
      'Comparison metrics update the PrimeNG status tables and D3 request path state.',
    );
    expect(labels).toContain(
      'Socket.IO event history updates the realtime portion of the Phase 5 visualization.',
    );
    expect(labels).toContain(
      'Local proxy uses localhost:18080 and Docker uses SPRING_API_TARGET=http://spring-api:8080.',
    );
  });

  it('should filter out contract deliverables without contracts permission', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const visible = subject.visibleDeliverables();

    expect(visible.some((item) => item.permission === 'contracts:view')).toBe(false);
    expect(visible).toHaveLength(5);
    expect(visible.every((item) => item.permission !== 'contracts:view')).toBe(true);
  });

  it('should expose realtime deliverables for Realtime Operator persona', async () => {
    const subject = await createPageWithAuthStore(MockRealtimeOperatorAuthStore);

    expect(subject.visibleDeliverables()).toHaveLength(2);
    expect(subject.visibleDeliverables().map((item: { permission: string }) => item.permission)).toEqual([
      'realtime:view',
      'realtime:view',
    ]);
    expect(subject.canViewRealtime()).toBe(true);
    expect(subject.canEmitRealtime()).toBe(true);
    expect(subject.hasAnyPermission(['backend-comparison:view'])).toBe(false);
    expect(
      subject.hasAnyPermission(['backend-comparison:view', 'realtime:view']),
    ).toBe(true);
  });

  it('should expose contract deliverables for Contract Admin persona', async () => {
    const subject = await createPageWithAuthStore(MockContractAdminAuthStore);

    expect(subject.visibleDeliverables()).toHaveLength(1);
    expect(subject.visibleDeliverables()[0].permission).toBe('contracts:view');
    expect(subject.hasAnyPermission(['contracts:view'])).toBe(true);
    expect(subject.hasAnyPermission(['backend-comparison:view'])).toBe(false);
  });

  it('should render live loan reads rows and Swagger fallback message for non-contract personas', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(subject.canViewContracts()).toBe(false);
    expect(subject.liveLoanReadRows()).toHaveLength(2);
    expect(compiled.querySelectorAll('[data-testid="loan-read-row"]').length).toBe(2);
    expect(compiled.textContent).toContain('Nest Swagger UI access is restricted for your persona.');
  });

  it('should wrap long D3 node labels into two lines', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    const wrapped = subject.wrapLabel('Angular Phase 5 View');

    expect(wrapped).toEqual(['Angular Phase', '5 View']);
  });

  it('should clamp values within the graph bounds', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    expect(subject.clamp(-10, 0, 100)).toBe(0);
    expect(subject.clamp(50, 0, 100)).toBe(50);
    expect(subject.clamp(120, 0, 100)).toBe(100);
  });

  it('should return info severity for planned status', () => {
    const subject = component as unknown as PhaseFivePageTestable;
    expect(subject.statusSeverity('planned')).toBe('info');
    expect(subject.statusSeverity('blocked')).toBe('warn');
    expect(subject.statusSeverity('ready')).toBe('success');
  });
});
