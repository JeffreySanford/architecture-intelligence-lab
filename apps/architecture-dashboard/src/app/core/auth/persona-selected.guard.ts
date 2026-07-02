import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthStore } from './auth.store';

export const personaSelectedGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.ensureCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
