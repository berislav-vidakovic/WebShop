server {
  listen 80;
  server_name webshop.barryonweb.com;

  root /var/www/webshop/frontend;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }
}

