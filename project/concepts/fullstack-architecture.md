# Concept: Full-Stack Architecture

**Core Concept**: Full-stack marketplace using Laravel 12 RESTful API backend with Angular 20 TypeScript SPA frontend.

**Key Points**:
- Backend: Laravel 12 (PHP 8.2) with RESTful API architecture
- Frontend: Angular 20 TypeScript with standalone components
- Root directories: `Backend/` and `Frontend/`
- Frontend structure: `core/` (models, services, guards), `modules/` (features), `shared/` (components)
- Backend structure: `app/Models/`, `app/Http/Controllers/`, `app/Http/Middleware/`, `database/migrations/`, `tests/`

**Quick Example**:
```
Marketplace/
├── Backend/          # Laravel API
│   ├── app/Models/   # Eloquent models
│   └── database/     # Migrations
└── Frontend/         # Angular SPA
    ├── src/app/core/     # Services, guards
    ├── src/app/modules/  # Feature modules
    └── src/app/shared/   # Shared components
```

**Reference**: See `AGENTS.md` for complete project structure
