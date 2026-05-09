import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats, MutationResponse, ApiResponse } from '../models/api-response';

export interface UserRoles {
  customer: boolean;
  staff: boolean;
  shop_owner: boolean;
  admin: boolean;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  roles: UserRoles;
  is_banned: boolean;
  status?: string;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'shop_owner' | 'admin' | 'staff';
  shop_name?: string;
  shop_description?: string;
}

export interface UpdateRoleRequest {
  role: 'customer' | 'shop_owner' | 'admin' | 'staff';
  shop_name?: string;
  delete_shop?: boolean;
}

export interface ReportDTO {
  report_id: number;
  id: number;
  reporter_id: number;
  listing_id: number;
  reason: string;
  is_resolved: boolean;
  status: string;
  created_at: string;
  reportedItem?: string;
  listing?: {
    listing_id: number;
    title: string;
  };
  reporter?: UserDTO;
}

export interface BanUserResponse {
  message: string;
  user: UserDTO;
}

export interface CreateUserResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  shop?: {
    shop_id: number;
    shop_name: string;
  };
}

export interface UpdateRoleResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface ResolveReportResponse {
  message: string;
  report: ReportDTO;
}

export interface DeleteUserResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
  }

  createUser(data: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.apiUrl}/users`, data);
  }

  updateUserRole(userId: number, role: UpdateRoleRequest): Observable<UpdateRoleResponse> {
    return this.http.put<UpdateRoleResponse>(`${this.apiUrl}/users/${userId}/role`, role);
  }

  banUser(userId: number): Observable<BanUserResponse> {
    return this.http.post<BanUserResponse>(`${this.apiUrl}/users/${userId}/ban`, {});
  }

  unbanUser(userId: number): Observable<BanUserResponse> {
    return this.http.post<BanUserResponse>(`${this.apiUrl}/users/${userId}/unban`, {});
  }

  verifyShop(shopId: number): Observable<MutationResponse<{ shop_id: number; status: string }>> {
    return this.http.post<MutationResponse<{ shop_id: number; status: string }>>(
      `${this.apiUrl}/shops/${shopId}/verify`,
      {},
    );
  }

  getReports(): Observable<ReportDTO[]> {
    return this.http.get<ReportDTO[]>(`${this.apiUrl}/reports`);
  }

  resolveReport(reportId: number): Observable<ResolveReportResponse> {
    return this.http.post<ResolveReportResponse>(`${this.apiUrl}/reports/${reportId}/resolve`, {});
  }

  deleteUser(userId: number): Observable<DeleteUserResponse> {
    return this.http.delete<DeleteUserResponse>(`${this.apiUrl}/users/${userId}`);
  }
}
