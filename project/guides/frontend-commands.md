# Guide: Frontend Build & Test Commands

**Purpose**: Common commands for Angular development and testing.

**Commands**:
```bash
cd Frontend

# Development
npm start                         # Dev server (http://localhost:4200)

# Building
ng build                          # Development build
ng build --configuration production  # Production build

# Testing
ng test                           # Run all Karma/Jasmine tests
ng test --include='**/filename.spec.ts'  # Run specific test file

# Formatting
npx prettier --write "src/**/*.{ts,html,css}"  # Format code
```

**Key Points**:
- TypeScript strict mode enabled (no `any` types)
- Use prettier for code formatting
- Tests use Karma/Jasmine framework
- Production build optimized for deployment

**Reference**: Angular CLI documentation
