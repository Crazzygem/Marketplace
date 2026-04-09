import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false // Important for NgModule
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  email = '';
  password = '';

  onSubmit() {
    // Since we're using template-driven forms, we can validate the form in the template
    // Just proceed with login attempt
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Redirect based on role
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authService.isShopOwner()) {
          this.router.navigate(['/shop/dashboard']);
        } else {
          this.router.navigate(['/public/home']);
        }
      },
      error: (err: any) => this.notificationService.error('Login failed')
    });
  }
}