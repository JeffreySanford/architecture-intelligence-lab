import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.api.dashboardSnapshot(dataset, undefined, false, this.jsonAcceptOptions).pipe(
      map((snapshot) => this.validateDashboardSnapshot(snapshot)),
    );
  }

  private validateDashboardSnapshot(snapshot: DashboardSnapshotDto): DashboardSnapshotDto {
    if (!snapshot.dataset || !Array.isArray(snapshot.loans) || !Array.isArray(snapshot.borrowers)) {
      throw new Error('Spring dashboard contract gap: missing dataset, loans, or borrowers.');
    }

    for (const loan of snapshot.loans) {
      if (!loan.id || !loan.borrowerId || !loan.loanNumber || !loan.statusCode) {
        throw new Error('Spring dashboard contract gap: loan is missing a critical identifier field.');
      }

      if (typeof loan.amount !== 'number' || loan.amount <= 0) {
        throw new Error('Spring dashboard contract gap: loan amount must be a positive number.');
      }
    }

    return snapshot;
  }
}
