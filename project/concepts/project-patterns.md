# Concept: Project-Specific Patterns

**Core Concept**: Specialized patterns for this Laravel/Angular marketplace.

**Frontend Services**: All in `src/app/core/services/`. Use `HttpClient`, `HttpParams`. Define response interfaces at top.

**Backend Models**: `HasApiTokens` for Sanctum. Boolean flags: `is_admin`, `is_shop_owner`, `is_staff`, `is_customer`. Eager load with `with()`. Image storage on `listings` disk.

**Authentication**:
- Frontend: JWT in localStorage via `authInterceptor`
- Backend: Sanctum Bearer tokens
- Admin routes: `auth:admin`
- Shop routes: `auth:shop`

**State Management**: Services use signals: `currentUser = signal<User | null>(null)`. Computed: `isAdmin = computed(() => currentUser()?.is_admin)`. localStorage for persistence.

**Quick Example**:
```typescript
// Frontend service with signals
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isAdmin = computed(() => this.currentUser()?.is_admin);
}
```

**Reference**: See `AGENTS.md` for complete patterns
