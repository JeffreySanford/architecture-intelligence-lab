export * from './app.service';
import { AppApiService } from './app.service';
export * from './comparison.service';
import { ComparisonApiService } from './comparison.service';
export * from './realtime.service';
import { RealtimeApiService } from './realtime.service';
export const APIS = [AppApiService, ComparisonApiService, RealtimeApiService];
