# Backend/app/Http/Middleware/

## Responsibility
HTTP Middleware Layer - Handles authentication, authorization, and request filtering. Protects routes based on authentication status and user roles.

## Design Patterns
- **Middleware Pattern**: Laravel middleware implementing `handle()` method for request filtering
- **Guard Pattern**: `AdminMiddleware` checks user roles before allowing access
- **Flexible Authentication**: `FlexibleAuthMiddleware` allows optional authentication (public endpoints with user context if available)

## Key Middleware

### AdminMiddleware
- **Purpose**: Restricts access to admin-only routes
- **Logic**: 
  1. Checks if user is authenticated via `auth('sanctum')`
  2. Verifies user has `is_admin` flag set to true
  3. Returns 403 if not admin
- **Usage**: Applied to all `/admin/*` routes via route group

### FlexibleAuthMiddleware
- **Purpose**: Optional authentication for public endpoints that can benefit from user context
- **Logic**:
  1. Attempts to authenticate via `auth('sanctum')`
  2. If authenticated, sets user via `Auth::setUser()`
  3. If not authenticated, continues without user context
- **Usage**: Applied to public listing/category endpoints that show different data for authenticated users

### BasicAuthMiddleware
- **Purpose**: Simple authentication check (fallback/legacy)
- **Logic**: Validates Bearer token and sets user context

## Data Flow
1. HTTP Request → Middleware `handle()` method
2. Middleware performs checks (authentication, role verification)
3. If check fails → Returns JSON error response (401 Unauthorized or 403 Forbidden)
4. If check passes → Calls `$next($request)` to continue to controller

## Integration Points
- **Applied via**: Route definitions in `Backend/routes/api.php`
- **Depends on**: Laravel Sanctum (`auth('sanctum')`), User model (`is_admin` flag)
- **Consumed by**: All protected API routes
