# Use Node.js as the base image for building
FROM node:20 as builder

# Install pnpm
RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set the working directory
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Clean up old node_modules and install dependencies
RUN rm -rf node_modules **/node_modules
RUN pnpm install

# Build the client
RUN pnpm --filter client run build

# Prepare the server (install dependencies only for the server)
RUN pnpm --filter server install --prod

# Use Nginx for serving the frontend and backend in the final stage
FROM nginx:stable-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from the builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy server files
COPY --from=builder /app /app

# Install PM2 for managing the backend server
RUN apk add --no-cache nodejs npm
RUN npm install -g pm2

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5174

# Expose ports for Fly.io
EXPOSE 80
EXPOSE 5174

# Start Nginx and the server
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Entry point
ENTRYPOINT ["/start.sh"]