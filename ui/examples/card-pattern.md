# Example: Card Pattern (shadcn-style)

**Purpose**: Consistent card layout with semantic colors.

**Pattern**:
```html
<div class="card shadow-sm">
  <div class="card-header">
    <h5 class="card-title">Team Members</h5>
    <p class="card-text text-muted small">Manage your team.</p>
  </div>
  <div class="card-body">
    <!-- Main content -->
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Invite</button>
  </div>
</div>
```

**Key Points**:
- Uses `card`, `card-header`, `card-body`, `card-footer`
- `shadow-sm` for subtle elevation
- `text-muted` for secondary text
- Semantic button variants (`btn-primary`)
- Colors auto-map to shadcn tokens

**Variations**:
- Add `h-100` for equal height cards
- Add `border-left-{color}` for left accent border
- Use `border-0` for borderless cards

**Reference**: Bootstrap Card docs, shadcn Card component
