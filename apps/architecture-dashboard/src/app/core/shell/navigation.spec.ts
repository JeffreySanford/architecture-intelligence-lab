import { CurrentUserDto } from '../api/lab-api.models';
import { visibleLabNavItems } from './navigation';

describe('visibleLabNavItems', () => {
  it('filters navigation by permissions only', () => {
    const currentUser = {
      persona: {
        id: 'any-persona',
        name: 'Any Persona',
        role: 'Unmapped Display Role',
      },
      roles: ['unmapped-role'],
      permissions: ['dashboard:view', 'developer:view', 'mcp:view', 'design:view'],
    } as CurrentUserDto;

    const labels = visibleLabNavItems(currentUser, (permission) =>
      currentUser.permissions?.includes(permission) ?? false,
    ).map((item) => item.label);

    expect(labels).toContain('PrimeNG Encapsulation Lab');
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Architecture Flow');
    expect(labels).toContain('MCP Dashboard');
    expect(labels).toContain('Glossary');
    expect(labels).toContain('Theme Governance');
    expect(labels).not.toContain('Admin');
    expect(labels).not.toContain('Realtime Lab');
  });

  it('does not show protected navigation without a current user', () => {
    expect(visibleLabNavItems(null, () => true)).toEqual([]);
  });

  it('shows design-system navigation for the Designer persona', () => {
    const currentUser = {
      persona: {
        id: 'adhan-designer',
        name: 'Adhan Designer',
        role: 'Designer',
      },
      roles: ['Designer'],
      permissions: ['design:view'],
    } as CurrentUserDto;

    const labels = visibleLabNavItems(currentUser, (permission) =>
      currentUser.permissions?.includes(permission) ?? false,
    ).map((item) => item.label);

    expect(labels).toEqual([
      'PrimeNG Encapsulation Lab',
      'Theme Governance',
    ]);
  });
});
