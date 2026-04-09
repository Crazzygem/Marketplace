import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon: string = 'fa-box-open';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() actionText: string = '';
  @Output() action = new EventEmitter<void>();

  protected hasAction(): boolean {
    return !!this.actionText;
  }

  protected onActionClick(): void {
    this.action.emit();
  }
}