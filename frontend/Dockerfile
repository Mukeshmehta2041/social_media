# Multi-stage Dockerfile for Vite frontend + nginx static serve
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install dependencies and build
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

FROM nginx:stable-alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config with our SPA configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
