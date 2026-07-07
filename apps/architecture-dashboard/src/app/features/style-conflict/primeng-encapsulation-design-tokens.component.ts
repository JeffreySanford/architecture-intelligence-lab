import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PrimengEncapsulationSharedComponent } from './primeng-encapsulation-shared.component';

@Component({
  selector: 'app-primeng-encapsulation-design-tokens',
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
    PrimengEncapsulationSharedComponent,
  ],
  templateUrl: './primeng-encapsulation-design-tokens.component.html',
  styleUrls: ['./primeng-encapsulation-design-tokens.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrimengEncapsulationDesignTokensComponent {
  readonly selectedPattern = signal('Commitments');

  readonly dropdownOptions = [
    { label: 'Commitments', value: 'Commitments' },
    { label: 'Disclosures', value: 'Disclosures' },
    { label: 'Pricing', value: 'Pricing' },
  ];
}
