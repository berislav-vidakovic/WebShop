# Stage: Single container with Java, Maven, Nginx, TAS, Frontend
FROM mcr.microsoft.com/openjdk/jdk:17-ubuntu

# Install required packages
RUN apt-get update && apt-get install -y \
    maven \
    nginx \
    curl \
    unzip \
    git \
    libnss3 \
    libxss1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    libx11-xcb1 \
    && apt-get clean

# Copy React frontend into Nginx folder
COPY webshop/dist/ /var/www/webshop/frontend

# Replace default Nginx config
COPY webshop/webshop-staging.conf /etc/nginx/sites-available/default

# Copy TAS project
COPY TAS/ /app/TAS
WORKDIR /app/TAS

# Install Playwright browsers via Maven
RUN mvn dependency:resolve \
    && mvn exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install"

# Expose HTTP
EXPOSE 80

# Start Nginx and run TAS tests
CMD ["sh", "-c", "nginx && mvn test -Pwebshop"]
