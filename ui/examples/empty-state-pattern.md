# Example: Empty State Pattern

**Purpose**: Guide users when no data exists with clear action.

**Pattern**:
```html
<div class="text-center py-5">
  <i class="fas fa-shopping-bag text-muted mb-3" style="font-size: 3rem"></i>
  <h5>No items yet</h5>
  <p class="text-muted mb-4">Get started by creating your first item.</p>
  <button class="btn btn-primary" (click)="createItem()">
    Create Item
  </button>
</div>
```

**Component Logic**:
```typescript
createItem() {
  this.router.navigate(['/items/create']);
}
```

**Key Points**:
- Large icon (3rem) with `text-muted`
- Clear heading (`h5`)
- Descriptive paragraph (`text-muted`)
- Prominent CTA button (`btn-primary`)
- Vertical padding (`py-5`)
- Centered content (`text-center`)

**Variations**:
- No action: Remove button
- Custom icon: Use different FontAwesome icon
- Different context: Update text appropriately

**Reference**: Empty State design pattern
