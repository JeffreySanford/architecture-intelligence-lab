import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DashboardStore } from './dashboard.store';
import { SpringApiFacade } from '../api/spring-api.facade';
import { DashboardSnapshotDto } from '../api/lab-api.models';

const sampleSnapshot: DashboardSnapshotDto = {
  dataset: 'small',
  borrowers: [
    { id: 'b1', name: 'Alice Borrower', riskBand: 'Low' },
    { id: 'b2', name: 'Bob Borrower', riskBand: 'High' },
  ],
  statusCodes: [
    { code: 'active', label: 'Active' },
    { code: 'delinquent', label: 'Delinquent' },
  ],
  loans: [
    { id: 'l1', loanNumber: 'LN-100', borrowerId: 'b1', amount: 100000, statusCode: 'active' },
    { id: 'l2', loanNumber: 'LN-200', borrowerId: 'b2', amount: 50000, statusCode: 'delinquent' },
  ],
  documents: [
    { id: 'd1', loanId: 'l1', documentType: 'Commitment Letter', status: 'active' },
    { id: 'd2', loanId: 'l1', documentType: 'Disclosure', status: 'active' },
    { id: 'd3', loanId: 'l2', documentType: 'Loan Agreement', status: 'active' },
  ],
};

class MockSpringApiFacade {
  getDashboardSnapshot() {
    return of(sampleSnapshot);
  }
}

describe('DashboardStore', () => {
  let store: DashboardStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardStore, { provide: SpringApiFacade, useClass: MockSpringApiFacade }],
    });

    store = TestBed.inject(DashboardStore);
  });

  it('should build borrowersById from snapshot', () => {
    store.snapshot.set(sampleSnapshot);

    expect(store.borrowersById().get('b1')?.name).toBe('Alice Borrower');
    expect(store.borrowersById().get('b2')?.riskBand).toBe('High');
  });

  it('should build statusByCode from snapshot', () => {
    store.snapshot.set(sampleSnapshot);

    expect(store.statusByCode().get('active')?.label).toBe('Active');
    expect(store.statusByCode().get('delinquent')?.label).toBe('Delinquent');
  });

  it('should build documentsByLoanId from snapshot', () => {
    store.snapshot.set(sampleSnapshot);

    expect(store.documentsByLoanId().get('l1')).toHaveLength(2);
    expect(store.documentsByLoanId().get('l2')).toHaveLength(1);
  });

  it('should build loan cards from snapshot and include document counts', () => {
    store.snapshot.set(sampleSnapshot);

    const loans = store.loanCards();
    expect(loans).toHaveLength(2);

    const firstLoan = loans.find((loan) => loan.id === 'l1');
    expect(firstLoan).toEqual(
      expect.objectContaining({
        loanNumber: 'LN-100',
        borrowerName: 'Alice Borrower',
        statusLabel: 'Active',
        documentCount: 2,
        riskBand: 'Low',
      }),
    );

    const secondLoan = loans.find((loan) => loan.id === 'l2');
    expect(secondLoan).toEqual(
      expect.objectContaining({
        loanNumber: 'LN-200',
        borrowerName: 'Bob Borrower',
        statusLabel: 'Delinquent',
        documentCount: 1,
        riskBand: 'High',
      }),
    );
  });

  it('should build map inspector rows for each index', () => {
    store.snapshot.set(sampleSnapshot);

    const rows = store.mapInspectorRows();
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indexName: 'loansById', key: 'l1', value: 'LN-100' }),
        expect.objectContaining({ indexName: 'borrowersById', key: 'b1', value: 'Alice Borrower' }),
        expect.objectContaining({ indexName: 'documentsByLoanId', key: 'l1', value: '2 document(s)' }),
        expect.objectContaining({ indexName: 'statusByCode', key: 'active', value: 'Active' }),
      ]),
    );
  });

  it('should load snapshot and update state', async () => {
    await firstValueFrom(store.loadSnapshot('small'));

    expect(store.snapshot()?.dataset).toBe('small');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should update selected dataset when loading a different dataset', async () => {
    await firstValueFrom(store.loadSnapshot('large'));

    expect(store.selectedDataset()).toBe('large');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should update computed loan state when snapshot changes', () => {
    store.snapshot.set(sampleSnapshot);
    expect(store.loanCards()).toHaveLength(2);

    store.snapshot.set({
      dataset: 'small',
      borrowers: [{ id: 'b3', name: 'Charlie Borrower', riskBand: 'Medium' }],
      statusCodes: [{ code: 'current', label: 'Current' }],
      loans: [{ id: 'l4', loanNumber: 'LN-400', borrowerId: 'b3', amount: 75000, statusCode: 'current' }],
      documents: [{ id: 'd4', loanId: 'l4', documentType: 'Term Sheet', status: 'active' }],
    });

    expect(store.loanCards()).toEqual([
      expect.objectContaining({
        loanNumber: 'LN-400',
        borrowerName: 'Charlie Borrower',
        statusLabel: 'Current',
        documentCount: 1,
        riskBand: 'Medium',
      }),
    ]);
  });

  it('should build fallback loan card values when borrower or status is missing', () => {
    store.snapshot.set({
      dataset: 'small',
      borrowers: [],
      statusCodes: [],
      loans: [
        { id: 'l3', loanNumber: 'LN-300', borrowerId: 'missing', amount: 25000, statusCode: 'unknown' },
      ],
      documents: [],
    });

    const loans = store.loanCards();

    expect(loans).toHaveLength(1);
    expect(loans[0]).toEqual(
      expect.objectContaining({
        borrowerName: 'Unknown borrower',
        statusLabel: 'unknown',
        documentCount: 0,
        riskBand: 'Unknown',
      }),
    );
  });

  it('should set error state if loadSnapshot fails', async () => {
    const mockFacade = TestBed.inject(SpringApiFacade) as unknown as MockSpringApiFacade;
    vi.spyOn(mockFacade, 'getDashboardSnapshot').mockReturnValue(throwError(() => new Error('snapshot failed')));

    await expect(firstValueFrom(store.loadSnapshot('small'))).rejects.toThrow('snapshot failed');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Unable to load dashboard snapshot.');
  });
});
