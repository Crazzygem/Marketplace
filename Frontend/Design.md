# Frontend Design System

## Overview

The Marketplace frontend is an Angular 20 TypeScript SPA with a clean, modern design system built on Bootstrap 5.3.8, enhanced with custom semantic design tokens inspired by shadcn/ui principles. The design emphasizes clarity, consistency, and accessibility across all user roles (customers, shop owners, admins, staff).

**Design Philosophy:**
- Semantic color tokens for consistent theming
- Component-driven architecture with reusable UI components
- Signal-based reactive state management
- Mobile-responsive layouts with Bootstrap grid system

---

## Tech Stack

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Angular | 20.3.0 | Framework | ✅ Active |
| Bootstrap | 5.3.8 | CSS framework, grid, utilities | ✅ Active |
| FontAwesome | 7.1.0 | Icon library | ✅ Active |
| Chart.js | 4.5.1 | Data visualization | ⚠️ Installed, not used |
| ng2-charts | 8.0.0 | Chart.js Angular wrapper | ⚠️ Installed, not used |
| TypeScript | 5.9.2 | Type safety | ✅ Active |

**Build System:** `@angular/build:application` (modern Angular builder)

---

## Design Tokens

Design tokens are defined in `src/styles/tokens.css` and override Bootstrap defaults for consistent theming.

### Colors

```css
/* Base */
--background: #ffffff;
--foreground: #09090b;

/* Card */
--card: #ffffff;
--card-foreground: #09090b;

/* Primary (Dark Navy) */
--primary: #0f172a;
--primary-foreground: #fafafa;

/* Secondary */
--secondary: #f4f4f5;
--secondary-foreground: #18181b;

/* Muted */
--muted: #f4f4f5;
--muted-foreground: #71717a;

/* Accent */
--accent: #f4f4f5;
--accent-foreground: #18181b;

/* Destructive */
--destructive: #ef4444;
--destructive-foreground: #fafafa;

/* Border & Input */
--border: #e4e4e7;
--input: #e4e4e7;
--ring: #09090b;
```

### Semantic Status Colors

```css
--success: #22c55e;    /* Green - Available, Delivered */
--warning: #f59e0b;    /* Amber - Inactive, Pending */
--error: #ef4444;      /* Red - Sold, Cancelled, Errors */
--info: #3b82f6;       /* Blue - Shipped, Info alerts */
```

### Chart Colors

```css
--chart-1: #0f172a;  /* Primary navy */
--chart-2: #22c55e;  /* Success green */
--chart-3: #f59e0b;  /* Warning amber */
--chart-4: #3b82f6;  /* Info blue */
--chart-5: #ef4444;  /* Destructive red */
```

### Typography

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Font Size Utilities:**
- `.text-xs` - 0.75rem (12px)
- `.text-sm` - 0.875rem (14px)
- `.text-md` - 1rem (16px)
- `.text-lg` - 1.25rem (20px)
- `.text-xl` - 1.5rem (24px)

### Spacing

```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - badges, small elements */
--radius-md: 0.5rem;    /* 8px - buttons, inputs, cards */
--radius-lg: 0.75rem;   /* 12px - larger containers */
--radius-xl: 1rem;      /* 16px - avatars, modals */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

---

## Component Patterns

### Component Structure

The codebase uses a **hybrid approach** with both standalone and NgModule-based components:

**Standalone Components** (preferred for new/shared components):
```typescript
@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent {
  @Input({ required: true }) listing!: Listing;
  @Output() onSaveToggle = new EventEmitter<Listing>();
}
```

**NgModule-based Components** (legacy modules):
```typescript
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: false, // Important for NgModule
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  // ...
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Component selector | `kebab-case` with `app-` prefix | `app-listing-card` |
| Component class | PascalCase | `ListingCardComponent` |
| CSS classes | `kebab-case` | `.listing-card`, `.card-body` |
| Component files | `component-name.component.ts` | `listing-card.component.ts` |
| Services | PascalCase + `Service` suffix | `AuthService`, `ListingService` |
| Guards | `kebab-case` + `-guard` | `admin-guard.ts`, `shop-guard.ts` |
| Interceptors | `kebab-case` + `-interceptor` | `auth-interceptor.ts` |

