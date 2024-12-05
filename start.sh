#!/bin/sh

pm2 start /server/dist/api.js
nginx -g "daemon off;"