import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '@environments/environment';

export interface User {
  id: string | number;
  nombre?: string;
  correo: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  /** Verifica sesión consultando a Sacramentos (cookie HttpOnly) */
  me(): Observable<User | null> {
    return this.http
      .get<{ user: User }>(`${environment.sacAuthUrl}auth/me`, { withCredentials: true })
      .pipe(
        map((resp) => resp.user),
        tap((user) => this.userSubject.next(user)),
        catchError(() => {
          this.userSubject.next(null);
          return of(null);
        })
      );
  }

  /** Catequesis NO hace login: redirige al portal (Sacramentos) */
  goToCentralLogin(returnUrl?: string) {
    const url = returnUrl
      ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/auth/login';

    window.location.href = url; // misma pestaña
  }

  /** Logout central (borra cookie) */
  logout(): Observable<any> {
    return this.http
      .post(`${environment.sacAuthUrl}auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.userSubject.next(null)));
  }

  /** Solo sirve si ya cargaste user con me() */
  isAuthenticatedSync(): boolean {
    return !!this.userSubject.value;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    return (this.userSubject.value?.rol === role.toUpperCase()) || false;
  }
}