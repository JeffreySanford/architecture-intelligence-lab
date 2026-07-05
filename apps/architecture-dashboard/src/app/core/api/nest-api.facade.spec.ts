import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideApi as provideNestApi } from '@generated/nest-api-client';
import { firstValueFrom } from 'rxjs';
import { NestApiFacade } from './nest-api.facade';

describe('NestApiFacade', () => {
  let facade: NestApiFacade;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NestApiFacade, provideNestApi('')],
    }).compileComponents();

    facade = TestBed.inject(NestApiFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads comparison metrics from the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(facade.getLoanComparison());
    const req = httpMock.expectOne('/gateway/comparison/loans');

    expect(req.request.method).toBe('GET');
    req.flush({
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
      ],
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({
        subject: 'loans',
        paths: [expect.objectContaining({ pathId: 'spring-direct' })],
      }),
    );
  });

  it('loads realtime event history from the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(facade.getRealtimeEventHistory());
    const req = httpMock.expectOne('/gateway/realtime/events');

    expect(req.request.method).toBe('GET');
    req.flush({
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
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({
        namespace: '/gateway/realtime',
        events: [expect.objectContaining({ eventId: 'event-seed-001' })],
      }),
    );
  });

  it('loads historical comparison metrics from the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(facade.getLoanComparisonHistory());
    const req = httpMock.expectOne('/gateway/comparison/loans/history');

    expect(req.request.method).toBe('GET');
    req.flush({
      subject: 'loans',
      sampleLimit: 20,
      sampleCount: 1,
      samples: [],
      summary: [
        {
          pathId: 'spring-direct',
          label: 'Spring direct',
          samples: 1,
          averageLatencyMs: 40,
          averagePayloadBytes: 700,
          latestRecordCount: 5,
          latestStatus: 'ok',
          latestObservedAt: '2026-07-03T00:00:00.000Z',
        },
      ],
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({
        subject: 'loans',
        summary: [expect.objectContaining({ pathId: 'spring-direct' })],
      }),
    );
  });

  it('loads direct loan reads from the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(facade.getDirectLoanReads());
    const req = httpMock.expectOne('/gateway/loans/direct');

    expect(req.request.method).toBe('GET');
    req.flush({
      pathId: 'nest-direct',
      mode: 'mock',
      recordCount: 2,
      records: [
        { id: 'loan-001', loanNumber: 'TL-1001', borrowerName: 'Maya Chen', amount: 325000, status: 'Submitted' },
      ],
      observedAt: '2026-07-03T00:00:00.000Z',
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({
        pathId: 'nest-direct',
        mode: 'mock',
        recordCount: 2,
      }),
    );
  });

  it('loads proxy loan reads from the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(facade.getProxyLoanReads());
    const req = httpMock.expectOne('/gateway/loans/proxy');

    expect(req.request.method).toBe('GET');
    req.flush({
      pathId: 'nest-proxy',
      mode: 'mock',
      recordCount: 2,
      records: [
        { id: 'loan-002', loanNumber: 'TL-1002', borrowerName: 'Noah Patel', amount: 418500, status: 'In Review' },
      ],
      observedAt: '2026-07-03T00:00:00.000Z',
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({
        pathId: 'nest-proxy',
        mode: 'mock',
        recordCount: 2,
      }),
    );
  });

  it('emits realtime loan status events through the Nest gateway endpoint', async () => {
    const resultPromise = firstValueFrom(
      facade.emitLoanStatusEvent({
        loanNumber: 'TL-1001',
        previousStatus: 'Submitted',
        nextStatus: 'In Review',
      }),
    );
    const req = httpMock.expectOne('/gateway/realtime/loan-status');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      loanNumber: 'TL-1001',
      previousStatus: 'Submitted',
      nextStatus: 'In Review',
    });
    req.flush({
      eventId: 'event-001',
      type: 'loan.status.updated',
      loanId: 'loan-001',
      loanNumber: 'TL-1001',
      previousStatus: 'Submitted',
      nextStatus: 'In Review',
      source: 'mock-http',
      observedAt: '2026-07-03T00:00:00.000Z',
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({ eventId: 'event-001' }),
    );
  });
});
