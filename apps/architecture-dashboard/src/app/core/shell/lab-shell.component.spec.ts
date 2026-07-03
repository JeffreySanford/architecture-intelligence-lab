import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import { LabShellComponent } from './lab-shell.component';

class MockAuthStore {
  currentUser = signal<{
    persona: { name: string; role: string };
    permissions: string[];
  } | null>(null);
  permissions = signal<string[]>([]);

  hasPermission(permission: string) {
    return this.permissions().includes(permission);
  }
}

describe('LabShellComponent', () => {
  let fixture: ComponentFixture<LabShellComponent>;
  let authStore: MockAuthStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useClass: MockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LabShellComponent);
    authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;
  });

  it('does not render lab navigation without a selected user', () => {
    fixture.detectChanges();

    const navText =
      (fixture.nativeElement as HTMLElement).querySelector('nav[aria-label="Lab views"]')
        ?.textContent ?? '';
    expect(navText).not.toContain('Dashboard');
    expect(navText).not.toContain('Backend Comparison');
  });

  it('renders only links allowed by the selected user permissions', () => {
    authStore.currentUser.set({
      persona: { name: 'Alice Viewer', role: 'Viewer' },
      permissions: ['dashboard:view', 'loans:view'],
    });
    authStore.permissions.set(['dashboard:view', 'loans:view']);
    fixture.detectChanges();

    const navText =
      (fixture.nativeElement as HTMLElement).querySelector('nav[aria-label="Lab views"]')
        ?.textContent ?? '';
    expect(navText).toContain('Architecture Flow');
    expect(navText).toContain('Dashboard');
    expect(navText).toContain('Capital Markets');
    expect(navText).toContain('Security Search');
    expect(navText).toContain('Map Inspector');
    expect(navText).not.toContain('SignalStore Inspector');
    expect(navText).not.toContain('Backend Comparison');
    expect(navText).not.toContain('OpenAPI Contract Lab');
    expect(navText).not.toContain('Admin And Persona Lab');
  });
});
