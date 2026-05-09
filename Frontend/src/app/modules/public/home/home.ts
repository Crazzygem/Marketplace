import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListingService } from '../../../core/services/listing';
import { CategoryService } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';
import { SavedItemsService } from '../../../core/services/saved-items.service';
import { Listing } from '../../../core/models/listing';
import { Category } from '../../../core/models/category';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryIconService } from '../../../core/services/category-icon.service';
import { ListingCardComponent } from '../../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ListingCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private listingService = inject(ListingService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private savedItemsService = inject(SavedItemsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  categoryIconService = inject(CategoryIconService);

  listings: Listing[] = [];
  categories: Category[] = [];
  loading = false;

  get popularCategories(): Category[] {
    return this.categories.filter((c) => c.is_popular);
  }

  getIcon(iconName: string | undefined): string {
    return iconName || 'fa-tag';
  }

  // Search and filter properties
  searchQuery = '';
  selectedCategory: number | null = null;
  sortBy = 'newest';
  includeSold = false;

  // Pagination properties
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  };

  ngOnInit() {
    // Get query parameters
    const categoryId = this.route.snapshot.queryParamMap.get('category_id');

    if (categoryId) {
      this.selectedCategory = parseInt(categoryId, 10);
    }

    this.loadCategories();
    this.loadListings();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading categories:', error);
        this.cdr.markForCheck();
      },
    });
  }

  loadListings(page: number = 1) {
    this.loading = true;

    const params: any = {
      page: page,
      per_page: this.pagination.itemsPerPage,
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    if (this.selectedCategory) {
      params.category_id = this.selectedCategory;
    }

    if (this.sortBy) {
      params.sort = this.sortBy;
    }

    if (this.includeSold) {
      params.include_sold = true;
    }

    this.listingService.getListings(params).subscribe({
      next: (response: any) => {
        this.listings = response.data || response; // Handle both paginated and non-paginated responses

        // Update pagination if response has pagination info
        if (response.meta) {
          this.pagination.currentPage = response.meta.current_page || 1;
          this.pagination.totalPages = response.meta.last_page || 1;
          this.pagination.totalItems = response.meta.total || 0;
        } else {
          // Fallback if no pagination info
          this.pagination.currentPage = 1;
          this.pagination.totalPages = 1;
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading listings:', error);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  searchListings() {
    this.loadListings();
  }

  filterByCategory() {
    this.loadListings();
  }

  sortListings() {
    this.loadListings();
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.loadListings();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.loadListings(page);
    }
  }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(1, this.pagination.currentPage - 2);
    const end = Math.min(this.pagination.totalPages, this.pagination.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  sellSomething() {
    if (!this.authService.isAuthenticated()) {
      // If not logged in, redirect to login
      this.router.navigate(['/auth/login']);
      return;
    }

    // Allow all authenticated users to create listings
    this.router.navigate(['/shop/create-listing']);
  }

  isSaved(listingId: number): boolean {
    return this.savedItemsService.isSaved(listingId);
  }

  toggleSaved(listing: Listing) {
    // Call the service to toggle the saved status
    this.savedItemsService.toggleSaved(listing).subscribe({
      next: (response: any) => {
        // Show success message based on the response
        this.notificationService.success(
          response.is_saved ? 'Added to saved items!' : 'Removed from saved items!',
        );
      },
      error: (error) => {
        this.logger.error('Error toggling saved status:', error);
        this.notificationService.error('Failed to update saved status. Please try again.');
      },
    });
  }
}
