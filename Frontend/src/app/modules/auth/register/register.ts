import { Component, ChangeDetectionStrategy, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  // Form state signals
  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  role = signal('customer');
  agreeToTerms = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Computed validation states
  isEmailValid = computed(() => {
    const email = this.email();
    return email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  isNameValid = computed(() => {
    const name = this.name();
    return name.length === 0 || name.length >= 2;
  });

  isPasswordValid = computed(() => {
    const password = this.password();
    return password.length === 0 || password.length >= 6;
  });

  passwordsMatch = computed(() => {
    const confirm = this.confirmPassword();
    const password = this.password();
    if (confirm.length === 0) return true;
    return confirm === password;
  });

  isPasswordStrong = computed(() => {
    const password = this.password();
    if (password.length === 0) return false;
    // Check for at least: 6 chars, one letter, one number
    const hasMinLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasMinLength && hasLetter && hasNumber;
  });

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.password();
    if (password.length === 0) return 'weak';

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  isFormValid = computed(() => {
    return (
      this.name().length >= 2 &&
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.passwordsMatch() &&
      this.agreeToTerms() &&
      this.role().length > 0
    );
  });

  togglePassword(): void {
    this.showPassword.update((val) => !val);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      if (!this.passwordsMatch()) {
        this.errorMessage.set('Passwords do not match');
      } else {
        this.errorMessage.set('Please fill in all required fields correctly');
      }
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        name: this.name(),
        email: this.email(),
        password: this.password(),
        password_confirmation: this.confirmPassword(),
        role: this.role(),
      })
      .subscribe({
        next: () => {
          this.notificationService.success('Account created successfully!');
          // Redirect to home or login
          this.router.navigate(['/public/home']);
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          let errorMsg = 'Registration failed. Please try again.';

          if (err?.error?.errors) {
            errorMsg = Object.values(err.error.errors).flat().join(', ');
          } else if (err?.error?.message) {
            errorMsg = err.error.message;
          }

          this.errorMessage.set(errorMsg);
          this.notificationService.error(errorMsg);
          this.cdr.markForCheck();
        },
      });
  }
}
