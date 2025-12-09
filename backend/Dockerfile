# Multi-stage Dockerfile for Strapi (Node 20)
FROM node:20-bullseye-slim AS builder

WORKDIR /srv/app

# Install dependencies (including dev deps needed for build)
# Use `npm install --legacy-peer-deps` to avoid lockfile/peer-deps errors during container builds
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . ./
RUN npm run build

FROM node:20-bullseye-slim AS runner
ENV NODE_ENV=production
ENV PORT=1337

WORKDIR /srv/app

# Create a non-root user
RUN useradd --system --uid 1001 strapi || true

# Copy only what's needed from builder
COPY --from=builder /srv/app/ .

# Ensure uploads dir exists and has correct permissions, create home for strapi user
RUN mkdir -p /srv/app/public/uploads /home/strapi \
	&& chown -R strapi:strapi /srv/app /home/strapi

# Switch to non-root user
USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
