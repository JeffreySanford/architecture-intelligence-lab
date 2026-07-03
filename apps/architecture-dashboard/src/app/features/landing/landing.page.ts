import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  standalone: true,
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ChipModule,
    DropdownModule,
    InputSwitchModule,
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
  protected readonly datasetOptions = [
    { label: 'Small', value: 'Small' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Large', value: 'Large' },
    { label: 'Stress', value: 'Stress' },
  ];
  protected readonly backendModes = [
    'Spring direct',
    'Nest direct',
    'Nest proxy',
    'Compare all',
  ];
  protected readonly backendOptions = [
    { label: 'Spring direct', value: 'Spring direct' },
    { label: 'Nest direct', value: 'Nest direct' },
    { label: 'Nest proxy', value: 'Nest proxy' },
    { label: 'Compare all', value: 'Compare all' },
  ];
  protected readonly personaList = computed(() => {
    const personas = this.personas();
    return Array.isArray(personas) ? personas : [];
  });

  protected readonly safePersonaList = computed(() => this.personaList());

  protected readonly safePersonaPermissions = (permissions?: string[]) =>
    Array.isArray(permissions) ? permissions : [];

  protected readonly personaOptions = computed(() =>
    this.personaList().map((persona) => ({
      label: `${persona.name ?? persona.id} · ${persona.role ?? ''}`,
      value: persona.id,
    })),
  );

  protected readonly fallbackPersona = {
    id: 'alice-viewer',
    name: 'Alice Viewer',
    role: 'Viewer',
    description: 'Default persona while Spring loads.',
    permissions: ['dashboard:view', 'loans:view'],
  };

  protected readonly selectedPersonaId = signal<string | undefined>('alice-viewer');
  protected readonly selectedDatasetSize = signal(this.datasetSizes[0]);
  protected readonly selectedBackendMode = signal(this.backendModes[0]);
  protected readonly explainMode = signal(true);

  protected readonly selectedPersona = computed(() => {
    const personas = this.personaList();
    return (
      personas.find((persona) => persona.id === this.selectedPersonaId()) ??
      personas[0] ??
      this.fallbackPersona
    );
  });

  protected readonly personaCount = computed(() => this.personaList().length);
  protected readonly isLoadingPersonas = computed(() => this.authStore.loading());

  ngOnInit(): void {
    this.authStore
      .loadPersonas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((personas) => {
        const loadedPersonas = Array.isArray(personas) ? personas : [];
        const firstPersonaId = loadedPersonas[0]?.id;
        const selectedPersonaId = this.selectedPersonaId();
        const selectedMatchesLoaded = loadedPersonas.some(
          (persona) => persona.id === selectedPersonaId,
        );

        if (firstPersonaId && !selectedMatchesLoaded) {
          this.selectedPersonaId.set(firstPersonaId);
        }
      });
  }

  protected selectPersona(personaId?: string): void {
    if (personaId) {
      this.selectedPersonaId.set(personaId);
    }
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