### Input/Output Patterns

**Input Properties:**
```typescript
@Input({ required: true }) listing!: Listing;  // Required input
@Input() showSaveButton = true;                 // Optional with default
@Input() variant: BadgeVariant = 'default';     // Typed with default
```

**Output Events:**
```typescript
@Output() onSaveToggle = new EventEmitter<Listing>();
@Output() onRemove = new EventEmitter<number>();
@Output() onView = new EventEmitter<number>();
```

**Event Handler Pattern:**
```typescript
handleSaveToggle(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
  this.onSaveToggle.emit(this.listing);
}
```

### State Management (Signals)

Services use Angular signals for reactive state:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // State Signals
  currentUser = signal<User | null>(this.getUserFromStorage());
  token = signal<string | null>(localStorage.getItem('token'));

  // Computed Values
  isAuthenticated = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.is_admin || false);
  isShopOwner = computed(() => this.currentUser()?.is_shop_owner || false);

  // Update state
  private setSession(authResult: AuthResponse): void {
    this.token.set(authResult.access_token);
    this.currentUser.set(authResult.user);
  }
}
```

**Service Injection Pattern:**
```typescript
// Modern inject() function (preferred)
private authService = inject(AuthService);
private router = inject(Router);

// Traditional constructor injection (legacy)
constructor(private authService: AuthService) {}
```

---

## Styling Guidelines

### CSS Conventions

1. **Component-scoped styles** in `styleUrls` array
2. **Global styles** in `src/styles.css` (imports `tokens.css`)
3. **Semantic class names** using design token prefixes

```css
/* Component-specific */
.listing-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}
```

### Bootstrap Usage

**Utility Classes (preferred):**
```html
<div class="d-flex justify-content-between align-items-center">
  <h5 class="text-primary mb-0">${{ listing.price }}</h5>
  <small class="text-muted">Seller name</small>
</div>
```

**Grid System:**
```html
<div class="container-fluid">
  <div class="row">
    <div class="col-md-3 col-lg-2 px-0">Sidebar</div>
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">Content</main>
  </div>
</div>
```

**Custom Bootstrap Overrides** (in `tokens.css`):
```css
.btn-primary {
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  color: var(--primary-foreground) !important;
}

