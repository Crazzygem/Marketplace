import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopDashboardComponent } from './shop-dashboard/shop-dashboard';
import { StaffManagementComponent } from './staff-management/staff-management';
import { ProductManagementComponent } from './product-management/product-management.component';
// ProductList removed - all product management moved to Settings → Listings tab
import { ShopCreateComponent } from './create/shop-create.component';
import { ShopSettingsComponent } from './settings/shop-settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ShopDashboardComponent },
  { path: 'staff', redirectTo: '/shop/settings?tab=staff', pathMatch: 'full' },
  // NOTE: /shop/products route removed - all product management moved to Settings → Listings tab
  { path: 'products', redirectTo: '/shop/settings?tab=listings', pathMatch: 'full' },
  { path: 'products/add', component: ProductManagementComponent },
  { path: 'products/edit/:id', component: ProductManagementComponent },
  { path: 'create', component: ShopCreateComponent },
  { path: 'create-listing', component: ProductManagementComponent },
  { path: 'settings', component: ShopSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
