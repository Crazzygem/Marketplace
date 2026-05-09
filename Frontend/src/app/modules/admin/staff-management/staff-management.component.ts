import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AdminService, UserDTO } from '../../../core/services/admin';
import { LoggerService } from '../../../core/services/logger.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  isLoading = false;
  searchTerm = '';

  alert: {
    variant: 'success' | 'danger' | 'warning' | 'info';
    title: string;
    description: string;
  } | null = null;
  private alertTimeout: any = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : data.data || [];
        this.filterUsers();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading users:', error);
        this.showAlert('danger', 'Error Loading Users', 'Failed to load users. Please try again.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }

  onSearchInput() {
    this.filterUsers();
  }

  getUserRole(user: UserDTO): string {
    if (user.roles?.admin) return 'admin';
    if (user.roles?.shop_owner) return 'shop_owner';
    if (user.roles?.staff) return 'staff';
    return 'customer';
  }

  isStaff(user: UserDTO): boolean {
    return user.roles?.staff === true;
  }

  toggleStaffRole(user: UserDTO) {
    const isCurrentlyStaff = this.isStaff(user);
    const action = isCurrentlyStaff ? 'remove staff role from' : 'assign staff role to';

    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      const newRole = isCurrentlyStaff ? 'customer' : 'staff';
      this.adminService.updateUserRole(user.id, { role: newRole }).subscribe({
        next: () => {
          user.roles.staff = !isCurrentlyStaff;
          this.showAlert(
            'success',
            'Staff Role Updated',
            `${user.name} has been ${isCurrentlyStaff ? 'removed from' : 'added to'} staff successfully.`,
          );
          this.filterUsers();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error updating staff role:', error);
          this.showAlert(
            'danger',
            'Error Updating Staff Role',
            'Failed to update staff role. Please try again.',
          );
          this.cdr.markForCheck();
        },
      });
    }
  }

  toggleBan(user: UserDTO) {
    const isCurrentlyBanned = user.is_banned;
    if (confirm(`Are you sure you want to ${isCurrentlyBanned ? 'unban' : 'ban'} ${user.name}?`)) {
      if (!isCurrentlyBanned) {
        this.adminService.banUser(user.id).subscribe({
          next: () => {
            user.is_banned = true;
            this.showAlert('danger', 'User Banned', `${user.name} has been banned successfully.`);
            this.filterUsers();
            this.cdr.markForCheck();
          },
          error: (error) => {
            this.logger.error('Error banning user:', error);
            this.showAlert('danger', 'Error Banning User', 'Failed to ban user. Please try again.');
            this.cdr.markForCheck();
          },
        });
      } else {
        this.adminService.unbanUser(user.id).subscribe({
          next: () => {
            user.is_banned = false;
            this.showAlert(
              'success',
              'User Unbanned',
              `${user.name} has been unbanned successfully.`,
            );
            this.filterUsers();
            this.cdr.markForCheck();
          },
          error: (error) => {
            this.logger.error('Error unbanning user:', error);
            this.showAlert(
              'danger',
              'Error Unbanning User',
              'Failed to unban user. Please try again.',
            );
            this.cdr.markForCheck();
          },
        });
      }
    }
  }

  getStatusVariant(
    role: string,
    isBanned: boolean,
  ): 'success' | 'destructive' | 'warning' | 'info' | 'default' {
    if (isBanned) return 'destructive';
    if (role === 'admin') return 'info';
    if (role === 'shop_owner') return 'warning';
    if (role === 'staff') return 'success';
    return 'default';
  }

  getRoleVariant(
    role: string,
  ): 'success' | 'destructive' | 'warning' | 'info' | 'default' | 'secondary' {
    if (role === 'admin') return 'info';
    if (role === 'shop_owner') return 'warning';
    if (role === 'staff') return 'success';
    return 'secondary';
  }

  private showAlert(
    variant: 'success' | 'danger' | 'warning' | 'info',
    title: string,
    description: string,
  ) {
    this.alert = { variant, title, description };
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = null;
    }, 5000);
  }
}
