import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import {
  BackendComparisonMetricDto,
  BackendComparisonHistoryDto,
  BackendComparisonResponseDto,
  ComparisonPathId,
  GatewayHealthDto,
  GatewayLoanReadDto,
  MockLoanDto,
  comparisonPathIds,
} from './comparison.dto';

interface SpringDashboardSnapshotDto {
  loans?: Array<{
    id: string;
    loanNumber: string;
    borrowerId: string;
    amount: number;
    statusCode: string;
  }>;
  borrowers?: Array<{
    id: string;
    name: string;
  }>;
  statusCodes?: Array<{
    code: string;
    label: string;
  }>;
}

interface MeasuredLoanRead {
  read: GatewayLoanReadDto;
  latencyMs: number;
  payloadBytes: number;
}

const MOCK_LOANS: MockLoanDto[] = [
  {
    id: 'loan-001',
    loanNumber: 'TL-1001',
    borrowerName: 'Maya Chen',
    amount: 325000,
    status: 'Submitted',
  },
  {
    id: 'loan-002',
    loanNumber: 'TL-1002',
    borrowerName: 'Noah Patel',
    amount: 418500,
    status: 'In Review',
  },
];

const PATH_LABELS: Record<ComparisonPathId, string> = {
  'spring-direct': 'Spring direct',
  'nest-direct': 'Nest direct',
  'nest-proxy': 'Nest proxy',
};

const HISTORY_LIMIT = 20;

@Injectable()
export class ComparisonService {
  private readonly springApiTarget =
    process.env['SPRING_API_TARGET'] ?? 'http://localhost:18080';
  private readonly comparisonHistory: BackendComparisonResponseDto[] = [];

  getHealth(): GatewayHealthDto {
    return {
      status: 'ok',
      service: 'nest-api',
      mode: 'live',
      springApiTarget: this.springApiTarget,
      observedAt: this.observedAt(),
    };
  }

  async getDirectLoans(): Promise<GatewayLoanReadDto> {
    const measured = await this.readSpringLoans('nest-direct');
    return measured.read;
  }

  async getProxyLoans(): Promise<GatewayLoanReadDto> {
    const measured = await this.readSpringLoans('nest-proxy');
    return measured.read;
  }

  async compareLoans(): Promise<BackendComparisonResponseDto> {
    const observedAt = this.observedAt();
    const [springDirect, nestDirect, nestProxy] = await Promise.all([
      this.readSpringLoans('spring-direct'),
      this.readSpringLoans('nest-direct'),
      this.readSpringLoans('nest-proxy'),
    ]);
    const paths = [
      this.metricFromRead('spring-direct', springDirect, observedAt),
      this.metricFromRead('nest-direct', nestDirect, observedAt),
      this.metricFromRead('nest-proxy', nestProxy, observedAt),
    ];

    const response: BackendComparisonResponseDto = {
      mode: paths.every((path) => path.status === 'ok') ? 'live' : 'degraded',
      subject: 'loans',
      observedAt,
      paths,
    };
    this.recordComparison(response);
    return response;
  }

  getComparisonHistory(): BackendComparisonHistoryDto {
    const samples = [...this.comparisonHistory].reverse();
    const summary = comparisonPathIds.map((pathId) => {
      const pathSamples = this.comparisonHistory
        .map((sample) => sample.paths.find((path) => path.pathId === pathId))
        .filter((path): path is BackendComparisonMetricDto => Boolean(path));
      const latest = pathSamples.at(-1);

      return {
        pathId,
        label: PATH_LABELS[pathId],
        samples: pathSamples.length,
        averageLatencyMs: this.average(pathSamples.map((path) => path.latencyMs)),
        averagePayloadBytes: this.average(pathSamples.map((path) => path.payloadBytes)),
        latestRecordCount: latest?.recordCount ?? 0,
        latestStatus: latest?.status ?? 'warning',
        latestObservedAt: latest?.observedAt ?? '',
      };
    });

    return {
      subject: 'loans',
      sampleLimit: HISTORY_LIMIT,
      sampleCount: this.comparisonHistory.length,
      samples,
      summary,
    };
  }

