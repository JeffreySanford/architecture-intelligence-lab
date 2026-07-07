import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PrimengEncapsulationDesignTokensComponent } from './primeng-encapsulation-design-tokens.component';
import { PrimengEncapsulationFixedComponent } from './primeng-encapsulation-fixed.component';
import { PrimengEncapsulationImpactComponent } from './primeng-encapsulation-impact.component';
import { PrimengEncapsulationNormalComponent } from './primeng-encapsulation-normal.component';

type DemoView = 'normal' | 'impact' | 'fixed' | 'tokens';

type TradeRow = {
  pool: string;
  status: 'Ready' | 'Review' | 'Held';
  amount: string;
  coupon: string;
};

type DropdownOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-primeng-encapsulation-lab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextModule,
    SelectModule,
    TagModule,
    PrimengEncapsulationNormalComponent,
    PrimengEncapsulationImpactComponent,
    PrimengEncapsulationFixedComponent,
    PrimengEncapsulationDesignTokensComponent,
  ],
  templateUrl: './primeng-encapsulation-lab.component.html',
  styleUrls: ['./primeng-encapsulation-lab.component.scss'],
  /*
    This intentionally recreates the enterprise styling issue:
    component styles behave globally when encapsulation is disabled.
  */
  encapsulation: ViewEncapsulation.None,
})
export class PrimengEncapsulationLabComponent {
  readonly activeView = signal<DemoView>('normal');
  readonly selectedPattern = signal('Commitments');
  readonly selectedFocus = signal<'Trade' | 'Pool' | 'Coupon'>('Trade');
  readonly showAdvanced = signal(true);
  readonly migrationProgress = signal(45);

  readonly dropdownOptions: DropdownOption[] = [
    { label: 'Commitments', value: 'Commitments' },
    { label: 'Disclosures', value: 'Disclosures' },
    { label: 'Pricing', value: 'Pricing' },
  ];

  readonly tags = ['Nora tokens', 'Scoped CSS', 'PrimeNG preset'];

  readonly rows: TradeRow[] = [
    { pool: 'POOL-2026-A01', status: 'Ready', amount: '$12.4M', coupon: '5.50%' },
    { pool: 'POOL-2026-B17', status: 'Review', amount: '$8.9M', coupon: '5.25%' },
    { pool: 'POOL-2026-C03', status: 'Held', amount: '$4.2M', coupon: '6.00%' },
  ];

  setView(view: DemoView): void {
    this.activeView.set(view);
  }
}
