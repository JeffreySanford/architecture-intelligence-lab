import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CurrentUserDto,
  DashboardSnapshotDto,
  PersonaDto,
} from './lab-api.models';

@Injectable({ providedIn: 'root' })
export class LabApiService {
  private readonly http = inject(HttpClient);

  getPersonas() {
    return this.http.get<PersonaDto[]>('/api/personas');
  }

  selectPersona(personaId: string) {
    return this.http.post<CurrentUserDto>(
      `/api/dev-auth/personas/${personaId}/select`,
      {},
      { withCredentials: true },
    );
  }

  getCurrentUser() {
    return this.http.get<CurrentUserDto>('/api/me', { withCredentials: true });
  }

  getDashboardSnapshot(dataset: string) {
    return this.http.get<DashboardSnapshotDto>('/api/dashboard/snapshot', {
      params: { dataset },
      withCredentials: true,
    });
  }
}
