import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  BackendComparisonMetricDto,
  BackendComparisonHistoryDto,
  BackendComparisonHistorySummaryDto,
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
export type ComparisonHistory = BackendComparisonHistoryDto;
export type ComparisonHistorySummary = BackendComparisonHistorySummaryDto;

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
    return this.comparisonApi.compareLoans(undefined, false, this.jsonAcceptOptions).pipe(
      map((comparison) => this.validateComparisonResponse(comparison)),
    );
  }

  getLoanComparisonHistory() {
    return this.comparisonApi.getComparisonHistory(undefined, false, this.jsonAcceptOptions);
  }

  getRealtimeEventHistory() {
    return this.realtimeApi.getRealtimeEventHistory(undefined, false, this.jsonAcceptOptions).pipe(
      map((history) => this.validateRealtimeEventHistory(history)),
    );
  }

  emitLoanStatusEvent(request: LoanStatusEventRequestDto) {
    return this.realtimeApi.emitLoanStatusEvent(request, undefined, false, this.jsonAcceptOptions).pipe(
      map((event) => this.validateRealtimeEvent(event)),
    );
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

  private validateComparisonResponse(
    response: BackendComparisonResponseDto,
  ): BackendComparisonResponseDto {
    if (!response.subject || !response.observedAt || !Array.isArray(response.paths)) {
      throw new Error('Nest comparison contract gap: missing subject, observedAt, or paths.');
    }

    for (const metric of response.paths) {
      if (!metric.pathId || !metric.label || !metric.status || !metric.observedAt) {
        throw new Error('Nest comparison contract gap: metric is missing a critical field.');
      }

      if (metric.latencyMs < 0 || metric.payloadBytes < 0 || metric.recordCount < 0) {
        throw new Error('Nest comparison contract gap: metric counters must be non-negative.');
      }
    }

    return response;
  }

  private validateRealtimeEventHistory(
    history: RealtimeEventHistoryDto,
  ): RealtimeEventHistoryDto {
    if (!history.namespace || !history.eventName || !Array.isArray(history.events)) {
      throw new Error('Nest realtime contract gap: missing namespace, eventName, or events.');
    }

    history.events.forEach((event) => this.validateRealtimeEvent(event));
    return history;
  }

  private validateRealtimeEvent(event: RealtimeEventDto): RealtimeEventDto {
    if (!event.eventId || !event.type || !event.loanId || !event.loanNumber || !event.observedAt) {
      throw new Error('Nest realtime contract gap: event is missing a critical identifier field.');
    }

    if (!event.previousStatus || !event.nextStatus || !event.source) {
      throw new Error('Nest realtime contract gap: event is missing status transition metadata.');
    }

    return event;
  }
}
