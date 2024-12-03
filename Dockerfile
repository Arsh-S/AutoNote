# Base Node.js image
FROM node:20 AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy lock files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies for both client and server
RUN pnpm install --frozen-lockfile

# Client build stage
FROM base AS client-builder

WORKDIR /app/client
COPY client .
RUN pnpm --filter client run build

# Server build stage
FROM base AS server-builder

WORKDIR /app/server
COPY server .
RUN pnpm --filter server run build

# Production image using Node.js to run both server and client
FROM node:20 AS production

# Install PM2 globally for managing server processes
RUN npm install -g pm2

# Set working directory for the final build
WORKDIR /app

# Copy built client and server artifacts
COPY --from=client-builder /app/client/dist /usr/share/nginx/html
COPY --from=server-builder /app/server /app/server

# Expose necessary ports
EXPOSE 80
EXPOSE 5174

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5174

# Command to start the server
CMD ["pm2-runtime", "server/api.js"]