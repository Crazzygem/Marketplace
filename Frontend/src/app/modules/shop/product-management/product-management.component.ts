import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ShopService } from '../../../core/services/shop';
import { ListingService } from '../../../core/services/listing';
import { CategoryService } from '../../../core/services/category';
import { CategoryIconService } from '../../../core/services/category-icon.service';
import { AuthService } from '../../../core/services/auth';
import { Category } from '../../../core/models/category';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../../core/services/logger.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AlertComponent,
    BadgeComponent,
    SkeletonComponent,
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private shopService = inject(ShopService);
  private listingService = inject(ListingService);
  private categoryService = inject(CategoryService);
  categoryIconService = inject(CategoryIconService);
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = environment.apiUrl;

  // Form data
  productData = {
    title: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: null as number | null,
    shop_id: null as number | null,
    status: 'Active',
  };

  // Editing mode
  isEditing = false;
  listingId: number | null = null;

  // Image handling
  selectedFiles: File[] = [];
  existingImagePaths: string[] = []; // Store paths of existing images
  previewUrls: string[] = []; // Combined preview URLs for existing and new images

  categories: Category[] = [];
  userShop: any = null; // Store user's shop info
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditing = true;
        this.listingId = +params['id']; // Convert to number
        this.loadListingDetails(this.listingId);
      }
    });

    this.loadCategories();

    // Load user's shop if they have one
    this.shopService.getShopStats().subscribe({
      next: (response: any) => {
        if (response.shop_details && response.shop_details.shop_id) {
          this.userShop = response.shop_details;
          this.productData.shop_id = response.shop_details.shop_id;
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        // User doesn't have a shop, that's fine
        this.logger.info('User does not have a shop');
        this.cdr.markForCheck();
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories';
        this.cdr.markForCheck();
      },
    });
  }

  loadListingDetails(id: number) {
    this.listingService.getListing(id).subscribe({
      next: (response: any) => {
        const listing = response.data || response;
        this.productData = {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          stock_quantity: listing.stock_quantity,
          category_id: listing.category_id,
          shop_id: listing.shop_id, // Include shop_id
          status: listing.status,
        };

        // Load existing images if any
        if (listing.image_urls && Array.isArray(listing.image_urls)) {
          // Store the actual paths separately
          this.existingImagePaths = [...listing.image_urls];
          // Set up preview URLs for existing images
          this.previewUrls = listing.image_urls.map((path: string) => {
            // Remove any 'listings/' prefix if present and construct correct path
            const cleanPath = path.startsWith('listings/') ? path.replace('listings/', '') : path;
            const imagePath = `/storage/${cleanPath}`;
            return `${this.apiUrl.replace('/api', '')}${imagePath}`;
          });
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading listing details:', error);
        this.errorMessage = 'Failed to load listing details';
        this.router.navigate(['/shop/settings'], { queryParams: { tab: 'listings' } });
        this.cdr.markForCheck();
      },
    });
  }

  onFileSelected(event: any) {
    const files: FileList | null = event.target.files;
    if (files) {
      // Don't clear existing images, only add new ones
      this.selectedFiles = [];

      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.isValidImage(file)) {
          this.selectedFiles.push(file);

          // Create a preview URL for the image
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Add to end of previewUrls (after existing images)
            this.previewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          this.logger.error('Invalid image file selected');
        }
      }
    }
  }

  isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  }

  removeImage(index: number) {
    // Determine if this is an existing image or a new one
    const totalExistingImages = this.existingImagePaths.length;

    if (index < totalExistingImages) {
      // Removing an existing image - remove from existingImagePaths
      this.existingImagePaths.splice(index, 1);
      this.previewUrls.splice(index, 1);
    } else {
      // Removing a new image - remove from selectedFiles
      const newImageIndex = index - totalExistingImages;
      this.selectedFiles.splice(newImageIndex, 1);
      this.previewUrls.splice(index, 1);
    }
  }

  async uploadImages(): Promise<string[]> {
    if (this.selectedFiles.length === 0) {
      return [];
    }

    // In a real app, you would upload images to a server
    // For now, we'll just return placeholder URLs
    const uploadedUrls: string[] = [];

    for (const file of this.selectedFiles) {
      // Simulate upload process
      // In a real app, you would make an HTTP request to upload the image
      // and return the actual URL
      uploadedUrls.push(URL.createObjectURL(file)); // This is temporary for demo
    }

    return uploadedUrls;
  }

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create FormData to handle file uploads
    const formData = new FormData();

    // Add regular fields to FormData
    formData.append('title', this.productData.title);
    formData.append('description', this.productData.description);
    formData.append('price', this.productData.price.toString());
    formData.append('stock_quantity', this.productData.stock_quantity.toString());
    if (this.productData.category_id) {
      formData.append('category_id', this.productData.category_id.toString());
    }

    // Only append shop_id if it's provided (can be null for independent listings)
    if (this.productData.shop_id !== null) {
      formData.append('shop_id', this.productData.shop_id.toString());
    }
    formData.append('status', this.productData.status);

    // Add image files to FormData
    this.selectedFiles.forEach((file: File, index: number) => {
      formData.append(`images[${index}]`, file, file.name);
    });

    if (this.isEditing && this.listingId) {
      // For updates, determine if we're replacing images or keeping existing ones
      // If new images are selected, we replace all existing images with new ones
      // If no new images are selected, we keep existing images
      if (this.selectedFiles.length > 0) {
        // When new images are uploaded, we're replacing all existing images
        // Don't send existing images to backend - this signals replacement
        formData.append('replace_images', 'true');
      } else {
        // When no new images are uploaded, preserve existing images
        this.existingImagePaths.forEach((path: string, index: number) => {
          formData.append(`existing_images[${index}]`, path);
        });
        formData.append('replace_images', 'false');
      }

      // Update existing listing
      this.http.put(`${this.apiUrl}/listings/${this.listingId}`, formData).subscribe({
        next: (response: any) => {
          this.logger.debug('Update response:', response); // Debug logging

          // Set a flag to indicate that data has been updated
          localStorage.setItem('listingUpdated', Date.now().toString());

          this.successMessage = 'Product updated successfully!';
          // Navigate back to Settings → Listings tab after successful update
          this.router.navigate(['/shop/settings'], { queryParams: { tab: 'listings' } });
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error updating product:', error);
          this.logger.debug('Error details:', error.error); // Additional debug logging

          // Try to get a more specific error message
          let errorMsg = 'Failed to update product';
          if (error.error && typeof error.error === 'object') {
            if (error.error.message) {
              errorMsg = error.error.message;
            } else if (error.error.errors) {
              // Handle validation errors
              const firstErrorKey = Object.keys(error.error.errors)[0];
              errorMsg = error.error.errors[firstErrorKey][0];
            }
          } else if (error.message) {
            errorMsg = error.message;
          }

          this.errorMessage = errorMsg;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      // For new listings, just send to new images
      this.http.post(`${this.apiUrl}/listings`, formData).subscribe({
        next: (response: any) => {
          this.logger.debug('Create response:', response); // Debug logging

          // Set a flag to indicate that data has been updated
          localStorage.setItem('listingUpdated', Date.now().toString());

          this.successMessage = 'Product added successfully!';
          // Optionally redirect to product list after creation
          // this.router.navigate(['/shop/products']);
          this.resetForm();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error adding product:', error);
          this.logger.debug('Error details:', error.error); // Additional debug logging

          // Try to get a more specific error message
          let errorMsg = 'Failed to add product';
          if (error.error && typeof error.error === 'object') {
            if (error.error.message) {
              errorMsg = error.error.message;
            } else if (error.error.errors) {
              // Handle validation errors
              const firstErrorKey = Object.keys(error.error.errors)[0];
              errorMsg = error.error.errors[firstErrorKey][0];
            }
          } else if (error.message) {
            errorMsg = error.message;
          }

          this.errorMessage = errorMsg;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  resetForm() {
    if (this.userShop && this.userShop.shop_id) {
      this.productData = {
        title: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category_id: null,
        shop_id: this.userShop.shop_id,
        status: 'Active',
      };
    } else {
      this.productData = {
        title: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category_id: null,
        shop_id: null,
        status: 'Active',
      };
    }

    this.selectedFiles = [];
    this.previewUrls = [];
  }

  onCancel() {
    this.router.navigate(['/shop/settings'], { queryParams: { tab: 'listings' } });
  }

  deleteCurrentProduct() {
    if (!this.isEditing || !this.listingId) {
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      this.listingService.deleteListing(this.listingId).subscribe({
        next: () => {
          // Set a flag to indicate that data has been updated
          localStorage.setItem('listingUpdated', Date.now().toString());

          // Navigate back to Settings → Listings tab after deletion
          this.router.navigate(['/shop/settings'], { queryParams: { tab: 'listings' } });
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error deleting product:', error);
          this.errorMessage = 'Failed to delete product';
          this.cdr.markForCheck();
        },
      });
    }
  }

  getStatusBadgeVariant(status: string): BadgeVariant {
    const variantMap: Record<string, BadgeVariant> = {
      Active: 'success',
      Inactive: 'warning',
    };
    return variantMap[status] || 'default';
  }
}
