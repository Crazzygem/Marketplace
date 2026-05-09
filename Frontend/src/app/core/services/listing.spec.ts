import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListingService } from './listing';
import { environment } from '../../../environments/environment';
import { Listing } from '../models/listing';

describe('ListingService', () => {
  let service: ListingService;
  let httpMock: HttpTestingController;

  const mockListing: Listing = {
    listing_id: 1,
    title: 'Test Listing',
    description: 'Description',
    price: 100.5,
    stock_quantity: 10,
    status: 'Active',
    view_count: 0,
    sales_count: 0,
    is_sold: false,
    category_id: 1,
    shop_id: 1,
    image_urls: ['image1.jpg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListingService],
    });
    service = TestBed.inject(ListingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getListings', () => {
    it('should fetch all listings', () => {
      const mockResponse = {
        data: [mockListing],
        current_page: 1,
        total: 1,
      };

      service.getListings().subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch listings with query params', () => {
      const params = { category_id: 1, search: 'test', page: 1 };

      service.getListings(params).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/listings?category_id=1&search=test&page=1`,
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getListing', () => {
    it('should fetch single listing', () => {
      service.getListing(1).subscribe((listing) => {
        expect(listing).toEqual(mockListing);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockListing);
    });
  });

  describe('createListing', () => {
    it('should create a new listing', () => {
      const newListing = {
        title: 'New Listing',
        description: 'Description',
        price: 50,
        stock_quantity: 5,
      };

      service.createListing(newListing).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newListing);
      req.flush({ listing: mockListing });
    });
  });

  describe('updateListing', () => {
    it('should update existing listing', () => {
      const updates = { title: 'Updated Title', price: 150 };

      service.updateListing(1, updates).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush({ listing: { ...mockListing, ...updates } });
    });
  });

  describe('deleteListing', () => {
    it('should delete listing', () => {
      service.deleteListing(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Listing deleted successfully' });
    });
  });

  describe('markAsSold', () => {
    it('should mark listing as sold', () => {
      service.markAsSold(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings/1/mark-as-sold`);
      expect(req.request.method).toBe('POST');
      req.flush({ listing: { ...mockListing, is_sold: true } });
    });
  });

  describe('restock', () => {
    it('should restock listing', () => {
      service.restock(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/listings/1/restock`);
      expect(req.request.method).toBe('POST');
      req.flush({ listing: mockListing });
    });
  });
});
