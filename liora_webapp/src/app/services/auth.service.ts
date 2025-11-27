import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface TokenResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private tokenKey = 'liora_token';

  constructor(private http: HttpClient) {}

  // login 
  login(username: string, password: string): Observable<TokenResponse> {
    const body = { username, password };

    return this.http
      .post<TokenResponse>(`${this.baseUrl}token/`, body)
      .pipe(
        tap((res) => {
          this.setToken(res.token);
        })
      );
  }
  //token helpers
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // headers with Authorization: Token ...
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Token ${token}` })
      : new HttpHeaders();
  }
}
