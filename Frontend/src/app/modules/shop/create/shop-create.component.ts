import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../../core/services/logger.service';
import { CategoryIconService } from '../../../core/services/category-icon.service';

@Component({
  selector: 'app-shop-create',
  standalone: false, // Important for NgModule
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.css'],
})
export class ShopCreateComponent implements OnInit {
  private shopService = inject(ShopService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private categoryIconService = inject(CategoryIconService);

  shopData = {
    shop_name: '',
    description: '',
    category: 'General', // Default category
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    // Check if user is already a shop owner
    if (this.authService.isShopOwner()) {
      // Redirect to their shop if they already have one
      this.router.navigate(['/shop']);
    }
  }

  createShop() {
    this.loading = true;
    this.errorMessage = '';

    // Validate form
    if (!this.shopData.shop_name.trim()) {
      this.errorMessage = 'Shop name is required';
      this.loading = false;
      return;
    }

    // Prepare shop data
    const shopPayload = {
      shop_name: this.shopData.shop_name,
      description: this.shopData.description,
      category: this.shopData.category,
      owner_id: this.authService.currentUser()?.id,
    };

    this.shopService.createShop(shopPayload).subscribe({
      next: (response) => {
        this.logger.info('Shop created successfully', response);
        this.successMessage = 'Shop created successfully! Redirecting to your shop dashboard...';
        this.loading = false;
        // Redirect to the new shop dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/shop']);
        }, 2000);
      },
      error: (error) => {
        this.logger.error('Error creating shop:', error);
        this.errorMessage = error.error?.message || 'Failed to create shop. Please try again.';
        this.loading = false;
      },
    });
  }

  cancel() {
    // Navigate back to home page
    this.router.navigate(['/public/home']);
  }
}