.alert-success {
  background-color: rgba(34, 197, 94, 0.1) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
}
```

### Custom Styles

**Global Custom Classes:**
- `.card-semantic` - Card with semantic colors
- `.text-foreground`, `.text-muted-foreground` - Text colors
- `.bg-success-semantic`, `.bg-warning-semantic` - Background colors
- `.border-semantic` - Border using design tokens
- `.btn-semantic-primary` - Button variants
- `.avatar`, `.avatar-sm`, `.avatar-md`, `.avatar-lg`, `.avatar-xl` - Avatar sizes
- `.skeleton` - Loading skeleton animation
- `.empty-state` - Empty state container

---

## Module Designs

### Admin Module

**Location:** `src/app/modules/admin/`

**Components (All Implemented ✅):**

| Component | Pattern | Status |
|-----------|---------|--------|
| `AdminDashboardComponent` | NgModule | ✅ Implemented - Dashboard stats with charts (line, bar) |
| `UserManagementComponent` | Standalone | ✅ Implemented - User list, ban/unban, role management with signals |
| `ModerationComponent` | Standalone | ✅ Implemented - Content moderation queue |
| `SettingsComponent` | Standalone | ✅ Implemented - Admin settings with tabs (categories, users, moderation) |
| `StaffManagementComponent` | Standalone | ✅ Implemented - Staff user management table, assign/remove staff role, ban/unban |

**Design Patterns:**
- Dashboard with Chart.js integration (sales, revenue, top items)
- Table layout with search, filter, pagination
- Action buttons with confirmation alerts
- Skeleton loading states
- Responsive design with Bootstrap grid

### Authentication Module

**Location:** `src/app/modules/auth/`

**Components (All Implemented ✅):**

| Component | Pattern | Status |
|-----------|---------|--------|
| `LoginComponent` | Standalone | ✅ Implemented - Email/password form, role-based redirect, validation with computed signals |
| `RegisterComponent` | Standalone | ✅ Implemented - Registration with password strength indicator, terms checkbox, role selection |

**Design Patterns:**
- Reactive forms with signal-based validation
- Password visibility toggle
- Password strength indicator (weak/medium/strong)
- Role-based redirect after login (admin → `/admin/dashboard`, shop owner → `/shop/dashboard`, customer → `/public/home`)
- Error handling with AlertComponent
- Loading states with spinner
- Responsive design (mobile-first)

### Public Module

**Location:** `src/app/modules/public/`

**Components (All Implemented ✅):**

| Component | Pattern | Status |
|-----------|---------|--------|
| `HomeComponent` | Standalone | ✅ Implemented - Featured listings grid, search, category filters, uses ListingCardComponent |
| `ProductDetailComponent` | Standalone | ✅ Implemented - Product image gallery, seller info, save/unsave, contact seller |
| `CategoriesComponent` | Standalone | ✅ Implemented - Category grid with FontAwesome icons, item count, click-to-filter |
| `SavedItemsComponent` | Standalone | ✅ Implemented - User's saved listings |
| `CheckoutComponent` | Standalone | ✅ Implemented - Checkout flow |

**Design Patterns:**
- Grid layout for product cards (`.row` + `.col-*`)
- Search bar with filter dropdowns
- Pagination controls
- Category icons with FontAwesome
- Shared ListingCardComponent for consistency
- Image gallery with thumbnails
- Seller information cards

### Shop Module

**Location:** `src/app/modules/shop/`

**Components (All Implemented ✅):**

| Component | Pattern | Status |
|-----------|---------|--------|
| `ShopDashboardComponent` | Standalone | ✅ Implemented - Shop owner dashboard with stats, charts (sales, revenue, top items), signal-based state |
| `ProductManagementComponent` | Standalone | ✅ Implemented - Create/edit listings |
| `ShopCreateComponent` | Standalone | ✅ Implemented - Create new shop |
| `ShopSettingsComponent` | Standalone | ✅ Implemented - Shop settings, listings table |

**Design Patterns:**
- Dashboard with Chart.js integration (design token colors)
- Form with image upload preview
- Product table with status badges
- Tab-based navigation for settings
- Inline edit actions
- Signal-based reactive state
- Computed signals for derived values

### User Profile

**Location:** `src/app/modules/user-profile/`

**Component:** `UserProfileComponent`

**Design Patterns:**
- Tab-based navigation (Overview, Personal Info, Security)
- Avatar display with user initials fallback
- Order history table
- Inline name editing
- Password change form

**Tabs Configuration:**
```typescript
tabs: TabItem[] = [
  { value: 'overview', label: 'Overview', icon: 'fa-home' },
  { value: 'personal', label: 'Personal Info', icon: 'fa-user' },
  { value: 'security', label: 'Security', icon: 'fa-shield-alt' },
];
```

---

## Implementation Status

**Last Updated:** April 24, 2026

### Overview

All 11 documented components have been implemented and are production-ready.

**Implementation Summary:**
- **Admin Module:** 5 components (1 NgModule, 4 Standalone)
- **Auth Module:** 2 components (both Standalone)
- **Public Module:** 5 components (all Standalone)
- **Shop Module:** 4 components (all Standalone)

### Consistent Patterns

All newly implemented/updated components follow these patterns:

| Pattern | Usage |
|---------|-------|
| `standalone: true` | All components except AdminDashboardComponent (NgModule for charts) |
| `inject()` for DI | All components |
| Signals for state | All components (`signal<T>()`, `computed<T>()`) |
| `templateUrl` | All components (no inline templates) |
| `styleUrls: [...]` | All components (array format) |
| `app-` selector prefix | All components |
| Bootstrap 5.3.8 | All components |
| Design tokens | All components (via `tokens.css`) |

### Component Inventory

| Component | Module | Pattern | Key Features |
|-----------|--------|---------|--------------|
| AdminDashboardComponent | admin | NgModule | Charts (line, bar), stats cards, design token colors |
| UserManagementComponent | admin | Standalone | User table, ban/unban, role management, signals |
| ModerationComponent | admin | Standalone | Content queue, resolve actions |
| SettingsComponent | admin | Standalone | Tab-based settings, categories/users/moderation |
| StaffManagementComponent | admin | Standalone | Staff table, assign/remove role, ban/unban |
| LoginComponent | auth | Standalone | Form validation, computed signals, role redirect |
| RegisterComponent | auth | Standalone | Password strength, terms checkbox, role selection |
| HomeComponent | public | Standalone | Featured listings, search, filters, ListingCardComponent |
| ProductDetailComponent | public | Standalone | Image gallery, seller info, save/unsave |
| CategoriesComponent | public | Standalone | Category grid, icons, item count |
| ShopDashboardComponent | shop | Standalone | Stats, charts, signal-based state, effect() |

### Exceptions

- **AdminDashboardComponent** uses `standalone: false` (NgModule) for Chart.js compatibility with `ng2-charts` providers
- **UserManagementComponent** was updated to standalone pattern during implementation

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | April 2026 | All 11 components implemented; Design.md updated to reflect reality |
| 1.0 | Initial | Initial design system documentation |

---

## Shared Components

Located in `src/app/shared/components/`

| Component | Selector | Description |
|-----------|----------|-------------|
| `AlertComponent` | `<app-alert>` | Status alerts (success, danger, warning, info) |
| `AvatarComponent` | `<app-avatar>` | User avatar with initials fallback |
| `BadgeComponent` | `<app-badge>` | Status badges with variants |
| `EmptyStateComponent` | `<app-empty-state>` | Empty state placeholder |
| `IconPickerComponent` | `<app-icon-picker>` | FontAwesome icon selector |
| `ListingCardComponent` | `<app-listing-card>` | Product card for grids |
| `NavbarComponent` | `<app-navbar>` | Top navigation bar |
| `SidebarComponent` | `<app-sidebar>` | Side navigation menu |
| `SkeletonComponent` | `<app-skeleton>` | Loading skeleton |
| `TabsComponent` | `<app-tabs>` | Tab navigation |
| `ToastComponent` | `<app-toast>` | Toast notifications |

### Alert Component

```typescript
export type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() showIcon: boolean = true;
}
```

**Usage:**
```html
<app-alert 
  variant="success" 
  title="Success!" 
  description="Your changes have been saved.">
