# Example: Form Pattern (Field-based)

**Purpose**: Consistent form layout with validation.

**Pattern**:
```html
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email Address</label>
    <input
      type="email"
      class="form-control"
      id="email"
      placeholder="email@example.com"
      aria-describedby="emailHelp"
      [class.is-invalid]="emailInvalid"
    >
    <div id="emailHelp" class="form-text">We'll never share your email.</div>
    <div class="invalid-feedback" *ngIf="emailInvalid">
      Please enter a valid email address.
    </div>
  </div>
</form>
```

**Key Points**:
- `form-label` for accessible labels
- `form-control` for inputs
- `form-text` for help text
- `is-invalid` class for error states
- `invalid-feedback` for error messages
- Use `aria-describedby` for accessibility

**Validation States**:
- Valid: `is-valid` class + `valid-feedback`
- Invalid: `is-invalid` class + `invalid-feedback`
- Disabled: Add `disabled` attribute

**Reference**: Bootstrap Forms, Angular Forms
