import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthStore } from './auth.store';

export const permissionGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const requiredPermission = route.data['permission'] as string | string[] | undefined;

  if (!requiredPermission) {
    return true;
  }

  const requiredPermissions = Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission];

  return authStore.ensureCurrentUser().pipe(
    map(() =>
      requiredPermissions.some((permission) => authStore.hasPermission(permission))
        ? true
        : router.createUrlTree(['/lab/dashboard']),
    ),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
