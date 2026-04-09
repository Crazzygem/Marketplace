import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  is_customer: boolean;
  is_staff: boolean;
  is_shop_owner: boolean;
  is_admin: boolean;
  ownShop?: {
    shop_id: number;
    shop_name: string;
  };
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}`;

  // State Signals
  currentUser = signal<User | null>(this.getUserFromStorage());
  token = signal<string | null>(localStorage.getItem('token'));

  // Computed Values
  isAuthenticated = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.is_admin || false);
  isShopOwner = computed(() => this.currentUser()?.is_shop_owner || false);
  isStaff = computed(() => this.currentUser()?.is_staff || false);
  isCustomer = computed(() => this.currentUser()?.is_customer || false);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.token.set(authResult.access_token);
    this.currentUser.set(authResult.user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
