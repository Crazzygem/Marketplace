# Backend/app/Models/

## Responsibility
Eloquent ORM Models - Define database table structure, relationships, casts, and business logic methods. Uses `HasApiTokens` and `HasFactory` traits per project standards.

## Design Patterns
- **Active Record Pattern**: Eloquent models with direct database access
- **Observer Pattern**: `Listing` model uses `#[ObservedBy([ListingObserver::class])` attribute for event-driven logic
- **Relationship Methods**: `belongsTo()`, `hasOne()`, `hasMany()` for defining foreign key relationships
- **Scope Methods**: Query scopes like `scopeSold()`, `scopeAvailable()` for reusable query constraints
- **Boolean Flags**: Role-based access via `is_admin`, `is_shop_owner`, `is_staff`, `is_customer` boolean columns

## Key Models

### User
- **Primary Key**: `id` (default)
- **Fillable**: `name`, `email`, `password`, `is_customer`, `is_staff`, `is_shop_owner`, `is_admin`, `is_banned`, `is_verified`
- **Casts**: All boolean flags cast to `boolean`
- **Role Methods**: `hasRole($role)`, `hasAnyRole($roles)`, `hasAllRoles($roles)` - checks `is_{role}` columns
- **Relationships**:
  - `ownShop()`: `hasOne(Shop::class, 'owner_id')` - User owns one shop
  - `shopMemberships()`: `hasMany(ShopMember::class, 'user_id')` - User can be staff in multiple shops

### Listing
- **Primary Key**: `listing_id` (custom)
- **Fillable**: `shop_id`, `category_id`, `title`, `description`, `price`, `stock_quantity`, `image_urls`, `status`, `view_count`, `sales_count`, `is_sold`, `sold_at`
- **Casts**: `image_urls` → `array` (JSON in DB), `price` → `decimal:2`, `is_sold` → `boolean`, `sold_at` → `datetime`
- **Relationships**:
  - `shop()`: `belongsTo(Shop::class, 'shop_id')`
  - `category()`: `belongsTo(Category::class, 'category_id')`
  - `reviews()`: `hasMany(Review::class, 'listing_id')`
- **Scopes**: `scopeSold()` (where `is_sold` = true), `scopeAvailable()` (where `is_sold` = false)
- **Methods**: `markAsSold()`, `restock()`, `incrementSales()`

### Shop
- **Primary Key**: `shop_id` (custom)
- **Relationships**:
  - `owner()`: `belongsTo(User::class, 'owner_id')`
  - `members()`: `hasMany(ShopMember::class, 'shop_id')`
  - `listings()`: `hasMany(Listing::class, 'shop_id')`

### Category
- **Primary Key**: `category_id` (custom)
- **Relationships**: `listings()` → `hasMany(Listing::class)`

### Order, Review, ChatRoom, ChatMessage, ShopMember, AuditLog, SavedItem
- Standard Eloquent models with appropriate relationships and casts

## Data Flow
1. Controller calls Model static methods (`Listing::with('shop')->findOrFail($id)`)
2. Model returns Eloquent collection/object with eager-loaded relationships
3. Models can have business logic methods (`markAsSold()`, `incrementSales()`)
4. Observer classes can hook into model events (creating, updating, deleting)

## Integration Points
- **Consumed by**: `App\Http\Controllers\*` controllers
- **Depends on**: Laravel Eloquent, Database migrations (`database/migrations/`)
- **Factories**: `database/factories/` for test data generation
- **Observers**: `App\Observers\ListingObserver` for event handling
