import { Component, ChangeDetectionStrategy, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SavedItemsService } from '../../../core/services/saved-items.service';
import { OrderService } from '../../../core/services/order';
import { AuthService } from '../../../core/services/auth';
import { Listing } from '../../../core/models/listing';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

interface SavedItem {
  listing: Listing;
  savedAt: Date;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent, SkeletonComponent, EmptyStateComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private savedItemsService = inject(SavedItemsService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  savedItems: SavedItem[] = [];
  total = 0;

  // Loading and alert states
  isLoading = signal(false);
  showAlert = signal(false);
  alertVariant = signal<'success' | 'danger' | 'warning' | 'info'>('info');
  alertTitle = signal('');
  alertDescription = signal('');

  // Delivery information
  firstName = '';
  lastName = '';
  email = '';
  shippingAddress = '';
  city = '';
  state = '';
  zip = '';

  // Payment information
  paymentMethod = 'Credit Card';
  cardName = '';
  cardNumber = '';
  cardExpiration = '';
  cardCvv = '';

  constructor() {
    // Use effect to reactively update saved items when the signal changes
    effect(() => {
      this.savedItems = this.savedItemsService.items();
      this.calculateTotal();
    });
  }

  ngOnInit() {
    // Initialize with user's profile data if available
    const user = this.authService.currentUser();
    if (user) {
      this.firstName = user.name.split(' ')[0] || '';
      this.lastName = user.name.split(' ').slice(1).join(' ') || '';
      this.email = user.email;
    }
  }

  calculateTotal() {
    this.total = this.savedItems.reduce((sum, item) => sum + item.listing.price, 0);
  }

  placeOrder() {
    if (!this.isValidForm()) {
      this.showAlert.set(true);
      this.alertVariant.set('danger');
      this.alertTitle.set('Validation Error');
      this.alertDescription.set('Please fill in all required fields');
      return;
    }

    // Show loading state
    this.isLoading.set(true);

    // Create orders for each saved item
    const orderPromises = this.savedItems.map((savedItem) => {
      return this.orderService
        .createOrder({
          listing_id: savedItem.listing.listing_id,
          quantity: 1, // For saved items, we assume quantity of 1
          shipping_address: `${this.firstName} ${this.lastName}, ${this.shippingAddress}, ${this.city}, ${this.state} ${this.zip}`,
          payment_method: this.paymentMethod,
          transaction_id: this.generateTransactionId(),
        })
        .toPromise();
    });

    Promise.all(orderPromises)
      .then(() => {
        this.isLoading.set(false);
        this.showAlert.set(true);
        this.alertVariant.set('success');
        this.alertTitle.set('Order Placed Successfully!');
        this.alertDescription.set('Thank you for your purchase. Your order has been confirmed.');
        this.savedItemsService.clearSavedItems();
        setTimeout(() => {
          this.router.navigate(['/public/home']);
        }, 3000);
      })
      .catch((error) => {
        this.isLoading.set(false);
        this.logger.error('Error placing order:', error);
        this.showAlert.set(true);
        this.alertVariant.set('danger');
        this.alertTitle.set('Order Failed');
        this.alertDescription.set('There was an error placing your order. Please try again.');
      });
  }

  isValidForm(): boolean {
    // Check if delivery information is filled
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.shippingAddress ||
      !this.city ||
      !this.state ||
      !this.zip
    ) {
      return false;
    }

    // If payment method is credit/debit card, check card details
    if (this.paymentMethod === 'Credit Card' || this.paymentMethod === 'Debit Card') {
      if (!this.cardName || !this.cardNumber || !this.cardExpiration || !this.cardCvv) {
        return false;
      }
    }

    return true;
  }

  clearSavedItems() {
    if (confirm('Are you sure you want to clear your saved items?')) {
      this.savedItemsService.clearSavedItems();
      this.router.navigate(['/public/home']);
    }
  }

  closeAlert() {
    this.showAlert.set(false);
  }

  navigateToProducts() {
    this.router.navigate(['/public/home']);
  }

  generateTransactionId(): string {
    return 'TXN' + Date.now().toString() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
