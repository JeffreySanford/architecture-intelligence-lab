import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthStore } from '../../core/auth/auth.store';
import { NestApiFacade, type RealtimeEventDto } from '../../core/api/nest-api.facade';
import { RealtimeLabPage } from './realtime-lab.page';

const seedEvent: RealtimeEventDto = {
  eventId: 'event-seed-001',
  type: 'loan.status.updated',
  loanId: 'loan-001',
  loanNumber: 'TL-1001',
  previousStatus: 'Submitted',
  nextStatus: 'In Review',
  source: 'mock-http',
  observedAt: '2026-07-03T00:00:00.000Z',
};

class MockAuthStore {
  canEmit = true;

  hasPermission(permission: string): boolean {
    return permission === 'realtime:emit' ? this.canEmit : true;
  }
}

class MockNestApiFacade {
  getRealtimeEventHistory = vi.fn(() =>
    of({
      mode: 'mock',
      namespace: '/gateway/realtime',
      eventName: 'loan.status.updated',
      observedAt: '2026-07-03T00:00:00.000Z',
      events: [seedEvent],
    }),
  );

  getRealtimeRedisAdapterStatus = vi.fn(() =>
    of({
      mode: 'in-process',
      connected: false,
      redisUrl: 'redis://localhost:6379',
      message: 'Socket.IO Redis adapter unavailable; using in-process gateway.',
    }),
  );

  emitLoanStatusEvent = vi.fn(() =>
    of({
      ...seedEvent,
      eventId: `event-${this.emitLoanStatusEvent.mock.calls.length}`,
      nextStatus: 'Approved',
      observedAt: '2026-07-03T00:01:00.000Z',
    }),
  );
}

type RealtimeLabPageTestable = {
  events: () => RealtimeEventDto[];
  totalEvents: () => number;
  filteredEvents: () => RealtimeEventDto[];
  filterText: { set: (value: string) => void };
  cacheTelemetry: () => Array<{ key: string; state: string }>;
  eventChartBars: () => Array<{ label: string; count: number }>;
  error: () => string | null;
  emitOne: () => void;
  emitBurst: () => void;
  loadHistory: () => void;
};

describe('RealtimeLabPage', () => {
  let fixture: ComponentFixture<RealtimeLabPage>;
  let component: RealtimeLabPageTestable;
  let api: MockNestApiFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeLabPage],
      providers: [
        { provide: AuthStore, useClass: MockAuthStore },
        { provide: NestApiFacade, useClass: MockNestApiFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RealtimeLabPage);
    api = TestBed.inject(NestApiFacade) as unknown as MockNestApiFacade;
    component = fixture.componentInstance as unknown as RealtimeLabPageTestable;
    fixture.detectChanges();
  });

  it('loads realtime history into cards, table rows, chart bars, and cache telemetry', () => {
    expect(api.getRealtimeEventHistory).toHaveBeenCalledOnce();
    expect(component.totalEvents()).toBe(1);
    expect(component.eventChartBars()).toEqual([
      expect.objectContaining({ label: 'In Review', count: 1 }),
    ]);
    expect(component.cacheTelemetry()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'socket:events:last', state: 'preview' }),
      ]),
    );
  });

  it('filters event history by loan and status text', () => {
    component.filterText.set('TL-1001');
    expect(component.filteredEvents()).toHaveLength(1);

    component.filterText.set('missing');
    expect(component.filteredEvents()).toHaveLength(0);
  });

  it('emits one event and prepends it into realtime state', () => {
    component.emitOne();

    expect(api.emitLoanStatusEvent).toHaveBeenCalledWith(
      expect.objectContaining({ loanNumber: 'TL-1001' }),
    );
    expect(component.events()[0]).toEqual(expect.objectContaining({ eventId: 'event-1' }));
    expect(component.totalEvents()).toBe(2);
  });

  it('emits a burst of three events through the existing realtime endpoint', () => {
    component.emitBurst();

    expect(api.emitLoanStatusEvent).toHaveBeenCalledTimes(3);
    expect(component.totalEvents()).toBe(4);
  });

  it('surfaces history load errors without stale rows', () => {
    api.getRealtimeEventHistory.mockReturnValueOnce(throwError(() => new Error('offline')));

    component.loadHistory();

    expect(component.events()).toEqual([]);
    expect(component.error()).toContain('Realtime event history is unavailable');
  });
});
