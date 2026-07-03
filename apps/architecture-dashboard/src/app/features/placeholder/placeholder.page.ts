import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';

type PlaceholderData = {
  title?: string;
  eyebrow?: string;
  description?: string;
};

@Component({
  selector: 'app-placeholder-page',
  imports: [CardModule, ChipModule],
  templateUrl: './placeholder.page.html',
  styleUrl: './placeholder.page.scss',
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly pageData = computed<Required<PlaceholderData>>(() => {
    const data = this.route.snapshot.data as PlaceholderData;

    return {
      title: data.title ?? 'Lab View',
      eyebrow: data.eyebrow ?? 'Planned feature',
      description:
        data.description ??
        'This routed view is ready for feature implementation.',
    };
  });
}
