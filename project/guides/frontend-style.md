# Guide: Frontend Code Style (TypeScript/Angular)

**Purpose**: TypeScript and Angular coding standards.

**Imports**: Angular framework → third-party → project modules. Explicit imports only.

**Formatting**:
- Single quotes, 2-space indentation, 100 char line width (Prettier)
- Semicolons required, trailing commas where applicable

**TypeScript**:
- Strict mode enabled. No `any` types - always specify types
- Interfaces in `src/app/core/models/`
- Use signals: `signal<T>()`, `computed<T>()`
- Use `inject()` for DI (Angular 15+)
- Explicit return types

**Components**:
- Use `standalone: true`
- Declare all imports in `imports[]`
- Selector: `kebab-case` with `app-` prefix
- File: `kebab-case.component.ts`

**Services**:
- `@Injectable({ providedIn: 'root' })`
- Use `HttpClient`, base URL from `environment.apiUrl`
- Define response interfaces, return typed observables

**Naming**: PascalCase (Components/Services/Interfaces), kebab-case (files/CSS), camelCase (variables/methods)

**Reference**: Angular Style Guide
