import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { AuthService } from './auth.service';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthUserService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getCurrentUser() {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<CurrentUser>(`${this.baseUrl}user/me`, { headers });
  }
}
