import { Injectable, signal } from '@angular/core';

export type SecurityWorkflowStatus = 'Draft' | 'Priced' | 'Committed' | 'Delivered' | 'Settled';
export type DisclosureStatus = 'Pending' | 'Issued' | 'Corrected' | 'Superseded';
export type CommitmentType = 'Mandatory' | 'Best Efforts' | 'Whole Loan' | 'MBS';

export interface SecuritySearchQuery {
  first: number;
  rows: number;
  sortField: keyof SecuritySearchRowVm;
  sortOrder: 1 | -1;
  globalFilter: string;
  workflowStatus: SecurityWorkflowStatus | '';
  disclosureStatus: DisclosureStatus | '';
  minCoupon: number | null;
  settlementDateFrom: string;
}

export interface SecuritySearchRowVm {
  securityId: string;
  cusip: string;
  poolNumber: string;
  commitmentId: string;
  commitmentType: CommitmentType;
  workflowStatus: SecurityWorkflowStatus;
  disclosureStatus: DisclosureStatus;
  coupon: number;
  currentBalance: number;
  loanCount: number;
  issueDate: string;
  settlementDate: string;
  disclosureFileId: string;
  sourceSystem: string;
  lastUpdated: string;
}

export interface SecuritySearchResult {
  rows: SecuritySearchRowVm[];
  totalRecords: number;
}

export const defaultSecuritySearchQuery: SecuritySearchQuery = {
  first: 0,
  rows: 10,
  sortField: 'settlementDate',
  sortOrder: 1,
  globalFilter: '',
  workflowStatus: '',
  disclosureStatus: '',
  minCoupon: null,
  settlementDateFrom: '',
};

