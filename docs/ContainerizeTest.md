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

- Add Hasura URL as runtime variables fetching from clientsetting.json
- Add Nginx config 
  - instead of files on server setup as reverse proxy on Port 8089
  - enable site and add TSSL certificate
- Test in browser (still points to Dev):
  ```bash
  https://webshop-test.barryonweb.com/
  ```
- Add clientsettings.json Test version su subdirectory /test
- Update the test frontend run script - **mount test/clientsettings.json**
  ```bash
  -v /var/www/webshop/test/clientsettings.json:/usr/share/nginx/html/clientsettings.json:ro \
  ```

