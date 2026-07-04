import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const realtimeEventTypes = ['loan.status.updated'] as const;
export type RealtimeEventType = (typeof realtimeEventTypes)[number];

export const realtimeSources = ['mock-http', 'socket'] as const;
export type RealtimeSource = (typeof realtimeSources)[number];

export class LoanStatusEventRequestDto {
  @ApiPropertyOptional()
  loanId?: string;

  @ApiPropertyOptional()
  loanNumber?: string;

  @ApiPropertyOptional()
  previousStatus?: string;

  @ApiPropertyOptional()
  nextStatus?: string;
}

export class RealtimeEventDto {
  @ApiProperty()
  eventId!: string;

  @ApiProperty({ enum: realtimeEventTypes })
  type!: RealtimeEventType;

  @ApiProperty()
  loanId!: string;

  @ApiProperty()
  loanNumber!: string;

  @ApiProperty()
  previousStatus!: string;

  @ApiProperty()
  nextStatus!: string;

  @ApiProperty({ enum: realtimeSources })
  source!: RealtimeSource;

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;
}

export class RealtimeEventHistoryDto {
  @ApiProperty({ enum: ['mock'] })
  mode!: 'mock';

  @ApiProperty({ enum: ['/gateway/realtime'] })
  namespace!: '/gateway/realtime';

  @ApiProperty({ enum: realtimeEventTypes })
  eventName!: RealtimeEventType;

  @ApiProperty({ type: () => [RealtimeEventDto] })
  events!: RealtimeEventDto[];

  @ApiProperty({ format: 'date-time' })
  observedAt!: string;
}
