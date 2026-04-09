import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() showIcon: boolean = true;

  protected get variantClass(): string {
    return `alert-semantic-${this.variant}`;
  }

  protected get iconClass(): string {
    const icons: Record<AlertVariant, string> = {
      success: 'fa-check-circle',
      danger: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[this.variant];
  }

  protected get hasContent(): boolean {
    return !!(this.title || this.description);
  }
}