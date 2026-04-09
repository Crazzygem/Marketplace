# Lookup: Design Tokens Reference

**Bootstrap Classes → shadcn Tokens**:

| Bootstrap Class | shadcn Token | Color |
|----------------|--------------|-------|
| `.bg-primary` | `var(--primary)` | #0f172a |
| `.bg-success` | `var(--success)` | #22c55e |
| `.bg-danger` | `var(--destructive)` | #ef4444 |
| `.bg-warning` | `var(--warning)` | #f59e0b |
| `.bg-info` | `var(--info)` | #3b82f6 |
| `.text-primary` | `var(--primary)` | #0f172a |
| `.text-success` | `var(--success)` | #22c55e |
| `.text-danger` | `var(--destructive)` | #ef4444 |
| `.text-warning` | `var(--warning)` | #f59e0b |
| `.text-info` | `var(--info)` | #3b82f6 |

**Special Utility Classes**:
- `.border-left-primary` - Left border with primary color
- `.border-left-success` - Left border with success color
- `.border-left-warning` - Left border with warning color
- `.border-left-info` - Left border with info color
- `.text-gray-300` - Gray text (#d1d5db)
- `.text-gray-400` - Gray text (#9ca3af)
- `.text-gray-800` - Gray text (#1f2937)

**Use in Custom Styles**:
```css
.custom-button {
  background: var(--primary);
  color: var(--primary-foreground);
}

.custom-card {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--card-foreground);
}
```

**Reference**: See `tokens.css` for complete token definitions
