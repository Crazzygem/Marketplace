import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse, DeleteResponse, ShopStats } from '../models/api-response';

export interface Shop {
  shop_id: number;
  owner_id: number;
  shop_name: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  subscription_tier: 'free' | 'basic' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  member_id: number;
  id?: number; // For backward compatibility with templates
  shop_id: number;
  user_id: number;
  role: 'owner' | 'manager' | 'employee';
  created_at: string;
  updated_at?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateShopRequest {
  shop_name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}

export interface AddStaffRequest {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/shops`;
  private readonly shopMembersUrl = `${environment.apiUrl}/shop-members`;
  private readonly myShopUrl = `${environment.apiUrl}/my-shop`;

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  getShop(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  createShop(shop: CreateShopRequest): Observable<MutationResponse<Shop>> {
    return this.http.post<MutationResponse<Shop>>(this.apiUrl, shop);
  }

  updateShop(id: number, shop: Partial<Shop>): Observable<MutationResponse<Shop>> {
    return this.http.put<MutationResponse<Shop>>(`${this.apiUrl}/${id}`, shop);
  }

  deleteShop(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  getShopStats(): Observable<ShopStats> {
    return this.http.get<ShopStats>(`${this.myShopUrl}/stats`);
  }

  updateMyShop(shop: Partial<Shop>): Observable<MutationResponse<Shop>> {
    return this.http.put<MutationResponse<Shop>>(`${this.myShopUrl}`, shop);
  }

  getStaff(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(this.shopMembersUrl);
  }

  addStaff(memberData: AddStaffRequest): Observable<MutationResponse<StaffMember>> {
    return this.http.post<MutationResponse<StaffMember>>(this.shopMembersUrl, memberData);
  }

  removeStaff(memberId: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.shopMembersUrl}/${memberId}`);
  }
}