</app-alert>
```

### Badge Component

```typescript
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() variant: BadgeVariant = 'default';
  @Input() dot: boolean = false;
}
```

**Usage:**
```html
<app-badge variant="success" text="Available"></app-badge>
<app-badge variant="destructive" text="SOLD" [dot]="true"></app-badge>
```

### Listing Card Component

```typescript
@Component({
  selector: 'app-listing-card',
  standalone: true,
  templateUrl: './listing-card.component.html',
})
export class ListingCardComponent {
  @Input({ required: true }) listing!: Listing;
  @Input() showSaveButton = true;
  @Output() onSaveToggle = new EventEmitter<Listing>();
}
```

---

## Advanced Patterns

### CUSTOM_ELEMENTS_SCHEMA Usage

**When to Use:** Required when using custom web components or third-party components that aren't recognized by Angular's compiler.

**Example from `ShopSettingsComponent`:**
```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-settings.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allows custom elements
})
export class ShopSettingsComponent {
  // Component logic
}
```

**Key Considerations:**
- Use sparingly - only when necessary
- Disables Angular's template type checking for custom elements
- Common for Bootstrap web components or custom element libraries

---

### localStorage Cross-Component Communication

**When to Use:** For simple cross-component state synchronization without a centralized state management solution.

**Example from `ShopSettingsComponent` (lines 376-388):**
```typescript
// Set flag after updating a listing
this.http.put(`/api/listings/${listingId}`, formData).subscribe({
  next: () => {
    localStorage.setItem('listingUpdated', 'true');
    this.notificationService.success('Listing updated successfully');
  }
});
```

**Example from `ProductManagementComponent` (lines 267, 302, 373):**
```typescript
// Check flag on component init
ngOnInit() {
  const updated = localStorage.getItem('listingUpdated');
  if (updated === 'true') {
    this.loadProducts(); // Refresh data
    localStorage.removeItem('listingUpdated'); // Clear flag
  }
}
```

**Key Considerations:**
- Simple but effective for basic sync
- Remember to clear flags after consumption
- Not suitable for complex state - use signals or services instead
- String-only storage - serialize objects with `JSON.stringify()`

---

### effect() Pattern for Reactive State Synchronization

**When to Use:** Automatically sync derived state or trigger side effects when signals change.

**Example from `CheckoutComponent` (lines 66-69):**
```typescript
import { effect } from '@angular/core';

