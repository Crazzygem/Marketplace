import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { LoggerService } from '../../../core/services/logger.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: false, // Important for NgModule
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  dashboardStats: any = null;
  loading = true;

  // Chart data
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'User Growth',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };

  ngOnInit() {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.loading = false;

        // Prepare chart data
        if (data.charts?.user_growth) {
          const userGrowth = data.charts.user_growth;
          this.lineChartData.labels = userGrowth.map((item: any) => item.date);
          this.lineChartData.datasets[0].data = userGrowth.map((item: any) => item.count);
        }

        if (data.charts?.category_dist) {
          const categoryDist = data.charts.category_dist;
          this.pieChartData.labels = categoryDist.map((item: any) => item.category_name);
          this.pieChartData.datasets[0].data = categoryDist.map((item: any) => item.total);
        }
      },
      error: (error) => {
        this.logger.error('Error loading dashboard stats:', error);
        this.loading = false;
      },
    });
  }
}
