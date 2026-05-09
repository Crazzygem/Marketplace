# Frontend/src/app/core/

## Responsibility
Core Application Layer - Contains singleton services for API communication, TypeScript interfaces (models), authentication guards, HTTP interceptors, and shared utilities. Uses Angular 20 standalone patterns with `inject()` function.

## Design Patterns
- **Service Pattern**: Injectable services (`@Injectable({ providedIn: 'root' })`) for API communication and state management
- **Signal-Based State**: Uses `signal<T>()` and `computed<T>()` for reactive state (not RxJS Subjects)
- **Dependency Injection**: Uses `inject()` function instead of constructor injection (Angular 20 pattern)
- **Interceptor Chain**: `authInterceptor` adds Bearer token to outgoing requests
- **Guard Pattern**: `AuthGuard` and `RoleGuard` protect routes based on authentication state and user roles

## Key Services

### AuthService
- **Responsibility**: User authentication (login, register, logout), token management, user state
- **State Signals**: `currentUser = signal<User | null>(...)`, `token = signal<string | null>(...)`
- **Computed Values**: `isAuthenticated`, `isAdmin`, `isShopOwner`, `isStaff`, `isCustomer`
- **Storage**: Persists token and user in `localStorage`
- **Methods**: `login()`, `register()`, `logout()`, `getCurrentUser()`, `getUserFromStorage()`

### ListingService
- **Responsibility**: CRUD operations for marketplace listings
- **API Endpoints**: GET/POST/PUT/DELETE `/listings`, `/listings/{id}/mark-as-sold`, `/listings/{id}/restock`
- **Returns**: Observable with Listing interface

### Other Services
- **CategoryService**: Category management (index, show, store, update, destroy, togglePopular)
- **OrderService**: Order CRUD operations
- **ReviewService**: Review CRUD operations
- **ShopService**: Shop creation, stats, update
- **ChatService**: Chat room management and messaging
- **SavedItemsService**: Saved item toggle and listing
- **AdminService**: Admin operations (dashboard stats, user management, moderation)
- **LoggerService**: Client-side error logging to backend
- **NotificationService**: Toast/notification display

## Models (TypeScript Interfaces)

### Listing
```typescript
interface Listing {
  listing_id: number;
  shop_id: number;
  category_id?: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_urls?: string[];
  status: string;
  view_count: number;
  sales_count?: number;
  is_sold?: boolean;
  sold_at?: string;
  created_at: string;
  updated_at: string;
  shop?: { shop_name: string; owner_id: number; };
  category?: Category;
}
```

### User (defined in AuthService)
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  is_customer: boolean;
  is_staff: boolean;
  is_shop_owner: boolean;
  is_admin: boolean;
  ownShop?: { shop_id: number; shop_name: string; };
}
```

### Other Interfaces
- `Category`, `Order`, `Review`, `ChatRoom`, `ChatMessage`, `Shop`, `ShopMember`, `SavedItem`, `ApiResponse<T>`

## Interceptors

### authInterceptor
- **Purpose**: Automatically attaches Bearer token from `AuthService.token()` to outgoing HTTP requests
- **Implementation**: Uses `HttpInterceptorFn` (functional interceptor pattern for Angular 20)

## Guards

### AuthGuard
- **Purpose**: Prevents unauthenticated access to protected routes
- **Logic**: Checks `AuthService.isAuthenticated()` signal

### RoleGuard
- **Purpose**: Restricts routes based on user roles (admin, shop_owner, staff, customer)
- **Logic**: Checks appropriate role signal (`isAdmin()`, `isShopOwner()`, etc.)

## Data Flow
1. Component calls Service method (e.g., `listingService.getListings()`)
2. Service makes HTTP request with `HttpClient` (token auto-attached by interceptor)
3. Backend returns JSON response → Service returns `Observable<T>`
4. Component subscribes or uses `async` pipe to consume data

## Integration Points
- **Consumed by**: Feature modules in `modules/` (auth, public, shop, admin, user-profile)
- **Depends on**: `@angular/common/http`, `environments/environment.ts` (API URL)
- **Backend API**: `http://127.0.0.1:8000/api` (configured in environment)
- **Storage**: `localStorage` for token and user persistence
