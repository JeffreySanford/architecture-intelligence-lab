import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComparisonModule } from './features/comparison/comparison.module';
import { RealtimeModule } from './features/realtime/realtime.module';

@Module({
  imports: [ComparisonModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
