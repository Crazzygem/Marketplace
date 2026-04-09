# Example: Tabs Component Usage

**Component**: `<app-tabs>`

**Basic Usage**:
```html
<app-tabs [tabs]="tabsList" [(activeTab)]="activeTab" (tabChange)="onTabChange($event)"></app-tabs>
```

**Inputs**:
- `tabs` (TabItem[], required) - Array of tab definitions
- `activeTab` (string, two-way binding) - Currently active tab value

**Outputs**:
- `tabChange` (event) - Emits when tab changes

**TabItem Interface**:
```typescript
interface TabItem {
  value: string;      // Unique identifier
  label: string;     // Display text
  icon?: string;      // Optional FontAwesome icon class (e.g., 'fa-home')
}
```

**Component Setup**:
```typescript
activeTab = signal('overview');

tabs: TabItem[] = [
  { value: 'overview', label: 'Overview', icon: 'fa-home' },
  { value: 'profile', label: 'Personal Info', icon: 'fa-user' },
  { value: 'security', label: 'Security', icon: 'fa-shield-alt' }
];

onTabChange(tabValue: string) {
  this.activeTab.set(tabValue);
  // Load data for this tab
}
```

**Direct Tab Access**:
```html
<!-- Navigate to specific tab via query parameter -->
<button routerLink="/profile?tab=security">Go to Security</button>
```

**Reference**: Tabs component source code
