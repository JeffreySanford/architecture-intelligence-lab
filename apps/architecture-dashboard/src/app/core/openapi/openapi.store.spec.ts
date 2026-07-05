import { TestBed } from '@angular/core/testing';
import { OpenApiStore } from './openapi.store';

describe('OpenApiStore', () => {
  let store: OpenApiStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OpenApiStore],
    }).compileComponents();

    store = TestBed.inject(OpenApiStore);
  });

  it('should initialize with generated client metadata and drift watch status', () => {
    expect(store.openApiDriftStatus.status).toBe('watch');
    expect(store.openApiDriftStatus.message).toContain('Generated client contract boundaries are under active watch');
    expect(store.generatedClients()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ client: 'spring-api-client' }),
        expect.objectContaining({ client: 'nest-api-client' }),
      ]),
    );
    expect(store.contractEndpoints()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ generatedService: 'ComparisonApiService.compareLoans' }),
      ]),
    );
  });

  it('should compute filtered generated clients when clientFilter changes', () => {
    store.clientFilter.set('nest');

    expect(store.filteredGeneratedClients().map((item) => item.client)).toEqual(['nest-api-client']);
  });

  it('should compute filtered contract endpoints when endpointFilter changes', () => {
    store.endpointFilter.set('proxy');

    expect(store.filteredContractEndpoints().every((endpoint) =>
      endpoint.endpoint.toLowerCase().includes('proxy'),
    )).toBe(true);
  });

  it('should compute filtered drift boundaries when driftFilter changes', () => {
    store.driftFilter.set('watch');

    expect(store.filteredDriftBoundaries()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ boundary: 'Spring/Nest DTOs to Angular clients' }),
        expect.objectContaining({ boundary: 'Realtime socket events to dashboard state' }),
      ]),
    );
  });

  it('should expose Nginx-relative Swagger and OpenAPI routes', () => {
    expect(store.swaggerLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/swagger/spring-json/' }),
        expect.objectContaining({ href: '/swagger/nest/' }),
        expect.objectContaining({ href: '/swagger/nest-json/' }),
      ]),
    );
  });

  it('should simulate UI-driven filter interaction through signals', () => {
    expect(store.generatedClients().length).toBe(2);

    store.clientFilter.set('nest');
    expect(store.filteredGeneratedClients()).toEqual([
      expect.objectContaining({ client: 'nest-api-client' }),
    ]);

    store.endpointFilter.set('loan-status');
    expect(store.filteredContractEndpoints()).toEqual([
      expect.objectContaining({ generatedService: 'RealtimeApiService.emitLoanStatusEvent' }),
    ]);

    store.driftFilter.set('watch');
    expect(store.filteredDriftBoundaries().map((item) => item.status)).toEqual(['watch', 'watch']);
  });

  it('should reset filters and restore full result sets', () => {
    store.clientFilter.set('nest');
    store.endpointFilter.set('proxy');
    store.driftFilter.set('watch');

    expect(store.filteredGeneratedClients()).toHaveLength(1);
    expect(store.filteredContractEndpoints()).toHaveLength(1);
    expect(store.filteredDriftBoundaries()).toHaveLength(2);

    store.clientFilter.set('');
    store.endpointFilter.set('');
    store.driftFilter.set('');

    expect(store.filteredGeneratedClients()).toHaveLength(2);
    expect(store.filteredContractEndpoints()).toHaveLength(store.contractEndpoints().length);
    expect(store.filteredDriftBoundaries()).toHaveLength(store.driftBoundaries().length);
  });

  it('should preserve filter state across store retrievals', () => {
    store.clientFilter.set('spring');
    store.endpointFilter.set('comparison');

    const secondStoreInstance = TestBed.inject(OpenApiStore);

    expect(secondStoreInstance.clientFilter()).toBe('spring');
    expect(secondStoreInstance.endpointFilter()).toBe('comparison');
    expect(secondStoreInstance.filteredGeneratedClients()).toEqual([
      expect.objectContaining({ client: 'spring-api-client' }),
    ]);
  });
});
