import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import {
  BorrowerDto,
  DashboardSnapshotDto,
  LoanDocumentDto,
  LoanDto,
  LoanStatusCodeDto,
} from '../api/lab-api.models';
import { SpringApiFacade } from '../api/spring-api.facade';

export type LoanCardVm = {
  id: string;
  loanNumber: string;
  borrowerName: string;
  amount: number;
  statusLabel: string;
  documentCount: number;
  riskBand: string;
};

export type MapInspectorRowVm = {
  indexName: string;
  key: string;
  value: string;
};

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api = inject(SpringApiFacade);

  readonly selectedDataset = signal('small');
  readonly snapshot = signal<DashboardSnapshotDto | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly borrowersById = computed(() => {
    const map = new Map<string, BorrowerDto>();
    for (const borrower of this.snapshot()?.borrowers ?? []) {
      if (borrower.id) {
        map.set(borrower.id, borrower);
      }
    }
    return map;
  });

  readonly statusByCode = computed(() => {
    const map = new Map<string, LoanStatusCodeDto>();
    for (const status of this.snapshot()?.statusCodes ?? []) {
      if (status.code) {
        map.set(status.code, status);
      }
    }
    return map;
  });

  readonly loansById = computed(() => {
    const map = new Map<string, LoanDto>();
    for (const loan of this.snapshot()?.loans ?? []) {
      if (loan.id) {
        map.set(loan.id, loan);
      }
    }
    return map;
  });

  readonly documentsByLoanId = computed(() => {
    const map = new Map<string, LoanDocumentDto[]>();
    for (const document of this.snapshot()?.documents ?? []) {
      if (document.loanId) {
        map.set(document.loanId, [...(map.get(document.loanId) ?? []), document]);
      }
    }
    return map;
  });

  readonly loanCards = computed<LoanCardVm[]>(() =>
    (this.snapshot()?.loans ?? [])
      .filter((loan): loan is LoanDto & { id: string; borrowerId: string; statusCode: string } => !!loan.id && !!loan.borrowerId && !!loan.statusCode)
      .map((loan) => {
        const borrower = this.borrowersById().get(loan.borrowerId);
        const status = this.statusByCode().get(loan.statusCode);
        return {
          id: loan.id,
          loanNumber: loan.loanNumber ?? 'Unknown loan',
          borrowerName: borrower?.name ?? 'Unknown borrower',
          amount: loan.amount ?? 0,
          statusLabel: status?.label ?? loan.statusCode,
          documentCount: this.documentsByLoanId().get(loan.id)?.length ?? 0,
          riskBand: borrower?.riskBand ?? 'Unknown',
        };
      }),
  );

  readonly mapInspectorRows = computed<MapInspectorRowVm[]>(() => [
    ...Array.from(this.loansById()).map(([key, loan]) => ({
      indexName: 'loansById',
      key,
      value: loan.loanNumber ?? 'Unknown loan',
    })),
    ...Array.from(this.borrowersById()).map(([key, borrower]) => ({
      indexName: 'borrowersById',
      key,
      value: borrower.name ?? 'Unknown borrower',
    })),
    ...Array.from(this.documentsByLoanId()).map(([key, documents]) => ({
      indexName: 'documentsByLoanId',
      key,
      value: `${documents.length} document(s)`,
    })),
    ...Array.from(this.statusByCode()).map(([key, status]) => ({
      indexName: 'statusByCode',
      key,
      value: status.label ?? 'Unknown status',
    })),
  ]);

  loadSnapshot(dataset = this.selectedDataset()): Observable<DashboardSnapshotDto> {
    this.loading.set(true);
    this.error.set(null);
    this.selectedDataset.set(dataset);

    return this.api.getDashboardSnapshot(dataset).pipe(
      tap((snapshot) => this.snapshot.set(snapshot)),
      tap(() => this.loading.set(false)),
      catchError((error: unknown) => {
        this.loading.set(false);
        this.error.set('Unable to load dashboard snapshot.');
        throw error;
      }),
    );
  }
}
