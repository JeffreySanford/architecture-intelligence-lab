import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserDto, DashboardSnapshotDto, PersonaDto } from './lab-api.models';
import { LabControllerApiService } from '@generated/spring-api-client';

type SpringApiRequestOptions = Parameters<LabControllerApiService['personas']>[2];

@Injectable({ providedIn: 'root' })
export class SpringApiFacade {
  private readonly api = inject(LabControllerApiService);

  private readonly jsonAcceptOptions = {
    httpHeaderAccept: 'application/json',
  } as unknown as SpringApiRequestOptions;

  getPersonas(): Observable<PersonaDto[]> {
    return this.api.personas(undefined, false, this.jsonAcceptOptions);
  }

  selectPersona(personaId: string): Observable<CurrentUserDto> {
    return this.api.selectPersona(personaId, undefined, false, this.jsonAcceptOptions);
  }

  getCurrentUser(): Observable<CurrentUserDto> {
    return this.api.me(undefined, undefined, false, this.jsonAcceptOptions);
  }

  getDashboardSnapshot(dataset: string): Observable<DashboardSnapshotDto> {
    return this.api.dashboardSnapshot(dataset, undefined, false, this.jsonAcceptOptions);
  }
}
