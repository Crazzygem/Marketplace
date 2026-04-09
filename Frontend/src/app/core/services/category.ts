import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse, DeleteResponse } from '../models/api-response';

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
  icon?: string;
  is_popular?: boolean;
  created_at: string;
  updated_at: string;
  listings_count?: number;
}

export interface CreateCategoryRequest {
  category_name: string;
  description?: string;
  icon: string;
  is_popular?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CreateCategoryRequest): Observable<MutationResponse<Category>> {
    return this.http.post<MutationResponse<Category>>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<MutationResponse<Category>> {
    return this.http.put<MutationResponse<Category>>(`${this.apiUrl}/${id}`, category);
  }

  togglePopular(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/popular`, {});
  }

  deleteCategory(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
