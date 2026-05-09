# Backend/app/Http/Controllers/

## Responsibility
API Controller Layer - Handles HTTP requests, authentication, authorization, and response formatting for all RESTful endpoints. Uses Laravel's resource controller patterns and custom action methods.

## Design Patterns
- **MVC Controller Pattern**: Each controller extends base `Controller` class, handling specific resource types
- **Middleware Chaining**: Routes protected by `auth:sanctum` and custom middleware (`AdminMiddleware`)
- **Form Request Validation**: Uses `$request->validate()` and `Validator::make()` for input validation
- **Eager Loading**: Uses `with(['shop', 'category'])` to prevent N+1 queries
- **Manual Multipart Parsing**: `ListingController` manually parses multipart/form-data for PUT requests (workaround for Laravel limitation)

## Key Controllers

### AuthController
- **Responsibility**: User registration, login, logout
- **Throttle**: 5 attempts per minute for register/login
- **Returns**: `AuthResponse` with user object and Sanctum token

### ListingController
- **Responsibility**: CRUD operations for marketplace listings with image handling
- **Key Methods**:
  - `index()`: Paginated listing retrieval with filters (category, shop, search, status, sold status)
  - `store()`: Creates listing with image upload to 'listings' disk, XSS sanitization (`strip_tags`)
  - `update()`: Handles multipart PUT requests, image replacement logic
  - `markAsSold()`/`restock()`: Manual status changes
- **Authorization**: Checks shop ownership or membership via `ShopMember` relationship

### AdminController
- **Responsibility**: Administrative operations (dashboard stats, user management, shop verification, moderation)
- **Middleware**: `auth:sanctum` + `admin` middleware
- **Key Methods**: `dashboardStats()`, `getUsers()`, `createUser()`, `updateUserRole()`, `banUser()`/`unbanUser()`, `verifyShop()`, `getReports()`/`resolveReport()`

### ShopController
- **Responsibility**: Shop creation and management
- **Key Methods**: `store()` (create shop), `stats()` (dashboard charts), `update()` (shop details)

### OrderController, ReviewsController, SavedItemController, ChatController, ShopMemberController
- **Responsibility**: Resource-specific CRUD operations with appropriate authorization checks

### LoggerController
- **Responsibility**: Client-side error logging endpoint (public access, no auth required)

## Data Flow
1. HTTP Request → Route (`routes/api.php`) → Middleware (`auth:sanctum`, `admin`) → Controller method
2. Controller validates input, checks authorization (shop ownership/membership, admin role)
3. Interacts with Eloquent models (`Listing::with('shop', 'category')->findOrFail($id)`)
4. Returns JSON response via `response()->json()`

## Integration Points
- **Consumed by**: Frontend Angular SPA via HTTP requests
- **Depends on**: Eloquent models (`Listing`, `Shop`, `User`, etc.), Laravel Sanctum, Storage facade
- **Middleware**: `App\Http\Middleware\AdminMiddleware`, `FlexibleAuthMiddleware`
- **Storage**: Uses `Storage::disk('listings')` for image uploads
