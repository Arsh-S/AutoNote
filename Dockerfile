# Base image for Node.js
FROM node:20 AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the monorepo and install dependencies
COPY . .
RUN pnpm install --frozen-lockfile

# Build the client
FROM base AS client-builder
WORKDIR /app/client
RUN pnpm --filter client run build

# Build the server
FROM base AS server-builder
WORKDIR /app/server
RUN pnpm --filter server run build

# Final production image for Nginx and PM2
FROM nginx:stable-alpine

# Install Node.js and PM2 for the server
RUN apk add --no-cache nodejs npm \
    && npm install -g pm2

# Copy built client to Nginx public directory
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy built server
COPY --from=server-builder /app/server /app/server

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the start.sh script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set working directory for backend
WORKDIR /app

# Expose ports for both frontend and backend
EXPOSE 5174

# Use start.sh as the entrypoint
ENTRYPOINT ["/app/start.sh"]