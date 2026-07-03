import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecuritySearchPage } from './security-search.page';
import { SecuritySearchFacade } from './security-search.facade';

type SecuritySearchPageTestable = {
  rows: () => unknown[];
  totalRecords: () => number;
  query: () => { first: number; rows: number; sortField: string; sortOrder: 1 | -1 };
  onLazyLoad: (event: {
    first?: number;
    rows?: number;
    sortField?: string | string[];
    sortOrder?: 1 | -1 | 0 | null;
  }) => void;
  updateFilter: (patch: Record<string, unknown>) => void;
  resetFilters: () => void;
  openDetails: (row: never) => void;
  closeDetails: () => void;
  exportDisclosure: (row: never) => void;
  workflowSeverity: (status: string) => string;
  disclosureSeverity: (status: string) => string;
};

describe('SecuritySearchPage', () => {
  let fixture: ComponentFixture<SecuritySearchPage>;
  let component: SecuritySearchPageTestable;
  let facade: SecuritySearchFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritySearchPage],
    }).compileComponents();

    facade = TestBed.inject(SecuritySearchFacade);
    fixture = TestBed.createComponent(SecuritySearchPage);
    component = fixture.componentInstance as unknown as SecuritySearchPageTestable;
    fixture.detectChanges();
  });

  it('should render initial security rows', () => {
    expect(component.rows().length).toBeGreaterThan(0);
    expect(component.totalRecords()).toBeGreaterThan(0);
  });

  it('should translate PrimeNG lazy events into typed query state', () => {
    component.onLazyLoad({
      first: 2,
      rows: 2,
      sortField: 'coupon',
      sortOrder: -1,
    });

    expect(component.query()).toMatchObject({
      first: 2,
      rows: 2,
      sortField: 'coupon',
      sortOrder: -1,
    });
    expect(component.rows()).toHaveLength(2);
  });

  it('should fall back to settlementDate for unknown lazy sort fields', () => {
    component.onLazyLoad({
      sortField: 'notAField',
      sortOrder: 1,
    });

    expect(component.query().sortField).toBe('settlementDate');
  });

  it('should update filters and reset them', () => {
    component.updateFilter({ workflowStatus: 'Draft' });
    expect(component.totalRecords()).toBe(1);

    component.resetFilters();
    expect(component.totalRecords()).toBeGreaterThan(1);
  });

  it('should open detail state and queue disclosure export', () => {
    const row = component.rows()[0] as never;

    component.openDetails(row);
    expect(facade.selectedRow()).toBe(row);

    component.exportDisclosure(row);
    expect(facade.exportMessage()).toContain('Queued export');

    component.closeDetails();
    expect(facade.selectedRow()).toBeNull();
  });

  it('should map workflow and disclosure severities for PrimeNG tags', () => {
    expect(component.workflowSeverity('Committed')).toBe('warn');
    expect(component.workflowSeverity('Delivered')).toBe('success');
    expect(component.disclosureSeverity('Corrected')).toBe('danger');
    expect(component.disclosureSeverity('Issued')).toBe('success');
  });
});
