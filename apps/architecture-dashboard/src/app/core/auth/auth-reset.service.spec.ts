import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthResetService } from './auth-reset.service';
import { AuthStore } from './auth.store';

type MockSignalSetter<T> = {
  set: (value: T) => void;
};

const mockSignalSetter = <T>(): MockSignalSetter<T> => ({ set: vi.fn() });

class MockAuthStore {
  currentUser = mockSignalSetter<unknown | null>();
  personas = mockSignalSetter<unknown[]>();
  loading = mockSignalSetter<boolean>();
  error = mockSignalSetter<string | null>();
}

describe('AuthResetService', () => {
  let service: AuthResetService;
  let authStore: MockAuthStore;
  let router: Router;

  beforeEach(() => {
    authStore = new MockAuthStore();
    router = { navigate: vi.fn(() => Promise.resolve(true)) } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        AuthResetService,
        { provide: AuthStore, useValue: authStore },
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(AuthResetService);
  });

  it('should clear auth state and navigate to landing', () => {
    document.cookie = 'access_token=test-token; Path=/;';

    service.resetAuth();

    expect(authStore.currentUser.set).toHaveBeenCalledWith(null);
    expect(authStore.personas.set).toHaveBeenCalledWith([]);
    expect(authStore.loading.set).toHaveBeenCalledWith(false);
    expect(authStore.error.set).toHaveBeenCalledWith(null);
    expect(document.cookie).not.toContain('access_token=');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
