# =============================================================================
# Codvia - Single Dockerfile for Frontend + Backend
# =============================================================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY Frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY Frontend/ ./

# Build frontend
RUN npm run build

# =============================================================================
# Stage 2: Final image with Backend + All Compilers + Frontend static files
# =============================================================================
FROM node:20-bookworm

# Install compilers and interpreters for all supported languages
RUN apt-get update && apt-get install -y --no-install-recommends \
    # C/C++ compilers
    gcc \
    g++ \
    # Python
    python3 \
    python3-pip \
    # Java
    default-jdk \
    # Ruby
    ruby \
    # PHP
    php-cli \
    # Go
    golang-go \
    # Rust
    rustc \
    # Nginx for serving frontend
    nginx \
    # Utilities
    curl \
    supervisor \
    && rm -rf /var/lib/apt/lists/* \
    # Create symlink for python command
    && ln -sf /usr/bin/python3 /usr/bin/python

# Install TypeScript globally
RUN npm install -g typescript

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package files
COPY Backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend application code
COPY Backend/ ./

# Create temp directory for code execution
RUN mkdir -p temp && chmod 777 temp

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/sites-enabled/default

# Create supervisor configuration to run both services
RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:backend]
command=node /app/backend/server.js
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log
environment=NODE_ENV="production",PORT="5000"

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/nginx.err.log
stdout_logfile=/var/log/supervisor/nginx.out.log
EOF

# Expose ports
EXPOSE 80 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/api/health && curl -f http://localhost:80 || exit 1

# Start supervisor (which manages both nginx and node)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
