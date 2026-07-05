import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { permissionRequirementMatches, type PermissionRequirement } from './permission.utils';
import { AuthStore } from './auth.store';

export const permissionGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const requiredPermission = route.data['permission'] as PermissionRequirement | undefined;

  if (!requiredPermission) {
    return true;
  }

  return authStore.ensureCurrentUser().pipe(
    map(() =>
      permissionRequirementMatches(authStore.hasPermission.bind(authStore), requiredPermission)
        ? true
        : router.createUrlTree(['/lab/dashboard']),
    ),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
