# Example: Alert State Management Pattern

**Purpose**: Manage alert display with auto-dismiss.

**Interface**:
```typescript
interface AlertState {
  show: boolean;
  variant: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  description?: string;
}
```

**Component Setup**:
```typescript
alertState: AlertState = {
  show: false,
  variant: 'success',
  title: '',
  description: ''
};

showAlert(
  variant: 'success' | 'danger',
  title: string,
  description?: string
) {
  this.alertState = { show: true, variant, title, description };
  setTimeout(() => {
    this.alertState.show = false;
  }, 5000);
}
```

**Usage Examples**:
```typescript
// Success alert
this.showAlert('success', 'Success', 'Changes saved successfully');

// Error alert
this.showAlert('danger', 'Error', 'Failed to save changes');

// Warning alert
this.showAlert('warning', 'Warning', 'This action cannot be undone');
```

**Template Usage**:
```html
<app-alert
  *ngIf="alertState.show"
  [variant]="alertState.variant"
  [title]="alertState.title"
  [description]="alertState.description"
  [showIcon]="true">
</app-alert>
```

**Key Points**:
- Auto-dismiss after 5 seconds
- Use signal for reactive updates (Angular 15+)
- Separate success/error methods for common cases
- Type-safe variant selection

**Alternative: Signal-based**:
```typescript
alertState = signal<AlertState>({
  show: false,
  variant: 'success',
  title: '',
  description: ''
});

showAlert(variant: 'success' | 'danger', title: string, description?: string) {
  this.alertState.set({ show: true, variant, title, description });
  setTimeout(() => {
    this.alertState.update(s => ({ ...s, show: false }));
  }, 5000);
}
```

**Reference**: Alert component documentation
