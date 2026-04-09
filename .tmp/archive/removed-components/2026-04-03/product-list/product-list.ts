import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../core/services/listing';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { getImageUrl } from '../../../shared/utils/image.utils';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private listingService = inject(ListingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  products: any[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated() || !this.authService.isShopOwner()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadProducts();

    // Check if data was recently updated and refresh if needed
    this.checkAndRefreshData();
  }

  loadProducts() {
    // Get all listings for the current user (both shop-bound and independent)
    // Include sold and inactive items so sellers can see and manage all their products
    this.listingService.getListings({ include_sold: true, include_inactive: true }).subscribe({
      next: (response: any) => {
        this.products = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  editProduct(productId: number) {
    this.router.navigate(['/shop/products/edit', productId]);
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.listingService.deleteListing(productId).subscribe({
        next: () => {
          // Set a flag to indicate that data has been updated
          localStorage.setItem('listingUpdated', Date.now().toString());

          this.products = this.products.filter(p => p.listing_id !== productId);
        },
        error: (error) => {
          this.logger.error('Error deleting product:', error);
          this.errorMessage = 'Failed to delete product';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary';

    switch (status.toLowerCase()) {
      case 'active':
      case 'published':
        return 'bg-success';   // Green
      case 'pending':
      case 'draft':
        return 'bg-warning';   // Yellow/Orange
      case 'out of stock':
      case 'sold out':
      case 'sold':
        return 'bg-danger';    // Red
      case 'archived':
      case 'inactive':
        return 'bg-dark';      // Black/Grey
      default:
        return 'bg-secondary'; // Grey
    }
  }

  checkAndRefreshData() {
    // Check if there's a flag indicating data was recently updated
    const lastUpdate = localStorage.getItem('listingUpdated');
    if (lastUpdate) {
      const updateTime = parseInt(lastUpdate, 10);
      const currentTime = Date.now();
      // If the update happened within the last 5 minutes, refresh the data
      if (currentTime - updateTime < 5 * 60 * 1000) {
        this.loadProducts();
        // Clear the flag after refreshing
        localStorage.removeItem('listingUpdated');
      }
    }
  }

  viewProduct(productId: number) {
    // Navigate to the product detail page (this might need to be implemented)
    // For now, we'll just log it
    this.logger.info('View product:', { productId });
  }

  markAsSold(product: any) {
    if (confirm(`Mark "${product.title}" as sold? This will show a SOLD badge on the listing.`)) {
      this.listingService.markAsSold(product.listing_id).subscribe({
        next: (response) => {
          product.is_sold = true;
          product.sold_at = new Date();
          this.logger.info('Product marked as sold:', { productId: product.listing_id });
        },
        error: (error) => {
          this.logger.error('Error marking product as sold:', error);
          this.errorMessage = 'Failed to mark product as sold';
        }
      });
    }
  }

  restock(product: any) {
    if (confirm(`Restock "${product.title}"? This will remove the SOLD badge.`)) {
      this.listingService.restock(product.listing_id).subscribe({
        next: (response) => {
          product.is_sold = false;
          product.sold_at = null;
          this.logger.info('Product restocked:', { productId: product.listing_id });
        },
        error: (error) => {
          this.logger.error('Error restocking product:', error);
          this.errorMessage = 'Failed to restock product';
        }
      });
    }
  }

  // Use shared utility for image URL
  getImageUrl = getImageUrl;
}
