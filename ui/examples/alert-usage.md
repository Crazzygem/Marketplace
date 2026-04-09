# Example: Alert Component Usage

**Component**: `<app-alert>`

**Basic Usage**:
```html
<app-alert variant="success" [title]="'Success'" [showIcon]="true"></app-alert>
```

**With Description**:
```html
<app-alert
  variant="danger"
  [title]="'Error'"
  [description]="errorMessage"
  [showIcon]="true">
</app-alert>
```

**Inputs**:
- `variant` (string, required) - 'success' | 'danger' | 'warning' | 'info'
- `title` (string, required) - Alert title/headline
- `description` (string, optional) - Alert description/details
- `showIcon` (boolean, default: true) - Show variant icon

**Auto-Dismiss Pattern**:
```typescript
alertState = {
  show: false,
  variant: 'success',
  title: '',
  description: ''
};

showSuccessMessage() {
  this.alertState = {
    show: true,
    variant: 'success',
    title: 'Success',
    description: 'Changes saved successfully'
  };
  setTimeout(() => {
    this.alertState.show = false;
  }, 5000);
}
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

**Reference**: Alert component source code
