import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false // Important for NgModule
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  formData = { name: '', email: '', password: '', role: 'customer' };

  onSubmit() {
    // Since we're using template-driven forms, we can validate the form in the template
    // Just proceed with registration attempt
    this.authService.register(this.formData).subscribe({
      next: () => this.router.navigate(['/public/home']),
      error: () => this.notificationService.error('Registration failed')
    });
  }
}