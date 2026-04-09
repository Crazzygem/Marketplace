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

// Components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { UserManagementComponent } from './user-management/user-management';
import { ModerationComponent } from './moderation/moderation';
import { SettingsComponent } from './settings/settings';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    BaseChartDirective, // Important for Charts
    TabsComponent,
    BadgeComponent,
    AlertComponent,
    SkeletonComponent,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()), // Registers Chart.js controllers
  ],
})
export class AdminModule {}
