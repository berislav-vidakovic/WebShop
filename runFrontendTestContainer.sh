#!/bin/bash
set -e

# Build Docker image
docker build -t webshop-frontend-test .

# Stop old container if exists
docker rm -f webshop-frontend-test >/dev/null 2>&1 || true

# Run new container 
docker run -d \
  --name webshop-frontend-test \
  --restart unless-stopped \
  -p 8089:80 \
  webshop-frontend-test

echo "WebShop Frontend container started on Port 8089"
