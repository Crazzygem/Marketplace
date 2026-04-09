# Example: Status Badge Mapping Pattern

**Purpose**: Map status strings to semantic badge variants.

**Pattern**:
```typescript
getStatusVariant(status: string, isSold?: boolean): 'success' | 'destructive' | 'warning' | 'default' {
  if (isSold) return 'destructive';
  if (status === 'Active' || status === 'Verified') return 'success';
  if (status === 'Pending' || status === 'Draft') return 'warning';
  return 'default';
}
```

**Usage in Template**:
```html
<span class="badge" [ngClass]="getBadgeClass(item.status, item.is_sold)">
  {{ item.is_sold ? 'Sold' : item.status }}
</span>
```

**Alternative Implementation**:
```typescript
getBadgeClass(status: string, isSold?: boolean): string {
  if (isSold) return 'text-bg-destructive';
  if (status === 'Active' || status === 'Verified') return 'text-bg-success';
  if (status === 'Pending' || status === 'Draft') return 'text-bg-warning';
  return 'text-bg-secondary';
}
```

**Status Mappings**:
| Status | Variant | Class |
|--------|---------|-------|
| Active | success | text-bg-success |
| Verified | success | text-bg-success |
| Pending | warning | text-bg-warning |
| Draft | warning | text-bg-warning |
| Sold | destructive | text-bg-destructive |
| Banned | destructive | text-bg-destructive |
| Deleted | destructive | text-bg-destructive |
| Other | default | text-bg-secondary |

**Key Points**:
- Always use semantic variants, not colors
- Handle special cases (isSold, isBanned) first
- Provide fallback for unknown statuses
- Use with `app-badge` component or Bootstrap badges

**Reference**: Badge component documentation