export class CheckoutComponent {
  cartTotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.price, 0));
  
  constructor() {
    // Auto-log when cart total changes
    effect(() => {
      console.log('Cart total updated:', this.cartTotal());
    });
  }
}
```

**Example from `SavedItemsComponent` (lines 28-31):**
```typescript
export class SavedItemsComponent {
  savedCount = computed(() => this.savedItems().length);
  
  constructor() {
    // Update badge count whenever saved items change
    effect(() => {
      this.updateBadgeCount(this.savedCount());
    });
  }
}
```

**Key Considerations:**
- Effects run automatically when dependencies change
- Don't return values from effects - they're for side effects only
- Avoid infinite loops - don't modify signals that the effect depends on
- Clean up manually if needed with `effectRef.destroy()`

---

### Image Upload FormData Handling

**When to Use:** For uploading files (images, documents) along with other form data.

**Example from `ProductManagementComponent` (lines 198-268):**
```typescript
onSubmit() {
  const formData = new FormData();
  
  // Append text fields
  formData.append('title', this.productData.title);
  formData.append('description', this.productData.description);
  formData.append('price', this.productData.price.toString());
  formData.append('stock_quantity', this.productData.stock_quantity.toString());
  formData.append('category_id', this.productData.category_id!.toString());
  formData.append('shop_id', this.productData.shop_id!.toString());
  formData.append('status', this.productData.status);
  
  // Append existing image paths (if keeping existing images)
  this.existingImagePaths.forEach(path => {
    formData.append('existing_images[]', path);
  });
  
  // Append new image files
  this.selectedFiles.forEach(file => {
    formData.append('images[]', file);
  });
  
  // Send with correct Content-Type (browser sets it automatically with boundary)
  this.http.post('/api/listings', formData).subscribe({
    next: (response) => {
      this.notificationService.success('Product created successfully');
    },
    error: (error) => {
      this.notificationService.error('Failed to create product');
    }
  });
}
```

**Key Considerations:**
- Don't set `Content-Type` header manually - browser sets it with boundary
- Use `append()` for multiple files with same field name (`images[]`)
- Convert numbers to strings before appending
- Handle both new files and existing image paths
- Show preview URLs for UX before upload

---

### Router Event Subscription for Auto-Refresh

**When to Use:** Refresh component data when navigating back to a route or when query params change.

**Example from `ShopSettingsComponent` (lines 99-103):**
```typescript
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export class ShopSettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Refresh data when navigation ends and we're on this route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => this.router.url.includes('/shop/settings'))
    ).subscribe(() => {
      this.loadShopData();
    });
    
    // Or refresh when query params change
    this.route.queryParams.subscribe(params => {
      if (params['refresh']) {
        this.loadShopData();
      }
    });
  }
}
```

**Key Considerations:**
- Unsubscribe on destroy to prevent memory leaks
- Use `filter()` to narrow down to relevant events
- Consider using `ActivatedRoute` param/paramMap subscriptions instead
- Useful for back-button navigation scenarios

---

## Responsive Design

### Breakpoints (Bootstrap 5)

| Breakpoint | Width | Class Prefix |
|------------|-------|--------------|
| xs | < 768px | (none) |
| sm | ≥ 768px | `sm-` |
| md | ≥ 992px | `md-` |
| lg | ≥ 1200px | `lg-` |
| xl | ≥ 1400px | `xl-` |

### Layout Approach

**Desktop-First with Mobile Fallback:**
```css
/* Desktop sidebar (default) */
.sidebar {
  position: fixed;
  width: 250px;
}

