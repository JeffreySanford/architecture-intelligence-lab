import { RealtimeService } from './realtime.service';

describe('RealtimeService', () => {
  let service: RealtimeService;

  beforeEach(() => {
    service = new RealtimeService();
  });

  it('returns mock Socket.IO event history metadata', () => {
    const history = service.getHistory();

    expect(history.mode).toBe('mock');
    expect(history.namespace).toBe('/gateway/realtime');
    expect(history.eventName).toBe('loan.status.updated');
    expect(history.events[0]).toMatchObject({
      eventId: 'event-seed-001',
      loanNumber: 'TL-1001',
      nextStatus: 'In Review',
    });
  });

  it('creates a loan status event and prepends it to history', () => {
    const event = service.createLoanStatusEvent({
      loanId: 'loan-009',
      loanNumber: 'TL-1009',
      previousStatus: 'In Review',
      nextStatus: 'Approved',
    });

    expect(event).toMatchObject({
      eventId: 'event-001',
      type: 'loan.status.updated',
      loanId: 'loan-009',
      loanNumber: 'TL-1009',
      previousStatus: 'In Review',
      nextStatus: 'Approved',
      source: 'mock-http',
    });
    expect(service.getHistory().events[0]).toBe(event);
  });
});
