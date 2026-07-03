import { TestBed } from '@angular/core/testing';
import { SecuritySearchFacade } from './security-search.facade';

describe('SecuritySearchFacade', () => {
  let facade: SecuritySearchFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(SecuritySearchFacade);
  });

  it('should return the first lazy page with default query state', () => {
    const result = facade.search();

    expect(result.totalRecords).toBeGreaterThan(5);
    expect(result.rows[0].securityId).toBe('SEC-2026-0005');
    expect(facade.query().sortField).toBe('settlementDate');
  });

  it('should filter rows by workflow status and reset pagination', () => {
    const result = facade.updateQuery({
      first: 10,
      workflowStatus: 'Committed',
    });

    expect(facade.query().first).toBe(10);
    expect(result.rows.every((row) => row.workflowStatus === 'Committed')).toBe(true);
  });

  it('should filter rows by global text, disclosure state, coupon, and settlement date', () => {
    const result = facade.search({
      ...facade.query(),
      first: 0,
      rows: 10,
      globalFilter: 'CL-1006',
      disclosureStatus: 'Issued',
      minCoupon: 6,
      settlementDateFrom: '2026-07-20',
    });

    expect(result.totalRecords).toBe(1);
    expect(result.rows[0].securityId).toBe('SEC-2026-0006');
  });

  it('should sort descending by coupon', () => {
    const result = facade.search({
      ...facade.query(),
      first: 0,
      rows: 3,
      sortField: 'coupon',
      sortOrder: -1,
    });

    expect(result.rows.map((row) => row.coupon)).toEqual([6.25, 6, 5.75]);
  });

  it('should manage detail and export row state', () => {
    const row = facade.search().rows[0];

    facade.openDetails(row);
    expect(facade.selectedRow()).toBe(row);

    facade.exportRow(row);
    expect(facade.exportMessage()).toContain(row.disclosureFileId);

    facade.closeDetails();
    expect(facade.selectedRow()).toBeNull();
  });
});
