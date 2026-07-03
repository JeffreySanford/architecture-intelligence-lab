export type RealtimeEventType = 'loan.status.updated';

export interface LoanStatusEventRequestDto {
  loanId?: string;
  loanNumber?: string;
  previousStatus?: string;
  nextStatus?: string;
}

export interface RealtimeEventDto {
  eventId: string;
  type: RealtimeEventType;
  loanId: string;
  loanNumber: string;
  previousStatus: string;
  nextStatus: string;
  source: 'mock-http' | 'socket';
  observedAt: string;
}

export interface RealtimeEventHistoryDto {
  mode: 'mock';
  namespace: '/gateway/realtime';
  eventName: RealtimeEventType;
  events: RealtimeEventDto[];
  observedAt: string;
}
