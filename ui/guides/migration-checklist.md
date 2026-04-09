# Guide: UI Migration Checklist

**Purpose**: Track progress of UI migration to shadcn-style components.

**Phase 1: Design Tokens** ✅ COMPLETE
- [x] Add CSS variables (tokens.css)
- [x] Add Bootstrap utility class overrides to tokens.css
- [x] Add border-left utility classes for stat cards
- [x] Add gray text utilities (text-gray-300, text-gray-400, text-gray-800)

**Phase 2: Global CSS** ✅ COMPLETE
- [x] Update app.css with design tokens
- [x] Replace hardcoded colors with CSS variables

**Phase 3: Component CSS Migration** ✅ COMPLETE
- [x] Update card components to use semantic colors
- [x] Standardize button variants
- [x] Create reusable badge status utility
- [x] Add consistent form validation styling
- [x] Update empty state patterns
- [x] Add loading state utilities
- [x] Implement semantic color classes
- [x] Add focus ring styles for inputs
- [x] Standardize table padding and hover

**Phase 4: Module-Specific Updates** ✅ COMPLETE
- [x] Admin Dashboard CSS migration
- [x] User Profile CSS migration
- [x] Settings CSS migration
- [x] Public pages CSS migration (home, checkout, product-detail)
- [x] Shop module CSS migration (dashboard, product-management, create, product-list)
- [x] Shared components CSS migration (listing-card)

**Phase 5: Build Verification** ✅ COMPLETE
- [x] Build successful with no CSS errors
- [x] All design tokens properly defined

**Reference**: See `UI_RULES.md` for detailed guidelines
