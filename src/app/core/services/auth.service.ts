import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '@shared/interfaces/user.interface';
import { TokenResponse } from '@shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';
  
  private readonly _isAuthenticated = signal<boolean>(this.hasToken());
  public readonly user = signal<string | null>(this.getUser());

  // Public getter for authentication state
  get isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.get<User[]>('assets/users.json').pipe(
      map(users => {
        const user = users.find(
          u => u.username === credentials.username && u.password === credentials.password
        );
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Generate mock tokens
        const accessToken = this.generateToken();
        const refreshToken = this.generateToken();

        const loginResponse: LoginResponse = {
          accessToken,
          refreshToken,
          user: { username: user.username }
        };

        this.setTokens(accessToken, refreshToken);
        this.setUser(user.username);
        this._isAuthenticated.set(true);
        this.user.set(user.username);

        return loginResponse;
      }),
      catchError(error => {
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._isAuthenticated.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    // Mock refresh token API call
    return of({
      accessToken: this.generateToken(),
      refreshToken: this.generateToken()
    }).pipe(
      tap(tokens => {
        this.setTokens(tokens.accessToken, tokens.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(username: string): void {
    localStorage.setItem(this.USER_KEY, username);
    this.user.set(username);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private checkAuthStatus(): void {
    const hasToken = this.hasToken();
    this._isAuthenticated.set(hasToken);
    if (hasToken) {
      this.user.set(this.getUser());
    }
  }

  private generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

