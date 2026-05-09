import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RegisterComponent } from './register';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, RegisterComponent],
      providers: [AuthService, NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all form signals initialized', () => {
    expect(component.name()).toBe('');
    expect(component.email()).toBe('');
    expect(component.password()).toBe('');
    expect(component.confirmPassword()).toBe('');
    expect(component.role()).toBe('customer');
    expect(component.agreeToTerms()).toBe(false);
  });

  it('should render form with all required fields', () => {
    const nameInput = fixture.debugElement.query(By.css('input#name'));
    const emailInput = fixture.debugElement.query(By.css('input#email'));
    const passwordInput = fixture.debugElement.query(By.css('input#password'));
    const confirmPasswordInput = fixture.debugElement.query(By.css('input#confirmPassword'));
    const roleSelect = fixture.debugElement.query(By.css('select#role'));
    const termsCheckbox = fixture.debugElement.query(By.css('input#terms'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
    expect(roleSelect).toBeTruthy();
    expect(termsCheckbox).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should have invalid form when name is too short', () => {
    component.name.set('A');
    fixture.detectChanges();
    expect(component.isNameValid()).toBe(false);
  });

  it('should have valid form when name is long enough', () => {
    component.name.set('John Doe');
    fixture.detectChanges();
    expect(component.isNameValid()).toBe(true);
  });

  it('should validate email format', () => {
    component.email.set('invalid');
    fixture.detectChanges();
    expect(component.isEmailValid()).toBe(false);

    component.email.set('valid@example.com');
    fixture.detectChanges();
    expect(component.isEmailValid()).toBe(true);
  });

  it('should validate password length', () => {
    component.password.set('123');
    fixture.detectChanges();
    expect(component.isPasswordValid()).toBe(false);

    component.password.set('password123');
    fixture.detectChanges();
    expect(component.isPasswordValid()).toBe(true);
  });

  it('should validate passwords match', () => {
    component.password.set('password123');
    component.confirmPassword.set('different');
    fixture.detectChanges();
    expect(component.passwordsMatch()).toBe(false);

    component.confirmPassword.set('password123');
    fixture.detectChanges();
    expect(component.passwordsMatch()).toBe(true);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePassword();
    expect(component.showPassword()).toBe(true);
    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword()).toBe(false);
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(true);
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(false);
  });

  it('should have invalid form when terms not agreed', () => {
    component.name.set('John Doe');
    component.email.set('john@example.com');
    component.password.set('password123');
    component.confirmPassword.set('password123');
    component.role.set('customer');
    component.agreeToTerms.set(false);
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(false);
  });

  it('should have valid form when all fields are correct', () => {
    component.name.set('John Doe');
    component.email.set('john@example.com');
    component.password.set('password123');
    component.confirmPassword.set('password123');
    component.role.set('customer');
    component.agreeToTerms.set(true);
    fixture.detectChanges();

    expect(component.isFormValid()).toBe(true);
  });

  it('should call register on form submit', () => {
    const registerSpy = spyOn(authService, 'register').and.callThrough();

    component.name.set('John Doe');
    component.email.set('john@example.com');
    component.password.set('password123');
    component.confirmPassword.set('password123');
    component.role.set('customer');
    component.agreeToTerms.set(true);

    component.onSubmit();

    expect(registerSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      role: 'customer',
    });
  });

  it('should show error on registration failure', () => {
    const errorSpy = spyOn(notificationService, 'error').and.callThrough();
    const registerSpy = spyOn(authService, 'register').and.callFake(() => {
      return {
        subscribe: (callbacks: any) => {
          callbacks.error({ message: 'Registration failed' });
          return { unsubscribe: () => {} };
        },
      } as any;
    });

    component.name.set('John Doe');
    component.email.set('john@example.com');
    component.password.set('password123');
    component.confirmPassword.set('password123');
    component.role.set('customer');
    component.agreeToTerms.set(true);

    component.onSubmit();

    expect(registerSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Registration failed');
    expect(component.errorMessage()).toBe('Registration failed');
  });
});
