import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { personaSelectedGuard } from './persona-selected.guard';
import { AuthStore } from './auth.store';

class MockAuthStore {
  ensureCurrentUser = vi.fn(() => of(true));
}

describe('personaSelectedGuard', () => {
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

  function guardResultToPromise(result: unknown) {
    if (isObservable(result)) {
      return firstValueFrom(result);
    }
    return Promise.resolve(result as unknown);
  }

  it('allows activation when a persona is already selected', async () => {
    const result = TestBed.runInInjectionContext(() =>
      personaSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      await expect(guardResultToPromise(result)).resolves.toBe(true);
    }
    expect(authStore.ensureCurrentUser).toHaveBeenCalled();
  });

  it('redirects to landing when persona selection fails', async () => {
    authStore.ensureCurrentUser.mockReturnValue(throwError(() => new Error('No persona')));

    const result = TestBed.runInInjectionContext(() =>
      personaSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({ commands: ['/'] });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('redirects to landing after a hard refresh when in-memory auth state is cleared', async () => {
    authStore.ensureCurrentUser.mockReturnValue(
      throwError(() => new Error('No current user in memory')),
    );

    const result = TestBed.runInInjectionContext(() =>
      personaSelectedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      await expect(guardResultToPromise(result)).resolves.toEqual({ commands: ['/'] });
    }
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});
