# Example: EmptyState Component Usage

**Component**: `<app-empty-state>`

**Basic Usage**:
```html
<app-empty-state
  icon="fa-shopping-bag"
  [title]="'No Items Yet'"
  [description]="'Get started by creating your first item.'"
  [actionText]="'Create Item'"
  (action)="createItem()">
</app-empty-state>
```

**Inputs**:
- `icon` (string, required) - FontAwesome icon class (e.g., 'fa-shopping-bag')
- `title` (string, required) - Empty state title/headline
- `description` (string, required) - Empty state description
- `actionText` (string, optional) - Button text for call-to-action

**Outputs**:
- `action` (event) - Emits when action button is clicked

**Component Logic**:
```typescript
createItem() {
  this.router.navigate(['/items/create']);
}
```

**Without Action Button**:
```html
<app-empty-state
  icon="fa-check-circle"
  [title]="'All Done!'"
  [description]="'You have completed all tasks.'">
</app-empty-state>
```

**Use Cases**:
- Empty lists/tables
- No search results
- No items in cart/wishlist
- Completed tasks
- First-time user onboarding

**Reference**: EmptyState component source code
