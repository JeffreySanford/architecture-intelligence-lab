import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardStore, LoanCardVm } from '../../core/dashboard/dashboard.store';

type CapitalMarketsRowVm = LoanCardVm & {
  commitmentType: 'Draft' | 'Priced' | 'Mandatory' | 'Best Efforts';
  disclosureStatus: 'Issued' | 'Pending' | 'Corrected';
  settlementDate: string;
};

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Component({
  standalone: true,
  selector: 'app-capital-markets-page',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './capital-markets.page.html',
  styleUrl: './capital-markets.page.scss',
})
export class CapitalMarketsPage implements OnInit {
  private readonly dashboardStore = inject(DashboardStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly globalFilter = signal('');
  protected readonly selectedCommitmentType = signal<string>('');

  protected readonly globalFilterValue = computed(() => this.globalFilter());
  protected readonly selectedCommitmentTypeValue = computed(() => this.selectedCommitmentType());

  protected readonly statusOptions = [
    { label: 'All Commitments', value: '' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Priced', value: 'Priced' },
    { label: 'Mandatory', value: 'Mandatory' },
    { label: 'Best Efforts', value: 'Best Efforts' },
  ];

  protected rowsPerPageOptions: number[] = [5, 10, 25];

  protected readonly rows = computed<CapitalMarketsRowVm[]>(() => {
    const filterText = this.globalFilter().trim().toLowerCase();

    return this.dashboardStore.loanCards()
      .map((loan, index) => ({
        ...loan,
        commitmentType: this.getCommitmentType(index),
        disclosureStatus: this.getDisclosureStatus(index),
        settlementDate: this.getSettlementDate(index),
      }))
      .filter((row) => {
        const commitmentMatches = this.selectedCommitmentType()
          ? row.commitmentType === this.selectedCommitmentType()
          : true;

        const globalMatches = !filterText ||
          [row.loanNumber, row.borrowerName, row.statusLabel, row.commitmentType, row.disclosureStatus]
            .some((value) => value.toLowerCase().includes(filterText));

        return commitmentMatches && globalMatches;
      });
  });

  protected readonly commitmentChips = computed(() => [
    { label: 'Draft', severity: 'info' as TagSeverity },
    { label: 'Priced', severity: 'success' as TagSeverity },
    { label: 'Mandatory', severity: 'warn' as TagSeverity },
    { label: 'Best Efforts', severity: 'secondary' as TagSeverity },
  ] as const);

  protected readonly disclosureChips = computed(() => [
    { label: 'Issued', severity: 'success' as TagSeverity },
    { label: 'Pending', severity: 'warn' as TagSeverity },
    { label: 'Corrected', severity: 'danger' as TagSeverity },
  ] as const);

  public ngOnInit(): void {
    this.dashboardStore.loadSnapshot('small').subscribe({});
  }

  protected getCommitmentType(index: number): CapitalMarketsRowVm['commitmentType'] {
    const types: CapitalMarketsRowVm['commitmentType'][] = [
      'Draft',
      'Priced',
      'Mandatory',
      'Best Efforts',
    ];
    return types[index % types.length];
  }

  protected getDisclosureStatus(index: number): CapitalMarketsRowVm['disclosureStatus'] {
    const statuses: CapitalMarketsRowVm['disclosureStatus'][] = [
      'Issued',
      'Pending',
      'Corrected',
    ];
    return statuses[index % statuses.length];
  }

  protected getSettlementDate(index: number): string {
    const base = new Date();
    base.setDate(base.getDate() + (index % 10));
    return base.toISOString().split('T')[0];
  }

  protected commitmentSeverity(type: CapitalMarketsRowVm['commitmentType']): TagSeverity {
    switch (type) {
      case 'Draft':
        return 'info';
      case 'Priced':
        return 'success';
      case 'Mandatory':
        return 'warn';
      case 'Best Efforts':
        return 'secondary';
      default:
        return 'info';
    }
  }

  protected disclosureSeverity(status: CapitalMarketsRowVm['disclosureStatus']): TagSeverity {
    switch (status) {
      case 'Issued':
        return 'success';
      case 'Pending':
        return 'warn';
      case 'Corrected':
        return 'danger';
      default:
        return 'info';
    }
  }
}
