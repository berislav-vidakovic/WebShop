server {
  server_name webshop.barryonweb.com;

  root /var/www/webshop/frontend;
  index index.html;

  location / {
      try_files $uri /index.html;
  }
}

