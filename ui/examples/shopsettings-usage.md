# Example: ShopSettingsComponent

**Component**: ShopSettingsComponent
**Location**: `Frontend/src/app/modules/shop/settings/shop-settings.component.ts`
**Route**: `/shop/settings`

**Purpose**: Comprehensive settings page for shop owners.

**Features**:
- Tabbed interface with 5 tabs: Shop Settings, Listings, Staff, Analytics, Payments (disabled)
- Lazy loading of data per tab
- Query parameter support for direct tab access (`?tab=staff`)
- Bulk selection and deletion of listings
- Shop information editing
- Analytics overview with stat cards

**Navigation Examples**:
```html
<!-- Navigate to settings with specific tab -->
<button routerLink="/shop/settings?tab=listings">Manage Listings</button>
<button routerLink="/shop/settings?tab=staff">Manage Staff</button>
<button routerLink="/shop/settings?tab=analytics">View Analytics</button>
```

**Key Methods**:
- `setActiveTab(tab: string)` - Switch between tabs
- `loadShopSettings()` - Load shop information
- `loadListings()` - Load all listings
- `toggleListingSelection(listingId: number)` - Toggle selection for bulk operations
- `bulkDeleteListings()` - Delete selected listings
- `showAlertMessage(variant, title, description)` - Display alert notification

**Payments Tab**: Disabled (2026-03-26) - functionality not required for current scope. Code preserved for future use.

**Reference**: See `COMPONENT_REFERENCE.md` for usage examples
