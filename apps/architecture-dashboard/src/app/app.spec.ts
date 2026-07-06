import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { App } from './app';
import { AuthStore } from './core/auth/auth.store';

class MockAuthStore {
  currentUser = signal<{
    persona: { id?: string; name: string; role: string };
    permissions: string[];
  } | null>(null);
  permissions = signal<string[]>([]);

  hasPermission(permission: string) {
    return this.permissions().includes(permission);
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useClass: MockAuthStore },
      ],
    }).compileComponents();
  });

  it('should create the app shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render shared header, navigation, main content, and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeTruthy();
    expect(compiled.querySelector('aside[aria-label="Primary navigation"]')).toBeTruthy();
    expect(compiled.querySelector('main')).toBeTruthy();
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('only renders public navigation on the landing route', async () => {
    const fixture = TestBed.createComponent(App);
    const authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;

    authStore.currentUser.set({
      persona: { name: 'Alice Viewer', role: 'Viewer' },
      permissions: ['dashboard:view', 'loans:view'],
    });
    authStore.permissions.set(['dashboard:view', 'loans:view']);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('aside[aria-label="Primary navigation"]')?.textContent ?? '';
    expect(navText).toContain('Persona Setup');
    expect(navText).not.toContain('Dashboard');
    expect(navText).not.toContain('Security Search');
    expect(navText).not.toContain('Backend Comparison');
  });

  it('renders authenticated navigation according to the selected user permissions', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;

    authStore.currentUser.set({
      persona: { name: 'Alice Viewer', role: 'Viewer' },
      permissions: ['dashboard:view', 'loans:view'],
    });
    authStore.permissions.set(['dashboard:view', 'loans:view']);
    component.currentUrl.set('/lab/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('aside[aria-label="Primary navigation"]')?.textContent ?? '';
    expect(navText).toContain('Persona Setup');
    expect(navText).toContain('Dashboard');
    expect(navText).toContain('Security Search');
    expect(navText).toContain('Capital Markets');
    expect(navText).toContain('Map Inspector');
    expect(navText).not.toContain('Backend Comparison');
    expect(navText).not.toContain('OpenAPI');
    expect(navText).not.toContain('Glossary');
    expect(navText).not.toContain('Admin');
  });

  it.each([
    ['Alice Viewer', 'Viewer', ['dashboard:view', 'loans:view']],
    ['Ben Reviewer', 'Reviewer', ['dashboard:view', 'loans:view', 'documents:view']],
    ['Cara Approver', 'Approver', ['dashboard:view', 'loans:view', 'loans:update']],
  ])('renders learner navigation explicitly assigned to %s', async (name, role, permissions) => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;

    authStore.currentUser.set({
      persona: { name, role },
      permissions,
    });
    authStore.permissions.set(permissions);
    component.currentUrl.set('/lab/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('aside[aria-label="Primary navigation"]')?.textContent ?? '';
    expect(navText).toContain('Dashboard');
    expect(navText).toContain('Security Search');
    expect(navText).toContain('Capital Markets');
    expect(navText).toContain('Map Inspector');
    expect(navText).toContain('Architecture Flow');
    expect(navText).not.toContain('MCP Dashboard');
    expect(navText).not.toContain('Admin');
  });

  it('renders admin navigation from the selected user role', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;
    const permissions = [
      'admin:view',
      'backend-comparison:view',
      'contracts:view',
      'dashboard:view',
      'developer:view',
      'diagnostics:view',
      'loans:view',
      'mcp:view',
      'realtime:view',
    ];

    authStore.currentUser.set({
      persona: { name: 'Diana Admin', role: 'Admin' },
      permissions,
    });
    authStore.permissions.set(permissions);
    component.currentUrl.set('/lab/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('aside[aria-label="Primary navigation"]')?.textContent ?? '';
    expect(navText).toContain('Admin');
    expect(navText).toContain('OpenAPI');
    expect(navText).toContain('Backend Comparison');
    expect(navText).toContain('Realtime Lab');
    expect(navText).toContain('MCP Dashboard');
    expect(navText).toContain('Glossary');
  });

  it('renders glossary navigation for a developer persona', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const authStore = TestBed.inject(AuthStore) as unknown as MockAuthStore;

    authStore.currentUser.set({
      persona: { id: 'henry-mcp-explorer', name: 'Henry MCP Explorer', role: 'MCP Explorer' },
      permissions: ['dashboard:view', 'developer:view', 'mcp:view'],
    });
    authStore.permissions.set(['dashboard:view', 'developer:view', 'mcp:view']);
    component.currentUrl.set('/lab/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('aside[aria-label="Primary navigation"]')?.textContent ?? '';
    expect(navText).toContain('MCP Dashboard');
    expect(navText).toContain('Glossary');
    expect(navText).not.toContain('Realtime Lab');
  });

  it('renders a Material icon in the app brand', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-frame__brand-icon.material-icons')).toBeTruthy();
    expect(compiled.querySelector('.app-frame__brand-icon')?.textContent?.trim()).toBe('insights');
  });
});
