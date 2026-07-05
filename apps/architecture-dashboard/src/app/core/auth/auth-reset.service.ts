import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthResetService {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  resetAuth(): void {
    this.authStore.currentUser.set(null);
    this.authStore.personas.set([]);
    this.authStore.loading.set(false);
    this.authStore.error.set(null);

    try {
      window.localStorage.removeItem('access_token');
      window.sessionStorage.removeItem('access_token');
    } catch {
      // ignore storage access failures in constrained environments
    }

    document.cookie = 'access_token=; Path=/; SameSite=Lax; Max-Age=0';
    void this.router.navigate(['/']);
  }
}
