# Marketplace Platform

A full-stack multi-role e-commerce marketplace platform that enables customers to browse and purchase products, shop owners to manage their stores and inventory, staff to assist with shop operations, and administrators to oversee platform governance.

## Overview

### Tech Stack

- **Frontend**: Angular 20, TypeScript, Bootstrap 5.3.8, Chart.js
- **Backend**: Laravel 12, PHP 8.2, Laravel Sanctum
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Docker Compose, Nginx, Redis

### Key Features

- **Multi-Role System**: Customer, Shop Owner, Staff, Administrator
- **Product Management**: Full CRUD with image uploads and stock tracking
- **Order Processing**: Complete order lifecycle management
- **Real-time Messaging**: Buyer-seller chat system
- **Reviews & Ratings**: Product review system
- **Wishlist**: Save items for later
- **Admin Dashboard**: Platform analytics, user management, moderation

---

## Quick Start (Docker Deployment)

The fastest way to get the platform running is using Docker.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Marketplace-Parent
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env to customize configuration (optional)
nano .env
```

### 3. Deploy

```bash
# Make the script executable (Linux/Mac)
chmod +x deploy.sh

# Full deployment with database seeding
./deploy.sh deploy --seed
```

This will:
- Build all Docker images
- Start all services (frontend, backend, nginx, mysql, redis)
- Run database migrations
- Seed the database with sample data

### 4. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost/api |
| Health Check | http://localhost/health |

### 5. Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@marketplace.com | password |
| Shop Owner | shop@marketplace.com | password |
| Customer | customer@marketplace.com | password |

---

## Development

### Using the Deployment Script

The `deploy.sh` script provides convenient commands for development:

```bash
# View all available commands
./deploy.sh

# Start all containers
./deploy.sh start

# Stop all containers
./deploy.sh stop

# Restart containers
./deploy.sh restart

# View logs
./deploy.sh logs                    # All services
./deploy.sh logs backend            # Specific service
./deploy.sh logs mysql

# Run database migrations
./deploy.sh migrate

# Seed the database
./deploy.sh seed

# Run artisan commands
./deploy.sh artisan migrate:status
./deploy.sh artisan cache:clear

# Access backend shell
./deploy.sh shell

# Check container status
./deploy.sh status

# Clean up (remove all containers, volumes, images)
./deploy.sh clean
```

### Local Development (Backend)

```bash
cd Backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --seed

# Start development server
php artisan serve

# Or use concurrent development
composer dev

# Run tests
php artisan test
```

### Local Development (Frontend)

```bash
cd Frontend

# Install dependencies
npm install

# Configure API URL in src/environments/environment.ts
# apiUrl: 'http://localhost:8000/api'

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Additional Documentation

For more detailed information, see:

- **Backend**: `Backend/README.md` - API documentation and backend setup
- **Frontend**: `Frontend/README.md` - Frontend setup and configuration
- **Technical Docs**: `Documentation/TECHNICAL_README.md` - Architecture and design patterns
- **Docker Guide**: `Documentation/DOCKER_DEPLOYMENT.md` - Detailed Docker deployment guide
