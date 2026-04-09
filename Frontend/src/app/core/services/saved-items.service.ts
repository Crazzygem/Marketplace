import { Injectable, signal, inject } from '@angular/core';
import { Listing } from '../models/listing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth';
import { Observable } from 'rxjs';
import { ToggleSavedResponse, MutationResponse } from '../models/api-response';
import { LoggerService } from './logger.service';

export interface SavedItem {
  id: number;
  listing: Listing;
  savedAt: Date;
}

export interface SavedItemResponse {
  id: number;
  listing_id: number;
  user_id: number;
  created_at: string;
  listing: Listing;
}

@Injectable({
  providedIn: 'root'
})
export class SavedItemsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/saved-items`;
  private savedItems = signal<SavedItem[]>([]);
  private logger = inject(LoggerService);

  // State signals
  items = this.savedItems.asReadonly();
  count = signal(0);
  loading = signal(false);

  private authService = inject(AuthService);

  constructor() {
    // Load saved items from the API on initialization only if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadSavedItems();
    }
  }

  // Load user's saved items from the API
  loadSavedItems(): void {
    this.loading.set(true);
    this.http.get<SavedItemResponse[]>(this.apiUrl).pipe(
      tap(items => {
        // Convert date strings to Date objects
        const itemsWithDates = items.map(item => {
          // Safely parse the date, fallback to current date if invalid
          let savedAt: Date;
          try {
            savedAt = item.created_at ? new Date(item.created_at) : new Date();
            // Check if the date is valid
            if (isNaN(savedAt.getTime())) {
              savedAt = new Date();
            }
          } catch {
            savedAt = new Date();
          }
          
          return {
            id: item.id,
            listing: item.listing,
            savedAt: savedAt
          };
        });
        this.savedItems.set(itemsWithDates);
        this.updateCount();
        this.loading.set(false);
      })
    ).subscribe({
      error: (error) => {
        // Silently handle unauthorized errors (when user is not logged in)
        if (error.status !== 401 && error.status !== 403) {
          this.logger.error('Error loading saved items:', error);
        }
        // Reset saved items when user is not authenticated
        this.savedItems.set([]);
        this.updateCount();
        this.loading.set(false);
      }
    });
  }

  // Add item to saved items
  addToSavedItems(listing: Listing): void {
    this.http.post<MutationResponse<SavedItemResponse>>(this.apiUrl, { listing_id: listing.listing_id }).subscribe({
      next: () => {
        // Refresh the saved items list
        this.loadSavedItems();
      },
      error: (error) => {
        this.logger.error('Error saving item:', error);
        // Show a user-friendly message if needed
        if (error.status === 401 || error.status === 403) {
          this.logger.info('User not authenticated. Redirect to login may be needed.');
        }
      }
    });
  }

  // Remove item from saved items
  removeFromSavedItems(listingId: number): void {
    // Find the saved item ID for this listing
    const savedItem = this.savedItems().find(item => item.listing.listing_id === listingId);

    if (savedItem) {
      this.http.delete(`${this.apiUrl}/${savedItem.id}`).subscribe({
        next: () => {
          // Refresh the saved items list
          this.loadSavedItems();
        },
        error: (error) => {
          this.logger.error('Error removing saved item:', error);
          // Show a user-friendly message if needed
          if (error.status === 401 || error.status === 403) {
            this.logger.info('User not authenticated. Redirect to login may be needed.');
          }
        }
      });
    }
  }

  // Check if item is saved
  isSaved(listingId: number): boolean {
    return this.savedItems().some(item => item.listing.listing_id === listingId);
  }

  // Toggle saved status and return the observable
  toggleSaved(listing: Listing): Observable<ToggleSavedResponse> {
    return this.http.post<ToggleSavedResponse>(`${this.apiUrl}/toggle`, { listing_id: listing.listing_id }).pipe(
      tap(() => {
        // Refresh the saved items list after successful toggle
        this.loadSavedItems();
      })
    );
  }

  // Clear all saved items
  clearSavedItems(): void {
    // Remove all saved items by removing each one individually
    const currentItems = [...this.savedItems()];
    currentItems.forEach(item => {
      this.removeFromSavedItems(item.listing.listing_id);
    });
  }

  // Private methods
  private updateCount(): void {
    const items = this.savedItems();
    this.count.set(items.length);
  }
}
