import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PrimengEncapsulationSharedComponent } from './primeng-encapsulation-shared.component';

@Component({
  selector: 'app-primeng-encapsulation-fixed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextModule,
    SelectModule,
    PrimengEncapsulationSharedComponent,
  ],
  templateUrl: './primeng-encapsulation-fixed.component.html',
  styleUrls: ['./primeng-encapsulation-fixed.component.scss'],
})
export class PrimengEncapsulationFixedComponent {
  readonly selectedPattern = signal('Commitments');
  readonly dropdownOptions = [
    { label: 'Commitments', value: 'Commitments' },
    { label: 'Disclosures', value: 'Disclosures' },
    { label: 'Pricing', value: 'Pricing' },
  ];
}
