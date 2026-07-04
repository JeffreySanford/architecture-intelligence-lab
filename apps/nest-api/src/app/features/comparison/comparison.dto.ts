import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const comparisonPathIds = ['spring-direct', 'nest-direct', 'nest-proxy'] as const;
export type ComparisonPathId = (typeof comparisonPathIds)[number];

export const comparisonStatuses = ['ok', 'warning', 'error'] as const;
export type ComparisonStatus = (typeof comparisonStatuses)[number];

export const gatewayModes = ['mock', 'live', 'degraded'] as const;
export type GatewayMode = (typeof gatewayModes)[number];

export class GatewayHealthDto {
  @ApiProperty({ enum: ['ok'] })
  status!: 'ok';

  @ApiProperty({ enum: ['nest-api'] })
  service!: 'nest-api';

  @ApiProperty({ enum: gatewayModes })
  mode!: GatewayMode;

  @ApiProperty()
  springApiTarget!: string;

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;
}

export class MockLoanDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  loanNumber!: string;

  @ApiProperty()
  borrowerName!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  status!: string;
}

export class GatewayLoanReadDto {
  @ApiProperty({ enum: comparisonPathIds })
  pathId!: ComparisonPathId;

  @ApiProperty({ enum: gatewayModes })
  mode!: GatewayMode;

  @ApiProperty()
  recordCount!: number;

  @ApiProperty({ type: () => [MockLoanDto] })
  records!: MockLoanDto[];

  @ApiPropertyOptional()
  errorMessage?: string;

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;
}

export class BackendComparisonMetricDto {
  @ApiProperty({ enum: comparisonPathIds })
  pathId!: ComparisonPathId;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  latencyMs!: number;

  @ApiProperty()
  payloadBytes!: number;

  @ApiProperty()
  recordCount!: number;

  @ApiProperty({ enum: comparisonStatuses })
  status!: ComparisonStatus;

  @ApiPropertyOptional()
  errorMessage?: string;

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;
}

export class BackendComparisonResponseDto {
  @ApiProperty({ enum: gatewayModes })
  mode!: GatewayMode;

  @ApiProperty({ enum: ['loans'] })
  subject!: 'loans';

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;

  @ApiProperty({ type: () => [BackendComparisonMetricDto] })
  paths!: BackendComparisonMetricDto[];
}
