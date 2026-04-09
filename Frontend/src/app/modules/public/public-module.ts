import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing-module';
import { HomeComponent } from './home/home';
import { ProductDetailComponent } from './product-detail/product-detail';

@NgModule({
  declarations: [
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }