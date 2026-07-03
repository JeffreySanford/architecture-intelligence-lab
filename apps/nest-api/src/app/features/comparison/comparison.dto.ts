export type ComparisonPathId = 'spring-direct' | 'nest-direct' | 'nest-proxy';
export type ComparisonStatus = 'ok' | 'warning' | 'error';
export type GatewayMode = 'mock' | 'live' | 'degraded';

export interface GatewayHealthDto {
  status: 'ok';
  service: 'nest-api';
  mode: GatewayMode;
  springApiTarget: string;
  observedAt: string;
}

export interface MockLoanDto {
  id: string;
  loanNumber: string;
  borrowerName: string;
  amount: number;
  status: string;
}

export interface GatewayLoanReadDto {
  pathId: ComparisonPathId;
  mode: GatewayMode;
  recordCount: number;
  records: MockLoanDto[];
  errorMessage?: string;
  observedAt: string;
}

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
