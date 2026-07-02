import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserDto, DashboardSnapshotDto, PersonaDto } from '../../../../apps/architecture-dashboard/src/app/core/api/lab-api.models';
import { LabApiService } from '../../../../apps/architecture-dashboard/src/app/core/api/lab-api.service';

@Injectable({ providedIn: 'root' })
export class SpringApiClientService {
  private readonly api = inject(LabApiService);

  getPersonas(): Observable<PersonaDto[]> {
    return this.api.getPersonas();
  }

  selectPersona(personaId: string): Observable<CurrentUserDto> {
    return this.api.selectPersona(personaId);
  }

  getCurrentUser(): Observable<CurrentUserDto> {
    return this.api.getCurrentUser();
  }

  getDashboardSnapshot(dataset: string): Observable<DashboardSnapshotDto> {
    return this.api.getDashboardSnapshot(dataset);
  }
}
