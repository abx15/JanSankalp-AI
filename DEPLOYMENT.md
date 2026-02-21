# Production Deployment & Scaling Guide

This guide provides instructions for deploying the JanSankalp AI platform in a production environment using Docker and Nginx.

## 🐳 Deployment Steps (VPS / Cloud)

### 1. Prerequisites

- Docker & Docker Compose installed.
- Domain name pointed to your server IP.
- SSL Certificates (Certbot recommended).

### 2. Environment Setup

Create a `.env` file in the root directory and ensure all keys from `ai-engine/.env` are present.

```bash
cp ai-engine/.env.example .env
nano .env
```

### 3. Build & Run

```bash
docker compose up --build -d
```

### 4. Initialize ML Models

Run the training script inside the container to generate initial models:

```bash
docker compose exec ai-engine python -m ml_training.train
```

## 📈 Scaling Strategy

### Vertical Scaling

- Increase CPU/Memory limits for `ai-engine` and `vector-db`.
- Adjust Uvicorn workers: `CMD ["uvicorn", "app.main:app", "--workers", "8"]`

### Horizontal Scaling

- Replicate `ai-engine` service: `docker compose up --scale ai-engine=3 -d`
- Use Nginx as a Load Balancer (already configured in `nginx.conf`).

### Database Optimization

- **Redis**: Enable cluster mode if caching load increases.
- **PostgreSQL**: Set up Read Replicas for analytics heavy tasks.
- **Weaviate**: Use Sharding for massive vector datasets.

## 🩺 Monitoring & Health

- **Next.js**: `http://your-domain.com/health` (via Nginx)
- **AI Engine**: `http://your-domain.com/ai/health`
- **Logs**: `docker compose logs -f ai-engine`
