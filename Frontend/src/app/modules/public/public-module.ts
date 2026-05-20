import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing-module';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoriesComponent } from './categories/categories.component';
import { SavedItemsComponent } from './saved-items/saved-items.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

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
    AboutComponent,
    ContactComponent,
  ],
})
export class PublicModule {}
