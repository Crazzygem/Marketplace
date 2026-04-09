# Example: Skeleton Component Usage

**Component**: `<app-skeleton>`

**Basic Usage**:
```html
<app-skeleton [height]="'40px'" [width]="'100%'"></app-skeleton>
```

**Multiple Skeletons**:
```html
<div class="d-flex gap-2">
  <app-skeleton [height]="'40px'" [width]="'40%'"></app-skeleton>
  <app-skeleton [height]="'40px'" [width]="'40%'"></app-skeleton>
</div>
```

**Inputs**:
- `height` (string, default: '20px') - CSS height value
- `width` (string, default: '100%') - CSS width value

**Loading Pattern**:
```typescript
isLoading = signal(false);

loadData() {
  this.isLoading.set(true);
  this.service.getData().subscribe({
    next: (data) => {
      this.data = data;
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
<div *ngIf="isLoading()">
  <app-skeleton [height]="'60px'" [width]="'100%'"></app-skeleton>
  <app-skeleton [height]="'300px'" [width]="'100%'></app-skeleton>
</div>

<div *ngIf="!isLoading()">
  <!-- Actual content -->
</div>
```

**Use Cases**:
- Loading data from API
- Image loading states
- Form submission states
- Initial page load

**Reference**: Skeleton component source code
