import { Module } from '@nestjs/common';
import { ComparisonController } from './comparison.controller';
import { ComparisonService } from './comparison.service';
import { AccessTokenGuard } from '../../auth/access-token.guard';
import { OriginGuard } from '../../auth/origin.guard';

@Module({
  controllers: [ComparisonController],
  providers: [ComparisonService, AccessTokenGuard, OriginGuard],
})
export class ComparisonModule {}
