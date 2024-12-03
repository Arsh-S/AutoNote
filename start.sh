#!/bin/sh

# Start the backend server
cd /app && pnpm --filter server run dev &

# Start Nginx for serving the frontend
nginx -g "daemon off;"