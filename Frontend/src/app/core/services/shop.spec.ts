import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShopService, Shop, StaffMember } from './shop';
import { environment } from '../../../environments/environment';

describe('ShopService', () => {
  let service: ShopService;
  let httpMock: HttpTestingController;

  const mockShop: Shop = {
    shop_id: 1,
    owner_id: 1,
    shop_name: 'Test Shop',
    description: 'Description',
    status: 'active',
    subscription_tier: 'basic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockStats = {
    shop: mockShop,
    stats: {
      total_views: 100,
      total_listings: 10,
      active_listings: 8,
      sold_listings: 2,
    },
    charts: {},
    top_listings: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShopService],
    });
    service = TestBed.inject(ShopService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createShop', () => {
    it('should create a shop', () => {
      const shopData = { shop_name: 'New Shop', description: 'Description' };

      service.createShop(shopData).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shops`);
      expect(req.request.method).toBe('POST');
      req.flush({ shop: mockShop });
    });
  });

  describe('getShopStats', () => {
    it('should fetch shop stats', () => {
      service.getShopStats().subscribe((stats) => {
        expect(stats).toBeTruthy();
        expect(stats.total_listings).toBeDefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/my-shop/stats`);
      expect(req.request.method).toBe('GET');
      req.flush({
        shop: mockShop,
        stats: {
          total_listings: 10,
          active_listings: 8,
          total_orders: 5,
          total_revenue: 1000,
          recent_orders: 2,
        },
      });
    });
  });

  describe('getShop', () => {
    it('should fetch a shop by id', () => {
      service.getShop(1).subscribe((shop) => {
        expect(shop).toEqual(mockShop);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shops/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockShop);
    });
  });

  describe('updateShop', () => {
    it('should update shop', () => {
      const updates = { shop_name: 'Updated Shop' };

      service.updateShop(1, updates).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shops/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ shop: { ...mockShop, ...updates } });
    });
  });

  describe('deleteShop', () => {
    it('should delete shop', () => {
      service.deleteShop(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shops/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Shop deleted successfully' });
    });
  });

  describe('getStaff', () => {
    it('should fetch shop staff', () => {
      const staff: StaffMember[] = [
        {
          member_id: 1,
          shop_id: 1,
          user_id: 1,
          role: 'owner',
          created_at: new Date().toISOString(),
          user: { id: 1, name: 'Owner', email: 'owner@test.com' },
        },
      ];

      service.getStaff().subscribe((response) => {
        expect(response).toEqual(staff);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shop-members`);
      expect(req.request.method).toBe('GET');
      req.flush(staff);
    });
  });

  describe('addStaff', () => {
    it('should add staff member', () => {
      const memberData = { user_id: 2, role: 'manager' as const };

      service.addStaff(memberData).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shop-members`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Staff added successfully' });
    });
  });

  describe('removeStaff', () => {
    it('should remove staff member', () => {
      service.removeStaff(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/shop-members/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Staff removed successfully' });
    });
  });
});
