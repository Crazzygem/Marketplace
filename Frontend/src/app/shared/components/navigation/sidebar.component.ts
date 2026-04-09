import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="sidebar d-flex flex-column p-3 bg-light vh-100" style="width: 250px;">
      <div class="mb-4">
        <h5 class="fw-bold">Marketplace</h5>
      </div>

      <ul class="nav flex-column mb-4">
        <li class="nav-item mb-2">
          <a
            class="nav-link d-flex align-items-center"
            routerLink="/public/home"
            routerLinkActive="active"
          >
            <i class="fas fa-home me-2"></i> Home
          </a>
        </li>
        <li class="nav-item mb-2">
          <a
            class="nav-link d-flex align-items-center"
            routerLink="/public/saved-items"
            routerLinkActive="active"
          >
            <i class="fas fa-heart me-2"></i> Saved Items
          </a>
        </li>
        <li class="nav-item mb-2">
          <a
            class="nav-link d-flex align-items-center"
            routerLink="/public/categories"
            routerLinkActive="active"
          >
            <i class="fas fa-tags me-2"></i> Categories
          </a>
        </li>
      </ul>

      <div class="mb-4" *ngIf="authService.isAuthenticated()">
        <h6 class="fw-bold text-uppercase text-muted small">My Account</h6>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <a
              class="nav-link d-flex align-items-center"
              routerLink="/profile"
              routerLinkActive="active"
            >
              <i class="fas fa-user me-2"></i> My Profile
            </a>
          </li>
          <!-- Show shop links if user is shop owner or admin -->
          <li class="nav-item mb-2" *ngIf="authService.isShopOwner() || authService.isAdmin()">
            <a
              class="nav-link d-flex align-items-center"
              routerLink="/shop"
              routerLinkActive="active"
            >
              <i class="fas fa-store me-2"></i> My Shop
            </a>
          </li>
          <!-- Show admin links if user is admin -->
          <li class="nav-item mb-2" *ngIf="authService.isAdmin()">
            <a
              class="nav-link d-flex align-items-center"
              routerLink="/admin"
              routerLinkActive="active"
            >
              <i class="fas fa-cog me-2"></i> Admin Panel
            </a>
          </li>
        </ul>
      </div>

      <div class="mt-auto">
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <a
              class="nav-link d-flex align-items-center"
              routerLink="/public/about"
              routerLinkActive="active"
            >
              <i class="fas fa-info-circle me-2"></i> About
            </a>
          </li>
          <li class="nav-item mb-2">
            <a
              class="nav-link d-flex align-items-center"
              routerLink="/public/contact"
              routerLinkActive="active"
            >
              <i class="fas fa-envelope me-2"></i> Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 100;
        overflow-y: auto;
      }

      .nav-link {
        border-radius: 0.375rem;
        color: var(--muted-foreground);
        transition: all 0.2s;
      }

      .nav-link:hover {
        background-color: var(--muted);
        color: var(--primary);
      }

      .nav-link.active {
        background-color: var(--primary);
        color: var(--primary-foreground);
      }
    `,
  ],
  host: {
    class: 'd-none d-md-block',
  },
})
export class SidebarComponent {
  authService = inject(AuthService);
}
