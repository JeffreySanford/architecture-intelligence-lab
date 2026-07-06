import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

type TokenRow = {
  alias: string;
  primeToken: string;
  guidance: string;
};

type PreviewRow = {
  pattern: string;
  component: string;
  state: string;
  severity: 'success' | 'info' | 'warn' | 'danger';
};

@Component({
  standalone: true,
  selector: 'app-theme-governance-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    ToggleSwitchModule,
  ],
  templateUrl: './theme-governance.page.html',
  styleUrl: './theme-governance.page.scss',
})
export class ThemeGovernancePage {
  protected compactDensity = false;
  protected darkPreview = false;
  protected dialogVisible = false;
  protected selectedPattern = 'Commitments';

  protected readonly patternOptions = [
    { label: 'Commitments', value: 'Commitments' },
    { label: 'Disclosures', value: 'Disclosures' },
    { label: 'Pricing', value: 'Pricing' },
  ];

  protected readonly tokenRows: TokenRow[] = [
    {
      alias: '--color-bg',
      primeToken: 'semantic.colorScheme.light.surface.50',
      guidance: 'Use for app backgrounds and quiet workspace bands.',
    },
    {
      alias: '--color-surface',
      primeToken: 'semantic.colorScheme.light.surface.0',
      guidance: 'Use for shell, cards, tables, and overlay surfaces.',
    },
    {
      alias: '--color-primary',
      primeToken: 'semantic.colorScheme.light.primary.color',
      guidance: 'Use for main actions, selected navigation, and active states.',
    },
    {
      alias: '--color-border',
      primeToken: 'semantic.content.borderColor',
      guidance: 'Use for cards, forms, tables, and shell dividers.',
    },
    {
      alias: '--color-primary-soft',
      primeToken: 'semantic.colorScheme.light.highlight.background',
      guidance: 'Use for selected rows, subtle badges, and contextual emphasis.',
    },
  ];

  protected readonly previewRows: PreviewRow[] = [
    {
      pattern: 'Commitment queue',
      component: 'DataTable',
      state: 'Selected and hover rows use highlight tokens',
      severity: 'success',
    },
    {
      pattern: 'Disclosure review',
      component: 'InputText',
      state: 'Focus and invalid states use formField tokens',
      severity: 'warn',
    },
    {
      pattern: 'Contract drift',
      component: 'Tag',
      state: 'Severity colors stay token governed',
      severity: 'danger',
    },
    {
      pattern: 'Design docs',
      component: 'Card',
      state: 'Zeroheight documents usage, Angular implements Nora',
      severity: 'info',
    },
  ];
}
