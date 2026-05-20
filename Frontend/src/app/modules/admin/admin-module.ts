import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing-module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';

// Shadcn-style Components
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

// Components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';
import { ModerationComponent } from './moderation/moderation.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [AdminDashboardComponent, UserManagementComponent, StaffManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    BaseChartDirective, // Important for Charts
    TabsComponent,
    BadgeComponent,
    AlertComponent,
    SkeletonComponent,
    EmptyStateComponent,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()), // Registers Chart.js controllers
  ],
})
export class AdminModule {}