  private getLoanRead(pathId: ComparisonPathId): GatewayLoanReadDto {
    return {
      pathId,
      mode: 'mock',
      recordCount: MOCK_LOANS.length,
      records: MOCK_LOANS,
      observedAt: this.observedAt(),
    };
  }

  private measureMockRead(pathId: ComparisonPathId): MeasuredLoanRead {
    const startedAt = performance.now();
    const read = this.getLoanRead(pathId);

    return {
      read,
      latencyMs: Math.max(Math.round(performance.now() - startedAt), 1),
      payloadBytes: this.payloadBytes(read.records),
    };
  }

  private async readSpringLoans(pathId: ComparisonPathId): Promise<MeasuredLoanRead> {
    const startedAt = performance.now();

    try {
      const response = await axios.get<SpringDashboardSnapshotDto>(
        `${this.springApiTarget}/api/dashboard/snapshot`,
        {
          params: { dataset: 'small' },
          timeout: 2500,
        },
      );
      const records = this.toMockLoans(response.data);
      const read: GatewayLoanReadDto = {
        pathId,
        mode: 'live',
        recordCount: records.length,
        records,
        observedAt: this.observedAt(),
      };

      return {
        read,
        latencyMs: Math.max(Math.round(performance.now() - startedAt), 1),
        payloadBytes: this.payloadBytes(response.data),
      };
    } catch (error) {
      const fallback = this.getLoanRead(pathId);
      const read: GatewayLoanReadDto = {
        ...fallback,
        mode: 'degraded',
        errorMessage: this.errorMessage(error),
        observedAt: this.observedAt(),
      };

      return {
        read,
        latencyMs: Math.max(Math.round(performance.now() - startedAt), 1),
        payloadBytes: this.payloadBytes(read.records),
      };
    }
  }

  private metricFromRead(
    pathId: ComparisonPathId,
    measured: MeasuredLoanRead,
    observedAt: string,
  ): BackendComparisonMetricDto {
    return {
      pathId,
      label: PATH_LABELS[pathId],
      latencyMs: measured.latencyMs,
      payloadBytes: measured.payloadBytes,
      recordCount: measured.read.recordCount,
      status: measured.read.mode === 'degraded' ? 'warning' : 'ok',
      errorMessage: measured.read.errorMessage,
      observedAt,
    };
  }

  private toMockLoans(snapshot: SpringDashboardSnapshotDto): MockLoanDto[] {
    const borrowersById = new Map(
      (snapshot.borrowers ?? []).map((borrower) => [borrower.id, borrower.name]),
    );
    const statusesByCode = new Map(
      (snapshot.statusCodes ?? []).map((status) => [status.code, status.label]),
    );

    return (snapshot.loans ?? []).map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber,
      borrowerName: borrowersById.get(loan.borrowerId) ?? 'Unknown borrower',
      amount: Number(loan.amount),
      status: statusesByCode.get(loan.statusCode) ?? loan.statusCode,
    }));
  }

  private payloadBytes(payload: unknown): number {
    return Buffer.byteLength(JSON.stringify(payload), 'utf8');
  }

  private errorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return axiosError.code ?? axiosError.message;
    }

    return error instanceof Error ? error.message : 'Unknown Spring API proxy error';
  }

  private observedAt(): string {
    return new Date().toISOString();
  }

  private recordComparison(response: BackendComparisonResponseDto): void {
    this.comparisonHistory.push(response);
    if (this.comparisonHistory.length > HISTORY_LIMIT) {
      this.comparisonHistory.splice(0, this.comparisonHistory.length - HISTORY_LIMIT);
    }
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total / values.length);
  }
}