/* Hide sidebar on mobile */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .main-content {
    padding-left: 0;
    padding-right: 0;
  }
}
```

**Responsive Grid:**
```html
<!-- 1 col mobile, 2 col tablet, 4 col desktop -->
<div class="row">
  <div class="col-12 col-sm-6 col-lg-3" *ngFor="let listing of listings">
    <app-listing-card [listing]="listing"></app-listing-card>
  </div>
</div>
```

### Mobile-Specific Patterns

- Navbar collapses to hamburger menu on mobile
- Sidebar hidden on mobile (`.d-none d-md-block`)
- Full-width cards on mobile
- Stacked form inputs on small screens
- Touch-friendly button sizes (min 44px height)

---

## Accessibility

### ARIA Attributes

**Badge Component:**
```html
<span class="badge" role="status" aria-label="Badge: {{ text }}">
  {{ text }}
</span>
```

**Alert Component:**
```html
<div class="alert" role="alert">
  <!-- Alert content -->
</div>
```

### Keyboard Navigation

- All interactive elements focusable
- Focus ring utility: `.focus-ring:focus-visible`
- Custom focus styles using `--ring` token

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 0.25rem rgba(15, 23, 42, 0.1);
}
```

### Screen Reader Considerations

- Semantic HTML elements (`<main>`, `<nav>`, `<footer>`)
- Alt text on images
- Icon buttons with `aria-label`
- Status conveyed through text, not just color

---

## Icons (FontAwesome)

### Usage Pattern

```html
<i class="fas fa-home"></i>
<i class="fas fa-shopping-bag"></i>
<i class="fas fa-exclamation-circle"></i>
```

### Common Icons by Category

| Category | Icons |
|----------|-------|
| Navigation | `fa-home`, `fa-tags`, `fa-heart`, `fa-store` |
| Actions | `fa-edit`, `fa-trash`, `fa-plus`, `fa-save` |
| Status | `fa-check-circle`, `fa-exclamation-triangle`, `fa-info-circle` |
| User | `fa-user`, `fa-users`, `fa-sign-out-alt` |
| Commerce | `fa-shopping-cart`, `fa-dollar-sign`, `fa-box` |

### Category Icon Service

```typescript
@Injectable({ providedIn: 'root' })
export class CategoryIconService {
  private categoryIcons: Record<string, string> = {
    'electronics': 'fa-laptop',
    'clothing': 'fa-tshirt',
    'home': 'fa-couch',
    // ...
  };

  getIcon(categoryName: string): string {
    return this.categoryIcons[categoryName] || 'fa-tag';
  }
}
```

---

## Charts (Chart.js)

**Status:** ✅ **Implemented** - Chart.js and ng2-charts are integrated in AdminDashboardComponent and ShopDashboardComponent.

**Installed Packages:**
- `chart.js` 4.5.1
- `ng2-charts` 8.0.0

**Implementation Pattern:**

