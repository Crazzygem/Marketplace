import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ShopService, StaffMember } from '../../../core/services/shop';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.html',
  styleUrls: ['./staff-management.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementComponent implements OnInit {
  private shopService = inject(ShopService);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  staffList: StaffMember[] = [];

  ngOnInit() {
    this.shopService.getStaff().subscribe((data) => {
      this.staffList = data;
      this.cdr.markForCheck();
    });
  }

  removeStaff(memberId: number) {
    if (confirm('Remove this staff member?')) {
      this.shopService.removeStaff(memberId).subscribe({
        next: () => {
          this.staffList = this.staffList.filter((s) => s.member_id !== memberId);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error removing staff member:', error);
          this.notificationService.error('Failed to remove staff member. Please try again.');
          this.cdr.markForCheck();
        },
      });
    }
  }
}
