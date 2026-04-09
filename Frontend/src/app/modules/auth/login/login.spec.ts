import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [LoginComponent],
      providers: [AuthService, NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have email and password fields', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should render form with email and password inputs', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should render submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
  });

  it('should call login on form submit', () => {
    const loginSpy = spyOn(authService, 'login').and.callThrough();

    component.email = 'test@example.com';
    component.password = 'password123';

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should show error notification on login failure', () => {
    const errorSpy = spyOn(notificationService, 'error').and.callThrough();
    const loginSpy = spyOn(authService, 'login').and.callFake(() => {
      return {
        subscribe: (callbacks: any) => {
          callbacks.error({ message: 'Login failed' });
          return { unsubscribe: () => {} };
        },
      } as any;
    });

    component.email = 'test@example.com';
    component.password = 'wrongpassword';

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Login failed');
  });

  it('should navigate to admin dashboard on admin login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const loginSpy = spyOn(authService, 'login').and.callFake(() => {
      return {
        subscribe: (callbacks: any) => {
          callbacks.next({});
          return { unsubscribe: () => {} };
        },
      } as any;
    });

    spyOn(authService, 'isAdmin').and.returnValue(true);
    spyOn(authService, 'isShopOwner').and.returnValue(false);

    component.email = 'admin@test.com';
    component.password = 'adminpass';

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should navigate to shop dashboard on shop owner login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const loginSpy = spyOn(authService, 'login').and.callFake(() => {
      return {
        subscribe: (callbacks: any) => {
          callbacks.next({});
          return { unsubscribe: () => {} };
        },
      } as any;
    });

    spyOn(authService, 'isAdmin').and.returnValue(false);
    spyOn(authService, 'isShopOwner').and.returnValue(true);

    component.email = 'shopowner@test.com';
    component.password = 'shoppass';

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/shop/dashboard']);
  });

  it('should navigate to home on regular user login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const loginSpy = spyOn(authService, 'login').and.callFake(() => {
      return {
        subscribe: (callbacks: any) => {
          callbacks.next({});
          return { unsubscribe: () => {} };
        },
      } as any;
    });

    spyOn(authService, 'isAdmin').and.returnValue(false);
    spyOn(authService, 'isShopOwner').and.returnValue(false);

    component.email = 'user@test.com';
    component.password = 'userpass';

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/public/home']);
  });
});
