# WebShop — Full Stack E‑Commerce Project

A modern full‑stack e‑commerce web application implemented with React, GraphQL, Hasura, PostgreSQL, Docker, and Nginx.

This project demonstrates building a **front‑end** with **React + TypeScript** that consumes a **GraphQL backend (Hasura)** securely over HTTPS and WebSockets, without needing a custom backend server. Hasura and PostgreSQL run as Docker containers on an Ubuntu VPS with TLS termination managed by Nginx.

---

## 🚀 Live Demo / Preview

> 🔗 Demo: https://webshop.barryonweb.com/ 

📸 *(Sreenshots)*

---

## 🧠 Project Summary

WebShop is a showcase e‑commerce platform with:

- **React + TypeScript frontend** built with Vite
- **GraphQL API** powered by **Hasura**
- **PostgreSQL database** storing product and order information
- **Dockerized infrastructure** for consistent testing and deployment
- **HTTPS via Nginx reverse proxy with TLS**
- Real-time subscriptions via GraphQL WebSockets

---

## 🛠 Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite |
| API | Hasura GraphQL Engine |
| Database | PostgreSQL |
| Infrastructure | Docker, Nginx, Ubuntu |
| Protocols | HTTPS, WebSockets |
| Others | GraphQL for data fetching |

There is building log available in <a href="docs/Details.md">separate document</a>

---

## 🚧 Key Features

### 📌 User Experience  
- Responsive UI built with modern React patterns  
- Product browsing and search  
- Real-time updates via subscriptions

### 📌 Data & Backend  
- GraphQL queries, mutations, and subscriptions  
- Fully normalized PostgreSQL schema  
- ERD & views for dashboard reporting

### 📌 Deployment & DevOps  
- Docker containers for consistent environments  
- Nginx TLS termination
- CI pipelines in place (GitHub, GitLab)  
- Staging workflows with dockerized services

---

## 📦 Setup & Local Development

### Prerequisites

Install:

- Node.js (>=16.x)
- Docker & Docker Compose
- PostgreSQL
- Hasura CLI (optional)

---

### 1. Clone the repository

```bash
git clone https://github.com/berislav-vidakovic/WebShop.git
cd WebShop
```

---

### 2. Backend Services (PostgreSQL + Hasura)

Create PostgreSQL database:

```bash
sudo -u postgres psql
CREATE DATABASE webshop OWNER <your‑user>;
GRANT ALL PRIVILEGES ON DATABASE webshop TO <your‑user>;
```

Load schema and data:

```bash
psql -U <user> webshop -f data/schema.sql
psql -U <user> webshop -f data/data.sql
```

Run Hasura (example):

```bash
docker run -d   --name hasura   -p 8083:8080   -e HASURA_GRAPHQL_DATABASE_URL=postgres://<user>:<pw>@<host>:5432/webshop   hasura/graphql-engine
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 💡 Deployment

- Configure Nginx as reverse proxy with HTTPS for your domain
- Ensure TLS is enabled via Certbot or similar
- Host Hasura and PostgreSQL secured services
- Build and deploy frontend as static assets or via container

Example Nginx config:

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  location / {
    try_files $uri /index.html;
  }
}
```

---

## 📊 Database Design

This project contains a full ERD illustrating relationships between:

- Users
- Products
- Orders
- OrderItems
- Categories

Include or link ERD image in this section.

---

## 🧪 Testing

- Unit tests for frontend (Vitest, Jest)
- Integration testing for GraphQL queries
- Mock tests for edge case scenarios

---

## 🙋 Contribution

Feel free to improve features or add new ones:

1. Fork repository
2. Create feature branch
3. Send pull request

---

## 📬 Contact

**Berislav Vidakovic**  
GitHub: https://github.com/berislav-vidakovic  
Email: your.email@example.com  
LinkedIn: https://linkedin.com/in/yourprofile

---

## 🏆 Why This Project Matters

This project showcases:

✔ Full stack development with modern tools  
✔ Secure production-grade deployment  
✔ Real-time client-server interaction via GraphQL  
✔ Containerization & infrastructure automation  
✔ Strong architectural patterns

*(This README aims to attract recruiters by explaining the project clearly and professionally.)*
