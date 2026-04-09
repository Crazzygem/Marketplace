# Guide: Backend Code Style (PHP/Laravel)

**Purpose**: PHP and Laravel coding standards.

**Imports**: Laravel facades → models → classes. Proper namespaces, explicit imports.

**Formatting**:
- 4-space indentation (PSR-12)
- Laravel Pint enforces: `./vendor/bin/pint`
- PascalCase classes, camelCase methods/variables
- Opening brace on new line
- Single quotes unless interpolation

**Models**:
- Use `HasApiTokens`, `HasFactory`
- Define `$fillable`, `$hidden`, `$casts`
- Define relationships with Eloquent methods

**Controllers**:
- Validate input with `$request->validate()`
- Return JSON responses
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)

**Naming**: PascalCase classes, camelCase methods/variables, UPPER_SNAKE_CASE constants, snake_case tables

**Routing**:
- RESTful routes in `routes/api.php`
- Dot notation for names
- Middleware: `auth:sanctum`
- Route model binding

**Database**: Migrations in `database/migrations/`, foreign keys with `constrained()`

**Reference**: Laravel documentation, PSR-12
