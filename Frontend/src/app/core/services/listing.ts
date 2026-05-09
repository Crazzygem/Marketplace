import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Listing } from '../models/listing';
import { PaginatedResponse, MutationResponse, DeleteResponse } from '../models/api-response';

// Query parameters interface for getListings
export interface ListingQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  sort?: string;
  status?: string;
  shop_id?: number;
  user_id?: number;
  include_sold?: boolean;
  include_inactive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/listings`;

  getListings(params?: ListingQueryParams): Observable<PaginatedResponse<Listing> | Listing[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof ListingQueryParams];
        if (value !== undefined && value !== null) {
          // Handle boolean values - convert to string for API
          if (typeof value === 'boolean') {
            httpParams = httpParams.set(key, value ? 'true' : 'false');
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<PaginatedResponse<Listing> | Listing[]>(this.apiUrl, {
      params: httpParams,
    });
  }

  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/${id}`);
  }

  createListing(listing: Partial<Listing>): Observable<MutationResponse<Listing>> {
    return this.http.post<MutationResponse<Listing>>(this.apiUrl, listing);
  }

  updateListing(id: number, listing: Partial<Listing>): Observable<MutationResponse<Listing>> {
    return this.http.put<MutationResponse<Listing>>(`${this.apiUrl}/${id}`, listing);
  }

  deleteListing(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  markAsSold(id: number): Observable<MutationResponse<Listing>> {
    return this.http.post<MutationResponse<Listing>>(`${this.apiUrl}/${id}/mark-as-sold`, {});
  }

  restock(id: number): Observable<MutationResponse<Listing>> {
    return this.http.post<MutationResponse<Listing>>(`${this.apiUrl}/${id}/restock`, {});
  }
}
