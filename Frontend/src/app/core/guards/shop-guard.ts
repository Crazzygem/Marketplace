import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth'; // Ensure import path is correct

export const shopGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Allow access if user is a shop owner or admin
  if (authService.isShopOwner() || authService.isAdmin()) {
    return true;
  }

  // For users who are not shop owners, redirect to shop creation
  if (route.url.join('/').includes('create')) {
    // Allow access to create shop page
    return true;
  } else {
    // Redirect to shop creation page
    router.navigate(['/shop/create']);
    return false;
  }
};