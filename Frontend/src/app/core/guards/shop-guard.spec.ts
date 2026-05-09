import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { shopGuard } from './shop-guard';
import { AuthService } from '../services/auth';

describe('shopGuard', () => {
  let guard: CanActivateFn;
  let authService: AuthService;
  let router: Router;

  const createMockRoute = (urlSegments: string[]): any => ({
    url: urlSegments.map((s) => ({ path: s }) as UrlSegment),
  });

  const mockState = { url: '/shop/dashboard' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });

    guard = shopGuard;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow shop owners', () => {
    authService.token.set('valid-token');
    authService.currentUser.set({
      id: 1,
      name: 'Shop Owner',
      email: 'shopowner@test.com',
      is_admin: false,
      is_customer: false,
      is_staff: false,
      is_shop_owner: true,
      ownShop: { shop_id: 1, shop_name: 'My Shop' },
    });

    const result = TestBed.runInInjectionContext(() =>
      guard(createMockRoute(['shop', 'dashboard']), mockState),
    );

    expect(result).toBe(true);
  });

  it('should allow admin users', () => {
    authService.token.set('valid-token');
    authService.currentUser.set({
      id: 1,
      name: 'Admin',
      email: 'admin@test.com',
      is_admin: true,
      is_customer: false,
      is_staff: false,
      is_shop_owner: false,
    });

    const result = TestBed.runInInjectionContext(() =>
      guard(createMockRoute(['shop', 'dashboard']), mockState),
    );

    expect(result).toBe(true);
  });

  it('should block unauthenticated users', () => {
    authService.token.set(null);
    authService.currentUser.set(null);

    const navigateSpy = spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() =>
      guard(createMockRoute(['shop', 'dashboard']), mockState),
    );

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should allow non-shop-owners to access create page', () => {
    authService.token.set('valid-token');
    authService.currentUser.set({
      id: 1,
      name: 'Regular User',
      email: 'user@test.com',
      is_admin: false,
      is_customer: true,
      is_staff: false,
      is_shop_owner: false,
    });

    const result = TestBed.runInInjectionContext(() =>
      guard(createMockRoute(['shop', 'create']), mockState),
    );

    expect(result).toBe(true);
  });

  it('should redirect non-shop-owners to create page', () => {
    authService.token.set('valid-token');
    authService.currentUser.set({
      id: 1,
      name: 'Regular User',
      email: 'user@test.com',
      is_admin: false,
      is_customer: true,
      is_staff: false,
      is_shop_owner: false,
    });

    const navigateSpy = spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() =>
      guard(createMockRoute(['shop', 'dashboard']), mockState),
    );

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/shop/create']);
  });
});
