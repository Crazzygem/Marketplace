# Task Context: UI Consistency & Functionality Fix

Session ID: 2026-04-02-ui-consistency
Created: 2026-04-02
Status: in_progress

## Current Request

User wants to ensure:
1. All functions work correctly (CRUD operations, upload, delete, update)
2. UI is consistent across all pages
3. Theme is consistent (shadcn-style design tokens)
4. Skip password improvements for now

## Focus Areas

### 1. Functionality Fixes
- Fix N+1 query problems
- Add rate limiting to prevent abuse
- Fix stored XSS vulnerability
- Ensure all CRUD operations work
- Test upload/delete/update functionality

### 2. UI Consistency
- Check all pages use consistent components
- Ensure button variants are consistent
- Validate form patterns are the same
- Check table patterns are consistent
- Verify alert patterns are unified

### 3. Theme Consistency
- Ensure all pages use design tokens
- Validate color usage is semantic
- Check spacing is consistent
- Verify typography is uniform

## Context Files (Standards to Follow)
- /home/cheypiseth/.config/opencode/context/core/context-system/standards/mvi.md
- /home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/ui/concepts/design-tokens.md
- /home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/ui/concepts/shadcn-rules.md
- /home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/ui/examples/card-pattern.md
- /home/cheypiseth/School/2.Setec_Semester/6.Six_Semester/SA/marketplace/ui/examples/table-pattern.md

## Reference Files (Source Material to Look At)
- Backend/app/Http/Controllers/ListingController.php
- Backend/app/Http/Controllers/AuthController.php
- Frontend/src/app/modules/admin/admin-dashboard/
- Frontend/src/app/modules/shop/settings/shop-settings.component.ts
- Frontend/src/app/shared/components/
- Frontend/src/styles/tokens.css

## Exit Criteria

- [ ] N+1 query issues fixed
- [ ] Rate limiting added to auth endpoints
- [ ] XSS vulnerability fixed (input sanitization)
- [ ] All CRUD operations tested and working
- [ ] UI components are consistent across all pages
- [ ] Design tokens used consistently
- [ ] Theme is unified (colors, spacing, typography)
- [ ] No debug logging in production code
- [ ] All files follow MVI principles
