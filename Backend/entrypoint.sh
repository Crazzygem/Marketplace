#!/bin/sh

# Container Entrypoint - Runtime setup and migrations
# Handles storage, permissions, and database operations

set -e

# Storage symlink (runtime, not build-time)
# Remove existing file/directory if it's not a symlink to prevent conflicts
if [ -e public/storage ] && [ ! -L public/storage ]; then
    rm -rf public/storage
    echo "Removed existing public/storage (was a file or directory, not a symlink)"
fi

if [ ! -L public/storage ]; then
  ln -sfn ../storage/app/public public/storage
  echo "Created storage symlink"
fi

# Permissions for writable directories
chown -R appuser:appuser storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
echo "Set permissions on storage and cache"

# Wait for database with retries
MAX_RETRIES=30
RETRY_INTERVAL=2
RETRY_COUNT=0

echo "Waiting for database connection..."
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if php artisan db:show >/dev/null 2>&1; then
    echo "Database connection established"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "Retrying database connection ($RETRY_COUNT/$MAX_RETRIES)..."
  sleep $RETRY_INTERVAL
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Error: Database connection failed after $MAX_RETRIES attempts"
  exit 1
fi

# Run migrations on first start
echo "Running database migrations..."
php artisan migrate --force

echo "Entrypoint completed successfully"
exec "$@"
