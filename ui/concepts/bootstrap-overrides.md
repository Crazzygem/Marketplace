# Concept: Bootstrap Override System

**Core Concept**: Bootstrap utility classes automatically use shadcn design tokens via CSS variable overrides.

**How It Works**: `tokens.css` overrides Bootstrap classes to use shadcn semantic variables instead of hardcoded colors.

**Text Colors**:
- `.text-primary` → `var(--primary)` (#0f172a)
- `.text-success` → `var(--success)` (#22c55e)
- `.text-danger` → `var(--destructive)` (#ef4444)
- `.text-warning` → `var(--warning)` (#f59e0b)
- `.text-info` → `var(--info)` (#3b82f6)
- `.text-white` → `#ffffff`
- `.text-gray-300` → `#d1d5db`
- `.text-gray-400` → `#9ca3af`
- `.text-gray-800` → `#1f2937`

**Background Colors**:
- `.bg-primary` → `var(--primary)` with `var(--primary-foreground)` text
- `.bg-success` → `var(--success)` with `var(--success-foreground)` text
- `.bg-danger` → `var(--destructive)` with `var(--destructive-foreground)` text
- `.bg-warning` → `var(--warning)` with `var(--warning-foreground)` text
- `.bg-info` → `var(--info)` with `var(--info-foreground)` text

**Key Points**:
- Continue using Bootstrap classes as normal
- Colors automatically use shadcn tokens
- Enables easy theming (light/dark mode)
- No migration needed for existing Bootstrap code
- Located in `Frontend/src/styles/tokens.css`

**Reference**: Bootstrap documentation, shadcn theming
