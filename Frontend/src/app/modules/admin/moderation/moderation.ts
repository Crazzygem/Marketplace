import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ReportDTO, UserDTO } from '../../../core/services/admin';
import { LoggerService } from '../../../core/services/logger.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

interface AlertState {
  title: string;
  description: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.html',
  styleUrls: ['./moderation.css'],
  standalone: true,
  imports: [CommonModule, BadgeComponent, AlertComponent, SkeletonComponent],
})
export class ModerationComponent implements OnInit {
  private adminService = inject(AdminService);
  private logger = inject(LoggerService);
  reports: ReportDTO[] = [];
  isLoading = signal<boolean>(true);
  alert = signal<AlertState | null>(null);
  private alertTimeout: any = null;

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading.set(true);
    // Real API:
    this.adminService.getReports().subscribe({
      next: (data: any) => {
        // Handle both paginated and non-paginated responses
        this.reports = Array.isArray(data) ? data : (data.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.logger.error('Error loading reports:', error);
        this.showAlert(
          'Error Loading Reports',
          'Failed to load moderation queue. Please try again.',
          'danger'
        );
        this.isLoading.set(false);
      },
    });
  }

  resolve(report: ReportDTO) {
    this.adminService.resolveReport(report.report_id).subscribe(() => {
      report.status = 'resolved';
      report.is_resolved = true;
      this.showAlert(
        'Report Resolved',
        `Report #${report.id} has been marked as resolved.`,
        'success'
      );
    });
  }

  getStatusVariant(status: string): 'warning' | 'success' | 'destructive' {
    if (status === 'pending') return 'warning';
    if (status === 'resolved') return 'success';
    return 'destructive';
  }

  showAlert(
    title: string,
    description: string,
    variant: 'success' | 'danger' | 'warning' | 'info'
  ) {
    this.alert.set({ title, description, variant });

    // Auto-dismiss after 5 seconds
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert.set(null);
    }, 5000);
  }

  dismissAlert() {
    this.alert.set(null);
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
}