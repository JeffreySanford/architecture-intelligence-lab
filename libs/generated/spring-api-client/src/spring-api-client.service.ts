import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserDto } from './generated/models/currentUserDto';
import { DashboardSnapshotDto } from './generated/models/dashboardSnapshotDto';
import { PersonaDto } from './generated/models/personaDto';
import { LabControllerApiService } from './generated/api/labController.service';

@Injectable({ providedIn: 'root' })
export class SpringApiClientService {
  private readonly api = inject(LabControllerApiService);

  getPersonas(): Observable<PersonaDto[]> {
    return this.api.personas();
  }

  selectPersona(personaId: string): Observable<CurrentUserDto> {
    return this.api.selectPersona(personaId);
  }

  getCurrentUser(): Observable<CurrentUserDto> {
    return this.api.me();
  }

  getDashboardSnapshot(dataset: string): Observable<DashboardSnapshotDto> {
    return this.api.dashboardSnapshot(dataset);
  }
}
