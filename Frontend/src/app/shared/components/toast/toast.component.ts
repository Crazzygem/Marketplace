import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="notifications().length > 0">
      <div
        *ngFor="let notification of notifications()"
        class="toast"
        [class.toast-success]="notification.type === 'success'"
        [class.toast-error]="notification.type === 'error'"
        [class.toast-info]="notification.type === 'info'"
        [class.toast-warning]="notification.type === 'warning'"
      >
        <div class="toast-content">
          <span class="toast-icon">
            <i *ngIf="notification.type === 'success'" class="fas fa-check-circle"></i>
            <i *ngIf="notification.type === 'error'" class="fas fa-exclamation-circle"></i>
            <i *ngIf="notification.type === 'info'" class="fas fa-info-circle"></i>
            <i *ngIf="notification.type === 'warning'" class="fas fa-exclamation-triangle"></i>
          </span>
          <span class="toast-message">{{ notification.message }}</span>
        </div>
        <button class="toast-close" (click)="close(notification.id)">
          <i class="fas fa-times"></i>
        </button>
        <div class="toast-progress" [style.animation-duration.ms]="notification.duration"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .toast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: white;
        min-width: 300px;
        position: relative;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-success {
        border-left: 4px solid var(--success);
      }

      .toast-error {
        border-left: 4px solid var(--destructive);
      }

      .toast-info {
        border-left: 4px solid var(--info);
      }

      .toast-warning {
        border-left: 4px solid var(--warning);
      }

      .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }

      .toast-icon {
        font-size: 20px;
      }

      .toast-success .toast-icon {
        color: var(--success);
      }

      .toast-error .toast-icon {
        color: var(--destructive);
      }

      .toast-info .toast-icon {
        color: var(--info);
      }

      .toast-warning .toast-icon {
        color: var(--warning);
      }

      .toast-message {
        font-size: 14px;
        color: var(--foreground);
        line-height: 1.4;
      }

      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--muted-foreground);
        font-size: 14px;
        transition: color 0.2s;
      }

      .toast-close:hover {
        color: var(--foreground);
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        animation: progress linear forwards;
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      /* Responsive adjustments */
      @media (max-width: 576px) {
        .toast-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }

        .toast {
          min-width: auto;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.activeNotifications;

  close(id: string): void {
    this.notificationService.remove(id);
  }
}
