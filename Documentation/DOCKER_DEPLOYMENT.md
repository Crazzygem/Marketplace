# Docker Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Deploy Script Reference](#deploy-script-reference)
7. [Common Operations](#common-operations)
8. [Deploying to a Remote Server](#deploying-to-a-remote-server)
9. [SSL / HTTPS Setup](#ssl--https-setup)
10. [Backup & Restore](#backup--restore)
11. [Troubleshooting](#troubleshooting)
12. [File Reference](#file-reference)

---

## Overview

This project uses **Docker containers** for deployment, ensuring consistent behavior across development, staging, and production environments. The entire stack (Frontend, Backend, Database, Reverse Proxy) runs inside Docker containers orchestrated by Docker Compose.

### Why Docker?

| Aspect | SCP (Manual) | Docker (Recommended) |
|--------|-------------|----------------------|
| Server setup time | 2-4 hours | 5 minutes |
| Environment consistency | Not guaranteed | Guaranteed |
| Rollback | Difficult | One command |
| Scaling | Manual | Automated |
| Team onboarding | Complex | `./deploy.sh` |

---

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           Host Machine                   │
                    │                                         │
                    │  ┌───────────────────────────────────┐  │
                    │  │   Nginx Reverse Proxy (:80)        │  │
                    │  │   marketplace-nginx                │  │
                    │  └──────┬──────────────┬──────────────┘  │
                    │         │              │                  │
                    │    /api │              │ / (everything)   │
                    │         ▼              ▼                  │
                    │  ┌────────────┐  ┌───────────────────┐   │
                    │  │ Backend    │  │ Frontend          │   │
                    │  │ PHP-FPM    │  │ Nginx + Angular   │   │
                    │  │ :9000      │  │ :80               │   │
                    │  └─────┬──────┘  └───────────────────┘   │
                    │        │                                 │
                    │        ▼                                 │
                    │  ┌────────────┐  ┌───────────────────┐   │
                    │  │ MySQL 8.0  │  │ Redis 7           │   │
                    │  │ :3306      │  │ :6379             │   │
                    │  └────────────┘  └───────────────────┘   │
                    │                                         │
                    │  Volumes:                                │
                    │  ├── mysql-data      (database)         │
                    │  ├── backend-storage (uploads)           │
                    │  ├── backend-logs    (log files)         │
                    │  └── redis-data      (cache)             │
                    └─────────────────────────────────────────┘
```

### Services

| Service | Image | Internal Port | Host Port | Purpose |
|---------|-------|---------------|-----------|---------|
| `nginx` | nginx:1.27-alpine | 80 | 80 | Reverse proxy |
| `frontend` | Custom (node + nginx) | 80 | - | Angular SPA |
| `backend` | Custom (php:8.2-fpm-alpine) | 9000 | - | Laravel API |
| `mysql` | mysql:8.0 | 3306 | 3306 | Database |
| `redis` | redis:7-alpine | 6379 | 6379 | Cache / Queues |

---

## Prerequisites

### On the target server

1. **Docker Engine** (20.10+) - [Install Guide](https://docs.docker.com/engine/install/)
2. **Docker Compose V2** (included with Docker Desktop / compose plugin)

Verify:
```bash
docker --version        # Docker version 20.10+
docker compose version  # Docker Compose version v2+
```

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Disk | 20 GB | 50 GB |
| OS | Linux (Ubuntu 22.04+) | Ubuntu 24.04 LTS |

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url> marketplace
cd marketplace
```

### 2. Configure environment

```bash
cp .env.example .env
nano .env   # Update passwords and settings
```

### 3. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Access the application

- **Frontend:** http://localhost
- **API:** http://localhost/api
- **Health Check:** http://localhost/health

---

## Configuration

### Root `.env` file

Edit `.env` (copied from `.env.example`) to configure:

```bash
# Application
APP_NAME=Marketplace
APP_ENV=production
APP_DEBUG=false
APP_URL=http://yourdomain.com

# Database credentials
DB_DATABASE=marketplace
DB_USERNAME=marketplace
DB_PASSWORD=change_this_to_a_strong_password
MYSQL_ROOT_PASSWORD=change_this_to_a_strong_root_password

# Host ports (change if ports conflict)
NGINX_PORT=80
MYSQL_PORT=3306
REDIS_PORT=6379

# Docker
COMPOSE_PROJECT_NAME=marketplace
```

### Backend `.env.docker`

Located at `Backend/.env.docker`, this is the Laravel environment file used inside the container. It defaults to connecting to Docker services:

```bash
DB_HOST=mysql       # Docker service name
DB_PORT=3306
DB_DATABASE=marketplace
REDIS_HOST=redis    # Docker service name
```

These values are automatically overridden by the `environment` section in `docker-compose.yml`.

### Frontend API URL

The Frontend production build uses `Frontend/src/environments/environment.production.ts`. Before building, update the `apiUrl`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://yourdomain.com/api'
};
```

---

## Deploy Script Reference

The `deploy.sh` script automates all common operations:

```bash
./deploy.sh <command> [options]
```

| Command | Description |
|---------|-------------|
| `deploy` | Full deployment: build images, start containers, run migrations |
| `deploy --seed` | Full deployment + seed database with sample data |
| `start` | Start all containers |
| `stop` | Stop all containers |
| `restart` | Restart all containers |
| `build` | Rebuild Docker images |
| `migrate` | Run database migrations |
| `seed` | Seed the database |
| `artisan <cmd>` | Run any Laravel artisan command |
| `shell` | Open a shell in the backend container |
| `status` | Show container status and URLs |
| `logs [service]` | View container logs (optional: frontend, backend, mysql, nginx, redis) |
| `clean` | Remove all containers, volumes, and images |

### Examples

```bash
# Full fresh deployment
./deploy.sh

# Deploy with sample data
./deploy.sh --seed

# View backend logs
./deploy.sh logs backend

# Run a specific migration
./deploy.sh artisan migrate:status

# Access backend shell
./deploy.sh shell

# Stop everything
./deploy.sh stop
```

---

## Common Operations

### Update the application

```bash
git pull
./deploy.sh build
./deploy.sh start
./deploy.sh migrate
```

### View logs

```bash
# All services
./deploy.sh logs

# Specific service
./deploy.sh logs backend
./deploy.sh logs frontend
./deploy.sh logs mysql
./deploy.sh logs nginx
```

### Database operations

```bash
# Run migrations
./deploy.sh migrate

# Fresh database (WARNING: deletes all data)
./deploy.sh artisan migrate:fresh --seed

# Check migration status
./deploy.sh artisan migrate:status

# Open MySQL shell
docker compose exec mysql mysql -u marketplace -p
```

### Backend artisan commands

```bash
# Clear all caches
./deploy.sh artisan config:clear
./deploy.sh artisan route:clear
./deploy.sh artisan view:clear
./deploy.sh artisan cache:clear

# Cache for performance
./deploy.sh artisan config:cache
./deploy.sh artisan route:cache

# Create storage link
./deploy.sh artisan storage:link

# Tinker (interactive REPL)
docker compose exec backend php artisan tinker
```

### Restart a single service

```bash
docker compose restart backend
docker compose restart nginx
docker compose restart mysql
```

---

## Deploying to a Remote Server

### Option A: Clone and deploy on the server

```bash
# SSH into your server
ssh user@your-server

# Install Docker (if not already)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone the repository
git clone <repository-url> marketplace
cd marketplace

# Configure and deploy
cp .env.example .env
nano .env              # Update with production values
chmod +x deploy.sh
./deploy.sh
```

### Option B: Transfer pre-built images

```bash
# On your local machine - build images
docker compose build

# Save images to tar files
docker save marketplace-frontend -o frontend.tar
docker save marketplace-backend -o backend.tar

# Transfer to server
scp frontend.tar backend.tar docker-compose.yml .env user@server:/opt/marketplace/
scp -r nginx/ user@server:/opt/marketplace/

# On the server
cd /opt/marketplace
docker load -i frontend.tar
docker load -i backend.tar
docker compose up -d
```

### Option C: Docker Registry (best for teams)

```bash
# Build and push
docker compose build
docker tag marketplace-frontend your-registry/marketplace-frontend:v1.0
docker tag marketplace-backend your-registry/marketplace-backend:v1.0
docker push your-registry/marketplace-frontend:v1.0
docker push your-registry/marketplace-backend:v1.0

# On the server - update docker-compose.yml to use registry images
# image: your-registry/marketplace-frontend:v1.0
docker compose pull
docker compose up -d
```

---

## SSL / HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install certbot on the host
sudo apt install certbot

# Generate certificate (stop nginx first)
./deploy.sh stop
sudo certbot certonly --standalone -d yourdomain.com
./deploy.sh start

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
```

Then update `nginx/nginx.conf` to add an HTTPS server block:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # ... same location blocks as the HTTP server
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Mount the SSL directory in `docker-compose.yml`:

```yaml
nginx:
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl:ro
```

### Auto-renewal

```bash
# Add to crontab
echo "0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/*.pem /opt/marketplace/nginx/ssl/ && docker compose restart nginx" | crontab -
```

---

## Backup & Restore

### Backup

```bash
# Backup database
docker compose exec -T mysql mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" marketplace > backup_$(date +%Y%m%d).sql

# Backup uploaded files
docker run --rm -v marketplace-backend-storage:/data -v $(pwd):/backup alpine tar czf /backup/uploads_$(date +%Y%m%d).tar.gz -C /data .
```

### Restore

```bash
# Restore database
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD}" marketplace < backup_20260401.sql

# Restore uploaded files
docker run --rm -v marketplace-backend-storage:/data -v $(pwd):/backup alpine tar xzf /backup/uploads_20260401.tar.gz -C /data
```

### Automated daily backups

Add to crontab (`crontab -e`):

```cron
# Daily backup at 2 AM
0 2 * * * cd /opt/marketplace && docker compose exec -T mysql mysqldump -u root -p"YOUR_ROOT_PASSWORD" marketplace > /backups/db_$(date +\%Y\%m\%d).sql
0 2 * * * find /backups -name "db_*.sql" -mtime +7 -delete
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
./deploy.sh logs <service-name>

# Check container status
docker compose ps -a

# Restart specific service
docker compose restart <service-name>
```

### Port already in use

```bash
# Find what's using port 80
sudo lsof -i :80

# Change port in .env
NGINX_PORT=8080
```

### MySQL connection refused

```bash
# Check MySQL is healthy
docker compose ps mysql

# Wait longer for MySQL to start
# MySQL can take 30+ seconds on first run

# Test connection
docker compose exec backend php artisan tinker
>>> DB::connection()->getPdo();
```

### Permission denied on storage

```bash
docker compose exec backend chmod -R 755 storage bootstrap/cache
```

### Frontend shows 404

```bash
# Check frontend container
docker compose logs frontend

# Rebuild frontend
docker compose build frontend
docker compose up -d frontend
```

### Clean slate (nuclear option)

```bash
./deploy.sh clean
./deploy.sh
```

---

## File Reference

### Files created for Docker deployment

```
marketplace/
├── .env.example                    # Environment template (copy to .env)
├── docker-compose.yml              # Docker Compose orchestration
├── deploy.sh                       # Deployment automation script
├── nginx/
│   └── nginx.conf                  # Reverse proxy configuration
├── Frontend/
│   ├── Dockerfile                  # Multi-stage Angular build
│   ├── nginx.conf                  # Frontend Nginx server block
│   └── .dockerignore               # Exclude files from build context
├── Backend/
│   ├── Dockerfile                  # Multi-stage PHP-FPM build
│   ├── .env.docker                 # Laravel env for Docker container
│   └── .dockerignore               # Exclude files from build context
└── Documentation/
    └── DOCKER_DEPLOYMENT.md        # This file
```

### Volume mapping

| Volume | Container Mount | Purpose |
|--------|----------------|---------|
| `marketplace-mysql-data` | `/var/lib/mysql` | Database persistence |
| `marketplace-backend-storage` | `/var/www/html/storage/app` | Uploaded files |
| `marketplace-backend-logs` | `/var/www/html/storage/logs` | Laravel logs |
| `marketplace-redis-data` | `/data` | Redis persistence |

### Network

All services communicate over the `marketplace-network` bridge network. Services reference each other by container name (e.g., `mysql`, `redis`, `backend`, `frontend`).
