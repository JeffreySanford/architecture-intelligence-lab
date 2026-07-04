import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import type { TableLazyLoadEvent } from 'primeng/types/table';
import { DashboardStore } from '../../core/dashboard/dashboard.store';
import {
  defaultSecuritySearchQuery,
  type DisclosureStatus,
  SecuritySearchFacade,
  type SecuritySearchQuery,
  type SecuritySearchRowVm,
  type SecurityWorkflowStatus,
} from './security-search.facade';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Component({
  standalone: true,
  selector: 'app-security-search-page',
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    PercentPipe,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './security-search.page.html',
  styleUrl: './security-search.page.scss',
})
export class SecuritySearchPage implements OnInit {
  protected readonly facade = inject(SecuritySearchFacade);
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly explainMode = this.dashboardStore.explainMode;
  protected readonly rows = signal<SecuritySearchRowVm[]>([]);
  protected readonly totalRecords = signal(0);

  protected readonly query = this.facade.query;
  protected readonly selectedRow = this.facade.selectedRow;
  protected readonly loading = this.facade.loading;
  protected readonly exportMessage = this.facade.exportMessage;
  protected readonly hasRows = computed(() => this.rows().length > 0);
  protected readonly tableState = computed<'loading' | 'empty' | 'results'>(() => {
    if (this.loading()) {
      return 'loading';
    }

    return this.hasRows() ? 'results' : 'empty';
  });

  protected readonly workflowOptions: Array<{ label: string; value: SecurityWorkflowStatus | '' }> = [
    { label: 'All workflow statuses', value: '' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Priced', value: 'Priced' },
    { label: 'Committed', value: 'Committed' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Settled', value: 'Settled' },
  ];

  protected readonly disclosureOptions: Array<{ label: string; value: DisclosureStatus | '' }> = [
    { label: 'All disclosure states', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Issued', value: 'Issued' },
    { label: 'Corrected', value: 'Corrected' },
    { label: 'Superseded', value: 'Superseded' },
  ];

  ngOnInit(): void {
    this.applyResult(this.facade.search({ ...defaultSecuritySearchQuery }));
  }

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const sortField = Array.isArray(event.sortField)
      ? event.sortField[0]
      : event.sortField;
    this.applyResult(
      this.facade.search({
        ...this.query(),
        first: event.first ?? 0,
        rows: event.rows ?? this.query().rows,
        sortField: this.asSortField(sortField ?? undefined),
        sortOrder: event.sortOrder === -1 ? -1 : 1,
      }),
    );
  }

  protected updateFilter(patch: Partial<SecuritySearchQuery>): void {
    this.applyResult(this.facade.updateQuery(patch));
  }

  protected resetFilters(): void {
    this.applyResult(this.facade.resetFilters());
  }

  protected openDetails(row: SecuritySearchRowVm): void {
    this.facade.openDetails(row);
  }

  protected closeDetails(): void {
    this.facade.closeDetails();
  }

  protected exportDisclosure(row: SecuritySearchRowVm): void {
    this.facade.exportRow(row);
  }

  protected workflowSeverity(status: SecurityWorkflowStatus): TagSeverity {
    const severities: Record<SecurityWorkflowStatus, TagSeverity> = {
      Draft: 'info',
      Priced: 'secondary',
      Committed: 'warn',
      Delivered: 'success',
      Settled: 'contrast',
    };
    return severities[status];
  }

  protected disclosureSeverity(status: DisclosureStatus): TagSeverity {
    const severities: Record<DisclosureStatus, TagSeverity> = {
      Pending: 'warn',
      Issued: 'success',
      Corrected: 'danger',
      Superseded: 'secondary',
    };
    return severities[status];
  }

  private applyResult(result: { rows: SecuritySearchRowVm[]; totalRecords: number }): void {
    this.rows.set(result.rows);
    this.totalRecords.set(result.totalRecords);
  }

  private asSortField(value: string | undefined): keyof SecuritySearchRowVm {
    const allowedFields: Array<keyof SecuritySearchRowVm> = [
      'securityId',
      'cusip',
      'poolNumber',
      'commitmentId',
      'commitmentType',
      'workflowStatus',
      'disclosureStatus',
      'coupon',
      'currentBalance',
      'loanCount',
      'issueDate',
      'settlementDate',
      'disclosureFileId',
      'sourceSystem',
      'lastUpdated',
    ];

    return allowedFields.includes(value as keyof SecuritySearchRowVm)
      ? (value as keyof SecuritySearchRowVm)
      : 'settlementDate';
  }
}
