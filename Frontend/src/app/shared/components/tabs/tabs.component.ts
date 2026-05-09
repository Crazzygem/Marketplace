import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab: string = '';
  @Output() activeTabChange = new EventEmitter<string>();

  protected onTabClick(tabValue: string): void {
    this.activeTab = tabValue;
    this.activeTabChange.emit(tabValue);
  }

  protected getTabIcon(tab: TabItem): string {
    return tab.icon || '';
  }
}
