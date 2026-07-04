import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BackendComparisonMetricDto,
  BackendComparisonResponseDto,
  ComparisonApiService,
  GatewayLoanReadDto,
  LoanStatusEventRequestDto,
  RealtimeApiService,
  RealtimeEventDto,
  RealtimeEventHistoryDto,
} from '@generated/nest-api-client';

export type RedisAdapterStatus = {
  mode: 'redis' | 'in-process' | 'unknown';
  connected: boolean;
  redisUrl: string | null;
  message: string;
};

export type ComparisonPathId = BackendComparisonMetricDto.PathIdEnum;
export type ComparisonStatus = BackendComparisonMetricDto.StatusEnum;
export type GatewayMode = BackendComparisonResponseDto.ModeEnum;
export type RealtimeEventType = RealtimeEventDto.TypeEnum;

export type {
  BackendComparisonMetricDto,
  BackendComparisonResponseDto,
  GatewayLoanReadDto,
  LoanStatusEventRequestDto,
  RealtimeEventDto,
  RealtimeEventHistoryDto,
};

@Injectable({ providedIn: 'root' })
export class NestApiFacade {
  private readonly comparisonApi = inject(ComparisonApiService);
  private readonly realtimeApi = inject(RealtimeApiService);
  private readonly http = inject(HttpClient);

  private readonly jsonAcceptOptions = {
    httpHeaderAccept: 'application/json' as const,
  };

  getLoanComparison() {
    return this.comparisonApi.compareLoans(undefined, false, this.jsonAcceptOptions);
  }

  getRealtimeEventHistory() {
    return this.realtimeApi.getRealtimeEventHistory(undefined, false, this.jsonAcceptOptions);
  }

  emitLoanStatusEvent(request: LoanStatusEventRequestDto) {
    return this.realtimeApi.emitLoanStatusEvent(request, undefined, false, this.jsonAcceptOptions);
  }

  getRealtimeRedisAdapterStatus() {
    return this.http.get<RedisAdapterStatus>('/gateway/realtime/redis-status', {
      withCredentials: true,
    });
  }

  getDirectLoanReads() {
    return this.comparisonApi.getDirectLoans(undefined, false, this.jsonAcceptOptions);
  }

  getProxyLoanReads() {
    return this.comparisonApi.getProxyLoans(undefined, false, this.jsonAcceptOptions);
  }
}
