# Concept: shadcn Design Tokens

**Core Concept**: Semantic CSS variables for consistent, themeable UI design.

**Token Categories**:
- **Base**: background, foreground
- **Muted**: muted, muted-foreground
- **Card**: card, card-foreground
- **Primary**: primary, primary-foreground
- **Secondary**: secondary, secondary-foreground
- **Accent**: accent, accent-foreground
- **Destructive**: destructive, destructive-foreground
- **Border**: border, input, ring
- **Semantic**: success, warning, error, info

**Quick Example**:
```css
:root {
  --primary: #0f172a;
  --primary-foreground: #fafafa;
  --success: #22c55e;
  --destructive: #ef4444;
}

/* Usage */
.button {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

**Key Points**:
- Enables easy theming (light/dark mode)
- Consistent color usage across components
- Bootstrap classes override to use tokens
- Located in `Frontend/src/styles/tokens.css`

**Reference**: shadcn/ui principles: https://ui.shadcn.com/docs/theming
