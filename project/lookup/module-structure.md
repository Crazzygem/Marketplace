# Lookup: Module Structure

**Frontend Structure**:
```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces
│   ├── services/        # API services (auth, listing, shop, etc.)
│   ├── guards/          # Route guards (admin, shop)
│   └── interceptors/    # HTTP interceptors (auth)
├── modules/
│   ├── public/          # Public pages (checkout, saved-items)
│   ├── user-profile/    # User profile page
│   ├── shop/            # Shop owner pages (dashboard, products, settings)
│   └── admin/           # Admin pages (dashboard, settings, users, moderation)
└── shared/
    ├── components/      # Shared components (listing-card, avatar, badge, alert)
    └── navigation/      # Navigation components (sidebar)
```

**Backend Structure**:
```
app/
├── Models/              # Eloquent models
├── Http/
│   ├── Controllers/     # API controllers
│   ├── Middleware/      # Middleware (auth, admin, shop)
│   └── Requests/        # Form request validation
├── Services/            # Business logic services
└── Services/
database/
├── migrations/          # Database migrations
└── seeders/             # Seed data
tests/
├── Feature/             # Feature tests
└── Unit/                # Unit tests
```

**Reference**: See `AGENTS.md` for detailed structure
