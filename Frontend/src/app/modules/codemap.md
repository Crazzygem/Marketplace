# Frontend/src/app/modules/

## Responsibility
Feature Modules - Organizes the application into domain-specific modules following Angular's feature module pattern. Each module contains components, services, and routing specific to a feature area.

## Design Patterns
- **Feature Module Pattern**: Each directory represents a specific feature domain (auth, public, shop, admin, user-profile)
- **Standalone Components**: Uses Angular 20 standalone components (no NgModule)
- **Lazy Loading**: Modules loaded on-demand via `app.routes.ts` configuration
- **Component Composition**: Smart/container components interact with services; presentational components receive data via inputs

## Module Structure

### auth/ (Authentication Module)
- **Components**: `login/`, `register/`
- **Services**: Uses `AuthService` from core
- **Responsibility**: User login, registration with role selection
- **Routes**: `/auth/login`, `/auth/register`

### public/ (Public-Facing Module)
- **Components**: `home/`, `product-detail/`, `categories/`, `checkout/`, `saved-items/`
- **Services**: `ListingService`, `CategoryService`, `SavedItemsService`, `OrderService`
- **Responsibility**: Public browsing, product viewing, category navigation, checkout process
- **Routes**: `/`, `/product/:id`, `/categories`, `/checkout`, `/saved-items`

### shop/ (Shop Management Module)
- **Components**: `create/`, `product-management/`, `dashboard/`, `members/`
- **Services**: `ShopService`, `ListingService`
- **Responsibility**: Shop creation, product CRUD, shop dashboard with stats, staff management
- **Guards**: `RoleGuard` with `isShopOwner` or `isStaff` check
- **Routes**: `/shop/create`, `/shop/dashboard`, `/shop/products`, `/shop/members`

### admin/ (Admin Module)
- **Components**: `admin-dashboard/`, `user-management/`, `moderation/`, `settings/`, `staff-management/`
- **Services**: `AdminService`
- **Responsibility**: Admin dashboard with charts, user management (ban/unban, role changes), content moderation, system settings
- **Guards**: `RoleGuard` with `isAdmin` check
- **Routes**: `/admin/dashboard`, `/admin/users`, `/admin/moderation`, `/admin/settings`

### user-profile/ (User Profile Module)
- **Components**: `profile/`, `my-orders/`, `my-listings/`
- **Services**: `AuthService`, `OrderService`, `ListingService`
- **Responsibility**: User profile management, order history, personal listings management
- **Guards**: `AuthGuard` (must be authenticated)
- **Routes**: `/profile`, `/my-orders`, `/my-listings`

## Data Flow
1. User navigates to route → Guard checks authentication/authorization
2. Component initializes → Calls service method (e.g., `listingService.getListings()`)
3. Service makes HTTP request → Backend API returns JSON
4. Component subscribes to Observable → Updates template with data
5. User interacts → Component calls service method → HTTP request → Backend processes → Response

## Integration Points
- **Consumed by**: Angular router in `app.routes.ts`
- **Depends on**: Core services (`core/services/*`), shared components (`shared/`)
- **Backend API**: All modules communicate with Laravel backend via core services
- **Guards**: Use `AuthGuard` and `RoleGuard` from core (or standalone guards in each module)
