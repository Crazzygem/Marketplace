# Example: Alert Pattern

**Purpose**: Display success, error, info, or warning messages.

**Success Alert**:
```html
<div class="alert alert-success" role="alert">
  <i class="fas fa-check-circle me-2"></i>
  Changes saved successfully.
</div>
```

**Error Alert**:
```html
<div class="alert alert-danger" role="alert">
  <i class="fas fa-exclamation-circle me-2"></i>
  Something went wrong. Please try again.
</div>
```

**Info Alert**:
```html
<div class="alert alert-info" role="alert">
  <i class="fas fa-info-circle me-2"></i>
  New feature available: Check out the dashboard.
</div>
```

**Warning Alert**:
```html
<div class="alert alert-warning" role="alert">
  <i class="fas fa-exclamation-triangle me-2"></i>
  Your session will expire in 5 minutes.
</div>
```

**Key Points**:
- Use semantic variants: `success`, `danger`, `info`, `warning`
- Icons with `me-2` for spacing
- `role="alert"` for accessibility
- Colors auto-map to shadcn tokens

**Reference**: Bootstrap Alerts
