import { computed, Injectable, signal } from '@angular/core';

export type ContractStatus = 'generated' | 'planned' | 'wrapped' | 'watch';

export type GeneratedClientStatus = {
  client: string;
  source: string;
  generatedPath: string;
  facade: string;
  status: ContractStatus;
  notes: string;
};

export type ContractEndpoint = {
  backend: 'Spring' | 'Nest';
  endpoint: string;
  generatedService: string;
  dtoCoverage: string;
  phase: string;
};

export type DriftBoundary = {
  boundary: string;
  protectedBy: string;
  failureSignal: string;
  owner: string;
  status: ContractStatus;
};

export type ContractGapAlert = {
  surface: string;
  criticalFields: string;
  validator: string;
  failureSignal: string;
  status: ContractStatus;
};

@Injectable({ providedIn: 'root' })
export class OpenApiStore {
  readonly openApiDriftStatus = {
    status: 'watch' as ContractStatus,
    message:
      'Generated client contract boundaries are under active watch. Run drift-check after OpenAPI or backend changes.',
  };

  readonly clientFilter = signal('');
  readonly endpointFilter = signal('');
  readonly driftFilter = signal('');
  readonly contractGapFilter = signal('');
  readonly rowsPerPageOptions = [5, 10, 25];

  readonly swaggerLinks = [
    {
      label: 'Spring OpenAPI JSON',
      href: '/swagger/spring-json/',
      description: 'Source-of-truth business API contract',
    },
    {
      label: 'Nest Swagger UI',
      href: '/swagger/nest/',
      description: 'Gateway, comparison, and realtime API contract',
    },
    {
      label: 'Nest OpenAPI JSON',
      href: '/swagger/nest-json/',
      description: 'Generation source for the Nest Angular client',
    },
  ] as const;

  readonly generatedClients = signal<GeneratedClientStatus[]>([
    {
      client: 'spring-api-client',
      source: 'Spring /v3/api-docs',
      generatedPath: 'libs/generated/spring-api-client/src/generated',
      facade: 'SpringApiFacade',
      status: 'wrapped',
      notes: 'Persona, auth, and dashboard calls flow through a facade.',
    },
    {
      client: 'nest-api-client',
      source: 'Nest exported swagger-json',
      generatedPath: 'libs/generated/nest-api-client/src/generated',
      facade: 'NestApiFacade',
      status: 'wrapped',
      notes: 'Comparison metrics, direct reads, proxy reads, and realtime event contracts are generated.',
    },
  ]);

  readonly contractEndpoints = signal<ContractEndpoint[]>([
    {
      backend: 'Spring',
      endpoint: 'GET /api/personas',
      generatedService: 'LabControllerApiService.personas',
      dtoCoverage: 'PersonaDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Spring',
      endpoint: 'POST /api/dev-auth/personas/{personaId}/select',
      generatedService: 'LabControllerApiService.selectPersona',
      dtoCoverage: 'CurrentUserDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Spring',
      endpoint: 'GET /api/dashboard/snapshot',
      generatedService: 'LabControllerApiService.dashboardSnapshot',
      dtoCoverage: 'DashboardSnapshotDto, LoanDto, BorrowerDto, LoanDocumentDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Nest',
      endpoint: 'GET /gateway/comparison/loans',
      generatedService: 'ComparisonApiService.compareLoans',
      dtoCoverage: 'BackendComparisonResponseDto, BackendComparisonMetricDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Nest',
      endpoint: 'GET /gateway/loans/direct',
      generatedService: 'ComparisonApiService.getDirectLoans',
      dtoCoverage: 'GatewayLoanReadDto, MockLoanDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Nest',
      endpoint: 'GET /gateway/loans/proxy',
      generatedService: 'ComparisonApiService.getProxyLoans',
      dtoCoverage: 'GatewayLoanReadDto, MockLoanDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Nest',
      endpoint: 'GET /gateway/realtime/events',
      generatedService: 'RealtimeApiService.getRealtimeEventHistory',
      dtoCoverage: 'RealtimeEventHistoryDto, RealtimeEventDto',
      phase: 'Phase 6',
    },
    {
      backend: 'Nest',
      endpoint: 'POST /gateway/realtime/loan-status',
      generatedService: 'RealtimeApiService.emitLoanStatusEvent',
      dtoCoverage: 'LoanStatusEventRequestDto, RealtimeEventDto',
      phase: 'Phase 6',
    },
  ]);

