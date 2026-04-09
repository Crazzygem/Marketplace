import { Component, EventEmitter, Input, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CATEGORY_ICONS, IconItem } from '../../data/icons';

@Component({
  selector: 'app-icon-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.css',
})
export class IconPickerComponent {
  @Input() selectedIcon = 'fa-tag';
  @Input() showModal = false;
  @Output() iconSelected = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();

  icons = CATEGORY_ICONS;
  searchQuery = signal('');

  filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.icons;
    }
    return this.icons.filter(
      icon =>
        icon.icon.toLowerCase().includes(query) ||
        icon.label.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query)
    );
  });

  get selectedIconItem(): IconItem | undefined {
    return CATEGORY_ICONS.find(icon => icon.icon === this.selectedIcon);
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.iconSelected.emit(icon);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }
}
