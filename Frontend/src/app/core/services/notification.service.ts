import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  readonly activeNotifications = this.notifications.asReadonly();

  private readonly defaultDuration = 2000; // 2 seconds as requested

  /**
   * Show a success notification
   */
  success(message: string, duration?: number): void {
    this.addNotification('success', message, duration);
  }

  /**
   * Show an error notification
   */
  error(message: string, duration?: number): void {
    this.addNotification('error', message, duration);
  }

  /**
   * Show an info notification
   */
  info(message: string, duration?: number): void {
    this.addNotification('info', message, duration);
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration?: number): void {
    this.addNotification('warning', message, duration);
  }

  /**
   * Remove a specific notification by ID
   */
  remove(id: string): void {
    this.notifications.update(current => 
      current.filter(n => n.id !== id)
    );
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.set([]);
  }

  private addNotification(type: NotificationType, message: string, duration?: number): void {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      message,
      duration: duration ?? this.defaultDuration
    };

    this.notifications.update(current => [...current, notification]);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(id);
    }, notification.duration);
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
