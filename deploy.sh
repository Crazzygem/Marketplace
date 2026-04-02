#!/usr/bin/env bash
# =============================================================================
# Marketplace Platform - Docker Deployment Script
# =============================================================================
# Usage:
#   ./deploy.sh              Full deployment (build, start, migrate)
#   ./deploy.sh --seed       Full deployment with database seeding
#   ./deploy.sh start        Start containers
#   ./deploy.sh stop         Stop containers
#   ./deploy.sh restart      Restart containers
#   ./deploy.sh logs [svc]   View logs (optional service name)
#   ./deploy.sh build        Rebuild images
#   ./deploy.sh migrate      Run database migrations
#   ./deploy.sh seed         Seed database
#   ./deploy.sh artisan      Run artisan command
#   ./deploy.sh shell        Access backend shell
#   ./deploy.sh status       Show container status
#   ./deploy.sh clean        Remove all containers, volumes, images
# =============================================================================

set -euo pipefail

# -------------------------------------------------------------------------
# Colors
# -------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# -------------------------------------------------------------------------
# Helper functions
# -------------------------------------------------------------------------
info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

separator() {
    echo ""
    echo "=============================================="
}

# -------------------------------------------------------------------------
# Pre-flight checks
# -------------------------------------------------------------------------
check_prerequisites() {
    info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Install it first: https://docs.docker.com/get-docker/"
        exit 1
    fi
    success "Docker is installed ($(docker --version))"

    if ! docker compose version &> /dev/null; then
        error "Docker Compose V2 is not available. Update Docker or install compose plugin."
        exit 1
    fi
    success "Docker Compose is available"

    if [ ! -f docker-compose.yml ]; then
        error "docker-compose.yml not found. Run this script from the project root."
        exit 1
    fi
    success "docker-compose.yml found"
}

# -------------------------------------------------------------------------
# Environment setup
# -------------------------------------------------------------------------
setup_env() {
    if [ ! -f .env ]; then
        warn ".env file not found. Creating from .env.example..."
        cp .env.example .env
        warn "Review and update .env before deploying. Then run: ./deploy.sh"
        exit 0
    fi
    success ".env file found"

    # Export variables for docker-compose
    set -a
    source .env
    set +a
}

# -------------------------------------------------------------------------
# Core operations
# -------------------------------------------------------------------------
do_build() {
    info "Building Docker images..."
    docker compose build
    success "Docker images built"
}

do_start() {
    info "Starting containers..."
    docker compose up -d
    success "Containers started"
}

do_stop() {
    info "Stopping containers..."
    docker compose down
    success "Containers stopped"
}

do_restart() {
    info "Restarting containers..."
    docker compose restart
    success "Containers restarted"
}

do_logs() {
    local service="${1:-}"
    if [ -n "$service" ]; then
        docker compose logs -f "$service"
    else
        docker compose logs -f
    fi
}

do_wait_for_mysql() {
    info "Waiting for MySQL to be ready..."
    local max_attempts=30
    local attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if docker compose exec -T mysql mysqladmin ping -h localhost \
            -u root -p"${MYSQL_ROOT_PASSWORD:-root_secret}" &> /dev/null; then
            success "MySQL is ready"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    echo ""
    error "MySQL did not become ready in time"
    return 1
}

do_setup_backend() {
    info "Setting up Laravel backend..."

    # Copy .env.docker into the container if no .env exists there
    docker compose exec -T backend test -f .env 2>/dev/null || {
        info "Copying .env.docker to backend container..."
        docker compose exec -T backend cp .env.docker .env
    }

    # Generate application key
    info "Generating application key..."
    docker compose exec -T backend php artisan key:generate --force

    # Run migrations
    info "Running database migrations..."
    docker compose exec -T backend php artisan migrate --force

    # Create storage symlink
    info "Creating storage symlink..."
    docker compose exec -T backend php artisan storage:link 2>/dev/null || true

    # Cache config for performance
    info "Caching configuration..."
    docker compose exec -T backend php artisan config:cache
    docker compose exec -T backend php artisan route:cache
    docker compose exec -T backend php artisan view:cache

    success "Backend setup complete"
}

do_seed() {
    info "Seeding database..."
    docker compose exec -T backend php artisan db:seed --force
    success "Database seeded"
}

do_migrate() {
    info "Running database migrations..."
    docker compose exec -T backend php artisan migrate --force
    success "Migrations complete"
}

do_artisan() {
    local cmd="${*:-}"
    if [ -z "$cmd" ]; then
        error "Provide an artisan command. Example: ./deploy.sh artisan migrate:status"
        exit 1
    fi
    docker compose exec -T backend php artisan "$cmd"
}

do_shell() {
    info "Opening backend shell..."
    docker compose exec backend sh
}

do_status() {
    separator
    echo "  Marketplace Platform - Container Status"
    separator
    docker compose ps
    echo ""
    info "Application URLs:"
    echo "  Frontend:  http://localhost:${NGINX_PORT:-80}"
    echo "  API:       http://localhost:${NGINX_PORT:-80}/api"
    echo "  Health:    http://localhost:${NGINX_PORT:-80}/health"
    echo ""
}

do_clean() {
    warn "This will remove ALL containers, volumes, and images for this project."
    read -rp "Are you sure? [y/N] " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        info "Removing everything..."
        docker compose down -v --rmi local --remove-orphans
        success "Cleanup complete"
    else
        info "Cancelled"
    fi
}

# -------------------------------------------------------------------------
# Full deployment
# -------------------------------------------------------------------------
do_deploy() {
    local seed="${1:-}"

    separator
    echo "  Marketplace Platform - Docker Deployment"
    separator
    echo ""

    check_prerequisites
    setup_env

    # Build and start
    do_build
    do_start

    # Wait for database
    do_wait_for_mysql

    # Setup backend (key, migrate, cache)
    do_setup_backend

    # Seed if requested
    if [ "$seed" = "--seed" ]; then
        do_seed
    fi

    # Show status
    echo ""
    do_status

    success "Deployment complete!"
}

# -------------------------------------------------------------------------
# Main entry point
# -------------------------------------------------------------------------
case "${1:-deploy}" in
    deploy)
        do_deploy "${2:-}"
        ;;
    start)
        check_prerequisites && setup_env && do_start && do_status
        ;;
    stop)
        do_stop
        ;;
    restart)
        check_prerequisites && setup_env && do_restart
        ;;
    logs)
        do_logs "${2:-}"
        ;;
    build)
        do_build
        ;;
    migrate)
        check_prerequisites && setup_env && do_migrate
        ;;
    seed)
        check_prerequisites && setup_env && do_seed
        ;;
    artisan)
        check_prerequisites && setup_env && do_artisan "${@:2}"
        ;;
    shell)
        do_shell
        ;;
    status)
        do_status
        ;;
    clean)
        do_clean
        ;;
    *)
        echo "Marketplace Platform - Docker Deployment Tool"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  deploy            Full deployment (build, start, migrate)"
        echo "  deploy --seed     Full deployment with database seeding"
        echo "  start             Start all containers"
        echo "  stop              Stop all containers"
        echo "  restart           Restart all containers"
        echo "  logs [service]    View logs (optional: frontend, backend, mysql, nginx, redis)"
        echo "  build             Rebuild Docker images"
        echo "  migrate           Run database migrations"
        echo "  seed              Seed the database"
        echo "  artisan <cmd>     Run artisan command in backend container"
        echo "  shell             Open a shell in the backend container"
        echo "  status            Show container status and URLs"
        echo "  clean             Remove all containers, volumes, and images"
        ;;
esac
