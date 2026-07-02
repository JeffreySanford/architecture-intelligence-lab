import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-landing-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authStore = inject(AuthStore);
  protected readonly personas = this.authStore.personas;

  protected readonly datasetSizes = ['Small', 'Medium', 'Large', 'Stress'];
  protected readonly backendModes = [
    'Spring direct',
    'Nest direct',
    'Nest proxy',
    'Compare all',
  ];
  protected readonly fallbackPersona = {
    id: 'alice-viewer',
    name: 'Alice Viewer',
    role: 'Viewer',
    description: 'Default persona while Spring loads.',
    permissions: ['dashboard:view', 'loans:view'],
  };

  protected readonly selectedPersonaId = signal('alice-viewer');
  protected readonly selectedDatasetSize = signal(this.datasetSizes[0]);
  protected readonly selectedBackendMode = signal(this.backendModes[0]);
  protected readonly explainMode = signal(true);

  protected readonly selectedPersona = computed(
    () =>
      this.personas().find(
        (persona) => persona.id === this.selectedPersonaId(),
      ) ?? this.personas()[0] ?? this.fallbackPersona,
  );

  ngOnInit(): void {
    this.authStore
      .loadPersonas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((personas) => {
        if (personas.length > 0 && !this.selectedPersona()) {
          this.selectedPersonaId.set(personas[0].id);
        }
      });
  }

  protected selectPersona(personaId: string): void {
    this.selectedPersonaId.set(personaId);
  }

  protected enterLab(): void {
    this.authStore
      .selectPersona(this.selectedPersonaId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.router.navigate(['/lab/dashboard'], {
          queryParams: {
            dataset: this.selectedDatasetSize().toLowerCase(),
            backend: this.selectedBackendMode().toLowerCase().replace(/\s+/g, '-'),
            explain: this.explainMode(),
          },
        });
      });
  }
}
