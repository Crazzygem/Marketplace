import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShopService } from '../../../core/services/shop';
import { ListingService } from '../../../core/services/listing';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TabItem } from '../../../shared/components/tabs/tabs.component';
import type { BadgeVariant } from '../../../shared/components/badge/badge.component';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { getImageUrl } from '../../../shared/utils/image.utils';

export interface StaffMember {
  member_id: number;
  shop_id: number;
  user_id: number;
  role: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at?: string;
}

@Component({
  selector: 'app-shop-settings',
  templateUrl: './shop-settings.component.html',
  styleUrls: ['./shop-settings.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TabsComponent,
    BadgeComponent,
    AlertComponent,
    SkeletonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShopSettingsComponent implements OnInit {
  private shopService = inject(ShopService);
  private listingService = inject(ListingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  activeTab = 'shop';

  tabs: TabItem[] = [
    { value: 'shop', label: 'Shop Settings', icon: 'fa-store' },
    { value: 'listings', label: 'Listings', icon: 'fa-box' },
    { value: 'staff', label: 'Staff', icon: 'fa-users' },
  ];

  alertState = {
    show: false,
    variant: 'info' as 'info' | 'success' | 'warning' | 'danger',
    title: '',
    description: '',
  };

  shopData: any = null;
  shopLoading = false;

  listings: any[] = [];
  listingsLoading = false;
  selectedListings: Set<number> = new Set();
  errorMessage = '';

  staff: StaffMember[] = [];
  staffLoading = false;
  staffLoaded = false;
  staffForm = {
    email: '',
  };
  staffFormLoading = false;

  ngOnInit() {
    this.loadShopSettings();
    this.loadListings();
    this.loadStaff();

    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.setActiveTab(params['tab']);
      }
    });

    // Subscribe to router events for auto-refresh
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAndRefreshListings();
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'shop' && !this.shopData) {
      this.loadShopSettings();
    }
    if (tab === 'listings' && !this.listings.length) {
      this.loadListings();
    }
    if (tab === 'staff' && !this.staffLoaded) {
      this.loadStaff();
    }
  }

  loadShopSettings() {
    this.shopLoading = true;
    this.shopService.getShopStats().subscribe({
      next: (response: any) => {
        this.shopData = response.shop_details;
        this.shopLoading = false;
      },
      error: (error) => {
        this.logger.error('Error loading shop settings:', error);
        this.shopLoading = false;
      },
    });
  }

  saveShopSettings() {
    this.showAlertMessage(
      'success',
      'Settings Saved',
      'Your shop settings have been updated successfully.',
    );
  }

  loadListings() {
    this.listingsLoading = true;
    this.errorMessage = '';
    // Use same params as ProductList to get all listings including sold/inactive
    this.listingService.getListings({ include_sold: true, include_inactive: true }).subscribe({
      next: (response: any) => {
        this.listings = response.data || response;
        this.listingsLoading = false;
      },
      error: (error) => {
        this.logger.error('Error loading listings:', error);
        this.errorMessage = 'Failed to load listings';
        this.listingsLoading = false;
      },
    });
  }

  toggleListingSelection(listingId: number) {
    if (this.selectedListings.has(listingId)) {
      this.selectedListings.delete(listingId);
    } else {
      this.selectedListings.add(listingId);
    }
  }

  selectAllListings() {
    this.listings.forEach((listing: any) => {
      this.selectedListings.add(listing.listing_id);
    });
  }

  bulkDeleteListings() {
    if (this.selectedListings.size === 0) {
      this.showAlertMessage(
        'warning',
        'No Selection',
        'Please select at least one listing to delete.',
      );
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedListings.size} listing(s)?`)) {
      this.showAlertMessage(
        'success',
        'Listings Deleted',
        `${this.selectedListings.size} listing(s) have been deleted.`,
      );
      this.selectedListings.clear();
      this.loadListings();
    }
  }

  loadStaff() {
    this.staffLoading = true;
    this.shopService.getStaff().subscribe({
      next: (response: any) => {
        this.staff = response.data || response || [];
        this.staffLoading = false;
        this.staffLoaded = true;
      },
      error: (error) => {
        this.logger.error('Error loading staff:', error);
        this.staffLoading = false;
        this.staffLoaded = true;
      },
    });
  }

  inviteStaff() {
    if (!this.staffForm.email.trim()) {
      this.notificationService.error('Email is required');
      return;
    }

    this.staffFormLoading = true;
    this.shopService.addStaff({ email: this.staffForm.email }).subscribe({
      next: (response: any) => {
        this.notificationService.success('Staff member added successfully');
        this.staffForm.email = '';
        this.loadStaff();
        this.staffFormLoading = false;
      },
      error: (error) => {
        this.logger.error('Error adding staff:', error);
        const message = error.error?.message || 'Failed to add staff member';
        this.notificationService.error(message);
        this.staffFormLoading = false;
      },
    });
  }

  removeStaff(staffMember: StaffMember) {
    if (
      confirm(`Are you sure you want to remove ${staffMember.user?.name || 'this staff member'}?`)
    ) {
      this.shopService.removeStaff(staffMember.member_id).subscribe({
        next: () => {
          this.notificationService.success('Staff member removed successfully');
          this.staff = this.staff.filter((s) => s.member_id !== staffMember.member_id);
        },
        error: (error) => {
          this.logger.error('Error removing staff:', error);
          this.notificationService.error('Failed to remove staff member');
        },
      });
    }
  }

  getStatusBadgeVariant(status: string): BadgeVariant {
    const statusMap: Record<string, BadgeVariant> = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      sold: 'destructive',
    };
    return statusMap[status] || 'default';
  }

  showAlertMessage(
    variant: 'info' | 'success' | 'warning' | 'danger',
    title: string,
    description: string,
  ): void {
    this.alertState = { show: true, variant, title, description };
    setTimeout(() => {
      this.alertState.show = false;
    }, 5000);
  }

  onTabChange(tabValue: string): void {
    this.setActiveTab(tabValue);
  }

  // ========== Enhanced Listings Features ==========

  /**
   * Get status badge class for color-coded status display
   */
  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary';

    switch (status.toLowerCase()) {
      case 'active':
      case 'published':
        return 'bg-success'; // Green
      case 'pending':
      case 'draft':
        return 'bg-warning'; // Yellow/Orange
      case 'out of stock':
      case 'sold out':
      case 'sold':
        return 'bg-danger'; // Red
      case 'archived':
      case 'inactive':
        return 'bg-dark'; // Black/Grey
      default:
        return 'bg-secondary'; // Grey
    }
  }

  /**
   * Navigate to edit listing page
   */
  editListing(listingId: number) {
    this.router.navigate(['/shop/products/edit', listingId]);
  }

  /**
   * Delete a listing with confirmation
   */
  deleteListing(listingId: number) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(listingId).subscribe({
        next: () => {
          // Set flag for auto-refresh
          localStorage.setItem('listingUpdated', Date.now().toString());
          this.showAlertMessage('success', 'Listing Deleted', 'The listing has been deleted.');
          this.loadListings();
        },
        error: (error) => {
          this.logger.error('Error deleting listing:', error);
          this.showAlertMessage('danger', 'Delete Failed', 'Failed to delete the listing.');
        },
      });
    }
  }

  /**
   * Mark listing as sold
   */
  markAsSold(listing: any) {
    if (confirm(`Mark "${listing.title}" as sold? This will show a SOLD badge on the listing.`)) {
      this.listingService.markAsSold(listing.listing_id).subscribe({
        next: () => {
          listing.is_sold = true;
          listing.sold_at = new Date();
          this.showAlertMessage(
            'success',
            'Marked as Sold',
            `"${listing.title}" has been marked as sold.`,
          );
        },
        error: (error) => {
          this.logger.error('Error marking listing as sold:', error);
          this.showAlertMessage('danger', 'Action Failed', 'Failed to mark listing as sold.');
        },
      });
    }
  }

  /**
   * Restock a sold listing
   */
  restock(listing: any) {
    if (confirm(`Restock "${listing.title}"? This will remove the SOLD badge.`)) {
      this.listingService.restock(listing.listing_id).subscribe({
        next: () => {
          listing.is_sold = false;
          listing.sold_at = null;
          this.showAlertMessage(
            'success',
            'Restocked',
            `"${listing.title}" is now available again.`,
          );
        },
        error: (error) => {
          this.logger.error('Error restocking listing:', error);
          this.showAlertMessage('danger', 'Action Failed', 'Failed to restock listing.');
        },
      });
    }
  }

  /**
   * Check if listings need to be refreshed after CRUD operations
   * Uses localStorage flag from ProductManagementComponent
   */
  checkAndRefreshListings() {
    const lastUpdate = localStorage.getItem('listingUpdated');
    if (lastUpdate) {
      const updateTime = parseInt(lastUpdate, 10);
      const currentTime = Date.now();
      // Only refresh if update happened within last 5 minutes and on listings tab
      if (currentTime - updateTime < 5 * 60 * 1000) {
        if (this.activeTab === 'listings') {
          this.loadListings();
        }
        localStorage.removeItem('listingUpdated');
      }
    }
  }

  // Expose getImageUrl to template
  getImageUrl = getImageUrl;
}
