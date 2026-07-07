import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
import { LandingPage } from './landing.page';
import { AuthStore } from '../../core/auth/auth.store';
import { DashboardStore, type BackendMode, type DatasetSize } from '../../core/dashboard/dashboard.store';
import { of } from 'rxjs';

class MockAuthStore {
  personas = signal([
    {
      id: 'adhan-designer',
      name: 'Adhan Designer',
      role: 'Designer',
      description: 'Frontend design-system lab.',
      permissions: ['design:view', 'dashboard:view'],
    },
    {
      id: 'alice-viewer',
      name: 'Alice Viewer',
      role: 'Viewer',
      description: 'Viewer persona',
      permissions: ['dashboard:view'],
    },
    {
      id: 'ethan-diagnostics-admin',
      name: 'Ethan Diagnostics Admin',
      role: 'Diagnostics Admin',
      description: 'Diagnostics persona',
      permissions: ['backend-comparison:view'],
    },
    {
      id: 'grace-realtime-operator',
      name: 'Grace Realtime Operator',
      role: 'Realtime Operator',
      description: 'Realtime persona',
      permissions: ['realtime:view'],
    },
    {
      id: 'henry-mcp-explorer',
      name: 'Henry MCP Explorer',
      role: 'MCP Explorer',
      description: 'Developer persona',
      permissions: ['dashboard:view', 'developer:view', 'mcp:view'],
    },
  ]);
  loading = signal(false);
  personasLoading = signal(false);
  currentUserLoading = signal(false);
  error = signal<string | null>(null);
  currentUser = signal(null);

  loadPersonas = vi.fn(() => of(this.personas()));
  hasPermission = vi.fn(() => false);

  selectPersona = vi.fn((personaId: string) =>
    of({
      persona: { id: personaId, name: 'Alice Viewer', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] },
      roles: ['viewer'],
      permissions: ['dashboard:view'],
    }),
  );

  loadCurrentUser = vi.fn(() =>
    of({
      persona: { id: 'alice-viewer', name: 'Alice Viewer', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] },
      roles: ['viewer'],
      permissions: ['dashboard:view'],
    }),
  );
}

class MockDashboardStore {
  readonly selectedDataset = signal<DatasetSize>('small');
  readonly selectedBackendMode = signal<BackendMode>('spring-direct');
  readonly explainMode = signal(false);
}

describe('LandingPage', () => {
  let fixture: ComponentFixture<LandingPage>;
  let router: Router;
  let navigateSpy: (commands: readonly unknown[], extras?: Record<string, unknown>) => Promise<boolean>;
  let authStore: MockAuthStore;

  beforeEach(async () => {
    authStore = new MockAuthStore();

    await TestBed.configureTestingModule({
      imports: [LandingPage, RouterTestingModule],
      providers: [
        { provide: AuthStore, useValue: authStore },
        { provide: DashboardStore, useClass: MockDashboardStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the landing page', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load personas and render the persona count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loaded 5 personas from Spring.');
  });

  it('should expose all persona, dataset, and backend dropdown options', () => {
    const component = fixture.componentInstance as unknown as {
      datasetOptions: Array<{ value: string }>;
      backendOptions: Array<{ value: string }>;
      personaOptions: () => Array<{ label: string; value: string }>;
    };

    expect(component.datasetOptions.map((option) => option.value)).toEqual([
      'Small',
      'Medium',
      'Large',
      'Stress',
    ]);
    expect(component.backendOptions.map((option) => option.value)).toEqual([
      'Spring direct',
      'Nest direct',
      'Nest proxy',
      'Compare all',
    ]);
    expect(component.personaOptions().map((option) => option.value)).toEqual([
      'adhan-designer',
      'alice-viewer',
      'ethan-diagnostics-admin',
      'grace-realtime-operator',
      'henry-mcp-explorer',
    ]);
  });

  it('should not render protected lab page details on the public landing page', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Sprint 1-5 Roadmap');
    expect(compiled.textContent).not.toContain('Role Access Guide');
    expect(compiled.textContent).not.toContain('Backend Comparison');
    expect(compiled.textContent).not.toContain('OpenAPI Contract Lab');
  });

  it('should set shared dashboard state when entering lab', async () => {
    const component = fixture.componentInstance as unknown as {
      selectedPersonaId: { set: (value: string) => void };
      selectedDatasetSize: { set: (value: string) => void };
      selectedBackendMode: { set: (value: 'Spring direct' | 'Nest direct' | 'Nest proxy' | 'Compare all') => void };
      enterLab: () => void;
    };
    const dashboardStore = TestBed.inject(DashboardStore);

    component.selectedPersonaId.set('grace-realtime-operator');
    component.selectedDatasetSize.set('Large');
    component.selectedBackendMode.set('Nest proxy');
    component.enterLab();

    await fixture.whenStable();

    expect(authStore.selectPersona).toHaveBeenCalledWith('grace-realtime-operator');
    expect(dashboardStore.selectedDataset()).toBe('large');
    expect(dashboardStore.selectedBackendMode()).toBe('nest-proxy');
    expect(dashboardStore.explainMode()).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/lab/dashboard'],
      {
        queryParams: {
          dataset: 'large',
          backend: 'nest-proxy',
          explain: true,
        },
      },
    );
  });

  it('should navigate to the default lab route when entering lab', async () => {
    fixture.componentInstance.enterLab();
    await fixture.whenStable();
    expect(navigateSpy).toHaveBeenCalledWith(['/lab/dashboard'], expect.any(Object));
  });

  it('should show the explain mode label and update when toggled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const component = fixture.componentInstance as unknown as {
      explainMode: { set: (value: boolean) => void };
    };

    component.explainMode.set(false);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Clean Mode');

    component.explainMode.set(true);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Explain Mode');
  });

});
