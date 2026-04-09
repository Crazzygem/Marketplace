import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { adminGuard } from './admin-guard';
import { AuthService } from '../services/auth';

describe('adminGuard', () => {
  let guard: CanActivateFn;
  let authService: AuthService;
  let router: Router;
  const mockRoute = {} as any;
  const mockState = { url: '/admin/dashboard' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    
    guard = adminGuard;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
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

    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

    expect(result).toBe(true);
  });

  it('should block non-admin users and redirect to login', () => {
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
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should block unauthenticated users and redirect to login', () => {
    authService.token.set(null);
    authService.currentUser.set(null);

    const navigateSpy = spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
