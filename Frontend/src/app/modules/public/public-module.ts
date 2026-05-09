import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing-module';
import { HomeComponent } from './home/home';
import { ProductDetailComponent } from './product-detail/product-detail';
import { CategoriesComponent } from './categories/categories';
import { SavedItemsComponent } from './saved-items/saved-items.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PublicRoutingModule,
    HomeComponent,
    ProductDetailComponent,
    CategoriesComponent,
    SavedItemsComponent,
    CheckoutComponent,
  ],
})
export class PublicModule {}
