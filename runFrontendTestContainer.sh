#!/bin/bash
set -e

# Stop old container if exists
docker rm -f webshop-frontend-test >/dev/null 2>&1 || true

# Run new container
docker run -d \
  --name webshop-frontend-test \
  --restart unless-stopped \
  -p 8089:80 \
  webshop-frontend-test
