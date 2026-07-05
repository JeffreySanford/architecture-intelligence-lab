import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenApiPage } from './openapi.page';
import { OpenApiStore, ContractStatus, GeneratedClientStatus } from '../../core/openapi/openapi.store';

describe('OpenApiPage', () => {
  let fixture: ComponentFixture<OpenApiPage>;
  let component: OpenApiPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OpenApiPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the OpenAPI contract lab with generated client rows', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('OpenAPI Contract Lab');
    expect(compiled.textContent).toContain('spring-api-client');
    expect(compiled.textContent).toContain('nest-api-client');
    expect(compiled.querySelectorAll('[data-testid="generated-client-row"]')).toHaveLength(2);
  });

  it('should show Nest comparison and realtime generated endpoint coverage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openApiStore = TestBed.inject(OpenApiStore);
    const endpointText = openApiStore.contractEndpoints()
      .map((endpoint) => `${endpoint.generatedService} ${endpoint.dtoCoverage}`)
      .join(' ');

    expect(compiled.textContent).toContain('ComparisonApiService.compareLoans');
    expect(endpointText).toContain('RealtimeApiService.emitLoanStatusEvent');
    expect(endpointText).toContain('BackendComparisonMetricDto');
    expect(endpointText).toContain('RealtimeEventDto');
  });

  it('should filter generated clients by facade name', () => {
    const page = component as unknown as {
      clientFilter: { set(value: string): void };
      filteredGeneratedClients(): Array<{ client: string }>;
    };

    page.clientFilter.set('NestApiFacade');

    expect(page.filteredGeneratedClients()).toEqual([
      expect.objectContaining({ client: 'nest-api-client' }),
    ]);
  });

  it('should map wrapped status to success severity', () => {
    const page = component as unknown as {
      statusSeverity(status: 'wrapped'): 'success' | 'info' | 'warn';
    };

    expect(page.statusSeverity('wrapped')).toBe('success');
  });

  it('should render explicit OpenAPI drift status and watch details', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-testid="openapi-drift-status"]')?.textContent).toContain('watch');
    expect(compiled.textContent).toContain(
      'Generated client contract boundaries are under active watch',
    );
  });

  it('should preserve store filter state across component recreation', () => {
    const store = TestBed.inject(OpenApiStore);
    store.clientFilter.set('spring');
    store.endpointFilter.set('comparison');
    store.driftFilter.set('watch');

    fixture.destroy();

    const secondFixture = TestBed.createComponent(OpenApiPage);
    secondFixture.detectChanges();
    const secondComponent = secondFixture.componentInstance as unknown as {
      clientFilter: { (): string };
      endpointFilter: { (): string };
      driftFilter: { (): string };
      filteredGeneratedClients(): Array<{ client: string }>;
    };

    expect(secondComponent.clientFilter()).toBe('spring');
    expect(secondComponent.endpointFilter()).toBe('comparison');
    expect(secondComponent.driftFilter()).toBe('watch');
    expect(secondComponent.filteredGeneratedClients()).toEqual([
      expect.objectContaining({ client: 'spring-api-client' }),
    ]);
  });

  it('should show drift boundary watch status in the drift boundaries table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const row = Array.from(compiled.querySelectorAll('[data-testid="drift-boundary-row"]')).find(
      (element) => element.textContent?.includes('Spring/Nest DTOs to Angular clients'),
    );

    expect(row).toBeDefined();
    expect(row?.textContent).toContain('watch');
  });

  it('should filter drift boundaries by status text', () => {
    const page = component as unknown as {
      driftFilter: { set(value: string): void };
      filteredDriftBoundaries(): Array<{ boundary: string }>;
    };

    page.driftFilter.set('watch');

    expect(page.filteredDriftBoundaries()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ boundary: 'Spring/Nest DTOs to Angular clients' }),
        expect.objectContaining({ boundary: 'Realtime socket events to dashboard state' }),
      ]),
    );
  });

  it('should handle large generated client lists and maintain filtering responsiveness', () => {
    const store = TestBed.inject(OpenApiStore);
    const largeClientRows: GeneratedClientStatus[] = Array.from({ length: 520 }, (_, index) => ({
      client: `generated-client-${index}`,
      source: 'Spring /v3/api-docs',
      generatedPath: `libs/generated/generated-client-${index}/src/generated`,
      facade: `Facade${index % 7}`,
      status: (index % 3 === 0 ? 'watch' : index % 3 === 1 ? 'generated' : 'wrapped') as ContractStatus,
      notes: `Synthetic generated client row ${index}`,
    }));

    store.generatedClients.set(largeClientRows);
    fixture.detectChanges();

    expect(store.filteredGeneratedClients().length).toBe(520);

    store.clientFilter.set('generated-client-519');
    expect(store.filteredGeneratedClients().length).toBe(1);
    expect(store.filteredGeneratedClients()[0].client).toBe('generated-client-519');
  });
});
