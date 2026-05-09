# Repository Atlas: Marketplace (Laravel 12 + Angular 20)

## Project Responsibility
Full-stack marketplace application with RESTful API backend (Laravel 12) and TypeScript SPA frontend (Angular 20). Supports multi-role users (customers, shop owners, staff, admins) with features for product listings, shop management, reviews, chat, and administrative moderation.

## System Entry Points
- **Backend**: `Backend/routes/api.php` - API route definitions with Sanctum authentication
- **Frontend**: `Frontend/src/app/app.ts` - Angular application bootstrap with standalone components
- **Frontend Config**: `Frontend/src/environments/environment.ts` - API URL configuration (`http://127.0.0.1:8000/api`)

## Architecture Overview

### Backend (Laravel 12 RESTful API)
- **Authentication**: Laravel Sanctum Bearer tokens with role-based access (`is_admin`, `is_shop_owner`, `is_staff`, `is_customer`)
- **Middleware**: `auth:sanctum` for protected routes, custom `AdminMiddleware` for admin routes
- **Models**: Eloquent ORM with `HasApiTokens`, `HasFactory` traits; boolean role flags
- **Controllers**: Resource controllers for Listings, Orders, Reviews, ShopMembers; custom controllers for Auth, Admin, Chat, SavedItems
- **Image Storage**: Uses Laravel's storage system with 'listings' disk

### Frontend (Angular 20 TypeScript SPA)
- **State Management**: Angular signals (`signal<T>()`, `computed<T>()`) for reactive state
- **HTTP Communication**: `HttpClient` with custom `authInterceptor` for JWT token injection
- **Dependency Injection**: Uses `inject()` function for service injection (Angular 20 pattern)
- **Module Structure**: Feature modules in `modules/` (auth, public, shop, admin, user-profile)

## Directory Map (Aggregated)

| Directory | Responsibility Summary | Detailed Map |
|-----------|------------------------|--------------|
| `Backend/app/Http/Controllers/` | API controllers handling HTTP requests/responses | [View Map](Backend/app/Http/Controllers/codemap.md) |
| `Backend/app/Models/` | Eloquent models defining database relationships and business logic | [View Map](Backend/app/Models/codemap.md) |
| `Backend/app/Http/Middleware/` | Authentication and authorization middleware | [View Map](Backend/app/Http/Middleware/codemap.md) |
| `Backend/app/Observers/` | Model observers for event-driven logic | [View Map](Backend/app/Observers/codemap.md) |
| `Backend/routes/` | API route definitions | [View Map](Backend/routes/codemap.md) |
| `Backend/config/` | Laravel configuration files | [View Map](Backend/config/codemap.md) |
| `Frontend/src/app/core/` | Core services, models, guards, interceptors | [View Map](Frontend/src/app/core/codemap.md) |
| `Frontend/src/app/modules/` | Feature modules (auth, public, shop, admin) | [View Map](Frontend/src/app/modules/codemap.md) |
| `Frontend/src/app/shared/` | Shared components, directives, pipes | [View Map](Frontend/src/app/shared/codemap.md) |
| `Frontend/src/environments/` | Environment-specific configuration | [View Map](Frontend/src/environments/codemap.md) |

## Key Design Patterns
- **Repository Pattern**: Not explicitly used; controllers directly use Eloquent models
- **Service Layer**: Frontend uses service classes (AuthService, ListingService, etc.) for API communication
- **Observer Pattern**: Backend uses Laravel Observers (`ListingObserver`) for model events
- **Middleware Chain**: Request filtering through Sanctum auth and custom middleware
- **Signals Pattern**: Frontend state management using Angular's signal() primitive
- **Role-Based Access Control**: Boolean flags (`is_admin`, `is_shop_owner`, etc.) with middleware protection

## Data Flow
1. **Authentication Flow**: Frontend `AuthService.login()` → POST `/api/login` → Backend `AuthController` → Sanctum token → Stored in localStorage → `authInterceptor` adds Bearer token to subsequent requests
2. **Listing Management**: Frontend `ListingService` → HTTP requests → Backend `ListingController` → `Listing` model → Database; Images stored via Laravel storage
3. **Shop Membership**: Users can own shops (`ownShop`) or be members (`shopMemberships`) → Authorized actions based on ownership/membership

## Integration Points
- **Backend ↔ Frontend**: RESTful API at `http://127.0.0.1:8000/api`
- **Backend ↔ Database**: MySQL with `marketplace` (dev) and `marketplace_test` (testing) databases
- **Frontend ↔ Storage**: Images uploaded to backend, served via Laravel storage URLs
- **Admin Routes**: Protected by `auth:sanctum` + `admin` middleware chain

## Testing Strategy
- **Backend**: PHPUnit with `RefreshDatabase` trait; uses MySQL test database
- **Frontend**: Karma/Jasmine with `HttpClientTestingModule`
- **Factories**: `User::factory()->create()` for test data generation
