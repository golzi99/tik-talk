import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, TokenResponse } from './auth-interface';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);

  token: string | null = null;
  refreshToken: string | null = null;

  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  login(payload: Partial<Auth>) {
    const fd = new FormData();
    fd.append('username', payload.username ?? '');
    fd.append('password', payload.password ?? '');
    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, fd).pipe(
      tap(val => {
        this.saveTokens(val);
      })
    );
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        catchError(err => {
          this.logout();
          return throwError(err);
        }),
        tap(val => {
          this.saveTokens(val);
        })
      );
  }

  logout() {
    this.cookieService.delete('token');
    this.cookieService.delete('refresh_token');
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refresh_token');
    }
    return !!this.token;
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;
    this.cookieService.set('token', this.token);
    this.cookieService.set('refresh_token', this.refreshToken);
  }
}
