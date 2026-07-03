import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  LoanStatusEventRequestDto,
  RealtimeEventDto,
  RealtimeEventHistoryDto,
} from './realtime.dto';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';

@Controller('gateway/realtime')
export class RealtimeController {
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  @Get('events')
  getEventHistory(): RealtimeEventHistoryDto {
    return this.realtimeService.getHistory();
  }

  @Post('loan-status')
  emitLoanStatusEvent(
    @Body() request: LoanStatusEventRequestDto,
  ): RealtimeEventDto {
    const event = this.realtimeService.createLoanStatusEvent(request);
    this.realtimeGateway.publishLoanStatusEvent(event);

    return event;
  }
}
