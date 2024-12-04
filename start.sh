#!/bin/sh

# Start the backend server
cd /server
pnpm run dev &

# Start Nginx for serving the frontend
nginx -g "daemon off;"