import { map, Observable, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  // ─── Login ───────────────────────────────────────────────────────────────
  // ─── Login ───────────────────────────────────────────────────────────────
  login(email: string, password: string, role: UserRole): Observable<AuthUser> {
    // 1. Use GET to search json-server for a matching user
    return this.http
      .get<any[]>(`${this.API_URL}/users?email=${email}&password=${password}&role=${role}`)
      .pipe(
        map((users) => {
          // 2. If the array is empty, no user matched those credentials!
          if (users.length === 0) {
            throw new Error('Invalid email, password, or role');
          }

          // 3. Get the matched user and attach a mock token (just like your register method)
          const user = users[0];
          return {
            ...user,
            token: 'mock-token-' + user.id,
          };
        }),
        tap((user) => this.saveSession(user)),
      );
  }

  // ─── Register ────────────────────────────────────────────────────────────
  register(payload: any): Observable<AuthUser> {
    return this.http.post<any>(`${this.API_URL}/users`, payload).pipe(
      map((response) => ({
        // Standard json-server returns the data directly in the 'response'
        ...response,
        // Generate a fake token since json-server doesn't make real ones
        token: 'mock-token-' + response.id,
      })),
      tap((user) => this.saveSession(user)),
    );
  }

  // ─── Session helpers ─────────────────────────────────────────────────────
  private saveSession(user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
