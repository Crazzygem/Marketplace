import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, User, AuthResponse } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    is_customer: true,
    is_staff: false,
    is_shop_owner: false,
    is_admin: false,
  };

  const mockAdmin: User = {
    ...mockUser,
    id: 2,
    name: 'Admin User',
    is_admin: true,
    is_customer: false,
  };

  const mockShopOwner: User = {
    ...mockUser,
    id: 3,
    name: 'Shop Owner',
    is_shop_owner: true,
    ownShop: { shop_id: 1, shop_name: 'My Shop' },
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store token', () => {
      const mockResponse: AuthResponse = {
        access_token: 'test-token-123',
        user: mockUser,
      };

      service.login({ email: 'test@example.com', password: 'password123' }).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });

      req.flush(mockResponse);

      expect(service.token()).toBe('test-token-123');
      expect(service.currentUser()).toEqual(mockUser);
      expect(localStorage.getItem('token')).toBe('test-token-123');
    });

    it('should handle login error', () => {
      service.login({ email: 'test@example.com', password: 'wrong' }).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/login`);
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register user and store token', () => {
      const mockResponse: AuthResponse = {
        access_token: 'register-token-456',
        user: mockUser,
      };

      service
        .register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(service.token()).toBe('register-token-456');
      expect(service.currentUser()).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout and clear storage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      service.token.set('test-token');
      service.currentUser.set(mockUser);

      service.logout();

      expect(service.token()).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('computed values', () => {
    it('should compute isAuthenticated correctly', () => {
      expect(service.isAuthenticated()).toBe(false);
      
      service.token.set('test-token');
      expect(service.isAuthenticated()).toBe(true);
      
      service.token.set(null);
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should compute isAdmin correctly for admin user', () => {
      service.currentUser.set(mockAdmin);
      expect(service.isAdmin()).toBe(true);
    });

    it('should compute isAdmin correctly for non-admin user', () => {
      service.currentUser.set(mockUser);
      expect(service.isAdmin()).toBe(false);
    });

    it('should compute isShopOwner correctly', () => {
      service.currentUser.set(mockShopOwner);
      expect(service.isShopOwner()).toBe(true);
    });

    it('should compute isCustomer correctly', () => {
      service.currentUser.set(mockUser);
      expect(service.isCustomer()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      service.currentUser.set(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when no user', () => {
      service.currentUser.set(null);
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
