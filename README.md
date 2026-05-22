<div align="center">
  <img src="frontend/public/logojansanklp.png" alt="JanSankalp AI Logo" width="180" />

# 🇮🇳 JanSankalp AI — Smart Civic Governance Platform

### _AI · Federated Learning · IoT · Satellite · Real-Time · Multi-Service Architecture_

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](#-running-via-docker-compose-easiest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Core API](https://img.shields.io/badge/NestJS-Core%20API-red?logo=nestjs)](backend/nest-api/)
[![AI Engine](https://img.shields.io/badge/FastAPI-AI%20Engine-green?logo=fastapi)](backend/fastapi-ai/)
[![Express Utils](https://img.shields.io/badge/Express-Node%20Services-lightgrey?logo=express)](backend/node-services/)

</div>

---

Welcome to the new enterprise-grade, highly-scalable, production-ready **JanSankalp AI** architecture! The platform has been fully refactored into a decoupled **4-Tier Microservices Architecture** to support 200k–500k active users and handle massive background civic data, satellite imagery, and automated multi-agent AI verification pipelines.

---

## 🏗️ Re-Engineered Architecture

Our system is split into four distinct tiers, allowing independent scalability and high availability:

```
                              ┌────────────────────────────────────────┐
                              │    Citizen & Officer React Clients     │
                              │         (Next.js Frontend: 3000)       │
                              └───────────────────┬────────────────────┘
                                                  │
                      ┌───────────────────────────┼───────────────────────────┐
                      │ (HTTP REST / SSE)         │ (HTTP REST)               │ (HTTP REST)
                      ▼                           ▼                           ▼
          ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
          │   NestJS Gateway API  │   │   FastAPI AI Engine   │   │   Express Utilities   │
          │   (nest-api: 4000)    │   │  (fastapi-ai: 8000)   │   │ (node-services: 3001) │
          └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
                      │                           │                           │
                      │                           │ (Validate Bearer Token)   │
                      └───────────────────────────┴───────────────────────────┘
                                                  │
                                                  ▼
                                      [Shared Services Network]
                                  PostgreSQL DB + Redis Cache/Queue
```

1. **`frontend/` (Next.js client on `:3000`)**: Interactive citizen complaint reporting dashboard and officer dispatch desks. Communicates with APIs using centralized custom hook connection handlers.
2. **`backend/nest-api/` (Core NestJS Gateway on `:4000`)**: Gatekeeper for auth (JWT/RBAC), core complaints workflows database management via Prisma, realtime notification dispatching using Socket.io, and task offloading using BullMQ.
3. **`backend/fastapi-ai/` (FastAPI Python Service on `:8000`)**: Handles specialized multi-agent workflow routing (spam, classification, duplicate check, routing, ETA policy), Server-Sent Events (SSE) AI assistant chat streams, and computer vision pothole/garbage audit calculations.
4. **`backend/node-services/` (Express Utility Service on `:3001`)**: Offloads Stripe subscription payments, secure ImageKit direct file upload authentication parameter generation, and Resend API transactional emails.

---

## 🔑 Environment Settings (.env Setup)

To support separate hosting hosts (e.g. on Render), each service is fully parameterized with its own `.env` configuration file:

### 1. NestJS Gateway API Configuration (`backend/nest-api/.env`)
Create `backend/nest-api/.env` and fill it with:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
REDIS_URL="redis://localhost:6379"
AUTH_SECRET="your-auth-secret-key"
INTERNAL_SERVICE_TOKEN="your-internal-service-token"
AI_SERVICE_URL="http://localhost:8000"       # Render: https://your-fastapi-ai.onrender.com
NODE_SERVICES_URL="http://localhost:3001"    # Render: https://your-node-services.onrender.com
RESEND_API_KEY="re_your_resend_api_key"
SMTP_EMAIL="your-smtp-email@example.com"
SMTP_PASSWORD="your-smtp-password"
```

### 2. FastAPI Python AI Configuration (`backend/fastapi-ai/.env`)
Create `backend/fastapi-ai/.env` and fill it with:
```env
PORT=8000
INTERNAL_SERVICE_TOKEN="your-internal-service-token"
OPENAI_API_KEY="sk-proj-your-openai-api-key"
GROK_API_KEY="xai-your-grok-api-key"
HUGGINGFACE_API_KEY="hf_your-huggingface-api-key"
COHERE_API_KEY="your-cohere-api-key"
ASSEMBLY_AI_API_KEY="your-assembly-ai-api-key"
```

### 3. Express Node Utilities Configuration (`backend/node-services/.env`)
Create `backend/node-services/.env` and fill it with:
```env
PORT=3001
NODE_SERVICES_PORT=3001
NODE_ENV=development
INTERNAL_SERVICE_TOKEN="your-internal-service-token"
NEST_API_INTERNAL_URL="http://localhost:4000" # Render: https://your-nest-api.onrender.com
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="private_your-imagekit-private-key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
RESEND_API_KEY="re_your_resend_api_key"
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASS="your-smtp-password"
SMTP_FROM="JanSankalp Alerts <alerts@jansankalp.org>"
```

### 4. Next.js Frontend Configuration (`frontend/.env`)
Create `frontend/.env` and fill it with:
```env
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_API_URL="http://localhost:4000/api"      # Render: https://your-nest-api.onrender.com/api
NEXT_PUBLIC_BASE_URL="http://localhost:4000"          # Render: https://your-nest-api.onrender.com
NEXT_PUBLIC_AI_URL="http://localhost:8000"            # Render: https://your-fastapi-ai.onrender.com
NEXT_PUBLIC_UTILS_URL="http://localhost:3001"         # Render: https://your-node-services.onrender.com
NEXTAUTH_URL="http://localhost:3000"                  # Render: https://your-frontend.onrender.com
NEXTAUTH_SECRET="your-auth-secret-key"
AUTH_SECRET="your-auth-secret-key"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_your-imagekit-public-key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your-mapbox-public-token"
```
```

---

## 🚀 Running Everything Locally

You can launch our entire platform natively in development mode in a few easy commands.

### Prerequisites
*   Node.js (v18+)
*   Python (3.9 - 3.11)
*   Redis server running locally (Default port `6379` for BullMQ queues and caching)

### Step 1: Initialize Database Client
Run Prisma generator inside `backend/nest-api` to bootstrap models:
```bash
cd backend/nest-api
npm install
npm run prisma:generate
```

### Step 2: Boot Services
Open **4 terminal windows** and execute the commands below:

*   **Terminal 1 — NestJS core API Gateway**:
    ```bash
    cd backend/nest-api
    npm run start:dev
    # Runs at http://localhost:4000 (Swagger docs at http://localhost:4000/api/docs)
    ```

*   **Terminal 2 — Python FastAPI AI Engine**:
    ```bash
    cd backend/fastapi-ai
    # Activate virtual environment
    .venv\Scripts\activate      # Windows
    source .venv/bin/activate    # Mac/Linux
    python -m app.main
    # Runs at http://localhost:8000
    ```

*   **Terminal 3 — Node Express Utility Service**:
    ```bash
    cd backend/node-services
    npm install
    npm run dev
    # Runs at http://localhost:3001
    ```

*   **Terminal 4 — Next.js React Client**:
    ```bash
    cd frontend
    npm install
    npm run dev
    # Runs at http://localhost:3000
    ```

---

## 🐳 Running via Docker Compose (Easiest)

If you have Docker installed, you can start all services, caching mechanisms, queues, and reverse-proxy routers in a single command!

For local development with live directory mounts:
```bash
docker compose -f docker-compose.dev.yml up --build
```

For production-mimicked builds:
```bash
docker compose up --build
```
This loads Nginx gateway at `http://localhost`, routing `/api/` traffic directly to NestJS, `/ai/` to FastAPI, `/utils/` to Express utility service, and standard web traffic to Next.js.

---

## ☁️ Independent Hosting & Deployment on Render

Render is perfect for hosting these microservices independently. Set up **3 distinct Web Services** and **1 Static Site/Web Service** for the frontend:

### 1. `nest-api` Web Service (API Gateway)
*   **Repo Subfolder**: `backend/nest-api`
*   **Language**: `Node`
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm run start:prod`
*   **Environment Variables**: Add all variables defined in `backend/nest-api/.env`.
*   **Render Redis**: Provision a private Redis database in Render and set `REDIS_URL` in the NestJS Web Service to point to the Render Redis connection string.

### 2. `fastapi-ai` Web Service (AI/ML Engine)
*   **Repo Subfolder**: `backend/fastapi-ai`
*   **Language**: `Python`
*   **Build Command**: `pip install -r requirements.txt`
*   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   **Environment Variables**: Add all variables defined in `backend/fastapi-ai/.env`. Make sure `PORT` is automatically managed or configured.

### 3. `node-services` Web Service (Express Utilities)
*   **Repo Subfolder**: `backend/node-services`
*   **Language**: `Node`
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm run start`
*   **Environment Variables**: Add all variables defined in `backend/node-services/.env`.

### 4. `frontend` Web Service (Next.js Application)
*   **Repo Subfolder**: `frontend`
*   **Language**: `Node`
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm run start`
*   **Environment Variables**:
    *   Set `NEXT_PUBLIC_API_URL` to point to the live URL of your **`nest-api`** service (e.g. `https://jansankalp-nest-api.onrender.com/api`).
    *   Set `NEXT_PUBLIC_AI_URL` to point to the live URL of your **`fastapi-ai`** service (e.g. `https://jansankalp-fastapi-ai.onrender.com`).
    *   Set `NEXT_PUBLIC_UTILS_URL` to point to the live URL of your **`node-services`** service (e.g. `https://jansankalp-node-services.onrender.com`).
    *   Set `NEXTAUTH_URL` to point to your live frontend URL (e.g. `https://jansankalp.onrender.com`).
    *   Include NextAuth secrets and Mapbox/ImageKit tokens.

---

## 🔒 Service-to-Service Security & CORS

*   **Security Header**: All backend API endpoints inside `fastapi-ai` and `node-services` are private and protected. Any request must include `Authorization: Bearer <INTERNAL_SERVICE_TOKEN>` generated matching `INTERNAL_SERVICE_TOKEN` in the environment files.
*   **Cross-Origin Requests**: Backend configurations are set up to support secure CORS configurations, meaning the frontend can communicate smoothly across all three distinct domain endpoints.
