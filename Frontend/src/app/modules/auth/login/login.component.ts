import { Component, ChangeDetectionStrategy, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  // Form state signals
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Computed validation states
  isEmailValid = computed(() => {
    const email = this.email();
    return email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  isPasswordValid = computed(() => {
    const password = this.password();
    return password.length === 0 || password.length >= 6;
  });

  isFormValid = computed(() => {
    return (
      this.email().length > 0 &&
      this.password().length > 0 &&
      this.isEmailValid() &&
      this.isPasswordValid()
    );
  });

  togglePassword(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage.set('Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          // Redirect based on role
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else if (this.authService.isShopOwner()) {
            this.router.navigate(['/shop/dashboard']);
          } else {
            this.router.navigate(['/public/home']);
          }
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          const errorMsg = err?.error?.message || 'Login failed. Please check your credentials.';
          this.errorMessage.set(errorMsg);
          this.notificationService.error(errorMsg);
          this.cdr.markForCheck();
        },
      });
  }
}
