import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

type TradeRow = {
  pool: string;
  status: 'Ready' | 'Review' | 'Held';
  amount: string;
  coupon: string;
};

@Component({
  selector: 'app-primeng-encapsulation-shared',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    AvatarGroupModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    ChipModule,
    FieldsetModule,
    InputTextModule,
    MessageModule,
    PanelModule,
    ProgressBarModule,
    RadioButtonModule,
    SelectModule,
    SkeletonModule,
    StepsModule,
    TableModule,
    TagModule,
    TabsModule,
    ToastModule,
    ToolbarModule,
    ToggleSwitchModule,
  ],
  providers: [MessageService],
  templateUrl: './primeng-encapsulation-shared.component.html',
  styleUrls: ['./primeng-encapsulation-shared.component.scss'],
})
export class PrimengEncapsulationSharedComponent {
  readonly selectedPattern = signal('Commitments');
  readonly selectedFocus = signal<'Trade' | 'Pool' | 'Coupon'>('Trade');
  readonly showAdvanced = signal(true);
  readonly migrationProgress = signal(45);
  readonly showSkeleton = signal(false);

  readonly dropdownOptions = [
    { label: 'Commitments', value: 'Commitments' },
    { label: 'Disclosures', value: 'Disclosures' },
    { label: 'Pricing', value: 'Pricing' },
  ];

  readonly steps = [
    { label: 'Review' },
    { label: 'Approve' },
    { label: 'Complete' },
  ];

  readonly avatars = ['N', 'S', 'A'];

  readonly removableTags = signal(['Scoped CSS', 'PrimeNG preset', 'Legacy mode']);

  readonly messageService = inject(MessageService);

  removeTag(tag: string) {
    this.removableTags.update((tags) => tags.filter((t) => t !== tag));
  }

  toggleSkeleton() {
    this.showSkeleton.update((current) => !current);
  }

  showToast() {
    this.messageService.add({
      severity: 'info',
      summary: 'Scoped boundary',
      detail: 'This toast is rendered from the shared PrimeNG suite.',
    });
  }

  readonly tags = ['Nora tokens', 'Scoped CSS', 'PrimeNG preset'];

  readonly rows: TradeRow[] = [
    { pool: 'POOL-2026-A01', status: 'Ready', amount: '$12.4M', coupon: '5.50%' },
    { pool: 'POOL-2026-B17', status: 'Review', amount: '$8.9M', coupon: '5.25%' },
    { pool: 'POOL-2026-C03', status: 'Held', amount: '$4.2M', coupon: '6.00%' },
  ];
}
