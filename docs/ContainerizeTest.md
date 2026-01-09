# Test environment containerization

- Designed and implemented a fully containerized multi-environment web application using Docker, Hasura, and Postgres 
- Built Dev and Test environments with separate databases and subdomains, configured dynamic runtime frontend settings via a single JSON file, and automated deployment through CI/CD scripts 
- Delivered a maintainable, scalable workflow where frontend automatically adapts to the target environment without rebuilds, demonstrating full-stack, DevOps-aware expertise

## Hasura

- Split Dev and Test into separate subdomains
- Run Test Hasura container:
  ```bash
  #!/bin/bash
  set -e

  # Stop and remove any existing container
  docker rm -f hasura-test >/dev/null 2>&1 || true

  docker run -d --name hasura-test -p 8088:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://barry75:abc123@barryonweb.com:5432/webshop_test \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_ENABLE_TELEMETRY=false \
  hasura/graphql-engine:v2.30.0

  echo "Hasura Test started on Port 8088"
  ```

## Frontend containerization

- Add Dockerfile
  ```docker
  # Use lightweight nginx to serve static frontend
  FROM nginx:alpine

  # Copy built frontend artifacts into nginx html folder
  COPY frontend/ /usr/share/nginx/html

  # Expose port 80 inside container
  EXPOSE 80

  # Start nginx
  CMD ["nginx", "-g", "daemon off;"]
  ```
- Build Docker image
  ```bash
  docker build -t webshop-frontend-test .
  ```
- Add script for run Frontend container
  ```bash
  # Stop old container if exists
  docker rm -f webshop-frontend-test >/dev/null 2>&1 || true

  # Run new container
  docker run -d \
    --name webshop-frontend-test \
    --restart unless-stopped \
    -p 8089:80 \
    webshop-frontend-test
  ```
- Test from Browser
  ```bash
  http://barryonweb.com:8089/
  ```
  - Points currently  to Dev Hasura and Dev DB

### Establish Frontend connection to Test Hasura and Test DB

- Add Hasura URL as runtime variables fetching from clientsetting.json
- Add Nginx config 
  - instead of files on server setup as reverse proxy on Port 8089
  - enable site and add TSSL certificate
- Test in browser (still points to Dev):
  ```bash
  https://webshop-test.barryonweb.com/
  ```
- Insert build Docker image into script for run Frontend container:
  ```bash

  ```

