# Marketplace Backend

Laravel 12 RESTful API backend for the multi-role marketplace platform. Supports admin, shop owner, staff, and customer roles with full CRUD operations for listings, orders, reviews, chat, and more.

## Tech Stack

- **PHP 8.2** with Laravel 12
- **MySQL 8.0** database
- **Redis 7** for caching and queues
- **Laravel Sanctum** for API authentication
- **PHPUnit** for testing

## Prerequisites

| Tool | Version |
|------|---------|
| PHP | >= 8.2 |
| Composer | >= 2.0 |
| MySQL | >= 8.0 |
| Node.js | >= 18 (for Vite assets) |
| Redis | >= 7 (optional) |

---

## Option 1: Docker Setup (Recommended)

This is the fastest way to get the backend running. Docker handles all dependencies automatically.

### Quick Start

```bash
# 1. Clone the repository
git clone <your-backend-repo-url>
cd Backend

# 2. Create environment file
cp .env.example .env

# 3. Start all services (MySQL, Redis, Nginx, PHP-FPM)
docker compose up -d --build

# 4. Run database migrations
docker compose exec backend php artisan migrate --force

# 5. (Optional) Seed with sample data
docker compose exec backend php artisan migrate:fresh --seed
```

The API will be available at **http://localhost:8000**

### Common Docker Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f mysql

# Run migrations
docker compose exec backend php artisan migrate

# Run tests
docker compose exec backend php artisan test

# Open a shell inside the container
docker compose exec backend sh

# Generate a new application key
docker compose exec backend php artisan key:generate

# Clear all caches
docker compose exec backend php artisan optimize:clear

# Stop all services
docker compose down

# Stop and remove all data (including database)
docker compose down -v
```

### Docker Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`):

```env
# App
APP_NAME=Marketplace
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost
APP_KEY=           # Generate with: docker compose exec backend php artisan key:generate

# Database
DB_DATABASE=marketplace
DB_USERNAME=marketplace
DB_PASSWORD=secret_password
MYSQL_ROOT_PASSWORD=root_secret

# Ports (optional - defaults shown)
NGINX_PORT=8000
MYSQL_PORT=3306
REDIS_PORT=6379
```

### Docker Architecture

```
                    ┌─────────────────────────────────────────┐
  Port 8000 ───────►│  Nginx (Reverse Proxy)                  │
                    │  ./docker/nginx/default.conf             │
                    └──────────┬──────────────────────────────┘
                               │
                    ┌──────────▼──────────────────────────────┐
                    │  PHP-FPM (Laravel)                      │
                    │  Port 9000 (internal)                    │
                    └────┬──────────────┬─────────────────────┘
                         │              │
              ┌──────────▼──┐    ┌──────▼──────┐
              │  MySQL 8.0  │    │  Redis 7    │
              │  Port 3306  │    │  Port 6379  │
              └─────────────┘    └─────────────┘
```

---

## Option 2: Local Development Setup

### Step-by-Step

```bash
# 1. Clone the repository
git clone <your-backend-repo-url>
cd Backend

# 2. Install PHP dependencies
composer install

# 3. Create environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Configure your .env file
#    - Set DB_DATABASE, DB_USERNAME, DB_PASSWORD
#    - Set REDIS_HOST if using Redis

# 6. Run database migrations
php artisan migrate

# 7. (Optional) Seed with sample data
php artisan migrate:fresh --seed

# 8. Start the development server
php artisan serve
# Or use composer dev for concurrent services:
composer dev
```

The API will be available at **http://localhost:8000**

### Local Development Commands

```bash
# Start server + queue + logs concurrently
composer dev

# Run tests
composer test
# Or:
php artisan test

# Run a specific test
php artisan test --filter UserTest

# Code formatting (PSR-12)
./vendor/bin/pint

# Clear caches
php artisan optimize:clear

# Database migrations
php artisan migrate:fresh --seed
```

---

## Project Structure

```
Backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API controllers (Auth, Listing, Order, etc.)
│   │   ├── Middleware/       # Custom middleware (Admin, FlexibleAuth, BasicAuth)
│   │   └── Requests/         # Form request validation classes
│   ├── Models/               # Eloquent models (User, Listing, Order, Shop, etc.)
│   └── Observers/            # Model observers (ListingObserver for image cleanup)
├── config/                   # Configuration files
├── database/
│   ├── migrations/           # Database schema migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories for testing
├── docker/
│   └── nginx/
│       └── default.conf      # Nginx config for standalone Docker
├── public/                   # Public web root
├── routes/
│   └── api.php               # API route definitions
├── tests/
│   ├── Feature/              # Feature tests
│   └── Unit/                 # Unit tests
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # Standalone Docker orchestration
├── .env.docker               # Docker-specific environment config
└── .env.example              # Environment template
```

## API Routes

### Public Routes (No authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive token |
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/{id}` | Get category details |
| GET | `/api/listings` | List all listings |
| GET | `/api/listings/{id}` | Get listing details |

### Protected Routes (Sanctum token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logout` | Logout user |
| GET | `/api/user` | Get current user |
| POST | `/api/listings` | Create listing |
| PUT | `/api/listings/{id}` | Update listing |
| DELETE | `/api/listings/{id}` | Delete listing |
| POST | `/api/listings/{id}/mark-as-sold` | Mark listing as sold |
| POST | `/api/listings/{id}/restock` | Restock listing |
| CRUD | `/api/orders` | Order management |
| CRUD | `/api/reviews` | Review management |
| CRUD | `/api/shop-members` | Shop member management |
| GET | `/api/chats` | List conversations |
| POST | `/api/chats` | Start conversation |
| POST | `/api/chats/{id}/messages` | Send message |
| GET | `/api/saved-items` | List saved items |
| POST | `/api/saved-items` | Save item |
| POST | `/api/saved-items/toggle` | Toggle saved status |
| DELETE | `/api/saved-items/{id}` | Remove saved item |

### Admin Routes (Admin middleware required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/{id}/role` | Update user role |
| POST | `/api/admin/users/{id}/ban` | Ban user |
| POST | `/api/admin/users/{id}/unban` | Unban user |
| POST | `/api/admin/shops/{id}/verify` | Verify shop |
| GET | `/api/admin/reports` | List reports |
| POST | `/api/admin/reports/{id}/resolve` | Resolve report |

## Authentication

All protected endpoints require a Sanctum Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

## License

MIT
