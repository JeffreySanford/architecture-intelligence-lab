import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { permissionGuard } from './permission.guard';
import { AuthStore } from './auth.store';
import { type PermissionRequirement } from './permission.utils';

class MockAuthStore {
  currentUser = signal({
    persona: {
      id: 'ethan-diagnostics-admin',
      name: 'Ethan Diagnostics Admin',
      role: 'Diagnostics Admin',
      description: 'Diagnostics persona',
      permissions: ['backend-comparison:view'],
    },
    roles: ['Diagnostics Admin'],
    permissions: ['backend-comparison:view'],
  });
  ensureCurrentUser = vi.fn(() => of(true));
  hasPermission = vi.fn((permission: string) => permission === 'backend-comparison:view');
}

describe('permissionGuard', () => {
  let authStore: MockAuthStore;
  let router: Router;

  beforeEach(() => {
    authStore = new MockAuthStore();
    router = {
      createUrlTree: vi.fn((commands: string[]) => ({ commands })),
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        { provide: Router, useValue: router },
      ],
    });
  });

  function routeWithPermission(permission?: PermissionRequirement): ActivatedRouteSnapshot {
    return {
      data: permission ? { permission } : {},
    } as ActivatedRouteSnapshot;
  }

  function guardResultToPromise(result: unknown) {
    if (isObservable(result)) {
      return firstValueFrom(result);
    }
    return Promise.resolve(result as unknown);
  }

  it('allows routes without a permission requirement', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission(), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      await expect(guardResultToPromise(result)).resolves.toBe(true);
    }

    expect(authStore.ensureCurrentUser).not.toHaveBeenCalled();
  });

  it('allows routes when the current user has the required permission', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission('backend-comparison:view'), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      await expect(guardResultToPromise(result)).resolves.toBe(true);
    }

    expect(authStore.ensureCurrentUser).toHaveBeenCalled();
    expect(authStore.hasPermission).toHaveBeenCalledWith('backend-comparison:view');
  });

  it('allows routes when the current user has any required permission', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission(['contracts:view', 'backend-comparison:view']), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      await expect(guardResultToPromise(result)).resolves.toBe(true);
    }

    expect(authStore.hasPermission).toHaveBeenCalledWith('contracts:view');
    expect(authStore.hasPermission).toHaveBeenCalledWith('backend-comparison:view');
  });

  it('redirects to the first visible lab route when the permission is missing', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission('contracts:view'), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/lab/backend-comparison'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/lab/backend-comparison']);
  });

  it('redirects Viewer persona from Realtime Lab when realtime:view permission is missing', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission('realtime:view'), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/lab/backend-comparison'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/lab/backend-comparison']);
  });

  it('redirects to landing when current user loading fails', async () => {
    authStore.ensureCurrentUser.mockReturnValue(throwError(() => new Error('No persona')));

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission('backend-comparison:view'), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('redirects to the first visible lab route when an array of permissions is present but none match', async () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission(['contracts:view', 'realtime:view']), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/lab/backend-comparison'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/lab/backend-comparison']);
    expect(authStore.hasPermission).toHaveBeenCalledWith('contracts:view');
    expect(authStore.hasPermission).toHaveBeenCalledWith('realtime:view');
  });

  it('allows routes requiring all developer and realtime permissions', async () => {
    authStore.hasPermission.mockImplementation((permission: string) =>
      permission === 'developer:view' || permission === 'realtime:view',
    );

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(
        routeWithPermission({ allOf: ['developer:view', 'realtime:view'] }),
        {} as RouterStateSnapshot,
      ),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      await expect(guardResultToPromise(result)).resolves.toBe(true);
    }
  });

  it('redirects to the first visible lab route when allOf permission requirement is missing one permission', async () => {
    authStore.hasPermission.mockImplementation((permission: string) => permission === 'realtime:view');
    authStore.currentUser.set({
      persona: {
        id: 'grace-realtime-operator',
        name: 'Grace Realtime Operator',
        role: 'Realtime Operator',
        description: 'Realtime persona',
        permissions: ['realtime:view'],
      },
      roles: ['Realtime Operator'],
      permissions: ['realtime:view'],
    });

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(
        routeWithPermission({ allOf: ['developer:view', 'realtime:view'] }),
        {} as RouterStateSnapshot,
      ),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/lab/backend-comparison'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/lab/backend-comparison']);
  });

  it('redirects design-only users away from dashboard to their first design lab route', async () => {
    authStore.hasPermission.mockImplementation((permission: string) => permission === 'design:view');
    authStore.currentUser.set({
      persona: {
        id: 'adhan-designer',
        name: 'Adhan Designer',
        role: 'Designer',
        description: 'Frontend design-system lab.',
        permissions: ['design:view'],
      },
      roles: ['Designer'],
      permissions: ['design:view'],
    });

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithPermission('dashboard:view'), {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({
        commands: ['/lab/primeng-encapsulation'],
      });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/lab/primeng-encapsulation']);
  });
});
