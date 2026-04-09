import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  @Input() imageSrc: string | null = null;
  @Input() name: string = '';
  @Input() size: AvatarSize = 'md';

  protected readonly sizeClass = computed(() => `avatar-${this.size}`);

  protected readonly initials = computed(() => {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  protected readonly hasImage = computed(() => !!this.imageSrc);
}