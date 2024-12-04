# Base image for Node.js
FROM node:20 AS base

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy monorepo and install dependencies
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

# Final production image
FROM nginx:stable-alpine

# Copy built client to Nginx public directory
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy built server
COPY --from=server-builder /app/server /app/server

# Expose the ports
EXPOSE 80
EXPOSE 5174

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]