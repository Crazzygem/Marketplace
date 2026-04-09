# =============================================================================
# Stage 1: Build the Angular application
# =============================================================================
FROM node:20-alpine AS builder

# Build argument for API URL (defaults to localhost:8000)
ARG API_URL=http://localhost:8000/api

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Replace API URL in production environment file
RUN sed -i "s|REPLACE_WITH_API_URL|${API_URL}|g" src/environments/environment.production.ts

# Build the Angular app for production
RUN npm run build:prod

# =============================================================================
# Stage 2: Serve with Nginx (minimal production image)
# =============================================================================
FROM nginx:1.27-alpine

# Install wget for health check
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
# Angular 20+ outputs to dist/frontend/browser/
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html/browser

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
