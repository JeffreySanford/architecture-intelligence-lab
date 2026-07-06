import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { CurrentUserDto, PersonaDto } from '../api/lab-api.models';
import { SpringApiFacade } from '../api/spring-api.facade';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(SpringApiFacade);

  readonly personas = signal<PersonaDto[]>([]);
  readonly currentUser = signal<CurrentUserDto | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly permissionSet = computed(() => {
    const currentUser = this.currentUser();
    return new Set([
      ...(currentUser?.permissions ?? []),
      ...(currentUser?.persona?.permissions ?? []),
    ]);
  });

  loadPersonas(): Observable<PersonaDto[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.getPersonas().pipe(
      tap((personas) => {
        this.personas.set(personas);
      }),
      finalize(() => this.loading.set(false)),
      catchError((error: unknown) => {
        this.error.set('Unable to load personas from Spring.');
        throw error;
      }),
    );
  }

  selectPersona(personaId?: string): Observable<CurrentUserDto> {
    if (!personaId) {
      throw new Error('Persona id is required');
    }

    this.loading.set(true);
    this.error.set(null);

    return this.api.selectPersona(personaId).pipe(
      tap((currentUser) => this.currentUser.set(currentUser)),
      tap(() => this.loading.set(false)),
      catchError((error: unknown) => {
        this.loading.set(false);
        this.error.set('Unable to select persona.');
        throw error;
      }),
    );
  }

  loadCurrentUser(): Observable<CurrentUserDto> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.getCurrentUser().pipe(
      tap((currentUser) => this.currentUser.set(currentUser)),
      tap(() => this.loading.set(false)),
      catchError((error: unknown) => {
        this.loading.set(false);
        this.error.set('Unable to load current user.');
        throw error;
      }),
    );
  }

  ensureCurrentUser(): Observable<boolean> {
    if (this.currentUser()) {
      return of(true);
    }

    return this.loadCurrentUser().pipe(map(() => true));
  }

  hasPermission(permission: string): boolean {
    return this.permissionSet().has(permission);
  }
}
