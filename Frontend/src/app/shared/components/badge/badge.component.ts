import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() variant: BadgeVariant = 'default';
  @Input() dot: boolean = false;

  protected get variantClass(): string {
    return `badge-${this.variant}`;
  }

  protected get dotClass(): string {
    return this.dot ? 'badge-dot' : '';
  }
}