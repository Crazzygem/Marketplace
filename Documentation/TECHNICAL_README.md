# Marketplace Platform - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Authentication & Authorization](#authentication--authorization)
9. [UI/UX Design System](#uiux-design-system)
10. [Development Workflow](#development-workflow)
11. [Testing Strategy](#testing-strategy)
12. [Deployment & Configuration](#deployment--configuration)
13. [Security Considerations](#security-considerations)
14. [Future Enhancements](#future-enhancements)

---

## Project Overview

This is a **full-stack multi-role e-commerce marketplace platform** that enables customers to browse and purchase products, shop owners to manage their stores and inventory, staff to assist with shop operations, and administrators to oversee platform governance.

### Key Features

- **Multi-Role System**: Customers, Shop Owners, Staff, and Administrators
- **Product Management**: Full CRUD with image uploads, stock tracking, and sales analytics
- **Order Processing**: Complete order lifecycle with status workflow
- **Real-time Messaging**: Buyer-seller chat system
- **Reviews & Ratings**: Product review system with star ratings
- **Wishlist Functionality**: Save items for later purchase
- **Shop Analytics**: Dashboard with charts for views, sales, and revenue
- **Admin Dashboard**: Platform-wide analytics, user management, and moderation
- **Content Moderation**: Report system for user-generated content
- **Audit Trail**: Complete logging of admin actions

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.3.0 | SPA Framework |
| TypeScript | 5.9.2 | Type-safe JavaScript |
| Bootstrap | 5.3.8 | UI Framework |
| FontAwesome | 7.1.0 | Icon Library |
| Chart.js | 4.5.1 | Data Visualization |
| ng2-charts | 8.0.0 | Angular Chart.js Wrapper |
| RxJS | 7.8.0 | Reactive Programming |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | 8.2 | Server-side Language |
| Laravel | 12.0 | Framework |
| Laravel Sanctum | 4.0 | API Authentication |
| Doctrine DBAL | 4.4 | Database Abstraction |
| SQLite | - | Development/Testing Database |

### Development Tools

| Tool | Purpose |
|------|---------|
| Composer | PHP Dependency Management |
| npm | JavaScript Dependency Management |
| Laravel Pint | PHP Code Formatting (PSR-12) |
| Prettier | TypeScript/HTML/CSS Formatting |
| PHPUnit | PHP Unit Testing |
| Karma/Jasmine | Frontend Testing |

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                   Angular 20 SPA                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Modules    │  │   Services   │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP (REST API)
                            │ JWT Authentication
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Laravel 12 API                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Models     │  │ Middleware   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Eloquent ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
│              SQLite / PostgreSQL / MySQL                    │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

**Frontend Patterns:**
- **Signal-Based State Management**: Angular signals for reactive state
- **Standalone Components**: Component composition without NgModules
- **Functional Guards**: Modern Angular guard pattern
- **Interceptor Pattern**: Centralized HTTP request handling
- **Service Pattern**: Injectable services for API communication
- **Observer Pattern (RxJS)**: Async operations and data streams

**Backend Patterns:**
- **Repository Pattern (Eloquent ORM)**: Data access abstraction
- **Observer Pattern**: Automatic cleanup on model events
- **Middleware Pipeline**: Layered authentication and authorization
- **Factory Pattern**: Database factories for test data
- **Audit Trail Pattern**: Admin action logging
- **Service Layer**: Business logic in controllers

---

## Frontend Architecture

### Directory Structure

```
Frontend/src/app/
├── core/
│   ├── guards/              # Route guards
│   │   ├── admin-guard.ts
│   │   └── shop-guard.ts
│   ├── interceptors/        # HTTP interceptors
│   │   └── auth-interceptor.ts
│   ├── models/              # TypeScript interfaces
│   │   ├── listing.ts
│   │   ├── category.ts
│   │   └── api-response.ts
│   └── services/            # Injectable services
│       ├── auth.service.ts
│       ├── listing.service.ts
│       ├── shop.service.ts
│       ├── order.service.ts
│       ├── category.service.ts
│       ├── review.service.ts
│       ├── chat.service.ts
│       ├── admin.service.ts
│       ├── notification.service.ts
│       ├── logger.service.ts
│       ├── saved-items.service.ts
│       └── category-icon.service.ts
├── modules/                  # Feature modules (lazy-loaded)
│   ├── public/              # Public pages
│   │   ├── home/
│   │   ├── product-detail/
│   │   ├── saved-items/
│   │   ├── checkout/
│   │   └── categories/
│   ├── auth/                # Authentication
│   │   ├── login/
│   │   └── register/
│   ├── shop/                # Shop owner features
│   │   ├── shop-dashboard/
│   │   ├── product-management/
│   │   ├── product-list/
│   │   ├── staff-management/
│   │   ├── shop-create/
│   │   └── shop-settings/
│   ├── admin/               # Admin features
│   │   ├── admin-dashboard/
│   │   ├── user-management/
│   │   ├── moderation/
│   │   └── settings/
│   └── user-profile/        # User profile
│       └── user-profile/
├── shared/                   # Shared components
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── navbar/
│   │   │   └── sidebar/
│   │   ├── listing-card/
│   │   ├── avatar/
│   │   ├── badge/
│   │   ├── alert/
│   │   ├── tabs/
│   │   ├── skeleton/
│   │   ├── empty-state/
│   │   ├── icon-picker/
│   │   └── toast/
│   ├── utils/
│   │   └── image.utils.ts
│   └── data/
│       └── icons.ts
├── app.routes.ts             # Root routing
├── app.config.ts             # App configuration
└── app.ts                    # Root component
```

### Core Services

#### AuthService (`src/app/core/services/auth.ts:43-94`)

**Responsibilities:**
- User authentication (login, register, logout)
- JWT token management
- User state management with signals
- Role-based access control signals

**Key Methods:**
- `login(email, password)`: Authenticates user and stores token
- `register(userData)`: Creates new customer account
- `logout()`: Clears token and user data
- `getCurrentUser()`: Fetches current user from API

**State Management:**
```typescript
currentUser = signal<User | null>(this.getUserFromStorage());
token = signal<string | null>(localStorage.getItem('token'));
isAuthenticated = computed(() => !!this.token());
isAdmin = computed(() => this.currentUser()?.is_admin || false);
isShopOwner = computed(() => this.currentUser()?.is_shop_owner || false);
```

#### ListingService (`src/app/core/services/listing.ts:25-72`)

**Responsibilities:**
- Product listing CRUD operations
- Advanced filtering and search
- Image upload handling
- Stock management

**Key Methods:**
- `getListings(params)`: Paginated listing with filters
- `getListing(id)`: Single listing details
- `createListing(formData)`: Create with image upload
- `updateListing(id, formData)`: Update listing
- `deleteListing(id)`: Remove listing
- `markAsSold(id)`: Mark as sold
- `restock(id)`: Restock inventory

#### AdminService (`src/app/core/services/admin.ts:95-134`)

**Responsibilities:**
- Admin dashboard statistics
- User management
- Shop verification
- Report moderation

**Key Methods:**
- `getDashboardStats()`: Platform-wide metrics
- `getUsers()`: User listing
- `updateUserRole(id, role)`: Role management
- `banUser(id)`, `unbanUser(id)`: User control
- `verifyShop(id)`: Approve shop
- `getReports()`: Moderation queue

### State Management

**Pattern:** Angular Signals (preferred over RxJS for simple state)

**Services with Signals:**
- `AuthService`: `currentUser`, `token`, role signals
- `SavedItemsService`: `items`, `count`, `loading` signals
- `NotificationService`: `notifications` signal array

**Computed Signals:**
```typescript
isAuthenticated = computed(() => !!this.token());
isAdmin = computed(() => this.currentUser()?.is_admin || false);
```

**Persistence:** localStorage for token and user data

### Routing Architecture

**Route Structure:**
```
/ → /public/home
/public/* (no authentication)
/auth/* (login, register)
/admin/* (admin-guard required)
/shop/* (shop-guard required)
/profile/* (user profile)
```

**Lazy Loading:** All feature modules loaded on demand

**Guards:**
- `adminGuard`: Protects admin routes
- `shopGuard`: Protects shop owner routes

### TypeScript Models

**User Interface:**
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

**Listing Interface:**
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

### Component Patterns

**Standalone Components:**
```typescript
@Component({
  standalone: true,
  selector: 'app-example',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  private authService = inject(AuthService);
  // ...
}
```

**Dependency Injection:**
- Use `inject()` function (Angular 15+ pattern)
- No constructor-based DI for services

**Lifecycle:**
- Implement `OnInit`, `ngOnDestroy` interfaces
- Use `takeUntilDestroyed()` for cleanup

---

## Backend Architecture

### Directory Structure

```
Backend/app/
├── Console/
│   └── Commands/            # Artisan commands
│       ├── CreateAdminShop.php
│       ├── UpdateAdminRoles.php
│       └── CheckRecords.php
├── Http/
│   ├── Controllers/         # API controllers
│   │   ├── AuthController.php
│   │   ├── ListingController.php
│   │   ├── ShopController.php
│   │   ├── OrderController.php
│   │   ├── CategoriesController.php
│   │   ├── ReviewsController.php
│   │   ├── ChatController.php
│   │   ├── SavedItemController.php
│   │   ├── ShopMemberController.php
│   │   └── AdminController.php
│   ├── Middleware/          # Custom middleware
│   │   ├── AdminMiddleware.php
│   │   ├── FlexibleAuthMiddleware.php
│   │   └── BasicAuthMiddleware.php
│   └── Requests/            # Form request validation
├── Models/                  # Eloquent models
│   ├── User.php
│   ├── Shop.php
│   ├── Listing.php
│   ├── Category.php
│   ├── Order.php
│   ├── Review.php
│   ├── ChatRoom.php
│   ├── ChatMessage.php
│   ├── Report.php
│   ├── AuditLog.php
│   ├── SystemRevenue.php
│   ├── Setting.php
│   ├── ShopMember.php
│   └── SavedItem.php
├── Observers/               # Model observers
│   └── ListingObserver.php
└── Providers/               # Service providers
```

### Models & Relationships

#### User Model (`Backend/app/Models/User.php:10-72`)

**Traits:** `HasApiTokens`, `HasFactory`, `Notifiable`

**Relationships:**
- `ownShop()`: One-to-one with Shop
- `shopMemberships()`: One-to-many with ShopMember

**Helper Methods:**
```php
public function hasRole(string $role): bool
public function hasAnyRole(array $roles): bool
public function hasAllRoles(array $roles): bool
```

**Boolean Role Flags:**
- `is_customer`: Regular marketplace users
- `is_staff`: Shop staff members
- `is_shop_owner`: Shop owners
- `is_admin`: Platform administrators

#### Shop Model (`Backend/app/Models/Shop.php:8-29`)

**Custom Primary Key:** `shop_id`

**Relationships:**
- `members()`: One-to-many (ShopMember)
- `listings()`: One-to-many (Listing)

**Status:** Pending, Active, Suspended

#### Listing Model (`Backend/app/Models/Listing.php:10-80`)

**Custom Primary Key:** `listing_id`

**Observer:** `ListingObserver` for automatic image cleanup

**Scopes:**
```php
public function scopeSold($query)
public function scopeAvailable($query)
```

**Methods:**
- `markAsSold()`: Mark as sold and set sold_at timestamp
- `restock()`: Reset sold status and sold_at
- `incrementSales()`: Increment sales_count

**Relationships:**
- `shop()`: BelongsTo
- `category()`: BelongsTo
- `reviews()`: HasMany

#### Order Model (`Backend/app/Models/Order.php:8-34`)

**Custom Primary Key:** `order_id`

**Status Workflow:** Pending → Confirmed → Shipped → Delivered or Cancelled

**Relationships:**
- `user()`: BelongsTo
- `listing()`: BelongsTo

### Controllers

#### AuthController (`Backend/app/Http/Controllers/AuthController.php:10-59`)

**Endpoints:**
- `POST /register`: Create new customer account
- `POST /login`: Authenticate and issue token
- `POST /logout`: Revoke current token
- `GET /user`: Get current user

**Features:**
- Ban status check during login
- Default customer role assignment
- Token creation/deletion via Sanctum

#### ListingController (`Backend/app/Http/Controllers/ListingController.php:14-447`)

**Endpoints:**
- `GET /listings`: Paginated listing with advanced filters
- `GET /listings/{id}`: Single listing details
- `POST /listings`: Create listing with image upload
- `PUT /listings/{id}`: Update listing (handles multipart)
- `DELETE /listings/{id}`: Delete listing
- `POST /listings/{id}/mark-as-sold`: Mark as sold
- `POST /listings/{id}/restock`: Restock inventory

**Features:**
- Image upload to custom `listings` disk
- Shop permission checks
- Advanced filtering (category, shop, search, status)
- Eager loading for relationships

#### AdminController (`Backend/app/Http/Controllers/AdminController.php:14-348`)

**Endpoints:**
- `GET /admin/dashboard`: Platform statistics and charts
- `GET /admin/users`: User listing
- `POST /admin/users`: Create user
- `PUT /admin/users/{id}/role`: Update user role
- `POST /admin/users/{id}/ban`: Ban user
- `POST /admin/users/{id}/unban`: Unban user
- `POST /admin/shops/{id}/verify`: Verify shop
- `GET /admin/reports`: Moderation queue
- `POST /admin/reports/{id}/resolve`: Resolve report

**Features:**
- Dashboard with chart data
- Audit logging for all actions
- User role management
- Shop verification workflow
- Report moderation

#### OrderController (`Backend/app/Http/Controllers/OrderController.php:10-139`)

**Endpoints:**
- `GET /orders`: Order listing with filters
- `GET /orders/{id}`: Single order details
- `POST /orders`: Create order
- `PUT /orders/{id}`: Update order status
- `DELETE /orders/{id}`: Cancel order

**Features:**
- Stock validation on creation
- Sales count increment on confirmation
- Stock restoration on cancellation
- Status workflow enforcement

### Middleware

#### AdminMiddleware (`Backend/app/Http/Middleware/AdminMiddleware.php:16-25`)

**Purpose:** Protect admin-only routes

**Logic:** Check `is_admin` flag, return 403 if unauthorized

#### FlexibleAuthMiddleware (`Backend/app/Http/Middleware/FlexibleAuthMiddleware.php:18-58`)

**Purpose:** Support both Sanctum and Basic Auth

**Configuration:** Controlled by `app.use_basic_auth` config

#### BasicAuthMiddleware (`Backend/app/Http/Middleware/BasicAuthMiddleware.php:18-54`)

**Purpose:** Development-only basic authentication

**Usage:** Parses Authorization header for Basic Auth credentials

### Observers

#### ListingObserver (`Backend/app/Observers/ListingObserver.php:8-65`)

**Events:**
- `deleted()`: Remove image files from `listings` disk
- `forceDeleted()`: Handle force deletes

**Purpose:** Automatic cleanup of orphaned image files

### File Storage

**Custom Disk:** `listings`

**Path:** `storage/app/public/listings`

**URL:** `{APP_URL}/storage/listings`

**Visibility:** Public

---

## Database Schema

### Core Tables

#### users

```sql
- id (primary key)
- name
- email (unique)
- password
- is_customer (boolean)
- is_staff (boolean)
- is_shop_owner (boolean)
- is_admin (boolean)
- created_at, updated_at
```

**Indexes:** `email` (unique)

#### shops

```sql
- shop_id (primary key)
- owner_id (foreign key → users.id)
- shop_name (unique)
- description
- status (enum: pending, active, suspended)
- subscription_tier
- contact_email
- contact_phone
- address
- created_at, updated_at
```

**Indexes:** `owner_id`, `shop_name` (unique)

#### listings

```sql
- listing_id (primary key)
- shop_id (foreign key → shops.shop_id)
- category_id (foreign key → categories.category_id)
- title
- description
- price (decimal)
- stock_quantity
- image_urls (json)
- status (enum: draft, active, sold_out, inactive)
- view_count
- sales_count
- is_sold (boolean)
- sold_at (timestamp)
- created_at, updated_at
```

**Indexes:** `shop_id`, `category_id`

#### categories

```sql
- category_id (primary key)
- category_name (unique)
- description
- icon
- is_popular (boolean)
```

**Indexes:** `category_name` (unique)

#### orders

```sql
- order_id (primary key)
- user_id (foreign key → users.id)
- listing_id (foreign key → listings.listing_id)
- quantity
- total_price (decimal)
- status (enum: pending, confirmed, shipped, delivered, cancelled)
- transaction_id
- created_at, updated_at
```

**Indexes:** `user_id`, `listing_id`

#### reviews

```sql
- review_id (primary key)
- listing_id (foreign key → listings.listing_id)
- reviewer_id (foreign key → users.id)
- seller_id (foreign key → users.id)
- rating (integer, 1-5)
- comment
- created_at, updated_at
```

**Indexes:** `listing_id`, `reviewer_id`, `seller_id`

#### chat_rooms

```sql
- chat_room_id (primary key)
- listing_id (foreign key → listings.listing_id)
- buyer_id (foreign key → users.id)
- seller_id (foreign key → users.id)
- created_at, updated_at
```

**Indexes:** `listing_id`, `buyer_id`, `seller_id`

#### chat_messages

```sql
- chat_message_id (primary key)
- chat_room_id (foreign key → chat_rooms.chat_room_id)
- sender_id (foreign key → users.id)
- message
- is_read (boolean)
- created_at
```

**Indexes:** `chat_room_id`, `sender_id`

#### saved_items

```sql
- saved_item_id (primary key)
- user_id (foreign key → users.id)
- listing_id (foreign key → listings.listing_id)
- created_at
```

**Indexes:** `user_id`, `listing_id`, unique `(user_id, listing_id)`

#### shop_members

```sql
- shop_member_id (primary key)
- shop_id (foreign key → shops.shop_id)
- user_id (foreign key → users.id)
- role (enum: staff, seller)
- created_at
```

**Indexes:** `shop_id`, `user_id`, unique `(shop_id, user_id)`

#### reports

```sql
- report_id (primary key)
- reporter_id (foreign key → users.id)
- reportable_type (polymorphic)
- reportable_id (polymorphic)
- reason
- status (enum: pending, resolved, dismissed)
- resolved_by (foreign key → users.id)
- resolved_at (timestamp)
- created_at, updated_at
```

**Indexes:** `reporter_id`, `status`

#### audit_logs

```sql
- audit_log_id (primary key)
- admin_id (foreign key → users.id)
- action
- entity_type
- entity_id
- ip_address
- created_at
```

**Indexes:** `admin_id`, `entity_type`, `entity_id`

#### system_revenues

```sql
- revenue_id (primary key)
- order_id (foreign key → orders.order_id)
- platform_fee (decimal)
- total_amount (decimal)
- recorded_at
```

**Indexes:** `order_id`

#### settings

```sql
- setting_id (primary key)
- key (unique)
- value
- description
- updated_at
```

**Indexes:** `key` (unique)

### Relationships

**User → Shop:** One-to-one (owner)
**User → ShopMember:** One-to-many (staff memberships)
**Shop → Listings:** One-to-many
**Shop → ShopMember:** One-to-many
**Listing → Category:** Many-to-one
**Listing → Reviews:** One-to-many
**Listing → Orders:** One-to-many
**Listing → ChatRoom:** One-to-many
**User → Orders:** One-to-many
**User → Reviews:** One-to-many
**User → SavedItems:** One-to-many
**ChatRoom → ChatMessages:** One-to-many

---

## API Documentation

### Base URL

```
Development: http://127.0.0.1:8000/api
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

### Public Routes

#### Authentication

**POST /register**
- Create new customer account
- Body: `{ name, email, password }`
- Response: `{ user, token }`

**POST /login**
- Authenticate user
- Body: `{ email, password }`
- Response: `{ user, token }`
- Note: Returns 403 if user is banned

#### Categories

**GET /categories**
- List all categories
- Response: `[ { category_id, category_name, icon, is_popular } ]`

#### Listings

**GET /listings**
- List listings with pagination and filters
- Query Params: `page`, `category_id`, `shop_id`, `search`, `status`, `is_sold`, `is_inactive`
- Response: `{ data: Listing[], meta: { current_page, last_page, total } }`

**GET /listings/{id}**
- Get single listing details
- Response: `Listing` with relationships

### Protected Routes (auth:sanctum)

#### User Management

**POST /logout**
- Revoke current token
- Response: `{ message }`

**GET /user**
- Get current user
- Response: `User`

#### Categories (Admin/Shop Owner)

**POST /categories**
- Create category
- Body: `{ category_name, description, icon }`
- Response: `Category`

**PUT /categories/{id}**
- Update category
- Body: `{ category_name, description, icon }`
- Response: `Category`

**PATCH /categories/{id}/popular**
- Toggle popular status
- Response: `Category`

**DELETE /categories/{id}**
- Delete category
- Response: `{ message }`

#### Listings (Admin/Shop Owner)

**POST /listings**
- Create listing with images
- Body: multipart/form-data with `title`, `description`, `price`, `stock_quantity`, `category_id`, `images[]`
- Response: `Listing`

**PUT /listings/{id}**
- Update listing with images
- Body: multipart/form-data
- Response: `Listing`

**DELETE /listings/{id}**
- Delete listing (triggers image cleanup)
- Response: `{ message }`

**POST /listings/{id}/mark-as-sold**
- Mark listing as sold
- Response: `Listing`

**POST /listings/{id}/restock**
- Restock listing inventory
- Response: `Listing`

#### Orders

**GET /orders**
- List orders with filters
- Query Params: `status`, `user_id`, `listing_id`
- Response: `{ data: Order[], meta }`

**GET /orders/{id}**
- Get single order
- Response: `Order`

**POST /orders**
- Create order
- Body: `{ listing_id, quantity }`
- Response: `Order`
- Note: Validates stock availability

**PUT /orders/{id}**
- Update order status
- Body: `{ status }`
- Response: `Order`
- Note: Admin and shop owner only

**DELETE /orders/{id}**
- Cancel order (pending only)
- Response: `{ message }`

#### Reviews

**GET /reviews**
- List reviews with filters
- Query Params: `listing_id`, `reviewer_id`, `seller_id`
- Response: `{ data: Review[] }`

**POST /reviews**
- Create review
- Body: `{ listing_id, rating, comment }`
- Response: `Review`
- Note: Prevents self-reviews

**PUT /reviews/{id}**
- Update review
- Body: `{ rating, comment }`
- Response: `Review`
- Note: Owner only

**DELETE /reviews/{id}**
- Delete review
- Response: `{ message }`
- Note: Owner only

#### Chat

**GET /chats**
- List chat rooms
- Response: `{ data: ChatRoom[] }`

**POST /chats**
- Create or get existing chat room
- Body: `{ listing_id, buyer_id, seller_id }`
- Response: `ChatRoom`

**GET /chats/{id}/messages**
- Get messages for chat room
- Response: `{ data: ChatMessage[] }`

**POST /chats/{id}/messages**
- Send message
- Body: `{ message }`
- Response: `ChatMessage`

**PATCH /chats/{id}/read**
- Mark messages as read
- Response: `{ message }`

#### Saved Items

**GET /saved-items**
- Get user's saved items
- Response: `{ data: SavedItem[] }`

**POST /saved-items**
- Save item
- Body: `{ listing_id }`
- Response: `{ saved: true, message }`
- Note: Toggle functionality

**DELETE /saved-items/{id}**
- Remove saved item
- Response: `{ message }`

**GET /saved-items/check/{listing_id}**
- Check if listing is saved
- Response: `{ is_saved: boolean }`

#### Shops

**GET /shops**
- List shops
- Response: `{ data: Shop[] }`

**GET /shops/{id}**
- Get shop details
- Response: `Shop`

**POST /shops**
- Create shop
- Body: `{ shop_name, description, contact_email, contact_phone, address }`
- Response: `Shop`
- Note: Auto-adds owner as member

**PUT /shops/{id}**
- Update shop
- Body: `{ shop_name, description, contact_email, contact_phone, address }`
- Response: `Shop`
- Note: Owner only

**DELETE /shops/{id}**
- Delete shop
- Response: `{ message }`
- Note: Owner only

**GET /my-shop/stats**
- Get shop analytics
- Response: `{ total_listings, total_sales, total_views, total_revenue, charts }`

#### Shop Members

**GET /shop-members**
- List shop members
- Query Params: `shop_id`
- Response: `{ data: ShopMember[] }`

**POST /shop-members**
- Add staff member
- Body: `{ shop_id, user_id, role }`
- Response: `ShopMember`
- Note: Shop owner only

**DELETE /shop-members/{id}**
- Remove staff member
- Response: `{ message }`
- Note: Shop owner only

### Admin Routes (admin middleware)

#### Dashboard

**GET /admin/dashboard**
- Get platform statistics
- Response: `{ users_count, shops_count, listings_count, orders_count, revenue, charts }`

#### User Management

**GET /admin/users**
- List all users
- Query Params: `role`, `search`
- Response: `{ data: User[] }`

**POST /admin/users**
- Create user
- Body: `{ name, email, password, is_customer, is_staff, is_shop_owner, is_admin }`
- Response: `User`

**PUT /admin/users/{id}/role**
- Update user role
- Body: `{ role }`
- Response: `User`

**POST /admin/users/{id}/ban**
- Ban user
- Response: `{ message }`

**POST /admin/users/{id}/unban**
- Unban user
- Response: `{ message }`

#### Shop Verification

**POST /admin/shops/{id}/verify**
- Verify shop
- Response: `Shop`

#### Moderation

**GET /admin/reports**
- List reports
- Query Params: `status`
- Response: `{ data: Report[] }`

**POST /admin/reports/{id}/resolve**
- Resolve report
- Body: `{ action }`
- Response: `Report`

### Response Formats

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message"
}
```

**Paginated Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "errors": { ... }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

## Authentication & Authorization

### Authentication Flow

**Frontend:**
1. User submits credentials to `/login`
2. API validates credentials and returns JWT token
3. Token stored in `localStorage`
4. `authInterceptor` adds `Authorization: Bearer {token}` to all requests
5. `AuthService` manages authentication state with signals

**Backend:**
1. `AuthController@login` validates credentials
2. Checks if user is banned
3. Creates Sanctum token via `createToken()`
4. Returns token and user data
5. Middleware validates token on protected routes

### Authorization

**Role-Based Access Control (RBAC):**

| Role | Permissions |
|------|-------------|
| Customer | Browse listings, create orders, save items, write reviews, send messages |
| Staff | Manage shop listings (if assigned), respond to messages |
| Shop Owner | Create/manage shop, listings, orders, staff, view analytics |
| Admin | Full platform access, user management, moderation, audit logs |

**Route Protection:**

**Frontend Guards:**
- `adminGuard`: Requires `isAuthenticated() && isAdmin()`
- `shopGuard`: Requires `isAuthenticated() && (isShopOwner() || isAdmin())`

**Backend Middleware:**
- `auth:sanctum`: Sanctum token validation
- `admin`: Custom middleware checking `is_admin` flag
- Controller-level permission checks

### Token Management

**Token Lifecycle:**
- Created on login
- Stored in `localStorage` (frontend)
- Validated on each request (backend)
- Deleted on logout
- Tokens stored in `personal_access_tokens` table

**Token Refresh:**
- Current implementation uses long-lived tokens
- Token refresh mechanism can be added for enhanced security

---

## UI/UX Design System

### Design Tokens

**CSS Variables** (`Frontend/src/styles/tokens.css`):

```css
--background: #ffffff
--foreground: #09090b
--muted: #f4f4f5
--muted-foreground: #71717a
--primary: #0f172a
--success: #22c55e
--warning: #f59e0b
--destructive: #ef4444
--info: #3b82f6
--border: #e4e4e7
--input: #e4e4e7
--ring: #09090b
```

### Bootstrap Override System

All Bootstrap utility classes automatically use shadcn design tokens:

| Bootstrap Class | shadcn Token | Color |
|----------------|--------------|-------|
| `.bg-primary` | `var(--primary)` | #0f172a |
| `.bg-success` | `var(--success)` | #22c55e |
| `.bg-danger` | `var(--destructive)` | #ef4444 |
| `.bg-warning` | `var(--warning)` | #f59e0b |
| `.bg-info` | `var(--info)` | #3b82f6 |

### Component Library

**Available Components:**

#### BadgeComponent (`app-badge`)
**Variants:** default, secondary, success, warning, destructive, info
**Features:** Optional dot indicator

#### AlertComponent (`app-alert`)
**Variants:** success, danger, warning, info
**Features:** Title, description, icon, auto-dismiss (5s)

#### TabsComponent (`app-tabs`)
**Purpose:** Tabbed navigation
**Interface:** `TabItem` with value, label, icon

#### AvatarComponent (`app-avatar`)
**Purpose:** User avatar display
**Features:** Fallback initials, image support

#### SkeletonComponent (`app-skeleton`)
**Purpose:** Loading placeholders
**Usage:** Display while data is loading

#### EmptyStateComponent (`app-empty-state`)
**Purpose:** Empty data states
**Features:** Icon, title, description, action button

#### ListingCardComponent (`app-listing-card`)
**Purpose:** Reusable product card
**Inputs:** listing, showSaveButton, showStatusBadge, showViewCount, isSaved
**Outputs:** onSaveToggle, onRemove, onView

#### ToastComponent (`app-toast`)
**Purpose:** Toast notifications
**Features:** Auto-dismiss (2s), manual close, progress bar, 4 variants

#### Navigation Components
**NavbarComponent (`app-navbar`):** Responsive, role-based menu
**SidebarComponent (`app-sidebar`):** Fixed sidebar, active route highlighting

### UI Patterns

**Critical Rules:**

1. **Use Semantic Colors, Not Raw Colors**
   - ❌ `bg-primary text-white`
   - ✅ Use CSS variables: `background: var(--background); color: var(--foreground);`

2. **No Manual Dark Mode Overrides**
   - ❌ `bg-white dark:bg-gray-950`
   - ✅ Use CSS variables that handle light/dark via media queries

3. **Gap Instead of Space Classes**
   - ❌ `mb-4` on individual items
   - ✅ `d-flex flex-column gap-3` on container

4. **Badge Variants for Status Indicators**
   - Use semantic variants: success, warning, destructive, info, default
   - Map status to variant programmatically

5. **Loading States**
   - Use skeleton loaders while data is loading
   - Show empty states when no data exists
   - Display error alerts on failures

### Responsive Design

**Bootstrap Grid System:**
- Mobile-first approach
- Breakpoints: sm (576px), md (768px), lg (992px), xl (1200px)
- Use `container`, `row`, `col-*` classes

**Sidebar:**
- Hidden on mobile (`d-none d-md-block`)
- Collapsible on tablet

**Navbar:**
- Responsive with hamburger menu
- Role-based menu items

---

## Development Workflow

### Frontend Development

**Setup:**
```bash
cd Frontend
npm install
```

**Development Server:**
```bash
npm start
# Runs on http://localhost:4200
```

**Build:**
```bash
ng build                          # Development build
ng build --configuration production  # Production build
```

**Testing:**
```bash
ng test                           # Run all tests
ng test --include='**/filename.spec.ts'  # Run specific test
```

**Code Formatting:**
```bash
npx prettier --write "src/**/*.{ts,html,css}"
```

### Backend Development

**Setup:**
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
```

**Database Setup:**
```bash
php artisan migrate
php artisan db:seed
```

**Fresh Database:**
```bash
php artisan migrate:fresh --seed
```

**Development Server:**
```bash
composer dev
# Starts server, queue, logs, Vite concurrently
```

**Testing:**
```bash
composer test                     # Run all tests
php artisan test --filter TestName  # Run single test
php artisan test --testsuite=Feature  # Run feature tests
php artisan test --testsuite=Unit     # Run unit tests
```

**Code Formatting:**
```bash
./vendor/bin/pint                 # Format PHP code (PSR-12)
```

### Git Workflow

**Branch Naming:**
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/critical-fix`

**Commit Messages:**
- Conventional Commits format
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: code restructuring`

**Pull Request:**
- Describe changes clearly
- Reference related issues
- Ensure tests pass
- Request review from team members

### Code Quality

**TypeScript:**
- Strict mode enabled
- No `any` types allowed
- Explicit return types
- Use interfaces for data structures

**PHP:**
- PSR-12 formatting
- Laravel Pint enforcement
- Type hints on methods
- Docblocks for complex logic

**Linting:**
- No ESLint (uses TypeScript compiler)
- Prettier for frontend
- Laravel Pint for backend

---

## Testing Strategy

### Frontend Testing

**Framework:** Karma + Jasmine

**Test Files:** Located in `Frontend/src/**/*.spec.ts`

**Setup:**
```typescript
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule, RouterTestingModule],
  providers: [AuthService, { provide: HttpClient, useValue: mockHttpClient }]
});
```

**Service Testing:**
```typescript
it('should return user data', (done: DoneFn) => {
  service.getCurrentUser().subscribe(user => {
    expect(user.email).toBe('test@example.com');
    done();
  });
});
```

**Component Testing:**
```typescript
it('should create component', () => {
  expect(component).toBeTruthy();
});

it('should display user name', () => {
  component.user = { name: 'John Doe' };
  fixture.detectChanges();
  const element = fixture.nativeElement;
  expect(element.textContent).toContain('John Doe');
});
```

**Async Testing:**
```typescript
it('should load data', fakeAsync(() => {
  component.loadData();
  tick(1000);
  expect(component.data).toBeDefined();
}));
```

### Backend Testing

**Framework:** PHPUnit

**Test Locations:**
- Feature tests: `Backend/tests/Feature/`
- Unit tests: `Backend/tests/Unit/`

**Database:** SQLite in-memory

**Traits:**
```php
use RefreshDatabase;
use WithFaker;
```

**Feature Test Example:**
```php
public function test_user_can_login()
{
    $user = User::factory()->create([
        'password' => bcrypt($password = 'password123'),
    ]);

    $response = $this->post('/api/login', [
        'email' => $user->email,
        'password' => $password,
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['token', 'user']);
}
```

**Unit Test Example:**
```php
public function test_user_has_role()
{
    $user = User::factory()->create(['is_admin' => true]);

    $this->assertTrue($user->hasRole('admin'));
}
```

**Factory Usage:**
```php
User::factory()->create();
Listing::factory()->count(10)->create();
Order::factory()->for($listing)->create();
```

### Test Coverage

**Frontend Tests:**
- Authentication flows
- Service methods
- Component rendering
- Form validation
- HTTP interceptors

**Backend Tests:**
- Authentication endpoints
- CRUD operations
- Permission checks
- Validation rules
- Model relationships

---

## Deployment & Configuration

### Environment Variables

**Backend (.env):**
```env
APP_NAME=Marketplace
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=marketplace
DB_USERNAME=your_username
DB_PASSWORD=your_password

FILESYSTEM_DISK=public
```

**Frontend (environment.ts):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  useBasicAuth: false
};
```

### Frontend Deployment

**Build for Production:**
```bash
cd Frontend
ng build --configuration production
```

**Output:** `dist/` directory

**Hosting Options:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx/Apache

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Backend Deployment

**Deployment Steps:**
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Set permissions
chmod -R 755 storage bootstrap/cache

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage
php artisan storage:link
```

**Web Server Configuration:**

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [L]
</IfModule>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /path/to/Backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Database Setup

**Production Database:**
- PostgreSQL or MySQL recommended
- Configure in `.env`
- Run migrations: `php artisan migrate --force`
- Seed data: `php artisan db:seed --force`

### SSL/TLS

**Frontend:**
- Enable HTTPS
- Use Let's Encrypt for free SSL

**Backend:**
- Enable HTTPS
- Configure CORS for API access

### CI/CD Pipeline

**GitHub Actions Example:**
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd Frontend && npm install
      - name: Run tests
        run: cd Frontend && npm test
      - name: Build
        run: cd Frontend && ng build --configuration production

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - name: Install dependencies
        run: cd Backend && composer install
      - name: Run tests
        run: cd Backend && composer test
```

---

## Security Considerations

### Authentication Security

**Token Management:**
- JWT tokens stored securely in localStorage
- Tokens validated on each request
- Token revocation on logout
- Token expiration handling

**Password Security:**
- Password hashing with Laravel's Hash facade
- Strong password requirements
- Password reset functionality (to be implemented)

### Authorization Security

**Role-Based Access Control:**
- Middleware protection at route level
- Guard protection at component level
- Permission checks in controllers
- Audit logging for admin actions

### Data Protection

**SQL Injection Prevention:**
- Eloquent ORM for all database queries
- Parameterized queries
- Input validation

**XSS Protection:**
- Angular template sanitization
- Content Security Policy (CSP)
- Input sanitization

**CSRF Protection:**
- Laravel CSRF tokens for form submissions
- Sanctum handles CSRF for API

### API Security

**Rate Limiting:**
- Implement rate limiting for API endpoints (to be added)
- Throttle login attempts

**CORS Configuration:**
- Configure allowed origins
- Restrict methods and headers

**Input Validation:**
- Server-side validation on all inputs
- Type casting for data integrity
- Sanitization of user input

### File Upload Security

**Image Validation:**
- File type validation
- Size limits
- Virus scanning (to be implemented)

**Storage Security:**
- Separate disk for uploads
- Public visibility control
- Secure file paths

### Audit Trail

**Admin Action Logging:**
- All admin actions logged to `audit_logs` table
- IP address tracking
- Timestamp recording
- User identification

### Future Security Enhancements

1. **Two-Factor Authentication (2FA)**
2. **OAuth2 Integration** (Google, Facebook)
3. **API Rate Limiting**
4. **Email Verification**
5. **Password Policies**
6. **Security Headers**
7. **DDoS Protection**
8. **Regular Security Audits**

---

## Future Enhancements

### High Priority

**1. Real-time Features**
- WebSocket integration for chat
- Push notifications for orders/messages
- Live inventory updates

**2. Payment Integration**
- Stripe/PayPal integration
- Payment history tracking
- Refund processing

**3. Search Enhancement**
- Full-text search with Elasticsearch
- Advanced filtering and sorting
- Search suggestions

**4. Email Notifications**
- Order confirmation emails
- Message notifications
- Marketing emails

**5. Mobile Application**
- React Native or Flutter app
- Push notifications
- Offline mode

### Medium Priority

**6. Advanced Analytics**
- User behavior tracking
- Sales forecasting
- Revenue analytics

**7. Multi-language Support**
- i18n implementation
- Currency conversion
- Regional settings

**8. Social Features**
- Social sharing
- User profiles with avatars
- Follow shops/users

**9. Advanced Moderation**
- Automated spam detection
- Content moderation AI
- User reputation system

**10. Seller Tools**
- Bulk product upload
- Inventory management
- Sales reports

### Low Priority

**11. Marketplace Features**
- Auction system
- Bulk discounts
- Coupon codes
- Wishlist sharing

**12. Customer Support**
- Ticket system
- Live chat support
- FAQ section

**13. Performance Optimization**
- Redis caching
- CDN for images
- Database query optimization
- Bundle size optimization

**14. Accessibility**
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

**15. DevOps Improvements**
- Docker containerization
- Kubernetes orchestration
- Automated backups
- Monitoring and alerting

---

## Contributing Guidelines

### Code Style

**Frontend:**
- Follow Angular style guide
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

**Backend:**
- Follow Laravel best practices
- Use PSR-12 formatting
- Write docblocks for classes and methods
- Use type hints

### Testing

- Write tests for new features
- Ensure all tests pass before committing
- Aim for high test coverage
- Test edge cases

### Documentation

- Update README for new features
- Document API endpoints
- Add inline comments for complex code
- Keep CHANGELOG updated

### Pull Requests

- Create feature branches
- Write descriptive PR descriptions
- Reference related issues
- Request review from team members
- Address feedback promptly

---

## Support & Contact

For questions or issues related to this project:

- **Documentation:** Check this README and other documentation files
- **Issues:** Create an issue on the project repository
- **Email:** contact@yourdomain.com

---

## License

This project is proprietary software. All rights reserved.

---

## Acknowledgments

- **Angular Team:** For the excellent framework
- **Laravel Team:** For the powerful backend framework
- **Bootstrap Team:** For the UI framework
- **FontAwesome:** For the icon library
- **Chart.js Team:** For the charting library

---

**Last Updated:** April 1, 2026
**Version:** 1.0.0
