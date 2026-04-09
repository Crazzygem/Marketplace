# Marketplace Frontend

Angular 20 TypeScript SPA for the multi-role marketplace platform. Features include product browsing, shop management, admin dashboard, real-time chat, and more.

## Tech Stack

- **Angular 20** with TypeScript (strict mode)
- **Bootstrap 5.3.8** for UI components
- **FontAwesome 7.1.0** for icons
- **Chart.js + ng2-charts** for dashboard charts
- **RxJS** for reactive programming
- **Angular Signals** for state management

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| npm | >= 10 |

---

## Option 1: Docker Setup (Recommended)

This is the fastest way to get the frontend running. Docker handles Node.js and Nginx automatically.

### Quick Start

```bash
# 1. Clone the repository
git clone <your-frontend-repo-url>
cd Frontend

# 2. Set the backend API URL
export API_URL=http://localhost:8000/api

# 3. Build and start
docker compose up -d --build
```

The app will be available at **http://localhost:4200**

### Custom API URL

The frontend needs to know where the backend API is running. Set it before building:

```bash
# Via environment variable
API_URL=https://api.yourdomain.com/api docker compose up -d --build

# Or create a .env file
echo "API_URL=http://your-backend:8000/api" > .env
docker compose up -d --build
```

### Common Docker Commands

```bash
# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build

# Stop
docker compose down

# Stop and remove image
docker compose down --rmi local
```

### Docker Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (required)
API_URL=http://localhost:8000/api

# Frontend port (optional, default: 4200)
FRONTEND_PORT=4200
```

---

## Option 2: Local Development Setup

### Step-by-Step

```bash
# 1. Clone the repository
git clone <your-frontend-repo-url>
cd Frontend

# 2. Install dependencies
npm install

# 3. Configure the API URL
#    Edit src/environments/environment.ts and set apiUrl to your backend URL
#    Example: apiUrl: 'http://localhost:8000/api'

# 4. Start the development server
npm start
```

The app will be available at **http://localhost:4200** and will auto-reload on file changes.

### Local Development Commands

```bash
# Start dev server
npm start

# Build for production
npm run build

# Build for production (optimized)
npm run build:prod

# Run tests
npm test

# Format code
npx prettier --write "src/**/*.{ts,html,css}"
```

---

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/           # Route guards (auth, admin, shop)
│   │   │   ├── interceptors/     # HTTP interceptors (auth, error)
│   │   │   ├── models/           # TypeScript interfaces
│   │   │   └── services/         # Core services (auth, listing, order, etc.)
│   │   ├── modules/
│   │   │   ├── admin/            # Admin dashboard module
│   │   │   ├── auth/             # Authentication module (login, register)
│   │   │   ├── profile/          # User profile module
│   │   │   ├── public/           # Public pages (home, listing detail)
│   │   │   └── shop/             # Shop management module
│   │   ├── shared/
│   │   │   └── components/       # Shared UI components
│   │   ├── app.config.ts         # Application configuration
│   │   └── app.routes.ts         # Route definitions
│   ├── environments/
│   │   ├── environment.ts        # Dev environment config
│   │   └── environment.production.ts  # Production environment config
│   └── styles.css                # Global styles
├── Dockerfile                    # Multi-stage production build
├── docker-compose.yml            # Standalone Docker orchestration
├── nginx.conf                    # Nginx SPA configuration
├── angular.json                  # Angular CLI configuration
└── package.json                  # Dependencies and scripts
```

## Key Features

- **Public storefront** with product browsing, categories, and search
- **User authentication** with login, registration, and role-based access
- **Shop management** for shop owners (create shop, manage listings, view stats)
- **Admin dashboard** with user management, moderation, and analytics charts
- **Order management** with full CRUD operations
- **Review system** for product ratings and feedback
- **Real-time chat** between buyers and sellers
- **Saved items / wishlist** functionality
- **Responsive design** using Bootstrap 5.3.8

## Environment Configuration

### Development (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  useBasicAuth: false,
};
```

### Production (`src/environments/environment.production.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'REPLACE_WITH_API_URL', // Set via Docker build arg or manual edit
};
```

## Connecting to the Backend

The frontend communicates with the backend API via the `apiUrl` environment variable. Ensure the backend is running and accessible:

| Setup | Default API URL |
|-------|----------------|
| Local dev | `http://127.0.0.1:8000/api` |
| Docker (standalone) | `http://host.docker.internal:8000/api` or your server IP |
| Combined Docker | `http://localhost/api` (via Nginx reverse proxy) |

## License

MIT
