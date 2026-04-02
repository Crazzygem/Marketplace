# Marketplace Backend — System Analysis & Presentation Document

---

## 1. Project Overview

**Project Name:** Marketplace Backend API
**Framework:** Laravel 12 (PHP 8.2)
**Architecture:** RESTful API (API-only, no server-rendered views)
**Frontend Integration:** Angular (http://localhost:4200)
**Deployment:** Docker (PHP-FPM 8.2 + Nginx reverse proxy)

This is a **multi-vendor online marketplace backend** that exposes a complete REST API to power a buyer-seller e-commerce platform. It supports product listings, order management, real-time chat, reviews, wishlists, shop management, and an admin governance dashboard.

---

## 2. Technology Stack

| Layer            | Technology              | Version  |
|------------------|-------------------------|----------|
| Language         | PHP                     | ^8.2     |
| Framework        | Laravel                 | ^12.0    |
| Authentication   | Laravel Sanctum         | ^4.0     |
| Database         | MySQL (via PDO)         | -        |
| Schema Tooling   | Doctrine DBAL           | ^4.4     |
| Containerization | Docker / PHP-FPM        | 8.2      |
| Frontend Target  | Angular                 | localhost:4200 |

---

## 3. System Architecture

```
┌─────────────────────────────────────────┐
│            Angular Frontend             │
│          (http://localhost:4200)        │
└─────────────────┬───────────────────────┘
                  │ HTTP / Bearer Token
                  ▼
┌─────────────────────────────────────────┐
│         Nginx Reverse Proxy             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Laravel API Backend              │
│  ┌──────────┐  ┌────────────────────┐   │
│  │  Routes  │→ │    Controllers     │   │
│  └──────────┘  └────────┬───────────┘   │
│                         │               │
│  ┌──────────────────────▼────────────┐  │
│  │   Models / Eloquent ORM           │  │
│  └──────────────────────┬────────────┘  │
│                         │               │
│  ┌──────────────────────▼────────────┐  │
│  │         MySQL Database            │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   File Storage (listings disk)   │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Pattern Used:** MVC — Models, Resource Controllers, Eloquent ORM. Business logic is co-located in controllers with model-level methods for domain operations.

---

## 4. Folder Structure

```
Backend/
├── app/
│   ├── Console/Commands/      # 3 Artisan CLI commands
│   ├── Http/
│   │   ├── Controllers/       # 10 API controllers
│   │   └── Middleware/        # 3 custom middleware
│   ├── Models/                # 13 Eloquent models
│   ├── Observers/             # ListingObserver (image cleanup)
│   └── Providers/             # AppServiceProvider
├── bootstrap/app.php          # App bootstrap + middleware aliases
├── config/                    # App config (cors, sanctum, filesystems)
├── database/
│   ├── migrations/            # 21 migration files
│   └── seeders/               # 11 seeders
├── routes/
│   ├── api.php                # All API endpoint definitions
│   └── web.php                # File server + welcome route
├── storage/app/public/        # Uploaded listing images
└── Dockerfile                 # PHP 8.2-FPM container
```

---

## 5. Database Schema

### 5.1 Entity Relationship Overview

```
User ──────────────── (hasOne)   Shop
User ──────────────── (hasMany)  ShopMember
User ──────────────── (hasMany)  Order
Shop ──────────────── (hasMany)  Listing
Shop ──────────────── (hasMany)  ShopMember
Listing ───────────── (belongsTo) Shop
Listing ───────────── (belongsTo) Category
Listing ───────────── (hasMany)  Review
Listing ───────────── (hasMany)  Order
Listing ───────────── (hasMany)  SavedItem
Order ─────────────── (belongsTo) User + Listing
Review ────────────── (belongsTo) User(reviewer) + User(seller) + Listing
ChatRoom ──────────── (belongsTo) Listing + User(buyer) + User(seller)
ChatRoom ──────────── (hasMany)  ChatMessage
ChatMessage ───────── (belongsTo) ChatRoom + User(sender)
SavedItem ─────────── (belongsTo) User + Listing
Report ────────────── (belongsTo) User(reporter) + Listing
AuditLog ──────────── (belongsTo) User
```

### 5.2 Key Tables Summary

| Table              | PK           | Key Columns |
|--------------------|--------------|-------------|
| `users`            | `id`         | `name`, `email`, `is_customer`, `is_seller`, `is_shop_owner`, `is_staff`, `is_admin`, `is_banned`, `is_verified` |
| `shops`            | `shop_id`    | `owner_id`, `shop_name`, `status` (Pending/Active/Suspended), `subscription_tier` |
| `categories`       | `category_id`| `category_name`, `description` |
| `listings`         | `listing_id` | `shop_id`, `category_id`, `title`, `price`, `stock_quantity`, `image_urls` (JSON), `status`, `view_count`, `sales_count`, `is_sold` |
| `orders`           | `order_id`   | `user_id`, `listing_id`, `quantity`, `total_price`, `status`, `shipping_address`, `payment_method` |
| `reviews`          | `review_id`  | `reviewer_id`, `seller_id`, `listing_id`, `star_rating` (1-5), `comment` |
| `chat_rooms`       | `room_id`    | `listing_id`, `buyer_id`, `seller_id` |
| `chat_messages`    | `message_id` | `room_id`, `sender_id`, `message_text`, `is_read` |
| `saved_items`      | `id`         | `user_id`, `listing_id`, `saved_at` — UNIQUE(user_id, listing_id) |
| `shop_members`     | `member_id`  | `shop_id`, `user_id`, `role` (owner/seller/staff) |
| `reports`          | `report_id`  | `reporter_id`, `listing_id`, `reason`, `is_resolved` |
| `audit_logs`       | `log_id`     | `user_id`, `action`, `details`, `ip_address` |
| `system_revenues`  | `id`         | `amount`, `description` |

---

## 6. Data Models (13 Eloquent Models)

| Model           | Purpose |
|-----------------|---------|
| `User`          | Platform identity with multi-role boolean flags |
| `Shop`          | Vendor storefront owned by a user |
| `Listing`       | Product posted by a shop |
| `Category`      | Product taxonomy |
| `Order`         | Purchase transaction |
| `Review`        | Star rating + comment on a listing |
| `ChatRoom`      | Conversation thread per listing between buyer & seller |
| `ChatMessage`   | Individual message in a chat room |
| `SavedItem`     | Wishlist entry (user bookmarks a listing) |
| `ShopMember`    | Staff/team membership in a shop |
| `Report`        | User-submitted content moderation flag |
| `AuditLog`      | Admin action trail |
| `SystemRevenue` | Platform revenue tracking |

---

## 7. User Roles

The platform uses a **multi-role boolean flag system** on the `users` table (migrated from a single ENUM column to allow compound roles).

| Flag            | Description |
|-----------------|-------------|
| `is_customer`   | Can browse, order, save, and review |
| `is_seller`     | Can manage listings |
| `is_staff`      | Can assist shop management |
| `is_shop_owner` | Owns and controls a shop |
| `is_admin`      | Full platform governance access |
| `is_banned`     | Blocked from login |
| `is_verified`   | Identity/shop verified by admin |

A user can hold **multiple roles simultaneously** (e.g., `is_customer = true` AND `is_shop_owner = true`).

---

## 8. API Endpoints

### 8.1 Public Routes (No Authentication)

| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| POST   | `/api/register`        | Register a new user |
| POST   | `/api/login`           | Login and receive Bearer token |
| GET    | `/api/categories`      | List all categories |
| GET    | `/api/categories/{id}` | Get single category |
| GET    | `/api/listings`        | Browse listings (filter: category, shop, search, status) |
| GET    | `/api/listings/{id}`   | View listing details (increments view count) |

### 8.2 Protected Routes (Require Bearer Token)

#### Authentication
| Method | Endpoint     | Description |
|--------|--------------|-------------|
| POST   | `/api/logout` | Revoke current token |
| GET    | `/api/user`   | Get authenticated user |

#### Listings
| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| POST   | `/api/listings`                   | Create a listing with image upload |
| PUT    | `/api/listings/{id}`              | Update listing |
| DELETE | `/api/listings/{id}`              | Delete listing + images |
| POST   | `/api/listings/{id}/mark-as-sold` | Mark listing as sold |
| POST   | `/api/listings/{id}/restock`      | Restock/unmark sold |

#### Orders (Full CRUD)
| Method      | Endpoint           | Description |
|-------------|--------------------|-------------|
| GET         | `/api/orders`      | List own orders (admin sees all) |
| POST        | `/api/orders`      | Place an order |
| GET         | `/api/orders/{id}` | View order details |
| PUT/PATCH   | `/api/orders/{id}` | Update order status |
| DELETE      | `/api/orders/{id}` | Cancel pending order |

#### Reviews (Full CRUD)
| Method    | Endpoint            | Description |
|-----------|---------------------|-------------|
| GET       | `/api/reviews`      | List reviews (filter: seller_id, listing_id) |
| POST      | `/api/reviews`      | Post a review |
| GET       | `/api/reviews/{id}` | View single review |
| PUT/PATCH | `/api/reviews/{id}` | Edit own review |
| DELETE    | `/api/reviews/{id}` | Delete own review |

#### Chat
| Method | Endpoint                      | Description |
|--------|-------------------------------|-------------|
| GET    | `/api/chats`                  | List user's chat rooms |
| POST   | `/api/chats`                  | Start a new chat / send first message |
| GET    | `/api/chats/{id}`             | View chat room + mark as read |
| POST   | `/api/chats/{id}/messages`    | Send message to existing room |

#### Saved Items (Wishlist)
| Method | Endpoint                               | Description |
|--------|----------------------------------------|-------------|
| GET    | `/api/saved-items`                     | List saved items |
| POST   | `/api/saved-items`                     | Save a listing |
| POST   | `/api/saved-items/toggle`              | Toggle save/unsave |
| GET    | `/api/saved-items/{listingId}/is-saved`| Check if listing is saved |
| DELETE | `/api/saved-items/{id}`                | Remove saved item |

#### Shop
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| POST   | `/api/shops`      | Create a shop |
| GET    | `/api/my-shop/stats` | Get shop dashboard analytics |

#### Shop Members
| Method    | Endpoint                 | Description |
|-----------|--------------------------|-------------|
| GET       | `/api/shop-members`      | List shop members |
| POST      | `/api/shop-members`      | Add a member |
| GET       | `/api/shop-members/{id}` | View member |
| PUT/PATCH | `/api/shop-members/{id}` | Update member role |
| DELETE    | `/api/shop-members/{id}` | Remove member |

#### Categories (Auth-Protected)
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| POST   | `/api/categories`       | Create category |
| PUT    | `/api/categories/{id}`  | Update category |
| DELETE | `/api/categories/{id}`  | Delete category |

### 8.3 Admin Routes (Require Admin Role)

| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| GET    | `/api/admin/dashboard`            | KPI stats + chart data |
| GET    | `/api/admin/users`                | List all users with roles |
| POST   | `/api/admin/users/{id}/ban`       | Ban a user |
| POST   | `/api/admin/users/{id}/unban`     | Unban a user |
| POST   | `/api/admin/shops/{id}/verify`    | Approve a shop |
| GET    | `/api/admin/reports`              | View moderation queue |
| POST   | `/api/admin/reports/{id}/resolve` | Resolve a report |

---

## 9. Authentication & Security

### Mechanism: Laravel Sanctum (Token-Based)
- On login, a **Bearer token** is issued and returned to the client
- Every protected request sends the token via `Authorization: Bearer <token>`
- Logout revokes only the current token (not all sessions)
- Tokens are **non-expiring** by default (`expiration: null` in sanctum config)

### Middleware Stack

| Middleware             | Alias          | Purpose |
|------------------------|----------------|---------|
| `auth:sanctum`         | (built-in)     | Validates Bearer token on all protected routes |
| `AdminMiddleware`      | `admin`        | Ensures `is_admin = true`, returns 403 otherwise |
| `BasicAuthMiddleware`  | `basic.auth`   | Dev-only HTTP Basic Auth (blocked in production) |
| `FlexibleAuthMiddleware` | `flexible.auth` | Switches between Basic Auth and Sanctum based on `.env` flag |

### CORS Policy
- Allowed origins: **`http://localhost:4200` only**
- Credentials: allowed
- All HTTP methods and headers: allowed

---

## 10. Key Features & Business Logic

### 10.1 Image Management
- Listing images are uploaded as multipart files
- Stored on a dedicated **`listings` filesystem disk** (`storage/app/public/listings/`)
- Paths saved as a **JSON array** in `image_urls`
- **Automatic cleanup:** `ListingObserver` deletes all image files from disk when a listing is deleted (Observer Pattern via PHP 8 `#[ObservedBy]` attribute)
- A custom web route serves storage files with CORS headers and path traversal protection

### 10.2 Order Lifecycle & Stock Management
```
Pending → Confirmed → Shipped → Delivered
                                        ↘ Cancelled (from Pending only)
```
- Stock is **decremented atomically** on order creation
- Stock is **restored** when a Pending order is cancelled
- `sales_count` on the listing is **incremented** when order is confirmed
- `total_price` is calculated from `price × quantity` at order time

### 10.3 Chat System
- Chat rooms are **idempotent** — same `(listing, buyer, seller)` reuses existing room
- Messages are **auto-marked as read** when the room is fetched by the other participant
- Users are identified as buyer or seller based on shop ownership

### 10.4 Shop Analytics Dashboard (`GET /api/my-shop/stats`)
Returns:
- **KPI Cards:** total views, items listed, total sales (Delivered orders), total revenue, active orders
- **Top 5 Listings** by view count (bar chart data)
- **Top 5 Listings** by sales count (bar chart data)
- **30-day time-series** of daily sales quantity and daily revenue

### 10.5 Admin Governance
- **Audit Trail:** All ban/unban actions logged to `audit_logs` with admin ID and client IP
- **Shop Verification:** Approving a shop sets `status = Active` AND sets owner's `is_verified = true` simultaneously
- **Content Moderation:** Reported listings managed through a moderation queue

### 10.6 Wishlist / Saved Items
- `POST /api/saved-items/toggle` — idempotent save/unsave
- Database-level `UNIQUE(user_id, listing_id)` prevents duplicate saves
- Fully integrated with listing details

---

## 11. Controllers Summary

| Controller              | Lines | Responsibility |
|-------------------------|-------|----------------|
| `AuthController`        | ~80   | Register, login, logout |
| `ListingController`     | ~430  | Full listing CRUD, image upload, mark-sold, restock |
| `OrderController`       | ~160  | Order lifecycle, stock management |
| `ShopController`        | ~130  | Shop creation, analytics dashboard |
| `AdminController`       | ~200  | Dashboard KPIs, user/shop moderation |
| `ChatController`        | ~120  | Chat rooms, messaging, read receipts |
| `CategoriesController`  | ~80   | Category CRUD |
| `ReviewsController`     | ~120  | Review CRUD with self-review prevention |
| `SavedItemController`   | ~130  | Wishlist management |
| `ShopMemberController`  | ~130  | Staff/team management |

---

## 12. Design Patterns & Notable Decisions

| Pattern / Decision              | Implementation |
|---------------------------------|----------------|
| **Observer Pattern**            | `ListingObserver` auto-deletes images on listing delete |
| **Multi-role Boolean Flags**    | Users can hold multiple roles simultaneously via boolean columns |
| **Idempotent Chat Rooms**       | `firstOrCreate` on `(listing, buyer, seller)` |
| **Idempotent Wishlist Toggle**  | `POST /toggle` saves or removes based on current state |
| **Custom PK Names**             | All domain models use descriptive PKs (e.g., `listing_id`, `shop_id`) |
| **JSON Image Arrays**           | `image_urls` stored as JSON for flexible multi-image support |
| **PUT Multipart Workaround**    | Manual multipart parsing to work around PHP's PUT file upload limitation |
| **Paginated Responses**         | All list endpoints return paginated results (20 per page) |
| **Comprehensive Seeder**        | Full interconnected demo dataset for development |

---

## 13. Artisan CLI Commands

| Command                      | Purpose |
|------------------------------|---------|
| `check:records`              | Diagnostic count of users and listings |
| `app:update-admin-roles`     | Grant all roles to the first admin user |
| `app:create-admin-shop`      | Create a default shop for the admin user |

---

## 14. Containerization

```dockerfile
Base Image:  php:8.2-fpm
Extensions:  pdo_mysql, mbstring, exif, pcntl, bcmath, gd
Purpose:     Run behind Nginx reverse proxy in Docker Compose
```

---

## 15. Known Technical Observations

| # | Issue | Location |
|---|-------|----------|
| 1 | Category write endpoints are **not admin-restricted** — any authenticated user can create/delete categories | `routes/api.php:52-54` |
| 2 | Listings with no `shop_id` have **no ownership enforcement** on update/delete | `ListingController.php:251-254` |
| 3 | Shop stats use **30 individual DB queries** for 30-day time-series (can be optimized to a single GROUP BY) | `ShopController.php:87-103` |
| 4 | Sanctum tokens **never expire** (`expiration: null`) | `config/sanctum.php:50` |
| 5 | `SystemRevenue` model defines columns not present in its migration (schema mismatch) | `Models/SystemRevenue.php` vs migration |

---

## 16. Summary

This marketplace backend is a **well-structured, feature-complete Laravel 12 REST API** suitable for a multi-vendor e-commerce platform. It covers the full business lifecycle from user registration and shop setup through product listing, ordering, payments, reviews, messaging, and admin moderation. The codebase demonstrates solid use of Laravel conventions (Eloquent ORM, Sanctum auth, Observers, resource controllers, migrations, seeders) and is containerized for easy deployment.

**Total scope:**
- 13 Eloquent Models
- 10 API Controllers
- 40+ API Endpoints
- 21 Database Migrations
- 3 Custom Middleware
- 11 Seeders
- 3 Artisan Commands
