import { Controller, Get } from '@nestjs/common';
import {
  BackendComparisonResponseDto,
  GatewayHealthDto,
  GatewayLoanReadDto,
} from './comparison.dto';
import { ComparisonService } from './comparison.service';

@Controller('gateway')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get('health')
  getHealth(): GatewayHealthDto {
    return this.comparisonService.getHealth();
  }

  @Get('loans/direct')
  getDirectLoans(): Promise<GatewayLoanReadDto> {
    return this.comparisonService.getDirectLoans();
  }

  @Get('loans/proxy')
  getProxyLoans(): Promise<GatewayLoanReadDto> {
    return this.comparisonService.getProxyLoans();
  }

  @Get('comparison/loans')
  compareLoans(): Promise<BackendComparisonResponseDto> {
    return this.comparisonService.compareLoans();
  }
}
