# =============================================================================
# Stage 1: Install Composer dependencies
# =============================================================================
FROM composer:2 AS builder

WORKDIR /app

# Copy composer files first for better layer caching
# composer.lock is optional (not tracked in git)
COPY composer.json* composer.lock* ./

# Install dependencies without dev for production
# --no-scripts skips Laravel post-install hooks (artisan doesn't exist yet)
RUN composer install \
    --no-dev \
    --no-scripts \
    --optimize-autoloader \
    --no-interaction \
    --no-progress \
    --prefer-dist

# =============================================================================
# Stage 2: Production PHP-FPM image
# =============================================================================
FROM php:8.4-fpm-alpine

# Install system dependencies required by Laravel
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    linux-headers

# Install PHP extensions required by Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip



# Install Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Create non-root user for security
RUN addgroup -g 1000 -S appuser \
    && adduser -u 1000 -S appuser -G appuser

# Set working directory
WORKDIR /var/www/html

# Copy application source code
COPY --chown=appuser:appuser . .

# Copy installed vendor dependencies from builder stage
COPY --from=builder --chown=appuser:appuser /app/vendor ./vendor

# Set proper permissions on writable directories
RUN chmod -R 755 storage \
    && chmod -R 755 bootstrap/cache

# Copy entrypoint script for runtime operations
COPY --chown=appuser:appuser entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Run database migrations and seeders at build time
# Note: This requires database to be running, so migrations/seeders will
# fail during build. Run them via entrypoint script or deploy script instead.
# RUN php artisan migrate --force
# RUN php artisan db:seed --force

# Switch to non-root user
USER appuser

# Expose PHP-FPM port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD php-fpm -t 2>/dev/null || exit 1

# Use entrypoint script for runtime setup (migrations, symlinks)
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default command (passed to entrypoint)
CMD ["php-fpm"]
