import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserDto, DashboardSnapshotDto, PersonaDto } from './lab-api.models';
import { SpringApiClientService } from '../../../../libs/generated/spring-api-client/src/spring-api-client.service';

@Injectable({ providedIn: 'root' })
export class SpringApiFacade {
  private readonly api = inject(SpringApiClientService);

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
