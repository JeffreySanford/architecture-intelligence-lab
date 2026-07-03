import { RealtimeController } from './realtime.controller';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';

describe('RealtimeController', () => {
  let controller: RealtimeController;
  let gateway: Pick<RealtimeGateway, 'publishLoanStatusEvent'>;

  beforeEach(() => {
    gateway = {
      publishLoanStatusEvent: jest.fn(),
    };
    controller = new RealtimeController(
      new RealtimeService(),
      gateway as RealtimeGateway,
    );
  });

  it('returns realtime event history', () => {
    expect(controller.getEventHistory()).toMatchObject({
      mode: 'mock',
      namespace: '/gateway/realtime',
      eventName: 'loan.status.updated',
    });
  });

  it('emits a loan status event through the gateway', () => {
    const event = controller.emitLoanStatusEvent({
      loanNumber: 'TL-1010',
      nextStatus: 'Approved',
    });

    expect(event).toMatchObject({
      eventId: 'event-001',
      loanNumber: 'TL-1010',
      nextStatus: 'Approved',
    });
    expect(gateway.publishLoanStatusEvent).toHaveBeenCalledWith(event);
  });
});
