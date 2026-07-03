import { Route } from '@angular/router';
import { appRoutes } from './app.routes';
import { permissionGuard } from './core/auth/permission.guard';

describe('App route configuration', () => {
  it.each([
    ['architecture-flow', 'dashboard:view'],
    ['dashboard', 'dashboard:view'],
    ['capital-markets', 'loans:view'],
    ['security-search', 'loans:view'],
    ['map-inspector', 'dashboard:view'],
    ['signal-store-inspector', 'diagnostics:view'],
    ['backend-comparison', ['backend-comparison:view', 'realtime:view']],
    ['infrastructure', ['diagnostics:view', 'admin:view']],
    ['realtime', 'realtime:view'],
    ['openapi', 'contracts:view'],
    ['mcp', 'mcp:view'],
    ['admin', 'admin:view'],
  ])('protects /lab/%s with permissionGuard and %s permission', (path, permission) => {
    const labRoute = appRoutes.find((route) => route.path === 'lab');
    expect(labRoute).toBeDefined();

    const childRoute = labRoute?.children?.find((route: Route) => route.path === path);
    expect(childRoute).toBeDefined();
    expect(childRoute?.data?.['permission']).toEqual(permission);
    expect(Array.isArray(childRoute?.canActivate)).toBe(true);
    expect(childRoute?.canActivate?.[0]).toBe(permissionGuard);
  });
});
