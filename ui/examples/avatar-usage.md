# Example: Avatar Component Usage

**Component**: `<app-avatar>`

**Basic Usage**:
```html
<app-avatar [name]="userName" size="md"></app-avatar>
```

**With Image**:
```html
<app-avatar [imageSrc]="user.avatar_url" [name]="user.name" size="xl"></app-avatar>
```

**Inputs**:
- `imageSrc` (string, optional) - URL to user's avatar image
- `name` (string, required) - User's name for fallback initials
- `size` (string, default: 'md') - 'sm' | 'md' | 'lg' | 'xl'

**Sizes**:
- `sm` - 32px
- `md` - 40px (default)
- `lg` - 48px
- `xl` - 64px

**Fallback**: If no image provided, shows initials from name (first 2 characters)

**Use Cases**:
- User profile pages
- Comment authors
- Team members
- Navigation sidebar

**Reference**: Avatar component source code
