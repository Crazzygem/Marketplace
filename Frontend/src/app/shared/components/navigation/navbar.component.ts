import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/public/home">Marketplace</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/public/home" routerLinkActive="active"></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/public/saved-items" routerLinkActive="active"></a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/auth/login" routerLinkActive="active">Login</a>
            </li>
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/auth/register" routerLinkActive="active">Register</a>
            </li>
            <li class="nav-item dropdown" *ngIf="authService.isAuthenticated()">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ authService.currentUser()?.name }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" routerLink="/profile">My Profile</a></li>
                <li><a class="dropdown-item" routerLink="/shop" *ngIf="authService.isShopOwner()">My Shop</a></li>
                <li><a class="dropdown-item" routerLink="/admin" *ngIf="authService.isAdmin()">Admin Panel</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout()" style="cursor: pointer;">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      padding: 0.5rem 0;
    }
    .navbar-brand {
      font-size: 1.5rem;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}