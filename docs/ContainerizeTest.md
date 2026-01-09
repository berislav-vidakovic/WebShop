## Frontend containerization

- Add Dockerfile
- Build Docker image
  ```bash
  docker build -t webshop-frontend-test .
  ```
- Run Docker container
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



