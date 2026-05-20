import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, LoginComponent],
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

  it('should have email and password signals initialized', () => {
    expect(component.email()).toBe('');
    expect(component.password()).toBe('');
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

    component.email.set('test@example.com');
    component.password.set('password123');

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

    component.email.set('test@example.com');
    component.password.set('wrongpassword');

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Login failed');
    expect(component.errorMessage()).toBe('Login failed');
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

    component.email.set('admin@test.com');
    component.password.set('adminpass');

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

    component.email.set('shopowner@test.com');
    component.password.set('shoppass');

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

    component.email.set('user@test.com');
    component.password.set('userpass');

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/public/home']);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePassword();
    expect(component.showPassword()).toBe(true);
    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should have valid form when all fields are filled correctly', () => {
    component.email.set('test@example.com');
    component.password.set('password123');
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(true);
  });

  it('should have invalid form when email is empty', () => {
    component.email.set('');
    component.password.set('password123');
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(false);
  });

  it('should have invalid form when password is too short', () => {
    component.email.set('test@example.com');
    component.password.set('123');
    fixture.detectChanges();

    expect(component.isPasswordValid()).toBe(false);
  });
});
