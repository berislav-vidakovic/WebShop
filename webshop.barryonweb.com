server {
  listen 80;
  server_name webshop.barryonweb.com;

  root /var/www/webshop/frontend;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }

  listen 443 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/webshop.barryonweb.com/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/webshop.barryonweb.com/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = webshop.barryonweb.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name webshop.barryonweb.com;
    listen 80;
    return 404; # managed by Certbot

}

