import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse, DeleteResponse, PaginatedResponse } from '../models/api-response';

export interface Review {
  review_id: number;
  reviewer_id: number;
  seller_id: number;
  listing_id?: number;
  star_rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  reviewer?: {
    id: number;
    name: string;
  };
  seller?: {
    id: number;
    name: string;
  };
  listing?: {
    listing_id: number;
    title: string;
  };
}

export interface CreateReviewRequest {
  seller_id: number;
  listing_id?: number;
  star_rating: number;
  comment?: string;
}

export interface ReviewQueryParams {
  page?: number;
  per_page?: number;
  seller_id?: number;
  listing_id?: number;
  reviewer_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  getReviews(params?: ReviewQueryParams): Observable<PaginatedResponse<Review> | Review[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof ReviewQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<PaginatedResponse<Review> | Review[]>(this.apiUrl, { params: httpParams });
  }

  getReview(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  createReview(review: CreateReviewRequest): Observable<MutationResponse<Review>> {
    return this.http.post<MutationResponse<Review>>(this.apiUrl, review);
  }

  updateReview(id: number, review: Partial<CreateReviewRequest>): Observable<MutationResponse<Review>> {
    return this.http.put<MutationResponse<Review>>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