const SECURITY_ROWS: SecuritySearchRowVm[] = [
  {
    securityId: 'SEC-2026-0001',
    cusip: '3138A1AA1',
    poolNumber: 'CL-1001',
    commitmentId: 'COM-9001',
    commitmentType: 'Mandatory',
    workflowStatus: 'Committed',
    disclosureStatus: 'Issued',
    coupon: 5.5,
    currentBalance: 245_750_000,
    loanCount: 642,
    issueDate: '2026-06-01',
    settlementDate: '2026-07-15',
    disclosureFileId: 'DISC-7001',
    sourceSystem: 'Spring source-of-truth',
    lastUpdated: '2026-07-03T12:00:00.000Z',
  },
  {
    securityId: 'SEC-2026-0002',
    cusip: '3138A1AB9',
    poolNumber: 'CL-1002',
    commitmentId: 'COM-9002',
    commitmentType: 'Best Efforts',
    workflowStatus: 'Priced',
    disclosureStatus: 'Pending',
    coupon: 5.0,
    currentBalance: 189_320_000,
    loanCount: 511,
    issueDate: '2026-06-04',
    settlementDate: '2026-07-18',
    disclosureFileId: 'DISC-7002',
    sourceSystem: 'Spring source-of-truth',
    lastUpdated: '2026-07-03T12:05:00.000Z',
  },
  {
    securityId: 'SEC-2026-0003',
    cusip: '3138A1AC7',
    poolNumber: 'CL-1003',
    commitmentId: 'COM-9003',
    commitmentType: 'MBS',
    workflowStatus: 'Delivered',
    disclosureStatus: 'Corrected',
    coupon: 6.0,
    currentBalance: 312_400_000,
    loanCount: 804,
    issueDate: '2026-06-08',
    settlementDate: '2026-07-21',
    disclosureFileId: 'DISC-7003',
    sourceSystem: 'Nest proxy validation',
    lastUpdated: '2026-07-03T12:10:00.000Z',
  },
  {
    securityId: 'SEC-2026-0004',
    cusip: '3138A1AD5',
    poolNumber: 'CL-1004',
    commitmentId: 'COM-9004',
    commitmentType: 'Whole Loan',
    workflowStatus: 'Draft',
    disclosureStatus: 'Pending',
    coupon: 4.5,
    currentBalance: 98_100_000,
    loanCount: 227,
    issueDate: '2026-06-10',
    settlementDate: '2026-07-25',
    disclosureFileId: 'DISC-7004',
    sourceSystem: 'Spring source-of-truth',
    lastUpdated: '2026-07-03T12:15:00.000Z',
  },
  {
    securityId: 'SEC-2026-0005',
    cusip: '3138A1AE3',
    poolNumber: 'CL-1005',
    commitmentId: 'COM-9005',
    commitmentType: 'Mandatory',
    workflowStatus: 'Settled',
    disclosureStatus: 'Superseded',
    coupon: 5.75,
    currentBalance: 276_890_000,
    loanCount: 719,
    issueDate: '2026-05-28',
    settlementDate: '2026-07-08',
    disclosureFileId: 'DISC-7005',
    sourceSystem: 'Contract snapshot',
    lastUpdated: '2026-07-03T12:20:00.000Z',
  },
  {
    securityId: 'SEC-2026-0006',
    cusip: '3138A1AF0',
    poolNumber: 'CL-1006',
    commitmentId: 'COM-9006',
    commitmentType: 'Best Efforts',
    workflowStatus: 'Committed',
    disclosureStatus: 'Issued',
    coupon: 6.25,
    currentBalance: 143_640_000,
    loanCount: 386,
    issueDate: '2026-06-12',
    settlementDate: '2026-07-29',
    disclosureFileId: 'DISC-7006',
    sourceSystem: 'Realtime event patch',
    lastUpdated: '2026-07-03T12:25:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class SecuritySearchFacade {
  readonly query = signal<SecuritySearchQuery>({ ...defaultSecuritySearchQuery });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedRow = signal<SecuritySearchRowVm | null>(null);
  readonly exportMessage = signal<string | null>(null);

  search(query = this.query()): SecuritySearchResult {
    this.loading.set(true);
    this.error.set(null);
    this.query.set({ ...query });

    const filtered = this.applyFilters(SECURITY_ROWS, query);
    const sorted = this.applySort(filtered, query);
    const rows = sorted.slice(query.first, query.first + query.rows);

    this.loading.set(false);
    return {
      rows,
      totalRecords: filtered.length,
    };
  }

  updateQuery(patch: Partial<SecuritySearchQuery>): SecuritySearchResult {
    return this.search({
      ...this.query(),
      ...patch,
      first: patch.first ?? 0,
    });
  }

  resetFilters(): SecuritySearchResult {
    this.exportMessage.set(null);
    return this.search({ ...defaultSecuritySearchQuery });
  }

  openDetails(row: SecuritySearchRowVm): void {
    this.selectedRow.set(row);
  }

  closeDetails(): void {
    this.selectedRow.set(null);
  }

  exportRow(row: SecuritySearchRowVm): void {
    this.exportMessage.set(`Queued export for ${row.disclosureFileId}`);
  }

  private applyFilters(rows: SecuritySearchRowVm[], query: SecuritySearchQuery): SecuritySearchRowVm[] {
    const text = query.globalFilter.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesText =
        !text ||
        [
          row.securityId,
          row.cusip,
          row.poolNumber,
          row.commitmentId,
          row.commitmentType,
          row.workflowStatus,
          row.disclosureStatus,
          row.disclosureFileId,
        ].some((value) => value.toLowerCase().includes(text));
      const matchesWorkflow =
        !query.workflowStatus || row.workflowStatus === query.workflowStatus;
      const matchesDisclosure =
        !query.disclosureStatus || row.disclosureStatus === query.disclosureStatus;
      const matchesCoupon = query.minCoupon === null || row.coupon >= query.minCoupon;
      const matchesSettlement =
        !query.settlementDateFrom || row.settlementDate >= query.settlementDateFrom;

      return (
        matchesText &&
        matchesWorkflow &&
        matchesDisclosure &&
        matchesCoupon &&
        matchesSettlement
      );
    });
  }

  private applySort(rows: SecuritySearchRowVm[], query: SecuritySearchQuery): SecuritySearchRowVm[] {
    return [...rows].sort((left, right) => {
      const leftValue = left[query.sortField];
      const rightValue = right[query.sortField];

      if (leftValue === rightValue) {
        return 0;
      }

      return (leftValue > rightValue ? 1 : -1) * query.sortOrder;
    });
  }
}
