# Task Context: Consolidate Shop Products into Settings

Session ID: 2026-04-03-consolidate-shop-products
Created: 2026-04-03
Status: in_progress

## Current Request

Remove `/shop/products` route and consolidate ALL product management into `/shop/settings?tab=listings` while preserving the full feature set from ProductList. The user wants:
- Complete removal of `/shop/products` route
- All product management functionality moved to Settings → Listings tab
- Keep `/shop/products/add` and `/shop/products/edit/:id` routes for forms
- All CRUD operations should return to Settings → Listings tab
- Full feature parity with current ProductList page

## Context Files (Standards to Follow)

### Critical Priority
- `/home/cheypiseth/.config/opencode/context/core/standards/code-quality.md`
  - Modular, functional, maintainable code
  - Pure functions, immutability, composition
  - Small functions (< 50 lines)
  - Explicit dependencies (dependency injection)
  - Anti-patterns: mutation, side effects, deep nesting, god modules

### High Priority
- `/home/cheypiseth/.config/opencode/context/core/standards/security-patterns.md`
  - Error handling, validation, logging
- `/home/cheypiseth/.config/opencode/context/development/principles/clean-code.md`
  - Meaningful names, single responsibility, small functions
- `/home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/AGENTS.md`
  - Angular 20 + Laravel 12 project standards
  - TypeScript strict mode (no `any` types)
  - Bootstrap 5.3.8 + FontAwesome 7.1.0 for UI
  - Signals for reactive state
  - `@Injectable({ providedIn: 'root' })` for services
  - Standalone components with `standalone: true`
  - Explicit return types, implement lifecycle interfaces

### UI Standards
- `/home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/.tmp/archive/harvested/2026-04-02/UI_RULES.md`
  - shadcn-style design principles adapted for Angular
  - Bootstrap overrides with semantic CSS variables
  - Design tokens: --primary, --success, --warning, --destructive, --muted, etc.
  - Shared components: app-badge, app-alert, app-skeleton, app-tabs
  - Card, Table, Alert, Empty State, Loading patterns
  - Icon guidelines: FontAwesome with semantic sizing

## Reference Files (Source Material to Look At)

### Frontend - Shop Module
- `Frontend/src/app/modules/shop/shop-routing-module.ts` - Routing configuration (NEEDS MODIFICATION)
- `Frontend/src/app/modules/shop/product-management/product-management.component.ts` - Add/edit forms (NEEDS MODIFICATION)
- `Frontend/src/app/modules/shop/product-management/product-management.component.html` - Form template (NEEDS MODIFICATION)
- `Frontend/src/app/modules/shop/settings/shop-settings.component.ts` - Settings page (NEEDS ENHANCEMENT)
- `Frontend/src/app/modules/shop/settings/shop-settings.component.html` - Settings template (NEEDS ENHANCEMENT)
- `Frontend/src/app/modules/shop/settings/shop-settings.component.css` - Settings styles (NEEDS ENHANCEMENT)
- `Frontend/src/app/modules/shop/product-list/product-list.ts` - Current product list (TO BE ARCHIVED)
- `Frontend/src/app/modules/shop/product-list/product-list.html` - Current product list template (TO BE ARCHIVED)

### Frontend - Shared Components
- `Frontend/src/app/shared/components/badge/badge.component.ts` - Status badges
- `Frontend/src/app/shared/components/alert/alert.component.ts` - Alert messages
- `Frontend/src/app/shared/components/skeleton/skeleton.component.ts` - Loading states
- `Frontend/src/app/shared/components/tabs/tabs.component.ts` - Tab navigation
- `Frontend/src/app/shared/utils/image.utils.ts` - Image URL helper

### Frontend - Services
- `Frontend/src/app/core/services/listing.ts` - Listing API service
- `Frontend/src/app/core/services/logger.service.ts` - Error logging
- `Frontend/src/app/core/services/notification.service.ts` - User notifications

