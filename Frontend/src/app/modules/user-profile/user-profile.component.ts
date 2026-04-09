import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { AuthService } from '../../core/services/auth';
import { Order } from '../../core/services/order';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { TabsComponent, TabItem } from '../../shared/components/tabs/tabs.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AvatarComponent, BadgeComponent, TabsComponent, AlertComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  public authService = inject(AuthService);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  currentUser: any = null;
  orders: Order[] = [];
  activeTab = 'overview';
  loading = {
    orders: true,
    profile: false,
  };

  // Tabs configuration
  tabs: TabItem[] = [
    { value: 'overview', label: 'Overview', icon: 'fa-home' },
    { value: 'personal', label: 'Personal Info', icon: 'fa-user' },
    { value: 'security', label: 'Security', icon: 'fa-shield-alt' },
  ];

  // Alert state for notifications
  nameAlert = {
    show: false,
    variant: 'success' as 'success' | 'danger' | 'warning' | 'info',
    title: '',
    description: '',
  };

  passwordAlert = {
    show: false,
    variant: 'success' as 'success' | 'danger' | 'warning' | 'info',
    title: '',
    description: '',
  };

  // Pagination
  pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    totalPages: 1,
  };

  // Profile editing
  editName: string = '';
  isEditingName: boolean = false;

  // Password change
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  isChangingPassword: boolean = false;

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.editName = this.currentUser?.name || '';
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        this.orders = Array.isArray(response) ? response : response.data || [];
        this.pagination.totalPages = Math.ceil(this.orders.length / this.pagination.itemsPerPage);
        this.loading.orders = false;
      },
      error: (error) => {
        this.logger.error('Error loading orders:', error);
        this.loading.orders = false;
      },
    });
  }

  get paginatedOrders() {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.pagination.currentPage = page;
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.pagination.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Profile editing
  enableNameEdit(): void {
    this.editName = this.currentUser?.name || '';
    this.isEditingName = true;
  }

  cancelNameEdit(): void {
    this.editName = this.currentUser?.name || '';
    this.isEditingName = false;
  }

  saveName(): void {
    if (!this.editName || this.editName.trim() === '') {
      this.nameAlert = {
        show: true,
        variant: 'danger',
        title: 'Error',
        description: 'Name cannot be empty',
      };
      return;
    }

    this.loading.profile = true;
    // TODO: Call API to update name
    this.currentUser.name = this.editName;
    this.isEditingName = false;
    this.loading.profile = false;
    this.nameAlert = {
      show: true,
      variant: 'success',
      title: 'Success',
      description: 'Name updated successfully',
    };
    setTimeout(() => (this.nameAlert.show = false), 5000);
  }

  // Password change
  changePassword(): void {
    if (!this.passwordForm.currentPassword) {
      this.passwordAlert = {
        show: true,
        variant: 'danger',
        title: 'Error',
        description: 'Please enter current password',
      };
      return;
    }
    if (!this.passwordForm.newPassword) {
      this.passwordAlert = {
        show: true,
        variant: 'danger',
        title: 'Error',
        description: 'Please enter new password',
      };
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordAlert = {
        show: true,
        variant: 'danger',
        title: 'Error',
        description: 'Passwords do not match',
      };
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.passwordAlert = {
        show: true,
        variant: 'danger',
        title: 'Error',
        description: 'Password must be at least 6 characters',
      };
      return;
    }

    this.loading.profile = true;
    // TODO: Call API to change password
    setTimeout(() => {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      this.loading.profile = false;
      this.passwordAlert = {
        show: true,
        variant: 'success',
        title: 'Success',
        description: 'Password changed successfully',
      };
      setTimeout(() => (this.passwordAlert.show = false), 5000);
    }, 1000);
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success';
      case 'shipped':
        return 'bg-info';
      case 'confirmed':
        return 'bg-primary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  getStatusVariant(status: string): 'success' | 'info' | 'warning' | 'destructive' {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'confirmed':
        return 'default' as any;
      case 'cancelled':
        return 'destructive';
      default:
        return 'warning';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  viewOrder(orderId: number) {
    this.logger.info('Viewing order:', { orderId });
  }

  goToShop() {
    if (this.authService.isShopOwner()) {
      this.router.navigate(['/shop']);
    } else {
      this.notificationService.info('You can create a shop to start selling!');
    }
  }
}
