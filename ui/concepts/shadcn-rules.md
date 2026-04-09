# Concept: shadcn Critical Rules

**Core Concept**: Design principles for consistent, maintainable UI.

**1. Use Semantic Colors, Not Raw Colors**
❌ `<div class="bg-primary text-white"><span class="text-gray-600">`
✅ `<div class="card" style="background: var(--primary); color: var(--foreground);">`

**2. No Manual Dark Mode Overrides**
❌ `<div class="bg-white dark:bg-gray-950">Content</div>`
✅ `<div class="card">Content</div>` (CSS variables handle dark mode)

**3. Button Variants Instead of Custom Classes**
❌ `<button class="btn border border-input bg-transparent">`
✅ `<button class="btn btn-outline-primary">`

**4. Gap Instead of Space Classes**
❌ `<div class="mb-4"><input class="mb-2"><input class="mb-2"></div>`
✅ `<div class="d-flex flex-column gap-3"><input><input></div>`

**5. Size Property for Equal Dimensions**
❌ `<div style="width: 120px; height: 120px;">`
✅ `<div style="aspect-ratio: 1/1; width: 120px;">`

**6. Badge Variants for Status Indicators**
❌ `<span class="badge bg-success">` or `<span class="badge text-emerald-600">`
✅ `<span class="badge text-bg-success">` (semantic variant)

**Reference**: shadcn principles: https://ui.shadcn.com/docs/principles
