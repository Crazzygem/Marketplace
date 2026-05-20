import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';
import { ModerationComponent } from './moderation/moderation.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'staff', component: StaffManagementComponent, title: 'Staff Management' },
  { path: 'users', redirectTo: '/admin/settings?tab=users' },
  { path: 'moderation', redirectTo: '/admin/settings?tab=moderation' },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
