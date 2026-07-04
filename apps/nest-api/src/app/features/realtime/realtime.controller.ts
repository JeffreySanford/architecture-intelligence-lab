import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoanStatusEventRequestDto,
  RealtimeAdapterStatusDto,
  RealtimeEventDto,
  RealtimeEventHistoryDto,
} from './realtime.dto';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { getRedisAdapterStatus } from './redis-io.adapter';

@ApiTags('realtime')
@Controller('gateway/realtime')
export class RealtimeController {
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  @Get('events')
  @ApiOperation({ operationId: 'getRealtimeEventHistory' })
  @ApiOkResponse({ type: RealtimeEventHistoryDto })
  getEventHistory(): RealtimeEventHistoryDto {
    return this.realtimeService.getHistory();
  }

  @Post('loan-status')
  @ApiOperation({ operationId: 'emitLoanStatusEvent' })
  @ApiBody({ type: LoanStatusEventRequestDto })
  @ApiOkResponse({ type: RealtimeEventDto })
  emitLoanStatusEvent(
    @Body() request: LoanStatusEventRequestDto,
  ): RealtimeEventDto {
    const event = this.realtimeService.createLoanStatusEvent(request);
    this.realtimeGateway.publishLoanStatusEvent(event);

    return event;
  }

  @Get('redis-status')
  @ApiOperation({ operationId: 'getRealtimeRedisAdapterStatus' })
  @ApiOkResponse({ type: RealtimeAdapterStatusDto })
  getRealtimeRedisAdapterStatus(): RealtimeAdapterStatusDto {
    return getRedisAdapterStatus();
  }
}
