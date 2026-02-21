<div align="center">
  <img src="public/logojansanklp.png" alt="JanSankalp AI Logo" width="180" />

# 🇮🇳 JanSankalp AI — Smart Civic Governance Platform

### _AI · Federated Learning · IoT · Satellite · Real-Time_

[![Build](https://github.com/abx15/JanSankalp-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/abx15/JanSankalp-AI/actions/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](docker/docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Engine](https://img.shields.io/badge/FastAPI-AI%20Engine-green?logo=fastapi)](ai-engine/)

</div>

---

## ✅ How to Run Everything (Step by Step)

> Follow these steps **in order**. All services connect to each other via `.env` files.

---

### 🗂️ Step 1 — Clone the Repository

```bash
git clone https://github.com/abx15/JanSankalp-AI.git
cd JanSankalp-AI
```

---

### 🔑 Step 2 — Setup Frontend `.env.local`

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in these **required** values:

| Variable                                                                 | Where to Get                                                           | Purpose                                |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------- |
| `DATABASE_URL`                                                           | [neon.tech](https://neon.tech) → New Project → Connection String       | Stores all complaints, users, sessions |
| `AUTH_SECRET`                                                            | [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) | Encrypts sessions                      |
| `NEXTAUTH_SECRET`                                                        | Same as above (can be same value)                                      | NextAuth security                      |
| `NEXTAUTH_URL`                                                           | `http://localhost:3000` (dev)                                          | Auth redirect base                     |
| `NEXT_PUBLIC_AI_ENGINE_URL`                                              | `http://localhost:10000`                                               | Connects frontend → AI engine          |
| `OPENAI_API_KEY`                                                         | [platform.openai.com/api-keys](https://platform.openai.com/api-keys)   | AI suggestions                         |
| `RESEND_API_KEY`                                                         | [resend.com/api-keys](https://resend.com/api-keys)                     | OTP emails                             |
| `NEXT_PUBLIC_PUSHER_KEY` + `PUSHER_SECRET`                               | [dashboard.pusher.com](https://dashboard.pusher.com)                   | Real-time updates                      |
| `IMAGEKIT_PRIVATE_KEY` + `IMAGEKIT_PUBLIC_KEY` + `IMAGEKIT_URL_ENDPOINT` | [imagekit.io](https://imagekit.io/dashboard)                           | Photo uploads                          |

---

### 🐍 Step 3 — Setup AI Engine `.env`

```bash
cp ai-engine/.env.example ai-engine/.env
```

Open `ai-engine/.env` and fill in:

| Variable                  | Where to Get                                                             | Purpose                        |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------ |
| `OPENAI_API_KEY`          | [platform.openai.com/api-keys](https://platform.openai.com/api-keys)     | Complaint classification, chat |
| `ASSEMBLY_AI_API_KEY`     | [assemblyai.com/app/account](https://www.assemblyai.com/app/account)     | Voice transcription            |
| `COHERE_API_KEY`          | [dashboard.cohere.com](https://dashboard.cohere.com/api-keys)            | Multi-language translation     |
| `HUGGINGFACE_API_KEY`     | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | CV (image analysis)            |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` (local) or Upstash Kafka URL                            | Real-time streaming            |
| `WEAVIATE_URL`            | `http://localhost:8080` (local)                                          | Duplicate detection            |

---

### 📦 Step 4 — Install Dependencies

**Frontend:**

```bash
npm install
```

**AI Engine:**

```bash
cd ai-engine
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

---

### 🗄️ Step 5 — Setup Database

```bash
# Run migrations to create all tables
npx prisma migrate dev --name init

# Seed with test data (Admin, Officer, Citizen accounts)
npx prisma db seed
```

Test credentials after seeding → see [LOGIN_DETAILS.md](LOGIN_DETAILS.md)

---

### 🚀 Step 6 — Run All Services

Open **3 terminals** simultaneously:

**Terminal 1 — Next.js Frontend:**

```bash
npm run dev
# → Runs at http://localhost:3000
```

**Terminal 2 — AI Engine:**

```bash
cd ai-engine
venv\Scripts\activate     # Windows
python -m app.main
# → Runs at http://localhost:10000
```

**Terminal 3 — Kafka (Optional, for real-time streaming):**

```bash
docker run -d -p 9092:9092 apache/kafka:latest
```

---

### 🐳 Option B — Run Everything with Docker (Easiest)

```bash
docker compose -f docker/docker-compose.yml up
```

> This starts: Next.js + AI Engine + Kafka + Weaviate together.

---

## 🔌 How All Services Are Connected

```
.env.local                      .env (ai-engine)
─────────────────────────────────────────────────────
NEXT_PUBLIC_AI_ENGINE_URL  ──▶  FastAPI (Port 10000)
DATABASE_URL               ──▶  PostgreSQL (Prisma ORM)
PUSHER keys                ──▶  Real-time WebSockets
IMAGEKIT keys              ──▶  Photo upload & storage
OPENAI_API_KEY             ──▶  AI Suggestions API
RESEND_API_KEY             ──▶  OTP Email delivery
                                ↕
                       KAFKA_BOOTSTRAP_SERVERS
                       (sensor_telemetry, vision_event topics)
                       WEAVIATE_URL
                       (vector search for duplicates)
                       HUGGINGFACE_API_KEY
                       (CV models: pothole, garbage)
                       ASSEMBLY_AI_API_KEY
                       (voice → text transcription)
```

---

## 🏗️ Full System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│             JANSANKALP AI — COMPLETE CONNECTED SYSTEM              │
│                                                                    │
│  Citizens / Officers / Admins                                      │
│      │                                                             │
│      ▼                                                             │
│  Next.js Frontend  (:3000)      ←── .env.local                    │
│  ├── /dashboard (Admin)                                            │
│  │     ├── FLDashboard (Federated AI)                             │
│  │     └── InfraDashboard (IoT + Satellite)                       │
│  ├── /dashboard/officer                                            │
│  └── /api/*  (Next.js API Routes)                                 │
│      │  PostgreSQL via Prisma                                      │
│      │  Pusher WebSockets                                          │
│      │  ImageKit Uploads                                           │
│      │                                                             │
│      ▼  HTTP / REST                                                │
│  FastAPI AI Engine  (:10000)    ←── ai-engine/.env                │
│  ├── /process-workflow          (Spam→Classify→Route→ETA)          │
│  ├── /federated/train-round     (FL Training)                      │
│  ├── /analytics/federated       (FL Dashboard data)                │
│  ├── /iot/ingest                (Sensor telemetry)                 │
│  ├── /vision/analyze            (CV: Satellite/CCTV)               │
│  └── /analytics/infrastructure  (Risk heatmap)                    │
│      │                                                             │
│      ▼  Apache Kafka                                               │
│  ┌─────────────────────────────────────────────────────┐          │
│  │  Topics: complaint_submitted | sensor_telemetry      │          │
│  │          vision_event | system_alert                 │          │
│  └────────────────────────┬────────────────────────────┘          │
│                           ▼                                        │
│  stream_processor.py  → Flood Risk → Power Alerts → Auto-Escalate │
│                                                                    │
│  Data Layer                                                        │
│  ├── PostgreSQL (NeonDB)  — users, complaints, sessions            │
│  ├── Weaviate Vector DB   — semantic duplicate detection           │
│  └── Sensor buffer        — IoT time-series data                  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
JanSankalp AI/
│
├── .env.example             ← Frontend env template  ← START HERE
├── ai-engine/.env.example   ← AI Engine env template ← COPY THIS TOO
│
├── ai-engine/               ← FastAPI Python AI Backend
│   ├── app/main.py          ← All API endpoints
│   ├── app/federated/       ← Federated Learning (coordinator, nodes, aggregator)
│   ├── app/services/
│   │   ├── iot_service.py       ← Water/Air/Electricity sensors
│   │   ├── vision_service.py    ← Satellite + CCTV CV models
│   │   ├── risk_service.py      ← Flood + Power outage predictor
│   │   └── analytics_service.py ← Dashboard data generator
│   └── app/events/
│       ├── kafka_client.py      ← Kafka producer/consumer
│       └── stream_processor.py  ← Real-time event handler
│
├── src/                     ← Next.js Frontend
│   ├── app/dashboard/page.tsx       ← Admin dashboard (FL + Infra sections)
│   ├── components/dashboard/
│   │   ├── FLDashboard.tsx          ← Federated Learning UI
│   │   └── InfraDashboard.tsx       ← Live IoT / Risk Map UI
│   └── lib/ai-service.ts            ← All AI Engine API calls
│
├── prisma/schema.prisma     ← Database schema
├── docs/IOT_ARCHITECTURE.md ← IoT sensor + Kafka connection guide
├── docker-compose.yml       ← Run everything with one command
└── render.yaml              ← One-click Render.com deployment
```

---

## 🛠️ Full Tech Stack

| Layer            | Technology                           | Purpose                               |
| ---------------- | ------------------------------------ | ------------------------------------- |
| **Frontend**     | Next.js 14, TypeScript, Tailwind CSS | UI, routing, API handlers             |
| **AI Engine**    | FastAPI (Python), PyTorch            | ML models, LLM API, FL coordinator    |
| **Database**     | PostgreSQL (NeonDB), Prisma ORM      | Persistent data                       |
| **Vector DB**    | Weaviate                             | Semantic duplicate detection          |
| **Streaming**    | Apache Kafka (`aiokafka`)            | Real-time sensor + complaint pipeline |
| **Real-time**    | Pusher WebSockets                    | Live dashboard updates                |
| **Auth**         | NextAuth.js v5, OTP via Resend       | Secure role-based login               |
| **Storage**      | ImageKit                             | Complaint photo uploads               |
| **Federated ML** | PyTorch + Differential Privacy       | Privacy-safe district AI training     |
| **CV / IoT**     | OpenCV, Pillow, HuggingFace          | Pothole/flood/garbage detection       |
| **Deployment**   | Docker, Render.com, Vercel           | Production ready                      |

---

## 📚 Documentation

| File                                                 | Description                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| [docs/IOT_ARCHITECTURE.md](docs/IOT_ARCHITECTURE.md) | IoT sensor formats, Kafka topics, API curl examples |
| [DEPLOYMENT.md](DEPLOYMENT.md)                       | Docker, Render.com, Vercel, Kubernetes guide        |
| [LOGIN_DETAILS.md](LOGIN_DETAILS.md)                 | Test credentials (Admin, Officer, Citizen)          |
| [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) | Security analysis & compliance                      |
| [CHANGELOG.md](CHANGELOG.md)                         | Feature history                                     |

---

## ⚖️ License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/abx15"><strong>Arun Kumar Bind</strong></a></p>
  <p><em>AI · Federated Learning · IoT · Satellite · For a Smarter India 🇮🇳</em></p>
</div>
