import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../core/services/listing';
import { ChatService } from '../../../core/services/chat';
import { AuthService } from '../../../core/services/auth';
import { SavedItemsService } from '../../../core/services/saved-items.service';
import { Listing } from '../../../core/models/listing';
import { environment } from '../../../../environments/environment';
import { getImageUrl, getAllImageUrls } from '../../../shared/utils/image.utils';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryIconService } from '../../../core/services/category-icon.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  standalone: false // Important for NgModule
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private savedItemsService = inject(SavedItemsService);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  categoryIconService = inject(CategoryIconService);

  listing: Listing | null = null;
  productId: string | null = '';
  loading = true;
  selectedImage: string | null = null;

  // Expose authService to template
  authServicePublic = this.authService;

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadListing(+this.productId);
    }
  }

  loadListing(id: number) {
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listing = data;
        // Set the first image as selected
        if (this.listing?.image_urls) {
          const images = this.getImagesArray(this.listing.image_urls);
          if (images.length > 0) {
            this.selectedImage = images[0];
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.logger.error('Error loading listing:', error);
        this.loading = false;
      }
    });
  }

  startChat() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.listing) {
      // Create a chat with the seller
      this.chatService.createChat({
        listing_id: this.listing.listing_id,
        message: 'Hi, I\'m interested in your product.'
      }).subscribe({
        next: (response) => {
          this.logger.info('Chat started successfully', response);
          // Navigate to the chat page
          this.router.navigate(['/chat', response.chat_room.room_id]);
        },
        error: (error) => {
          this.logger.error('Error starting chat:', error);
        }
      });
    }
  }

  toggleSaved() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.listing) {
      // Toggle the saved status of the listing
      this.savedItemsService.toggleSaved(this.listing).subscribe({
        next: (response: any) => {
          // Show success message based on the response
          this.notificationService.success(response.is_saved ? 'Added to saved items!' : 'Removed from saved items!');
        },
        error: (error) => {
          this.logger.error('Error toggling saved status:', error);
          this.notificationService.error('Failed to update saved status. Please try again.');
        }
      });
    }
  }

  isSaved(): boolean {
    if (this.listing) {
      return this.savedItemsService.isSaved(this.listing.listing_id);
    }
    return false;
  }

  // Use shared utility for image URL
  getImageUrl = getImageUrl;

  getImagesArray(imageUrls: any): string[] {
    return getAllImageUrls(imageUrls);
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  filterByCategory(categoryId: number | undefined) {
    if (categoryId) {
      // Navigate to home page with category filter
      this.router.navigate(['/public/home'], { queryParams: { category: categoryId } });
    }
  }

  // Helper method to safely access category properties
  getCategoryName(): string {
    return this.listing?.category?.category_name || 'Uncategorized';
  }

  getCategoryId(): number | undefined {
    return this.listing?.category?.category_id;
  }
}
