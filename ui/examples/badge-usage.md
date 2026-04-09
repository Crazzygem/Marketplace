# Example: Badge Component Usage

**Component**: `<app-badge>`

**Basic Usage**:
```html
<app-badge variant="success" [text]="'Active'"></app-badge>
```

**With Dot Indicator**:
```html
<app-badge variant="destructive" [text]="'Sold'" [dot]="true"></app-badge>
```

**Inputs**:
- `text` (string, required) - Badge text content
- `variant` (string, default: 'default') - 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'
- `dot` (boolean, optional) - Show small dot indicator

**Variant Meanings**:
- `default` - Primary badge, neutral/positive
- `secondary` - Muted/secondary status
- `success` - Positive state (Active, Verified, Available)
- `warning` - Cautionary state (Draft, Pending)
- `destructive` - Negative state (Sold, Banned, Deleted)
- `info` - Informational state (Admin, New)

**Status Mapping**:
```typescript
getStatusVariant(status: string, isSold?: boolean): string {
  if (isSold) return 'destructive';
  if (status === 'Active' || status === 'Verified') return 'success';
  if (status === 'Pending' || status === 'Draft') return 'warning';
  return 'default';
}
```

**Reference**: Badge component source code
