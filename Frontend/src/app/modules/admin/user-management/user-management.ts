import { Component, OnInit, inject } from '@angular/core';
import { AdminService, UserDTO } from '../../../core/services/admin';
import { LoggerService } from '../../../core/services/logger.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  standalone: false,
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private logger = inject(LoggerService);
  users: UserDTO[] = [];
  isLoading = false;

  alert: { variant: 'success' | 'danger' | 'warning' | 'info'; title: string; description: string } | null = null;
  private alertTimeout: any = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : (data.data || []);
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.error('Error loading users:', error);
        this.showAlert('danger', 'Error Loading Users', 'Failed to load users. Please try again.');
        this.isLoading = false;
      },
    });
  }

  getUserRole(user: UserDTO): string {
    if (user.roles?.admin) return 'admin';
    if (user.roles?.shop_owner) return 'shop_owner';
    if (user.roles?.staff) return 'staff';
    return 'customer';
  }

  toggleBan(user: UserDTO) {
    const isCurrentlyBanned = user.is_banned;
    if (confirm(`Are you sure you want to ${isCurrentlyBanned ? 'unban' : 'ban'} ${user.name}?`)) {
      if (!isCurrentlyBanned) {
        this.adminService.banUser(user.id).subscribe({
          next: () => {
            user.is_banned = true;
            this.showAlert('danger', 'User Banned', `${user.name} has been banned successfully.`);
          },
          error: (error) => {
            this.logger.error('Error banning user:', error);
            this.showAlert('danger', 'Error Banning User', 'Failed to ban user. Please try again.');
          },
        });
      } else {
        this.adminService.unbanUser(user.id).subscribe({
          next: () => {
            user.is_banned = false;
            this.showAlert('success', 'User Unbanned', `${user.name} has been unbanned successfully.`);
          },
          error: (error) => {
            this.logger.error('Error unbanning user:', error);
            this.showAlert('danger', 'Error Unbanning User', 'Failed to unban user. Please try again.');
          },
        });
      }
    }
  }

  getStatusVariant(role: string, isBanned: boolean): 'success' | 'destructive' | 'warning' | 'info' | 'default' {
    if (isBanned) return 'destructive';
    if (role === 'admin') return 'info';
    if (role === 'shop_owner') return 'warning';
    return 'success';
  }

  getRoleVariant(role: string): 'success' | 'destructive' | 'warning' | 'info' | 'default' | 'secondary' {
    if (role === 'admin') return 'info';
    if (role === 'shop_owner') return 'warning';
    return 'secondary';
  }

  private showAlert(variant: 'success' | 'danger' | 'warning' | 'info', title: string, description: string) {
    this.alert = { variant, title, description };
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = null;
    }, 5000);
  }
}
