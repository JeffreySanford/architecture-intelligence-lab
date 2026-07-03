import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type ComparisonPathId = 'spring-direct' | 'nest-direct' | 'nest-proxy';
export type ComparisonStatus = 'ok' | 'warning' | 'error';
export type GatewayMode = 'mock' | 'live' | 'degraded';

export interface BackendComparisonMetricDto {
  pathId: ComparisonPathId;
  label: string;
  latencyMs: number;
  payloadBytes: number;
  recordCount: number;
  status: ComparisonStatus;
  errorMessage?: string;
  observedAt: string;
}

export interface BackendComparisonResponseDto {
  mode: GatewayMode;
  subject: 'loans';
  observedAt: string;
  paths: BackendComparisonMetricDto[];
}

export type RealtimeEventType = 'loan.status.updated';

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
  mode: GatewayMode;
  namespace: '/gateway/realtime';
  eventName: RealtimeEventType;
  events: RealtimeEventDto[];
  observedAt: string;
}

export interface GatewayLoanReadDto {
  pathId: ComparisonPathId;
  mode: GatewayMode;
  recordCount: number;
  records: Array<{
    id: string;
    loanNumber: string;
    borrowerName: string;
    amount: number;
    status: string;
  }>;
  errorMessage?: string;
  observedAt: string;
}

export interface LoanStatusEventRequestDto {
  loanId?: string;
  loanNumber?: string;
  previousStatus?: string;
  nextStatus?: string;
}

@Injectable({ providedIn: 'root' })
export class NestApiFacade {
  private readonly http = inject(HttpClient);

  getLoanComparison() {
    return this.http.get<BackendComparisonResponseDto>('/gateway/comparison/loans');
  }

  getRealtimeEventHistory() {
    return this.http.get<RealtimeEventHistoryDto>('/gateway/realtime/events');
  }

  emitLoanStatusEvent(request: LoanStatusEventRequestDto) {
    return this.http.post<RealtimeEventDto>('/gateway/realtime/loan-status', request);
  }

  getDirectLoanReads() {
    return this.http.get<GatewayLoanReadDto>('/gateway/loans/direct');
  }

  getProxyLoanReads() {
    return this.http.get<GatewayLoanReadDto>('/gateway/loans/proxy');
  }
}
