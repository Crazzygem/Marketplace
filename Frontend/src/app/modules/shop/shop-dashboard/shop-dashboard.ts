import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShopService } from '../../../core/services/shop';
import { AuthService } from '../../../core/services/auth';
import { LoggerService } from '../../../core/services/logger.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-shop-dashboard',
  templateUrl: './shop-dashboard.html',
  styleUrls: ['./shop-dashboard.css'],
  standalone: false, // Important for NgModule
})
export class ShopDashboardComponent implements OnInit {
  private shopService = inject(ShopService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);

  shopStats: any = null;
  loading = true;
  private routerSubscription!: Subscription;

  // Chart Data
  salesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'Sales' }],
  };

  revenueChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Revenue ($)' }],
  };

  topSellingItemsData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Items Sold' }],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadShopStats();

    // Check if data was recently updated and refresh if needed
    this.checkAndRefreshData();

    // Subscribe to router events to refresh data when returning to dashboard
    this.routerSubscription = this.router.events.subscribe((event) => {
      // Refresh data when navigating back to dashboard
      if (event instanceof NavigationEnd) {
        this.checkAndRefreshData();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkAndRefreshData() {
    // Check if there's a flag indicating data was recently updated
    const lastUpdate = localStorage.getItem('listingUpdated');
    if (lastUpdate) {
      const updateTime = parseInt(lastUpdate, 10);
      const currentTime = Date.now();
      // If update happened within the last 5 minutes, refresh data
      if (currentTime - updateTime < 5 * 60 * 1000) {
        // Small delay to ensure the update operation completes
        setTimeout(() => {
          this.refreshData();
          // Clear the flag after refreshing
          localStorage.removeItem('listingUpdated');
        }, 500);
      }
    }
  }

  refreshData() {
    this.loadShopStats();
  }

  loadShopStats() {
    this.shopService.getShopStats().subscribe({
      next: (data: any) => {
        this.shopStats = data;
        this.loading = false;

        // Populate chart data
        if (data.charts) {
          // Sales by date chart
          if (data.charts.sales_by_date) {
            this.salesChartData = {
              labels: data.charts.sales_by_date.labels,
              datasets: [
                {
                  data: data.charts.sales_by_date.data,
                  label: 'Sales',
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  tension: 0.4,
                  fill: true,
                },
              ],
            };
          }

          // Revenue by date chart
          if (data.charts.revenue_by_date) {
            this.revenueChartData = {
              labels: data.charts.revenue_by_date.labels,
              datasets: [
                {
                  data: data.charts.revenue_by_date.data,
                  label: 'Revenue ($)',
                  backgroundColor: '#4BC0C0',
                  borderColor: '#4BC0C0',
                  borderWidth: 1,
                },
              ],
            };
          }

          // Top selling items chart
          if (data.charts.top_selling_items) {
            this.topSellingItemsData = {
              labels: data.charts.top_selling_items.map((item: any) => item.title),
              datasets: [
                {
                  data: data.charts.top_selling_items.map((item: any) => item.sales_count),
                  label: 'Items Sold',
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                  borderWidth: 1,
                },
              ],
            };
          }
        }
      },
      error: (error) => {
        this.logger.error('Error loading shop stats:', error);
        this.loading = false;
      },
    });
  }
}
