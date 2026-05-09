import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing-module';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import { withDefaultRegisterables } from 'ng2-charts';

import { StaffManagementComponent } from './staff-management/staff-management';
import { ShopCreateComponent } from './create/shop-create.component';
import { ProductManagementComponent } from './product-management/product-management.component';
// ProductList removed - all product management moved to Settings → Listings tab
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@NgModule({
  declarations: [StaffManagementComponent, ShopCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ShopRoutingModule,
    BaseChartDirective,
    ProductManagementComponent,
    AlertComponent,
    BadgeComponent,
    SkeletonComponent,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ShopModule {}
