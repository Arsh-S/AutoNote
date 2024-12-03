# Use a Node.js image with support for pnpm
FROM node:20-alpine as builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Install dependencies
RUN pnpm install

# Build the client
RUN pnpm --filter client run build

# Prepare for production
RUN pnpm install --filter server --prod

# Use an Nginx image to serve the frontend
FROM nginx:stable-alpine

# Copy built client files to Nginx
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy the server code for backend API
COPY --from=builder /app/server /app/server

# Install pnpm for server runtime
RUN apk add --no-cache nodejs npm && npm install -g pnpm

# Set working directory for the server
WORKDIR /app/server

# Expose the backend port
EXPOSE 5174

# Expose the frontend port
EXPOSE 80

# Start the backend and frontend
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]