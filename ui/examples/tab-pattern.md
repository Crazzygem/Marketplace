# Example: Tab Pattern (shadcn-style)

**Purpose**: Tabbed navigation with active state.

**Pattern**:
```html
<ul class="nav nav-pills mb-4" role="tablist">
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      [class.active]="activeTab === 'account'"
      (click)="setActiveTab('account')"
      role="tab"
      aria-selected="activeTab === 'account'"
    >
      <i class="fas fa-user me-2"></i>
      Account
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      [class.active]="activeTab === 'password'"
      (click)="setActiveTab('password')"
      role="tab"
      aria-selected="activeTab === 'password'"
    >
      <i class="fas fa-lock me-2"></i>
      Password
    </button>
  </li>
</ul>

<div *ngIf="activeTab === 'account'">
  <!-- Account content -->
</div>
```

**Component Logic**:
```typescript
activeTab = signal('account');

setActiveTab(tab: string) {
  this.activeTab.set(tab);
}
```

**Key Points**:
- Use `nav-pills` for pill-style tabs
- `active` class shows active state
- Icons with `me-2` for spacing
- `role="tab"` for accessibility
- `aria-selected` for screen readers

**Reference**: Bootstrap Tabs
