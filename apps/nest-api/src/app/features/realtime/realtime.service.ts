import { Injectable } from '@nestjs/common';
import {
  LoanStatusEventRequestDto,
  RealtimeEventDto,
  RealtimeEventHistoryDto,
} from './realtime.dto';

const MAX_HISTORY = 20;

@Injectable()
export class RealtimeService {
  private eventSequence = 1;
  private readonly history: RealtimeEventDto[] = [
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
  ];

  getHistory(): RealtimeEventHistoryDto {
    return {
      mode: 'mock',
      namespace: '/gateway/realtime',
      eventName: 'loan.status.updated',
      events: [...this.history],
      observedAt: this.observedAt(),
    };
  }

  createLoanStatusEvent(request: LoanStatusEventRequestDto = {}): RealtimeEventDto {
    const event: RealtimeEventDto = {
      eventId: `event-${String(this.eventSequence).padStart(3, '0')}`,
      type: 'loan.status.updated',
      loanId: request.loanId ?? 'loan-001',
      loanNumber: request.loanNumber ?? 'TL-1001',
      previousStatus: request.previousStatus ?? 'Submitted',
      nextStatus: request.nextStatus ?? 'In Review',
      source: 'mock-http',
      observedAt: this.observedAt(),
    };

    this.eventSequence += 1;
    this.history.unshift(event);
    this.history.splice(MAX_HISTORY);

    return event;
  }

  private observedAt(): string {
    return new Date().toISOString();
  }
}