## External Docs Fetched

None required - using project standards and existing code patterns.

## Implementation Plan Summary

### Phase 1: Preparation (30 min)
- Update `shop-routing-module.ts`: Remove `/shop/products` route, add redirect
- Update `product-management.component.ts`: Fix all navigation to return to Settings
- Update `product-management.component.html`: Fix back button navigation

### Phase 2: Build Enhanced Listings Tab (2-3 hours)
- Enhance `shop-settings.component.ts`: Add all ProductList features and methods
- Replace Listings tab HTML with full table (images, badges, actions, bulk delete)
- Add CSS for table, empty state, and button styles

### Phase 3: Fix Navigation References (15 min)
- Search for any remaining `/shop/products` references
- Update all navigation links

### Phase 4: Remove Old Routes (30 min)
- Archive `product-list/` directory to `.tmp/archive/removed-components/YYYY-MM-DD/`
- Finalize routing changes
- Clean up imports

### Phase 5: Testing and Polish (2-3 hours)
- Test all CRUD operations
- Test navigation flows
- Verify UI consistency
- Performance check

## Features to Preserve from ProductList

**Table Columns:**
- Checkbox (bulk selection)
- Image thumbnail (50x50px)
- Title with SOLD badge overlay
- Description (truncated to 50 chars)
- Price (formatted)
- Stock quantity
- Status badge (color-coded: green, yellow, red, dark)
- Shop name
- Actions: Edit, Mark as Sold, Restock, Delete
- Sales count

**Functionality:**
- Bulk selection and delete
- Mark as Sold / Restock actions
- Auto-refresh after CRUD operations (using localStorage flag)
- Empty state with "Add Your First Listing" button
- Loading state with skeleton
- Error state with alert
- Navigation to Add/Edit pages

**Navigation:**
- All CRUD operations return to `/shop/settings?tab=listings`
- Add button goes to `/shop/products/add`
- Edit button goes to `/shop/products/edit/:id`
- Back/Cancel buttons return to Settings

## Constraints

### Technical Constraints
- Angular 20 with standalone components
- TypeScript strict mode (no `any` types)
- Bootstrap 5.3.8 + FontAwesome 7.1.0
- No new services needed (use existing ListingService)
- No new components needed (keep it simple in ShopSettings)

### Code Quality Constraints
- Functions < 50 lines where possible
- Pure functions for data transformations
- Explicit return types
- Implement lifecycle interfaces (OnInit, etc.)
- Use dependency injection
- Handle errors gracefully with try-catch
- Provide user-friendly error messages

### UI Constraints
- Use shadcn-style design tokens
- Use shared components (badge, alert, skeleton, tabs)
- Match existing Settings UI pattern (Shop tab, Staff tab)
- Responsive design (mobile-first)
- Accessibility: ARIA attributes, keyboard navigation, screen reader support

## Exit Criteria

- [ ] Route `/shop/products` redirects to `/shop/settings?tab=listings`
- [ ] Routes `/shop/products/add` and `/shop/products/edit/:id` still work
- [ ] Listings tab in Settings shows all ProductList features
- [ ] All CRUD operations (Add, Edit, Delete, Mark Sold, Restock) work
- [ ] Navigation after CRUD returns to Settings → Listings tab
- [ ] Auto-refresh works after CRUD operations
- [ ] Bulk selection and delete works
- [ ] Image thumbnails display correctly
- [ ] Status badges use correct colors
- [ ] SOLD badge displays when applicable
- [ ] Sales count displays
- [ ] Empty state displays when no listings
- [ ] Loading state displays while fetching
- [ ] Error state displays on API failure
- [ ] ProductList component archived
- [ ] Build successful: `ng build --configuration production`
- [ ] No TypeScript errors
- [ ] Prettier formatted: `npx prettier --write "src/**/*.{ts,html,css}"`
- [ ] All test scenarios pass
