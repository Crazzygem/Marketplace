import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { StaffManagementComponent } from './staff-management.component';
import { AdminService, UserDTO } from '../../../core/services/admin';
import { LoggerService } from '../../../core/services/logger.service';

describe('StaffManagementComponent', () => {
  let component: StaffManagementComponent;
  let fixture: ComponentFixture<StaffManagementComponent>;
  let httpMock: HttpTestingController;
  let adminService: AdminService;

  const mockUsers: UserDTO[] = [
    {
      id: 1,
      name: 'John Staff',
      email: 'john@example.com',
      roles: { customer: true, staff: true, shop_owner: false, admin: false },
      is_banned: false,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Customer',
      email: 'jane@example.com',
      roles: { customer: true, staff: false, shop_owner: false, admin: false },
      is_banned: false,
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@example.com',
      roles: { customer: true, staff: false, shop_owner: false, admin: true },
      is_banned: false,
      created_at: '2024-01-03T00:00:00Z',
    },
    {
      id: 4,
      name: 'Banned Staff',
      email: 'banned@example.com',
      roles: { customer: true, staff: true, shop_owner: false, admin: false },
      is_banned: true,
      created_at: '2024-01-04T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [StaffManagementComponent],
      providers: [AdminService, LoggerService],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffManagementComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    adminService = TestBed.inject(AdminService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(component.users.length).toBe(4);
    expect(component.isLoading).toBe(false);
  });

  it('should filter users by search term', () => {
    component.users = mockUsers;
    component.searchTerm = 'john';
    component.filterUsers();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Staff');
  });

  it('should filter users by email', () => {
    component.users = mockUsers;
    component.searchTerm = 'admin@example.com';
    component.filterUsers();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].email).toBe('admin@example.com');
  });

  it('should show all users when search term is empty', () => {
    component.users = mockUsers;
    component.searchTerm = '';
    component.filterUsers();

    expect(component.filteredUsers.length).toBe(4);
  });

  it('should identify staff users correctly', () => {
    const staffUser = mockUsers[0];
    const customerUser = mockUsers[1];

    expect(component.isStaff(staffUser)).toBe(true);
    expect(component.isStaff(customerUser)).toBe(false);
  });

  it('should get correct user role', () => {
    expect(component.getUserRole(mockUsers[0])).toBe('staff');
    expect(component.getUserRole(mockUsers[1])).toBe('customer');
    expect(component.getUserRole(mockUsers[2])).toBe('admin');
  });

  it('should get correct role variant', () => {
    expect(component.getRoleVariant('admin')).toBe('info');
    expect(component.getRoleVariant('staff')).toBe('success');
    expect(component.getRoleVariant('shop_owner')).toBe('warning');
    expect(component.getRoleVariant('customer')).toBe('secondary');
  });

  it('should get correct status variant', () => {
    expect(component.getStatusVariant('staff', true)).toBe('destructive');
    expect(component.getStatusVariant('admin', false)).toBe('info');
    expect(component.getStatusVariant('staff', false)).toBe('success');
    expect(component.getStatusVariant('customer', false)).toBe('default');
  });

  it('should handle ban user', () => {
    const user = { ...mockUsers[1] };
    component.users = [user];
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.toggleBan(user);

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users/2/ban');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User banned successfully', user: { ...user, is_banned: true } });

    expect(user.is_banned).toBe(true);
    expect(component.alert).toBeTruthy();
    expect(component.alert?.title).toBe('User Banned');
  });

  it('should handle unban user', () => {
    const user = { ...mockUsers[3] };
    component.users = [user];
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.toggleBan(user);

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users/4/unban');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User unbanned successfully', user: { ...user, is_banned: false } });

    expect(user.is_banned).toBe(false);
    expect(component.alert).toBeTruthy();
    expect(component.alert?.title).toBe('User Unbanned');
  });

  it('should handle assign staff role', () => {
    const user = { ...mockUsers[1] };
    component.users = [user];
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.toggleStaffRole(user);

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users/2/role');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.role).toBe('staff');
    req.flush({
      message: 'Role updated successfully',
      user: { ...user, roles: { customer: false, staff: true, shop_owner: false, admin: false } },
    });

    expect(user.roles.staff).toBe(true);
    expect(component.alert).toBeTruthy();
    expect(component.alert?.title).toBe('Staff Role Updated');
  });

  it('should handle remove staff role', () => {
    const user = { ...mockUsers[0] };
    component.users = [user];
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.toggleStaffRole(user);

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users/1/role');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.role).toBe('customer');
    req.flush({
      message: 'Role updated successfully',
      user: { ...user, roles: { customer: true, staff: false, shop_owner: false, admin: false } },
    });

    expect(user.roles.staff).toBe(false);
    expect(component.alert).toBeTruthy();
    expect(component.alert?.title).toBe('Staff Role Updated');
  });

  it('should handle error when loading users', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users');
    req.flush('Error loading users', { status: 500, statusText: 'Server Error' });

    expect(component.users.length).toBe(0);
    expect(component.isLoading).toBe(false);
    expect(component.alert).toBeTruthy();
    expect(component.alert?.variant).toBe('danger');
  });

  it('should clear alert after timeout', () => {
    jasmine.clock().install();

    // Trigger an action that shows an alert
    const user = { ...mockUsers[1] };
    component.users = [user];
    spyOn(window, 'confirm').and.returnValue(true);
    component.toggleBan(user);

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/admin/users/2/ban');
    req.flush({ message: 'User banned successfully', user: { ...user, is_banned: true } });

    expect(component.alert).toBeTruthy();

    jasmine.clock().tick(5001);
    expect(component.alert).toBeNull();

    jasmine.clock().uninstall();
  });

  it('should handle search input', () => {
    component.users = mockUsers;
    component.searchTerm = 'Jane';
    component.onSearchInput();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Jane Customer');
  });
});
