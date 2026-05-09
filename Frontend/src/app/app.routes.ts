import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { shopGuard } from './core/guards/shop-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'public/home',
  },
  {
    path: 'public',
    loadChildren: () => import('./modules/public/public-module').then((m) => m.PublicModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin-module').then((m) => m.AdminModule),
    canActivate: [adminGuard],
  },
  {
    path: 'shop',
    loadChildren: () => import('./modules/shop/shop-module').then((m) => m.ShopModule),
    canActivate: [shopGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule),
  },
];
