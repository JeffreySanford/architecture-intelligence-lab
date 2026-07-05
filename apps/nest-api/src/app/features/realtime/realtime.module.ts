import { Module } from '@nestjs/common';
import { RealtimeController } from './realtime.controller';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { AccessTokenGuard } from '../../auth/access-token.guard';
import { OriginGuard } from '../../auth/origin.guard';

@Module({
  controllers: [RealtimeController],
  providers: [RealtimeGateway, RealtimeService, AccessTokenGuard, OriginGuard],
})
export class RealtimeModule {}