```typescript
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Line Chart (Sales Trends)
public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: [], // Populated from API
  datasets: [{
    data: [],
    label: 'Sales',
    backgroundColor: 'rgba(59, 66, 104, 0.2)', // Design token: --color-primary
    borderColor: 'rgba(59, 66, 104, 1)',
    fill: 'origin',
  }],
};

public lineChartOptions: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  maintainAspectRatio: true,
};
```

**Implemented Use Cases:**
- ✅ Admin dashboard analytics (AdminDashboardComponent)
  - User growth (line chart)
  - Revenue trends (bar chart)
  - Top categories (bar chart)
- ✅ Shop owner statistics (ShopDashboardComponent)
  - Sales trends (line chart)
  - Revenue breakdown (bar chart)
  - Top selling items (bar chart)

**Design Token Colors:**
Charts use design token colors from `tokens.css`:
- Primary: `rgba(59, 66, 104, 1)` (navy)
- Success: `rgba(34, 197, 94, 1)` (green)
- Warning: `rgba(234, 179, 8, 1)` (amber)
- Info: `rgba(59, 130, 246, 1)` (blue)
- Destructive: `rgba(239, 68, 68, 1)` (red)

---

## File Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Route guards (admin-guard, shop-guard)
│   │   │   ├── interceptors/    # HTTP interceptors (auth-interceptor)
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── services/        # Injectable services
│   │   ├── modules/
│   │   │   ├── admin/           # Admin dashboard, user management
│   │   │   ├── auth/            # Login, register
│   │   │   ├── public/          # Home, product detail, categories
│   │   │   ├── shop/            # Shop management, listings
│   │   │   └── user-profile/    # User profile, orders
│   │   ├── shared/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── data/            # Static data
│   │   │   └── utils/           # Utility functions
│   │   ├── app.config.ts        # App configuration
│   │   ├── app.routes.ts        # Route definitions
│   │   ├── app.ts               # Root component
│   │   ├── app.html             # Root template
│   │   └── app.css              # Root styles
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.development.ts
│   │   └── environment.production.ts
│   ├── styles/
│   │   └── tokens.css           # Design tokens
│   ├── styles.css               # Global styles
│   └── main.ts                  # Entry point
├── angular.json                 # Build configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

---

## Code Quality

### Formatting (Prettier)

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": { "parser": "angular" }
    }
  ]
}
```

**Format Command:**
```bash
npx prettier --write "src/**/*.{ts,html,css}"
```

### TypeScript Configuration

- Strict mode enabled
- No `any` type allowed
- Interfaces in `src/app/core/models/`
- Prefer `inject()` for dependency injection

---

## Testing

### Test Commands

```bash
npm test                              # Run all tests
ng test --include='**/filename.spec.ts'  # Single test file
```

### Test Structure

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## API Integration

### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  useBasicAuth: false
};
```

### HTTP Interceptor

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  
  return next(req);
};
```

### Response Handling

```typescript
// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Service method
getListings(params: any): Observable<PaginatedResponse<Listing>> {
  return this.http.get<PaginatedResponse<Listing>>(`${this.apiUrl}/listings`, { params });
}
```

---

## Image Storage

### Image URL Utility

```typescript
export function getImageUrl(imageUrls: string | string[] | null | undefined): string | null {
  if (!imageUrls) return null;
  
  const baseUrl = environment.apiUrl.replace('/api', '');
  
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    const imagePath = imageUrls[0];
    const fullPath = imagePath.startsWith('listings/') 
      ? imagePath 
      : `listings/${imagePath}`;
    return `${baseUrl}/storage/${fullPath}`;
  }
  
  return null;
}
```

### Storage Configuration

- Images stored in `storage/app/listings/` (Laravel)
- Accessed via `/storage/listings/{filename}`
- Backend: `config/filesystems.php` - `listings` disk

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-24 | Initial design system documentation |

---

## References

- [Angular Documentation](https://angular.dev/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [FontAwesome Icons](https://fontawesome.com/icons)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [ng2-charts](https://github.com/valor-software/ng2-charts)
