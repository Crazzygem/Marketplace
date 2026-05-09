import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartData, Chart, registerables } from 'chart.js';
import { ShopService } from '../../../core/services/shop';
import { AuthService } from '../../../core/services/auth';
import { LoggerService } from '../../../core/services/logger.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-shop-dashboard',
  templateUrl: './shop-dashboard.html',
  styleUrls: ['./shop-dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective, BadgeComponent, SkeletonComponent],
  providers: [provideCharts(withDefaultRegisterables())],
  viewProviders: [provideCharts(withDefaultRegisterables())],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopDashboardComponent implements OnInit, OnDestroy {
  private shopService = inject(ShopService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);

  // State Signals
  shopStats = signal<any>(null);
  loading = signal(true);
  private routerSubscription!: Subscription;

  // Chart Data Signals
  salesChartData = signal<ChartData<'line'>>({
    labels: [],
    datasets: [{ data: [], label: 'Sales' }],
  });

  revenueChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [{ data: [], label: 'Revenue ($)' }],
  });

  topSellingItemsData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [{ data: [], label: 'Items Sold' }],
  });

  // Computed Values
  hasShop = computed(() => !!this.shopStats());
  isLoading = computed(() => this.loading());
  totalViews = computed(() => this.shopStats()?.stats?.total_views || 0);
  totalSales = computed(() => this.shopStats()?.stats?.sold_listings || 0);
  itemsListed = computed(() => this.shopStats()?.stats?.total_listings || 0);
  activeOrders = computed(() => this.shopStats()?.stats?.active_listings || 0);
  shopInfo = computed(() => this.shopStats()?.shop || null);

  // Chart Options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  constructor() {
    // Register Chart.js controllers (required for standalone component)
    Chart.register(...registerables);

    // Effect to sync chart data when shopStats changes
    effect(() => {
      const stats = this.shopStats();
      if (stats?.charts) {
        this.updateChartData(stats.charts);
      }
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadShopStats();
    this.checkAndRefreshData();

    // Subscribe to router events to refresh data when returning to dashboard
    this.routerSubscription = this.router.events.subscribe((event) => {
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
    const lastUpdate = localStorage.getItem('listingUpdated');
    if (lastUpdate) {
      const updateTime = parseInt(lastUpdate, 10);
      const currentTime = Date.now();
      // If update happened within the last 5 minutes, refresh data
      if (currentTime - updateTime < 5 * 60 * 1000) {
        setTimeout(() => {
          this.refreshData();
          localStorage.removeItem('listingUpdated');
        }, 500);
      }
    }
  }

  refreshData() {
    this.loadShopStats();
  }

  loadShopStats() {
    this.loading.set(true);
    this.shopService.getShopStats().subscribe({
      next: (data: any) => {
        this.shopStats.set(data);
        this.loading.set(false);

        // Populate chart data if charts exist
        if (data.charts) {
          this.updateChartData(data.charts);
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.logger.error('Error loading shop stats:', error);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  private updateChartData(charts: any) {
    // Sales by date chart
    if (charts.sales_by_date) {
      this.salesChartData.set({
        labels: charts.sales_by_date.labels,
        datasets: [
          {
            data: charts.sales_by_date.data,
            label: 'Sales',
            borderColor: '#0f172a', // Primary navy from design tokens
            backgroundColor: 'rgba(15, 23, 42, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0f172a',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#0f172a',
          },
        ],
      });
    }

    // Revenue by date chart
    if (charts.revenue_by_date) {
      this.revenueChartData.set({
        labels: charts.revenue_by_date.labels,
        datasets: [
          {
            data: charts.revenue_by_date.data,
            label: 'Revenue ($)',
            backgroundColor: '#22c55e', // Success green from design tokens
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      });
    }

    // Top selling items chart
    if (charts.top_selling_items) {
      this.topSellingItemsData.set({
        labels: charts.top_selling_items.map((item: any) => item.title),
        datasets: [
          {
            data: charts.top_selling_items.map((item: any) => item.sales_count),
            label: 'Items Sold',
            backgroundColor: [
              '#0f172a', // Primary navy
              '#22c55e', // Success green
              '#f59e0b', // Warning amber
              '#3b82f6', // Info blue
              '#ef4444', // Destructive red
            ],
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      });
    }
  }
}
