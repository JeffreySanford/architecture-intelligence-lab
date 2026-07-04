import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  BackendComparisonResponseDto,
  GatewayHealthDto,
  GatewayLoanReadDto,
} from './comparison.dto';
import { ComparisonService } from './comparison.service';

@ApiTags('comparison')
@Controller('gateway')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get('health')
  @ApiOperation({ operationId: 'getGatewayHealth' })
  @ApiOkResponse({ type: GatewayHealthDto })
  getHealth(): GatewayHealthDto {
    return this.comparisonService.getHealth();
  }

  @Get('loans/direct')
  @ApiOperation({ operationId: 'getDirectLoans' })
  @ApiOkResponse({ type: GatewayLoanReadDto })
  getDirectLoans(): Promise<GatewayLoanReadDto> {
    return this.comparisonService.getDirectLoans();
  }

  @Get('loans/proxy')
  @ApiOperation({ operationId: 'getProxyLoans' })
  @ApiOkResponse({ type: GatewayLoanReadDto })
  getProxyLoans(): Promise<GatewayLoanReadDto> {
    return this.comparisonService.getProxyLoans();
  }

  @Get('comparison/loans')
  @ApiOperation({ operationId: 'compareLoans' })
  @ApiOkResponse({ type: BackendComparisonResponseDto })
  compareLoans(): Promise<BackendComparisonResponseDto> {
    return this.comparisonService.compareLoans();
  }
}
