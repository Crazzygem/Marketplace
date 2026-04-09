# Task Context: Docker Simplification & Deployment Fix

Session ID: 2026-04-02-docker-simplification
Created: 2026-04-02
Status: in_progress

## Current Request

User wants to simplify and fix the Docker deployment setup for the marketplace project. Current issues:
- Redis pulled but not used (waste of resources)
- Broken storage symlink path in nginx (double /public/public/)
- Confusing multiple docker-compose files
- Complex dependency chain with healthchecks
- Symlink created at build time (wrong)
- No database migrations on startup
- No .env.example file
- Delete/upload/update functions don't work
- Web won't run after deployment

## Context Files (Standards to Follow)
- /home/cheypiseth/.config/opencode/context/core/context-system/standards/mvi.md
- /home/cheypiseth/.config/opencode/context/core/context-system/standards/structure.md

## Reference Files (Source Material to Look At)
- docker-compose.yml (root)
- Backend/docker-compose.yml (to be removed)
- Frontend/docker-compose.yml (to be removed)
- Backend/Dockerfile
- Backend/docker/nginx/default.conf
- nginx/nginx.conf
- Frontend/Dockerfile
- Frontend/src/environments/environment.production.ts

## Components

### Services to Create/Modify
1. **Simplified docker-compose.yml** - Root level, single file, 4 services (frontend, backend, mysql, nginx)
2. **Backend/entrypoint.sh** - New: handle migrations, storage symlink, permissions
3. **Backend/Dockerfile** - Update to use entrypoint script
4. **nginx/nginx.conf** - Fix storage path, simplify routing
5. **.env.example** - New: all required environment variables
6. **deploy.sh** - New: one-command deployment script

### Services to Remove
- Backend/docker-compose.yml (standalone)
- Frontend/docker-compose.yml (standalone)
- Redis service (not used)

## Constraints

1. Must fix the storage symlink issue (double /public/public/ path)
2. Must create symlink at RUNTIME, not build time
3. Must run migrations automatically on first start
4. Must reduce complexity (5 services → 4 services)
5. Must have single docker-compose.yml at root
6. Must include .env.example for all required variables
7. Must provide one-command deploy script
8. Must maintain all existing functionality
9. Must ensure delete/upload/update functions work
10. Must keep changes minimal and focused

## Exit Criteria

- [ ] New simplified docker-compose.yml created with 4 services
- [ ] Redis removed from configuration
- [ ] Backend/entrypoint.sh created and working
- [ ] Backend/Dockerfile updated to use entrypoint
- [ ] nginx/nginx.conf storage path fixed
- [ ] .env.example created with all variables
- [ ] deploy.sh created and working
- [ ] Standalone docker-compose files removed
- [ ] All files follow MVI principles (<200 lines)
- [ ] Symlink created at runtime, not build time
- [ ] Migrations run automatically on startup
- [ ] Delete/upload/update functions tested and working
- [ ] Deployment tested and working

## Critical Issues to Fix

1. **Storage Symlink Path**: Fix `alias /var/www/html/storage/app/public/public/;` → `alias /var/www/html/storage/app/public/;`
2. **Symlink Creation Time**: Move from build-time to runtime (entrypoint.sh)
3. **Migrations**: Add automatic migration on startup
4. **Redis Removal**: Remove Redis service and all references
5. **Configuration**: Add .env.example with clear documentation
