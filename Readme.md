# Webshop serverless Project

React + TypeScript frontend that connects to Hasura via GraphQL over HTTPS and WebSockets, handling queries, mutations, and subscriptions without a custom backend. Hasura is running as Docker container on Ubuntu VPS in separate subdomain.

## Table of contents 

1. [Create PostgreSQL Database and Populate Tables](#1-create-postgresql-database-and-populate-tables)
2. [Introduce Docker](#2-introduce-docker)
3. [Introduce Hasura](#3-introduce-hasura)
4. [Enable TLS Access to Hasura](#4-enable-tls-access-to-hasura)
5. [Build Frontend Skeleton (React + TypeScript)](#5-build-frontend-skeleton-react--typescript)

## 1. Create PostgreSQL database and populate tables

![ERD diagram](data/ERD.png)

- Create DB and schema
  ```bash
  sudo -u postgres psql
  CREATE DATABASE webshop OWNER barry75;
  GRANT ALL PRIVILEGES ON DATABASE webshop TO barry75;
  ```

- Connect to PostgreSQL to default db, show dbs, switch, delete db
  ```bash
  psql -U barry75 -d postgres
  \l
  \c webshop
  ```


- Show databases and current database 
  ```bash
  \l
  SELECT current_database();
  ```

- Apply schema.sql and verify
  ```bash
  psql -U barry75 -d webshop -f schema.sql
  psql -U barry75 -d webshop
  \dt
  \d+ customers
  ```

- Populate tables with data.sql 
  ```sql
  psql -U barry75 -d webshop -f data.sql  
  ```  

- Save sanity check query as view
  ```sql
  CREATE VIEW order_details_v AS
  SELECT
    o.id AS order_id,
    c.name AS customer,
    p.name AS product,
    oi.quantity,
    o.order_date
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  ORDER BY o.id;
  ```

##  2. Introduce Docker

### 1. Run update and upgrade
  - Update APT package cache using apt update - refresh system's list of available software (package index)
  - apt upgrade downloads and installs newer versions of currently installed packages, using the information from update
    ```bash
    sudo apt update
    sudo apt upgrade -y
    ```

### 2. Prerequisites
  - Check installation (Output ii  curl 8.5.0-2ubuntu10.6 ->ii=installed and configured) 
    - apt-transport-https + ca-certificates → make secure HTTPS downloads possible
    - curl → download Docker GPG key
    - gnupg → verify key integrity
    - software-properties-common + lsb-release → help add the Docker repo based on your Ubuntu version
      ```bash
      dpkg -l apt-transport-https
      dpkg -l ca-certificates
      dpkg -l curl
      dpkg -l gnupg
      dpkg -l software-properties-common
      dpkg -l lsb-release
      ```
  - Install missing packages
    ```bash
    sudo apt install apt-transport-https
    ```

### 3.Add Docker's official GPG key

GPG, or GNU Privacy Guard, is a public key cryptography implementation. This allows for the secure transmission of information between parties and can be used to verify that the origin of a message is genuine.
  - Download Docker's public GPG key from Docker site
  - Convert the key into a “keyring” file format that APT can use securely and save it in /usr/share/keyrings/
    ```bash
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    ```

### 4. Install Docker Engine


- Update APT package cache
- Install Docker engine using the official script
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```

- Verify
  ```bash
  docker --version
  ```

- Verify Docker repository is added. Docker repo was added automatically by the official install script
  ```bash
  cat /etc/apt/sources.list.d/docker.list
  ```

- Add user to docker group, apply membership and verify
  ```bash
  whoami
  groups
  sudo usermod -aG docker barry75
  newgrp docker
  groups
  ```

- Verify Docker installation
  ```bash
  docker run hello-world
  ```



##  3. Introduce Hasura


- Pull the official Hasura GraphQL engine image from Docker Hub
  ```bash
  docker pull hasura/graphql-engine:v2.30.0
  ```

- Check available ports
  ```bash
  sudo ss -tulpn | grep 8080
  sudo lsof -i :8080
  ```


- Add allowed hosts in CIDR notation to /etc/postgresql/16/main/pg_hba.conf 
  ```
  host    webshop    barry75    172.17.0.0/16    md5
  ```
  - 172.17.0.0 → base network address
  - /16 → network mask: the first 16 bits are fixed as the network part
  - Remaining 16 bits are host bits, which can vary
  - Any IP from 172.17.0.0 to 172.17.255.255 is in this subnet

- Restart PostgreSQL
  ```bash
  sudo systemctl restart postgresql
  ```

- Run Hasura container
  ```bash
  docker run -d --name hasura -p 8083:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://barry75:Pwd!@barryonweb.com:5432/webshop \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_ENABLE_TELEMETRY=false 
  hasura/graphql-engine:v2.30.0
  ```

- Check running containers, all (including stopped ones), remove
  ```bash
  docker ps
  docker ps -a
  docker rm hasura
  ```

- Check logs
  ```bash
  docker logs hasura
  ```


- Get the IP of Hasura Docker container on the Docker network. PostgreSQL sees a connection from this IP. It has to be configured in pg_hba.conf
  ```bash
  docker inspect hasura | grep -i ipaddress
  ```


- Test in Browser:
  ```bash
  http://barryonweb.com:8083
  ```


## 4. Enable TLS access to Hasura

Hasura runs in Docker and is exposed via a dedicated subdomain using Nginx as a reverse proxy with TLS termination via Let’s Encrypt.

- Create subdomain hasura.barryonweb.com and verify
  ```bash
  ping hasura.barryonweb.com
  ```

- Configure Nginx as reverse proxy for Hasura
- Test in Browser
  ```bash
  http://hasura.barryonweb.com
  ```

- Enable HTTPS
  ```bash
  sudo certbot --nginx -d hasura.barryonweb.com
  ```

- Test in Browser
  ```bash
  https://hasura.barryonweb.com
  ```

- Test POST from Postman:
  ```bash
  https://hasura.barryonweb.com/v1/graphql
  ```
  ```graphql
  { "query": "query GetCustomers { customers { id name city country } }" }
  ```

- Verify WebSockets (subscriptions)
  - In Hasura console run query
    ```graphql
    subscription {
      orders(order_by: { id: desc }) {
        id
        order_date
        customer {
          name
        }
      }
    }
    ```

  - In DevTools->Network->Sockets Request URL:
    ```bash
    wss://hasura.barryonweb.com/v1/graphql
    ``` 

TODO
- Add admin secret to Hasura
- Create roles (user, admin)

## 5. Build Frontend skeleton React + TypeScript

- Create project skeleton
	```bash
	npm create vite@latest webshop -- --template react-ts
  cd webshop
  npm install
	```

- Run dev, build for production, check Ts
  ```bash
  npm run dev
  npm run build
  npx tsc --noEmit
  ```

- Explicitly set port in vite.config.ts
  ```ts
  export default defineConfig({
    plugins: [react()],
    server: { port: 5180 }
  })
  ```

- Link to Remote Repo on Github
  - Initialize git
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
  - Create Remote repo
  - Link and verify
    ```bash
    git remote add origin git@github.com:berislav-vidakovic/WebShop.git
    git remote -v
    ```
  
  - Push code (--set-upstream or -u flag)
    ```bash
    git push -u origin main
    ```

- Add query and call it from App.txs