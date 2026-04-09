# Example: Loading with Skeleton Pattern

**Purpose**: Show skeleton placeholders during async operations.

**Component Setup**:
```typescript
isLoading = signal(false);
data = signal<any[]>([]);

loadData() {
  this.isLoading.set(true);
  this.service.getData().subscribe({
    next: (data) => {
      this.data.set(data);
      this.isLoading.set(false);
    },
    error: (error) => {
      this.error = error;
      this.isLoading.set(false);
    }
  });
}
```

**Template Usage**:
```html
<!-- Loading state -->
<ng-container *ngIf="isLoading()">
  <app-skeleton [height]="'60px'" [width]="'100%'"></app-skeleton>
  <div class="d-flex gap-2 mb-3">
    <app-skeleton [height]="'40px'" [width]="'40%'"></app-skeleton>
    <app-skeleton [height]="'40px'" [width]="'40%'"></app-skeleton>
  </div>
  <app-skeleton [height]="'300px'" [width]="'100%'"></app-skeleton>
</ng-container>

<!-- Data loaded -->
<div *ngIf="!isLoading()">
  <h1>{{ data()?.title }}</h1>
  <p>{{ data()?.description }}</p>
  <!-- Actual content -->
</div>
```

**Table Loading**:
```html
<table class="table">
  <thead *ngIf="!isLoading()">
    <tr>
      <th>Name</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngIf="isLoading()">
      <td colspan="2">
        <app-skeleton [height]="'40px'" [width]="'100%'"></app-skeleton>
      </td>
    </tr>
    <tr *ngFor="let item of data()" *ngIf="!isLoading()">
      <td>{{ item.name }}</td>
      <td>{{ item.status }}</td>
    </tr>
  </tbody>
</table>
```

**Key Points**:
- Use signals for reactive loading state
- Match skeleton dimensions to actual content
- Use multiple skeletons for complex layouts
- Handle both loading and error states

**Reference**: Skeleton component documentation
