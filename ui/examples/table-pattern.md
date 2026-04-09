# Example: Table Pattern

**Purpose**: Consistent data table with hover and status badges.

**Pattern**:
```html
<div class="table-responsive">
  <table class="table table-hover mb-0">
    <thead class="table-dark">
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td>{{ item.name }}</td>
        <td>
          <span class="badge" [ngClass]="getStatusClass(item.status)">
            {{ item.status }}
          </span>
        </td>
        <td>{{ item.date | date }}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary">Edit</button>
          <button class="btn btn-sm btn-outline-danger">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Component Logic**:
```typescript
getStatusClass(status: string): string {
  switch (status) {
    case 'Active': return 'text-bg-success';
    case 'Pending': return 'text-bg-warning';
    case 'Sold': return 'text-bg-danger';
    default: return 'text-bg-secondary';
  }
}
```

**Key Points**:
- `table-responsive` for mobile scrolling
- `table-hover` for row hover effect
- `table-dark` header for contrast
- Status badges with semantic colors
- Action buttons with outline variants
- `mb-0` to remove bottom margin

**Reference**: Bootstrap Tables
