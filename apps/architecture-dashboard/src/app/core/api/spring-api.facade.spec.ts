import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { SpringApiFacade } from './spring-api.facade';
import { LabControllerApiService } from '@generated/spring-api-client';
import { CurrentUserDto, DashboardSnapshotDto } from './lab-api.models';

class MockLabControllerApiService {
  personas() {
    return of([{ id: 'alice', name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] }]);
  }

  selectPersona(personaId: string) {
    return of({ persona: { id: personaId, name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] }, roles: ['viewer'], permissions: ['dashboard:view'] } as CurrentUserDto);
  }

  me() {
    return of({ persona: { id: 'alice', name: 'Alice', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view'] }, roles: ['viewer'], permissions: ['dashboard:view'] } as CurrentUserDto);
  }

  dashboardSnapshot(dataset: string) {
    return of({ dataset, loans: [], borrowers: [], documents: [], statusCodes: [] } as DashboardSnapshotDto);
  }
}

describe('SpringApiFacade', () => {
  let facade: SpringApiFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        SpringApiFacade,
        { provide: LabControllerApiService, useClass: MockLabControllerApiService },
      ],
    }).compileComponents();

    facade = TestBed.inject(SpringApiFacade);
  });

  it('should return personas from generated client', async () => {
    const personas = await firstValueFrom(facade.getPersonas());
    expect(personas).toEqual([
      expect.objectContaining({ id: 'alice', name: 'Alice' }),
    ]);
  });

  it('should select persona through generated client', async () => {
    const user = await firstValueFrom(facade.selectPersona('alice'));
    expect(user.persona?.id).toBe('alice');
    expect(user.permissions).toContain('dashboard:view');
  });

  it('should load current user through generated client', async () => {
    const user = await firstValueFrom(facade.getCurrentUser());
    expect(user.persona?.name).toBe('Alice');
  });

  it('should load dashboard snapshot through generated client', async () => {
    const snapshot = await firstValueFrom(facade.getDashboardSnapshot('small'));
    expect(snapshot.dataset).toBe('small');
    expect(snapshot.loans).toEqual([]);
  });
});
