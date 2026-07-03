import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface InfrastructureLink {
  label: string;
  url: string;
  proxyUrl?: string;
  description: string;
}

interface PortMapping {
  service: string;
  env: string;
  directPort: string;
  proxyPath: string;
}

interface HealthResponse {
  status: string;
  service: string;
}

@Component({
  selector: 'app-infrastructure-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './infrastructure.page.html',
  styleUrls: ['./infrastructure.page.scss'],
})
export class InfrastructurePage {
  private readonly http = inject(HttpClient);

  protected readonly infrastructureLinks: InfrastructureLink[] = [
    {
      label: 'pgAdmin',
      url: 'http://localhost:5050',
      proxyUrl: '/pgadmin/',
      description: 'PostgreSQL admin UI',
    },
    {
      label: 'Redis Insight',
      url: 'http://localhost:5540',
      proxyUrl: '/redis-insight/',
      description: 'Redis inspection UI',
    },
    {
      label: 'Spring API',
      url: 'http://localhost:18080',
      proxyUrl: '/api/',
      description: 'Spring source-of-truth service',
    },
    {
      label: 'Nest API',
      url: 'http://localhost:13000',
      proxyUrl: '/gateway/',
      description: 'Nest API gateway',
    },
  ];

  protected readonly infrastructurePortMappings: PortMapping[] = [
    {
      service: 'pgAdmin',
      env: 'PGADMIN_PORT',
      directPort: '5050',
      proxyPath: '/pgadmin/',
    },
    {
      service: 'Redis Insight',
      env: 'REDIS_INSIGHT_PORT',
      directPort: '5540',
      proxyPath: '/redis-insight/',
    },
    {
      service: 'Spring API',
      env: 'SPRING_API_PORT',
      directPort: '18080',
      proxyPath: '/api/',
    },
    {
      service: 'Nest API',
      env: 'NEST_API_PORT',
      directPort: '13000',
      proxyPath: '/gateway/',
    },
  ];

  protected readonly infrastructureFilter = signal('');
  protected readonly portMappingFilter = signal('');
  protected rowsPerPageOptions: number[] = [5, 10, 25];
  protected readonly health = signal<HealthResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.loadHealth();
  }

  protected retry(): void {
    this.loadHealth();
  }
  protected readonly filteredInfrastructureLinks = computed(() => {
    const filterText = this.infrastructureFilter().trim().toLowerCase();

    return this.infrastructureLinks.filter((link) =>
      !filterText ||
      [link.label, link.url, link.proxyUrl ?? '']
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });

  protected readonly filteredInfrastructurePortMappings = computed(() => {
    const filterText = this.portMappingFilter().trim().toLowerCase();

    return this.infrastructurePortMappings.filter((mapping) =>
      !filterText ||
      [mapping.service, mapping.env, mapping.directPort, mapping.proxyPath]
        .some((value) => value.toLowerCase().includes(filterText)),
    );
  });
  protected healthSeverity(status: string): 'success' | 'warn' {
    return status === 'ok' ? 'success' : 'warn';
  }

  private loadHealth(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<HealthResponse>('/api/health').subscribe({
      next: (result) => {
        this.health.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        const errorMessage = err?.message ?? 'Unable to contact Spring API health endpoint.';
        this.error.set(errorMessage);
        this.health.set(null);
        this.loading.set(false);
      },
    });
  }
}
