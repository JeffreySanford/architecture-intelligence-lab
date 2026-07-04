import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { OpenApiStore } from '../../core/openapi/openapi.store';

type ContractStatus = 'generated' | 'planned' | 'wrapped' | 'watch';

interface GeneratedClientStatus {
  client: string;
  source: string;
  generatedPath: string;
  facade: string;
  status: ContractStatus;
  notes: string;
}

interface ContractEndpoint {
  backend: 'Spring' | 'Nest';
  endpoint: string;
  generatedService: string;
  dtoCoverage: string;
  phase: string;
}

interface DriftBoundary {
  boundary: string;
  protectedBy: string;
  failureSignal: string;
  owner: string;
  status: ContractStatus;
}

@Component({
  standalone: true,
  selector: 'app-openapi-page',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChipModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './openapi.page.html',
  styleUrl: './openapi.page.scss',
})
export class OpenApiPage {
  private readonly openApiStore = inject(OpenApiStore);

  protected readonly openApiDriftStatus = this.openApiStore.openApiDriftStatus;
  protected readonly clientFilter = this.openApiStore.clientFilter;
  protected readonly endpointFilter = this.openApiStore.endpointFilter;
  protected readonly driftFilter = this.openApiStore.driftFilter;
  protected readonly rowsPerPageOptions = this.openApiStore.rowsPerPageOptions;
  protected readonly swaggerLinks = this.openApiStore.swaggerLinks;
  protected readonly generatedClients = this.openApiStore.generatedClients;
  protected readonly contractEndpoints = this.openApiStore.contractEndpoints;
  protected readonly driftBoundaries = this.openApiStore.driftBoundaries;
  protected readonly filteredGeneratedClients = this.openApiStore.filteredGeneratedClients;
  protected readonly filteredContractEndpoints = this.openApiStore.filteredContractEndpoints;
  protected readonly filteredDriftBoundaries = this.openApiStore.filteredDriftBoundaries;

  protected statusSeverity(status: ContractStatus): 'success' | 'info' | 'warn' {
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
