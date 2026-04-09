import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductDetailComponent } from './product-detail/product-detail';
import { SavedItemsComponent } from './saved-items/saved-items.component';
import { Categories } from './categories/categories';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'saved-items', component: SavedItemsComponent },
  { path: 'wishlist', component: SavedItemsComponent },
  { path: 'cart', redirectTo: 'saved-items', pathMatch: 'full' },  // Legacy route - redirect to saved items
  { path: 'categories', component: Categories }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }