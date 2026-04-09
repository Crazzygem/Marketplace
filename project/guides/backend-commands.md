# Guide: Backend Build & Test Commands

**Purpose**: Common commands for Laravel development and testing.

**Commands**:
```bash
cd Backend

# Setup & Development
composer setup                    # Full setup (install, migrate, seed, build)
composer dev                      # Start server, queue, logs, Vite concurrently

# Testing
composer test                     # Run PHPUnit tests
php artisan test --filter TestName            # Run single test
php artisan test --testsuite=Feature          # Run feature tests
php artisan test --testsuite=Unit             # Run unit tests

# Database
php artisan migrate:fresh          # Fresh database migrations
php artisan migrate:fresh --seed   # Fresh migrations with seeders

# Code Quality
./vendor/bin/pint                 # Format PHP code (PSR-12)
```

**Key Points**:
- Laravel Pint enforces PSR-12 formatting
- Use factories for test data
- SQLite in-memory for testing
- `composer setup` runs complete initialization

**Reference**: Laravel documentation
