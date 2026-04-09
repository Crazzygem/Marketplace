import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, UserDTO, ReportDTO } from '../../../core/services/admin';
import { CategoryService, Category } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TabItem } from '../../../shared/components/tabs/tabs.component';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';
import { IconPickerComponent } from '../../../shared/components/icon-picker/icon-picker.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import type { BadgeVariant } from '../../../shared/components/badge/badge.component';
import type { AlertVariant } from '../../../shared/components/alert/alert.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TabsComponent,
    IconPickerComponent,
    BadgeComponent,
    AlertComponent,
    SkeletonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingsComponent implements OnInit {
  private adminService = inject(AdminService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  activeTab = 'categories';

  tabs: TabItem[] = [
    { value: 'categories', label: 'Categories', icon: 'fa-list' },
    { value: 'users', label: 'Users', icon: 'fa-users' },
    { value: 'moderation', label: 'Moderation', icon: 'fa-shield-alt' },
  ];

  alertState = {
    show: false,
    variant: 'info' as AlertVariant,
    title: '',
    description: '',
  };

  categories: Category[] = [];
  categoriesLoaded = false;

  showCategoryModal = false;
  editingCategory: Category | null = null;
  categoryForm = {
    category_name: '',
    description: '',
    icon: 'fa-tag',
    is_popular: false,
  };

  users: UserDTO[] = [];
  usersLoading = false;
  usersLoaded = false;
  usersError: string | null = null;

  showUserModal = false;
  userForm = {
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'shop_owner' | 'admin',
    shop_name: '',
    shop_description: '',
  };
  userFormLoading = false;

  showDemoteWarningModal = false;
  demotingUser: UserDTO | null = null;
  demotingUserShopName = '';
  demotingUserListingCount = 0;
  pendingRoleChange = '';

  reports: ReportDTO[] = [];
  reportsLoading = false;
  reportsLoaded = false;

  ngOnInit() {
    this.loadCategories();
    this.loadUsers();
    this.loadReports();
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.setActiveTab(params['tab']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = Array.isArray(data) ? data : data.data || [];
        this.categoriesLoaded = true;
      },
      error: (error) => {
        this.logger.error('Error loading categories:', error);
      },
    });
  }

  openAddCategoryModal(): void {
    this.editingCategory = null;
    this.categoryForm = {
      category_name: '',
      description: '',
      icon: 'fa-tag',
      is_popular: false,
    };
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = {
      category_name: category.category_name,
      description: category.description || '',
      icon: category.icon || 'fa-tag',
      is_popular: category.is_popular || false,
    };
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  onIconSelected(icon: string): void {
    this.categoryForm.icon = icon;
  }

  saveCategory(): void {
    if (!this.categoryForm.category_name.trim()) {
      this.notificationService.error('Category name is required');
      return;
    }

    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory.category_id, this.categoryForm).subscribe({
        next: () => {
          this.notificationService.success('Category updated successfully');
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (error) => {
          this.logger.error('Error updating category:', error);
          this.notificationService.error('Failed to update category');
        },
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.notificationService.success('Category created successfully');
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (error) => {
          this.logger.error('Error creating category:', error);
          this.notificationService.error('Failed to create category');
        },
      });
    }
  }

  togglePopular(category: Category): void {
    this.categoryService.togglePopular(category.category_id).subscribe({
      next: (response: any) => {
        category.is_popular = response.category.is_popular;
        this.notificationService.success(
          category.is_popular
            ? `${category.category_name} is now popular`
            : `${category.category_name} is no longer popular`
        );
      },
      error: (error) => {
        this.logger.error('Error toggling popular status:', error);
        this.notificationService.error('Failed to update popular status');
      },
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.category_name}"?`)) {
      if (category.listings_count && category.listings_count > 0) {
        this.notificationService.error('Cannot delete category with existing listings');
        return;
      }

      this.categoryService.deleteCategory(category.category_id).subscribe({
        next: () => {
          this.notificationService.success('Category deleted successfully');
          this.categories = this.categories.filter((c) => c.category_id !== category.category_id);
        },
        error: (error) => {
          this.logger.error('Error deleting category:', error);
          this.notificationService.error('Failed to delete category');
        },
      });
    }
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = null;
    this.adminService.getUsers().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : data.data || [];
        this.usersLoading = false;
        this.usersLoaded = true;
      },
      error: (error) => {
        this.logger.error('Error loading users:', error);
        this.usersError = error.error?.message || error.message || 'Failed to load users. Please try again.';
        this.usersLoading = false;
      },
    });
  }

  openAddUserModal(): void {
    this.userForm = {
      name: '',
      email: '',
      password: '',
      role: 'customer',
      shop_name: '',
      shop_description: '',
    };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  saveUser(): void {
    if (!this.userForm.name.trim()) {
      this.notificationService.error('Name is required');
      return;
    }
    if (!this.userForm.email.trim()) {
      this.notificationService.error('Email is required');
      return;
    }
    if (!this.userForm.password || this.userForm.password.length < 6) {
      this.notificationService.error('Password must be at least 6 characters');
      return;
    }

    this.userFormLoading = true;

    const payload: any = {
      name: this.userForm.name,
      email: this.userForm.email,
      password: this.userForm.password,
      role: this.userForm.role,
    };

    if (this.userForm.role === 'shop_owner') {
      if (!this.userForm.shop_name.trim()) {
        this.notificationService.error('Shop name is required for shop owners');
        this.userFormLoading = false;
        return;
      }
      payload.shop_name = this.userForm.shop_name;
      payload.shop_description = this.userForm.shop_description;
    }

    this.adminService.createUser(payload).subscribe({
      next: (response) => {
        this.notificationService.success('User created successfully');
        this.loadUsers();
        this.closeUserModal();
        this.userFormLoading = false;
      },
      error: (error) => {
        this.logger.error('Error creating user:', error);
        const message = error.error?.message || 'Failed to create user';
        this.notificationService.error(message);
        this.userFormLoading = false;
      },
    });
  }

  updateUserRole(user: UserDTO, newRole: string): void {
    if (user.id === this.authService.currentUser()?.id) {
      this.notificationService.error('You cannot change your own role');
      return;
    }

    const currentRole = this.getUserRole(user);

    // If changing TO shop_owner, auto-generate shop name from user's name
    if (newRole === 'shop_owner') {
      const payload: any = {
        role: newRole,
        shop_name: user.name,
      };

      this.adminService.updateUserRole(user.id, payload).subscribe({
        next: () => {
          this.notificationService.success(`${user.name} is now a shop owner with shop "${user.name}"`);
          this.loadUsers();
        },
        error: (error) => {
          this.logger.error('Error updating user role:', error);
          const message = error.error?.message || 'Failed to update user role';
          this.notificationService.error(message);
        },
      });
    } else if (currentRole === 'shop_owner' && newRole === 'customer') {
      // First call API to check if user has a shop
      this.adminService.updateUserRole(user.id, { role: newRole as any }).subscribe({
        next: () => {
          // User had no shop, just update role
          this.notificationService.success(`${user.name}'s role updated successfully`);
          this.loadUsers();
        },
        error: (error) => {
          this.logger.error('Error updating user role:', error);

          // Check if backend returned confirmation request
          if (error.error?.requires_confirmation && error.error?.shop) {
            const shop = error.error.shop;
            this.showDemoteWarningModal = true;
            this.demotingUser = user;
            this.demotingUserShopName = shop.shop_name;
            this.demotingUserListingCount = shop.listing_count;
            this.pendingRoleChange = newRole;
          } else {
            const message = error.error?.message || 'Failed to update user role';
            this.notificationService.error(message);
          }
        },
      });
    } else {
      // Normal role change
      this.adminService.updateUserRole(user.id, { role: newRole as any }).subscribe({
        next: () => {
          this.notificationService.success(`${user.name}'s role updated successfully`);
          this.loadUsers();
        },
        error: (error) => {
          this.logger.error('Error updating user role:', error);
          const message = error.error?.message || 'Failed to update user role';
          this.notificationService.error(message);
        },
      });
    }
  }

  confirmDemote(): void {
    if (!this.demotingUser) return;

    const user = this.demotingUser;
    const payload: any = {
      role: this.pendingRoleChange as any,
      delete_shop: true,
    };

    this.adminService.updateUserRole(user.id, payload).subscribe({
      next: () => {
        this.notificationService.success(`${user.name} demoted to customer. Shop and listings deleted.`);
        this.closeDemoteModal();
        this.loadUsers();
      },
      error: (error) => {
        this.logger.error('Error updating user role:', error);
        const message = error.error?.message || 'Failed to update user role';
        this.notificationService.error(message);
      },
    });
  }

  cancelDemote(): void {
    this.closeDemoteModal();
  }

  closeDemoteModal(): void {
    this.showDemoteWarningModal = false;
    this.demotingUser = null;
    this.demotingUserShopName = '';
    this.demotingUserListingCount = 0;
    this.pendingRoleChange = '';
  }

  toggleBan(user: UserDTO): void {
    const isCurrentlyBanned = user.is_banned;
    if (confirm(`Are you sure you want to ${isCurrentlyBanned ? 'unban' : 'ban'} ${user.name}?`)) {
      if (!isCurrentlyBanned) {
        this.adminService.banUser(user.id).subscribe({
          next: () => {
            user.is_banned = true;
            this.notificationService.success(`${user.name} has been banned`);
          },
          error: (error) => {
            this.logger.error('Error banning user:', error);
            this.notificationService.error('Failed to ban user');
          },
        });
      } else {
        this.adminService.unbanUser(user.id).subscribe({
          next: () => {
            user.is_banned = false;
            this.notificationService.success(`${user.name} has been unbanned`);
          },
          error: (error) => {
            this.logger.error('Error unbanning user:', error);
            this.notificationService.error('Failed to unban user');
          },
        });
      }
    }
  }

  loadReports(): void {
    this.reportsLoading = true;
    this.adminService.getReports().subscribe({
      next: (data: any) => {
        this.reports = Array.isArray(data) ? data : data.data || [];
        this.reportsLoading = false;
        this.reportsLoaded = true;
      },
      error: (error) => {
        this.logger.error('Error loading reports:', error);
        this.reportsLoading = false;
      },
    });
  }

  resolve(report: ReportDTO): void {
    this.adminService.resolveReport(report.report_id).subscribe({
      next: () => {
        report.status = 'resolved';
        report.is_resolved = true;
        this.notificationService.success(`Report #${report.report_id} resolved`);
      },
      error: (error) => {
        this.logger.error('Error resolving report:', error);
        this.notificationService.error('Failed to resolve report');
      },
    });
  }

  getUserRole(user: UserDTO): string {
    if (user.roles?.admin) return 'admin';
    if (user.roles?.shop_owner) return 'shop_owner';
    if (user.roles?.staff) return 'staff';
    return 'customer';
  }

  getUserRoleBadgeVariant(role: string): BadgeVariant {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'shop_owner':
        return 'info';
      case 'staff':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getUserStatusBadgeVariant(status: string): BadgeVariant {
    return status === 'active' ? 'success' : 'destructive';
  }

  getReportStatusBadgeVariant(status: string): BadgeVariant {
    return status === 'pending' ? 'warning' : 'success';
  }

  onTabChange(tabValue: string): void {
    this.setActiveTab(tabValue);
  }
}
