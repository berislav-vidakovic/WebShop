server {
  server_name webshop-dev.barryonweb.com;

  root /var/www/webshop/frontend;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/webshop-dev.barryonweb.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/webshop-dev.barryonweb.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}


server {
    if ($host = webshop-dev.barryonweb.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  server_name webshop-dev.barryonweb.com;
    return 404; # managed by Certbot


}