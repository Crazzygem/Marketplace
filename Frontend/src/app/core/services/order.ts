import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse, DeleteResponse, PaginatedResponse } from '../models/api-response';

export interface Order {
  order_id: number;
  user_id: number;
  listing_id: number;
  quantity: number;
  total_price: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  shipping_address: string;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at?: string;
  listing?: {
    listing_id: number;
    title: string;
    image_urls?: string[];
    price: number;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateOrderRequest {
  listing_id: number;
  quantity: number;
  shipping_address: string;
  payment_method: string;
  transaction_id?: string;
}

export interface UpdateOrderRequest {
  status?: Order['status'];
  shipping_address?: string;
  payment_method?: string;
}

export interface OrderQueryParams {
  page?: number;
  per_page?: number;
  status?: Order['status'];
  user_id?: number;
  listing_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  getOrders(params?: OrderQueryParams): Observable<PaginatedResponse<Order> | Order[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof OrderQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<PaginatedResponse<Order> | Order[]>(this.apiUrl, { params: httpParams });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(data: CreateOrderRequest): Observable<MutationResponse<Order>> {
    return this.http.post<MutationResponse<Order>>(this.apiUrl, data);
  }

  updateOrder(id: number, data: UpdateOrderRequest): Observable<MutationResponse<Order>> {
    return this.http.put<MutationResponse<Order>>(`${this.apiUrl}/${id}`, data);
  }

  cancelOrder(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
