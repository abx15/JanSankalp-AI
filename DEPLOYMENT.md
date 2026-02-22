# 🚀 JanSankalp AI — Deployment Guide

> **Audience**: Developers aur DevOps engineers jo JanSankalp AI ko local Docker ya cloud par deploy karna chahte hain.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture)
2. [Prerequisites](#prerequisites)
3. [Local Development (Docker)](#local-dev)
4. [Production Deployment (VPS/Cloud)](#production)
5. [Cloud Platform Deployment](#cloud)
6. [Environment Variables Reference](#env)
7. [Health Checks & Monitoring](#health)
8. [Scaling Guide](#scaling)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview {#architecture}

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Nginx (Port 80/443)  — Reverse Proxy + SSL         │
└──────────────────┬──────────────────┬───────────────┘
                   │                  │
          ┌────────▼───────┐  ┌───────▼────────┐
          │  Next.js (3000)│  │ FastAPI  (8000) │
          │  Frontend+API  │  │  AI Engine      │
          └────────┬───────┘  └───────┬─────────┘
                   │                  │
    ┌──────────────┼──────────────────┼──────────────┐
    │              │                  │              │
┌───▼───┐   ┌──────▼──┐   ┌─────────▼──┐   ┌──────▼──┐
│Postgres│   │  Redis  │   │  Weaviate  │   │  Kafka  │
│  DB   │   │   Cache │   │  VectorDB  │   │  Events │
└───────┘   └─────────┘   └────────────┘   └─────────┘
```

---

## 🔧 Prerequisites {#prerequisites}

### Local Machine

| Tool           | Version | Link                                                         |
| -------------- | ------- | ------------------------------------------------------------ |
| Docker Desktop | 24.x+   | [docker.com](https://www.docker.com/products/docker-desktop) |
| Docker Compose | v2.x+   | (Docker Desktop ke saath aata hai)                           |
| Git            | any     | [git-scm.com](https://git-scm.com)                           |

### Production Server (VPS)

| Tool              | Required                              |
| ----------------- | ------------------------------------- |
| Ubuntu 22.04 LTS  | Recommended                           |
| Docker Engine     | ✅                                    |
| Docker Compose v2 | ✅                                    |
| Nginx (optional)  | SSL ke liye                           |
| Min 4GB RAM       | ✅ (8GB recommended Weaviate ke liye) |

---

## 💻 Local Development (Docker) {#local-dev}

### Option A — Windows (Ek Click) ⭐ Recommended

```powershell
# Project folder me jaao
cd "C:\Users\arunk\Desktop\ReactProjects25-26\JanSankalp AI"

# Dev mode start karo (Next.js + FastAPI + Postgres + Redis)
.\start-docker.ps1 -Mode dev

# Full production stack (Kafka + Weaviate bhi)
.\start-docker.ps1 -Mode prod
```

### Option B — Manual (Kisi bhi OS)

**Step 1: Environment setup karo**

```bash
# .env.docker ko .env me copy karo
cp .env.docker .env

# Apni API keys fill karo
notepad .env   # Windows
nano .env      # Linux/Mac
```

**Step 2: Dev Stack chalao (Recommended — fast & light)**

```bash
docker compose -f docker-compose.dev.yml up --build
```

**Step 3: Full Production Stack**

```bash
cd infrastructure
docker compose up --build -d
```

**Step 4: Database migrate karo (pehli baar)**

```bash
# Client container me jaake Prisma migrate karo
docker compose exec client npx prisma db push
docker compose exec client npm run seed
```

### Services aur Ports

| Service             | Local URL                  | Details                  |
| ------------------- | -------------------------- | ------------------------ |
| Frontend (Next.js)  | http://localhost:3000      | Main app                 |
| AI Engine (FastAPI) | http://localhost:8000/docs | Swagger UI               |
| Nginx Proxy         | http://localhost:80        | Prod only                |
| PostgreSQL          | localhost:5432             | DB tools se connect karo |
| Redis               | localhost:6379             | Dev only                 |
| Kafka               | localhost:29092            | External access          |

---

## 🌐 Production Deployment (VPS/Cloud) {#production}

### Step 1: Server Setup

```bash
# Ubuntu server par
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git

# Docker ko non-root user se chalane do
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Code Deploy

```bash
git clone https://github.com/AbhaySuneriya/JanSankalpAI.git
cd JanSankalpAI

# Environment variables set karo
cp .env.docker .env
nano .env  # Sab production values fill karo
```

### Step 3: Production Env Variables (ZARURI)

```bash
# .env me ye values ZARURI change karo:
NEXTAUTH_URL=https://aapka-domain.com
NEXT_PUBLIC_BASE_URL=https://aapka-domain.com
NEXT_PUBLIC_API_URL=https://aapka-domain.com/api
CORS_ORIGINS=https://aapka-domain.com

# DATABASE_URL: Neon DB ka production URL use karo
DATABASE_URL=postgresql://...  # Neon production DB

# Strong secrets generate karo:
# openssl rand -base64 32
NEXTAUTH_SECRET=<strong-random-secret>
AUTH_SECRET=<same-strong-random-secret>
JWT_SECRET=<another-strong-random-secret>
```

### Step 4: SSL Setup (Certbot + Nginx)

```bash
# Certbot install karo
sudo apt install certbot -y

# Certificate lo (docker down karo pehle port 80 ke liye)
sudo certbot certonly --standalone -d aapka-domain.com

# Certificates Docker me mount karo (nginx service me add karo)
# infrastructure/nginx/nginx.conf me SSL configure karo
```

### Step 5: Launch

```bash
cd infrastructure
docker compose up --build -d

# Status check karo
docker compose ps

# Logs dekho
docker compose logs -f
```

### Step 6: Database Initialize karo

```bash
# Pehli baar Prisma migrate karo
docker compose exec client npx prisma db push

# Test data seed karo (optional)
docker compose exec client npm run seed
```

---

## ☁️ Cloud Platform Deployment {#cloud}

### Frontend — Vercel (Free Tier Available)

```bash
# Vercel CLI install karo
npm i -g vercel

# client/ folder me se deploy karo
cd client
vercel --prod

# Vercel Dashboard me Environment Variables add karo:
# Settings > Environment Variables > Add all from .env
# DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, etc.
```

> **Note**: Vercel par `AI_SERVICE_URL` ko Render/Railway ke production URL par set karo

### AI Server — Render (Free Tier Available)

1. Render.com par jaao → New Web Service
2. GitHub repo connect karo
3. **Root Directory**: `server`
4. **Runtime**: Docker
5. **Plan**: Free (512MB) ya Starter ($7/mo for 512MB)
6. Environment Variables add karo (server/.env se)
7. Deploy karo → URL milega jaise `https://jansankalp-ai.onrender.com`

```bash
# Vercel me AI_SERVICE_URL update karo:
AI_SERVICE_URL=https://jansankalp-ai.onrender.com
```

### Database — Neon (Already Configured ✅)

Aapka project pehle se Neon DB use kar raha hai. Production ke liye same URL kaam karega.

---

## 🔑 Environment Variables Reference {#env}

| Variable                          | Required | Description                  |
| --------------------------------- | -------- | ---------------------------- |
| `DATABASE_URL`                    | ✅       | PostgreSQL connection string |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | ✅       | NextAuth encryption key      |
| `NEXTAUTH_URL`                    | ✅       | App ka public URL            |
| `OPENAI_API_KEY`                  | ✅       | AI features ke liye          |
| `AI_SERVICE_URL`                  | ✅       | FastAPI server URL           |
| `RESEND_API_KEY`                  | ✅       | Email sending                |
| `PUSHER_*`                        | ✅       | Real-time features           |
| `CLOUDINARY_*`                    | ✅       | Image uploads                |
| `KAFKA_BROKERS`                   | Optional | Event streaming              |
| `WEAVIATE_URL`                    | Optional | Vector search                |

---

## 🩺 Health Checks & Monitoring {#health}

```bash
# Sab services ka status
docker compose ps

# Real-time logs
docker compose logs -f

# Specific service ki logs
docker compose logs -f client
docker compose logs -f server

# Service health endpoints
curl http://localhost:3000          # Frontend
curl http://localhost:8000/health   # AI Engine
curl http://localhost:80/health     # Nginx (prod only)
curl http://localhost:8000/docs     # FastAPI Swagger UI
```

---

## 📈 Scaling Guide {#scaling}

### Vertical Scaling (Single Server)

```bash
# Uvicorn workers badhao server/Dockerfile me:
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "8"]
```

### Horizontal Scaling

```bash
# AI Engine ke multiple instances chalao
docker compose up --scale server=3 -d
```

### Database Optimization

- **PostgreSQL**: Neon ka connection pooling enable karo (`?pgbouncer=true`)
- **Redis**: Memory limit set karo `maxmemory 256mb`
- **Weaviate**: Sharding enable karo large datasets ke liye

---

## 🔥 Troubleshooting {#troubleshooting}

### Port Already in Use

```powershell
# Windows — Port 3000 kaunsa process use kar raha hai
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Container Build Fail

```bash
# Cache saaf karke dobara build karo
docker compose build --no-cache

# Specific service rebuild karo
docker compose build client
```

### Prisma DB Push Fail

```bash
# Container ke andar jaake manually chalao
docker compose exec client sh
npx prisma db push
npx prisma studio  # DB GUI
```

### "Cannot connect to Docker daemon"

```
Docker Desktop open karo aur wait karo jab tak green indicator aaye
```

### Client Container Crash (Next.js build fail)

```bash
# Detailed logs dekho
docker compose logs client

# Common fix: node_modules clean karo
docker compose down
docker volume prune
docker compose up --build
```

---

## 🛑 Useful Commands Cheatsheet

```bash
# Start (dev)
docker compose -f docker-compose.dev.yml up -d

# Start (prod / full stack)
cd infrastructure && docker compose up -d

# Stop
docker compose down

# Stop + volumes delete (fresh start)
docker compose down -v

# Ek service restart karo
docker compose restart client

# Container ke andar jaao
docker compose exec client sh
docker compose exec server bash

# Images saaf karo
docker system prune -a
```