  readonly driftBoundaries = signal<DriftBoundary[]>([
    {
      boundary: 'Database schema to Spring DTOs',
      protectedBy: 'Flyway, Spring integration tests, DTO mapping tests',
      failureSignal: 'Spring test failure or missing DTO field',
      owner: 'Spring source-of-truth API',
      status: 'wrapped',
    },
    {
      boundary: 'Spring/Nest DTOs to Angular clients',
      protectedBy: 'OpenAPI generation and generated-client drift checks',
      failureSignal: 'Generated client check fails or facade no longer compiles',
      owner: 'API contract owners',
      status: 'watch',
    },
    {
      boundary: 'Generated clients to Angular features',
      protectedBy: 'SpringApiFacade, NestApiFacade, no direct feature imports',
      failureSignal: 'Boundary check reports direct generated-client import',
      owner: 'Angular data-access layer',
      status: 'wrapped',
    },
    {
      boundary: 'Realtime socket events to dashboard state',
      protectedBy: 'Nest realtime DTOs and Phase 5 browser tests',
      failureSignal: 'Realtime event payload no longer matches generated DTO',
      owner: 'Nest gateway and Angular realtime facade',
      status: 'watch',
    },
  ]);

  readonly contractGapAlerts = signal<ContractGapAlert[]>([
    {
      surface: 'Spring dashboard snapshot',
      criticalFields: 'dataset, loans[], loan id, borrowerId, loanNumber, amount, statusCode',
      validator: 'SpringApiFacade.validateDashboardSnapshot',
      failureSignal: 'Facade throws `Spring dashboard contract gap` before state projection.',
      status: 'wrapped',
    },
    {
      surface: 'Nest comparison metrics',
      criticalFields: 'subject, observedAt, pathId, label, status, latencyMs, payloadBytes, recordCount',
      validator: 'NestApiFacade.validateComparisonResponse',
      failureSignal: 'Facade throws `Nest comparison contract gap` before charts or tables bind.',
      status: 'wrapped',
    },
    {
      surface: 'Nest realtime events',
      criticalFields: 'eventId, type, loanId, loanNumber, previousStatus, nextStatus, source, observedAt',
      validator: 'NestApiFacade.validateRealtimeEventHistory',
      failureSignal: 'Facade throws `Nest realtime contract gap` before event history projection.',
      status: 'wrapped',
    },
    {
      surface: 'Future securities and disclosure DTOs',
      criticalFields: 'security id, commitment id, disclosure file id, pricing status',
      validator: 'Future generated facade validators',
      failureSignal: 'Track as a watch item until these backend DTOs exist.',
      status: 'watch',
    },
  ]);

  readonly filteredGeneratedClients = computed(() =>
    this.filterRows(this.generatedClients(), this.clientFilter()),
  );

  readonly filteredContractEndpoints = computed(() =>
    this.filterRows(this.contractEndpoints(), this.endpointFilter()),
  );

  readonly filteredDriftBoundaries = computed(() =>
    this.filterRows(this.driftBoundaries(), this.driftFilter()),
  );

  readonly filteredContractGapAlerts = computed(() =>
    this.filterRows(this.contractGapAlerts(), this.contractGapFilter()),
  );

  statusSeverity(status: ContractStatus): 'success' | 'info' | 'warn' {
    switch (status) {
      case 'generated':
      case 'wrapped':
        return 'success';
      case 'watch':
        return 'warn';
      default:
        return 'info';
    }
  }

  private filterRows<T extends object>(rows: T[], filterValue: string): T[] {
    const filterText = filterValue.trim().toLowerCase();

    if (!filterText) {
      return rows;
    }

    return rows.filter((row) =>
      Object.values(row).some((value: unknown) =>
        String(value).toLowerCase().includes(filterText),
      ),
    );
  }
}
