import { TestBed } from '@angular/core/testing';
import { delay, firstValueFrom, of } from 'rxjs';
import { AuthStore } from './auth.store';
import { SpringApiFacade } from '../api/spring-api.facade';
import { CurrentUserDto, PersonaDto } from '../api/lab-api.models';

class MockSpringApiFacade {
  getPersonas() {
    return of([
      { id: 'alice', name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] },
      { id: 'fiona', name: 'Fiona', role: 'Contract Admin', description: 'Contract Admin persona', permissions: ['contracts:view'] },
    ] as PersonaDto[]).pipe(delay(0));
  }

  selectPersona(personaId: string) {
    const currentUser =
      personaId === 'fiona'
        ? {
            persona: { id: 'fiona', name: 'Fiona', role: 'Contract Admin', description: 'Contract Admin persona', permissions: ['contracts:view'] },
            roles: ['contract-admin'],
            permissions: ['contracts:view'],
          }
        : {
            persona: { id: personaId, name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] },
            roles: ['viewer'],
            permissions: ['dashboard:view'],
          };

    return of(currentUser as CurrentUserDto).pipe(delay(0));
  }

  getCurrentUser() {
    return of({
      persona: { id: 'alice', name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] },
      roles: ['viewer'],
      permissions: ['dashboard:view'],
    } as CurrentUserDto).pipe(delay(0));
  }
}

describe('AuthStore', () => {
  let authStore: AuthStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: SpringApiFacade, useClass: MockSpringApiFacade },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
  });

  it('should load personas through SpringApiFacade and update state', async () => {
    const personas = await firstValueFrom(authStore.loadPersonas());
    expect(personas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'alice', name: 'Alice' }),
        expect.objectContaining({ id: 'fiona', name: 'Fiona' }),
      ]),
    );
    expect(authStore.personas()).toHaveLength(2);
    expect(authStore.personas().map((persona) => persona.id)).toEqual(['alice', 'fiona']);
  });

  it('should select persona and update currentUser state', async () => {
    const currentUser = await firstValueFrom(authStore.selectPersona('alice'));
    expect(currentUser.persona?.id).toBe('alice');
    expect(authStore.currentUser()?.persona?.name).toBe('Alice');
    expect(authStore.hasPermission('dashboard:view')).toBe(true);
  });

  it('should switch persona and update currentUser permissions accordingly', async () => {
    const currentUser = await firstValueFrom(authStore.selectPersona('fiona'));

    expect(currentUser.persona?.id).toBe('fiona');
    expect(currentUser.persona?.role).toBe('Contract Admin');
    expect(authStore.currentUser()?.persona?.name).toBe('Fiona');
    expect(authStore.hasPermission('contracts:view')).toBe(true);
    expect(authStore.hasPermission('dashboard:view')).toBe(false);
  });

  it('should load current user on demand', async () => {
    const currentUser = await firstValueFrom(authStore.loadCurrentUser());
    expect(currentUser.roles).toEqual(['viewer']);
    expect(authStore.currentUser()?.permissions).toContain('dashboard:view');
  });

  it('should track separate personasLoading and currentUserLoading states', async () => {
    expect(authStore.personasLoading()).toBe(false);
    expect(authStore.currentUserLoading()).toBe(false);

    const personasPromise = authStore.loadPersonas().toPromise();
    expect(authStore.personasLoading()).toBe(true);
    expect(authStore.currentUserLoading()).toBe(false);

    await personasPromise;
    expect(authStore.personasLoading()).toBe(false);
    expect(authStore.currentUserLoading()).toBe(false);

    const selectPromise = authStore.selectPersona('alice').toPromise();
    expect(authStore.personasLoading()).toBe(false);
    expect(authStore.currentUserLoading()).toBe(true);

    await selectPromise;
    expect(authStore.personasLoading()).toBe(false);
    expect(authStore.currentUserLoading()).toBe(false);
  });

  it('should compute permission set membership correctly', async () => {
    await firstValueFrom(authStore.selectPersona('fiona'));

    expect(authStore.permissionSet().has('contracts:view')).toBe(true);
    expect(authStore.permissionSet().has('dashboard:view')).toBe(false);
  });

  it('should include persona permissions when top-level current user permissions are missing', () => {
    authStore.currentUser.set({
      persona: {
        id: 'henry-mcp-explorer',
        name: 'Henry MCP Explorer',
        role: 'MCP Explorer',
        description: 'Developer persona',
        permissions: ['dashboard:view', 'developer:view', 'mcp:view'],
      },
      roles: ['MCP Explorer'],
    } as CurrentUserDto);

    expect(authStore.hasPermission('developer:view')).toBe(true);
    expect(authStore.hasPermission('mcp:view')).toBe(true);
  });
});
