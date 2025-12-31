server {
  listen 80;
  server_name webshop.barryonweb.com;

  root /var/www/webshop/frontend;
  index index.html;

  # Serve static assets directly
  location /assets/ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }
}

