# JanSankalp AI — Full Codebase Audit & Architectural Mapping

This document details the comprehensive audit of the **JanSankalp AI Smart Civic Governance Platform** prior to restructuring into a 4-tier production-ready enterprise microservice architecture.

---

## 1. Directory Tree Analysis & Module Mappings

### `/client` (Frontend & Serverless API Routes)
The frontend is a **Next.js 14** application with App Router support. It is highly modularized, with domain business logic currently residing under `client/src/modules/` and exposed via API routes under `client/src/app/api/`.

*   **`src/app`**: Renders all visual pages (Citizen dashboards, Admin management, Officer workspaces, authentication portals, transparency ledger, sitemap, etc.).
*   **`src/modules`**: Encapsulates core business domains:
    *   `auth`: Authentication flow backed by NextAuth with Credentials provider, password hashing using `bcryptjs`, and tenancy/role checks.
    *   `user`: Profiles, regional mappings, points/gamification.
    *   `complaints`: Repository-service-controller pattern mapping complaint creation, updates, assigning officers, and integrating real-time events.
    *   `budget`: Operations for fiscal forecasting, actual logs, cost optimizations, and demand surges.
    *   `sovereign`: Complex SDG goals tracking, national twin node syncing, and crisis reallocation simulators.
    *   `notifications`: Real-time state synchronizations using Pusher and automated mail notifications (SMTP/Resend).
    *   `ai`: Connection shims to dynamic API engines (FastAPI & Grok fallbacks).
*   **`src/data` & `src/lib`**: Contains Prisma client singletons (`prisma.ts`), Pusher configurations, Kafka client shims, and core error wrappers.

### `/server` (Autonomous AI Engine)
A high-performance **FastAPI** Python application that houses heavy statistical computations, computer vision systems, Reinforcement Learning (RL), federated training processes, and the Multi-Agent RAG Orchestrator.

*   **`app/agents`**: Specialized LLM-powered nodes (`spam_agent.py`, `classification_agent.py`, `duplicate_rag_agent.py`, `routing_agent.py`, `eta_policy_agent.py`) coordinated by `coordinator_agent.py` to automate 95%+ of civic operations.
*   **`app/api`**: Exposes REST interfaces (`routes_ai.py`, `models_status.py`) for AI pipelines.
*   **`app/pipelines`**: Contains `llm_pipeline.py` which aggregates the coordinator agent workflows.
*   **`app/services`**: A rich layer of 24 domain-specific services spanning computer vision (Hugging Face pipelines), audio STT (AssemblyAI), text translation (Cohere), analytics engines, policy outcomes, bias trackers, and the local semantic RAG embedding processor.
*   **`app/rl`**: Implements a Q-learning Reinforcement Learning agent (`rl_agent.py`) to optimize complaint routing priorities dynamically based on feedback loops.
*   **`app/federated`**: Manages simulations of federated ML model updates across independent local districts to aggregate national intelligence without centralizing raw civic data.
*   **`app/events`**: Handles streaming data ingestion pipelines utilizing Apache Kafka.

### `/prisma`
Maintains seed scripts for comprehensive civic regional datasets, user credentials, and mock budget forecast statistics (`comprehensive_seed.js`).

### `/infrastructure`
Stores dev & prod multi-service configuration files including Nginx configuration, Dockerfiles, and Kubernetes manifests.

### `/scripts`
Provides DevOps shell scripts for database teardown (`clean.sh`), hot-reloading (`dev.sh`), initial provisioning (`setup.sh`), and administrative database seeding.

---

## 2. API Routes Matrix

### Next.js Internal API Endpoints (To Migrate to NestJS `nest-api`)

| Route Path | Method | Purpose | Source Module |
| :--- | :--- | :--- | :--- |
| `/api/auth/*` | ALL | NextAuth authentication handler | `src/modules/auth` |
| `/api/complaints` | GET/POST | Fetch user complaints / File a new civic grievance | `src/modules/complaints` |
| `/api/complaints/[id]` | GET/PUT | Read complaint details / Update status & notes | `src/modules/complaints` |
| `/api/complaints/assign` | POST | Assign a complaint to an officer | `src/modules/complaints` |
| `/api/budget/forecast` | GET/POST | Generate & query municipal budget forecasts | `src/modules/budget` |
| `/api/budget/actuals` | GET/POST | Record actual expenditures | `src/modules/budget` |
| `/api/budget/optimizations`| GET/PUT | Retrieve or execute cost optimization strategies | `src/modules/budget` |
| `/api/budget/surges` | GET | Track AI-predicted civic demand surges | `src/modules/budget` |
| `/api/sovereign/nodes` | GET/POST | Fetch geopolitical nodes hierarchy | `src/modules/sovereign` |
| `/api/sovereign/sdg` | GET/PUT | Track SDG Goals & indicators | `src/modules/sovereign` |
| `/api/sovereign/sim` | POST | Simulate local legislative policy trade-offs | `src/modules/sovereign` |
| `/api/sovereign/twin` | GET/POST | Real-time digital twin twin health-grid sync | `src/modules/sovereign` |
| `/api/sovereign/crisis` | POST | Deploy emergency resources during national crises | `src/modules/sovereign` |
| `/api/user/profile` | GET/PUT | Manage user metadata & profiles | `src/modules/user` |
| `/api/notifications` | GET/PUT | Retrieve user alerts & mark as read | `src/modules/notifications` |
| `/api/admin/tenants` | GET/POST | Tenancy management for municipal instances | `src/modules/user` |
| `/api/imagekit/auth` | GET | Generate secure tokens for image uploads | `src/modules/complaints` |

### FastAPI Engine Endpoints (To Modernize under `fastapi-ai`)

| Route Path | Method | Purpose | Engine Handler |
| :--- | :--- | :--- | :--- |
| `/chat` | POST | Direct LLM smart chat interface | `chat_service.py` |
| `/classify` | POST | Single-request category/severity scoring | `classification_service.py` |
| `/duplicate-check` | POST | Vector semantic duplicate checking | `duplicate_service.py` |
| `/route` | POST | Optimal officer matching service | `routing_service.py` |
| `/spam-check` | POST | Autonomous bot/gibberish filter | `spam_service.py` |
| `/verify-resolution` | POST | Computer vision validation of resolved complaints | `verification_service.py` |
| `/process-workflow` | POST | Autonomous multi-agent pipeline orchestrator | `llm_pipeline.py` |
| `/analytics/rl` | GET | Check Reinforcement Learning Q-table metrics | `rl_agent.py` |
| `/analytics/federated`| GET | Fetch aggregated multi-district ML training rates | `analytics_service.py` |
| `/federated/train-round`| POST | Simulate localized decentralized training round | `federated/coordinator.py` |
| `/iot/ingest` | POST | Ingest IoT civic sensors telemetry | `iot_service.py` |
| `/vision/analyze` | POST | Process camera/satellite streams using HF models | `vision_service.py` |
| `/analytics/infrastructure`| GET | Predictive civil infrastructure failure dashboard | `risk_service.py` |
| `/voice-to-text` | POST | Transcribe voice reports using AssemblyAI | `voice_service.py` |
| `/translate` | POST | Dynamic multilingual translation fallbacks | `translation_service.py` |
| `/predict-eta` | POST | Feedforward ML network ETA predictions | `ml_model_service.py` |
| `/compliance/bias-report`| GET | Monitor LLM routing and language fairness | `compliance_service.py` |
| `/compliance/audit-summary`| GET | Municipal compliance ledger summary | `compliance_service.py` |
| `/urban/risk-heatmap` | GET | Predict high-risk zones (infrastructure/floods) | `urban_intelligence_service.py` |
| `/mayor/simulate` | POST | Predict voter approval & policy outcome impacts | `ai_mayor_service.py` |
| `/un/sdg-status` | GET | Evaluate local alignment with standard UN SDGs | `un_governance_service.py` |
| `/security/check` | POST | Safeguard against prompt injection & bots | `threat_service.py` |
| `/governance/optimize-routing`| POST | Recalculate RL routing weights based on history | `governance_engine.py` |

---

## 3. Database Schema Models

The Prisma schema defines a highly integrated multi-tenant relational system with **24 tables**:

1.  **`User`**: Accounts mapping to multi-tenant structures with granular RBAC permissions (`Role` enum: Citizen, Officer, State/District/City Admin, Global Admin), points, and coordinate telemetry.
2.  **`Tenant`**: Tenant boundary parameters supporting SaaS white-label deployments.
3.  **`Subscription`**: Stripe-linked subscription details, usage quotas, and tier limits.
4.  **`State`**, **`District`**, **`City`**, **`Ward`**: Nested geographical tenancy parameters mapping users and complaints to local administrative boundaries.
5.  **`VerificationToken`**, **`PasswordResetToken`**: Authorization utility tables.
6.  **`Complaint`**: Central grievance record. Links to categories, severity, geo-telemetry, and hosts complex AI analysis JSON blocks, spam scores, duplicate identifiers, security hashing signatures, and blockchain transaction keys.
7.  **`Department`**: Municipal branch records (e.g., Road Safety, Waste Management) linking heads and budgets.
8.  **`Remark`**: Multi-role execution logs appended by citizens, officers, or the AI verifier.
9.  **`Notification`**: Audit alerts triggered via real-time connections or emails.
10. **`AuditLog`**: Tamper-proof administrative logs.
11. **`ThreatLog`**: Tracks security incidents (Prompt Injection, SQL Injection, Bot Spam) logged by the threat service.
12. **`Conversation`**, **`UserConversation`**, **`Message`**: Real-time conversational AI system logs, featuring bot flags, audio attachments, and message sentiments.
13. **`BudgetForecast`**, **`BudgetActual`**: Dynamic multi-tenant budget records. Integrates actual expenditure vs. AI forecast breakdowns.
14. **`CostOptimization`**: Cost saving recommendations produced by the policy analysis services.
15. **`DemandSurge`**: AI-predicted infrastructure overload warning triggers.
16. **`SovereignNode`**: Tree hierarchical node structures tracking geopolitical units (Global down to City).
17. **`SDGTarget`**: Dynamic metrics mapping localized actions to UN Sustainable Development Goals.
18. **`PolicySimulation`**: Evaluates prospective laws against historical citizen sentiment using LLM routing.
19. **`DigitalTwinNode`**: Models physical civic infrastructure elements (grids, bridges, pipes) reporting real-time telemetry.
20. **`NationalCrisis`**: Governs coordination during emergency alerts.

---

## 4. Key AI / ML Integration Channels

The core intelligence of JanSankalp is split across several third-party and local models:
1.  **OpenAI API (`sk-proj-...`)**:
    *   Powers the **Multi-Agent Orchestrator** for spam filtering, semantic taxonomy categorizations, departmental routing, policy evaluations, and conversational assistants.
    *   Generates embeddings (`text-embedding-3-small`) to enable standalone local numpy vector searches when Weaviate is offline.
2.  **xAI Grok API (`xai-...`)**:
    *   Serves as the high-availability failover layer for chat and classification pipelines when OpenAI API hits rate-limits.
3.  **Hugging Face Transformers (`hf_...`)**:
    *   Runs Computer Vision models (e.g., YOLO, ViT) for infrastructure deterioration detection and pothole/garbage validation from CCTV snapshot inputs.
4.  **Cohere Multi-lingual API (`PKE...`)**:
    *   Supports translation routing, standardizing multi-lingual localized complaints (Hindi, Tamil, Marathi, etc.) into English analysis models and back.
5.  **AssemblyAI (`e3f...`)**:
    *   Converts user-recorded voice reports into clean text feeds.
6.  **Reinforcement Learning Module (`Q-Learning`)**:
    *   A custom Python agent calculating dynamic routing penalties based on officer ticket turnaround performance.
7.  **Federated Learning System**:
    *   A localized simulation pipeline using PyTorch matrices (`torch.randn`) mapping weight distributions across districts.

---

## 5. Master Environment Variable Map

The unified `.env` will categorize settings so each service imports strictly what it needs:

| Env Key | Used By Service | Classification | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `nest-api`, `fastapi-ai` | Database Credentials | Neon cloud PostgreSQL connection URI |
| `REDIS_URL` | `nest-api`, `fastapi-ai` | Cache & Queues | Redis caching and BullMQ connection |
| `AUTH_SECRET`, `NEXTAUTH_SECRET` | `nest-api`, `frontend` | Core Security | Authentication token hashing |
| `NEXTAUTH_URL` | `frontend` | Route Mappings | NextAuth local / production callback |
| `OPENAI_API_KEY`, `OPENAI_ORG_ID` | `fastapi-ai` | LLM Key | OpenAI GPT-4o, Embeddings models |
| `GROK_API_KEY` | `fastapi-ai` | LLM Key | xAI Grok high-availability failover |
| `HUGGINGFACE_API_KEY` | `fastapi-ai` | Vision Key | CCTV, Satellite & Infrastructure CV models |
| `COHERE_API_KEY` | `fastapi-ai` | NLP Translation | Multi-lingual translation pipeline |
| `ASSEMBLY_AI_API_KEY` | `fastapi-ai` | Voice STT | Speech transcription endpoint |
| `SATELLITE_API_KEY` | `fastapi-ai` | Remote Sensing | Planet Labs / Google Earth tile API |
| `NEXT_PUBLIC_PUSHER_KEY` | `frontend` | WebSockets Client | Real-time channel key |
| `PUSHER_SECRET`, `PUSHER_APP_ID` | `nest-api`, `node-services` | WebSockets Server | Pusher trigger credential |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`| `frontend`, `node-services` | Media Uploads | Secure asset upload client key |
| `IMAGEKIT_PRIVATE_KEY` | `node-services` | Media Uploads | Secure asset signing |
| `SMTP_EMAIL`, `SMTP_PASSWORD` | `node-services` | SMTP Gateway | Resend fallback email transporter |
| `RESEND_API_KEY` | `node-services` | Notifications | Resend transactional mail gateway |
| `STRIPE_SECRET_KEY` | `node-services`, `nest-api` | Billing Gateway | Stripe subscriptions payments |
| `STRIPE_WEBHOOK_SECRET` | `node-services` | Webhooks Router | Stripe payment events callback |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `frontend` | Map Services | Geographical layers |

---

## 6. Structural Improvements & Cleanup Checklist

1.  **Decouple Next.js Serverless API**: Migrate database access logic, controller schemas, Pusher triggers, and Kafka pipeline events from `client/src/modules/` into the new **NestJS application** (`backend/nest-api`).
2.  **Move Schema to Root**: Place the `prisma` folder at the root `/prisma`, allowing easy schema changes. Generate Prisma clients in `backend/nest-api/` and `backend/fastapi-ai/` directly.
3.  **Service Isolation**:
    *   `fastapi-ai` handles strictly AI: SSE streams, agents orchestrations, embeddings generation, RL training, CV pipelines.
    *   `node-services` handles utilities: webhooks, file uploads (ImageKit/S3/R2), Resend/SMTP transactional mail notifications.
4.  **Inter-Service Auth**: Secure internal communication between `nest-api` and `fastapi-ai` using service token authentication.
5.  **State Management & SSE**: Implement SWR/React Query on the frontend pointing to the new NestJS backend API gateway, and configure custom SSE event hooks to handle streaming responses from FastAPI.

---
*Audit completed by Senior Software Architect Antigravity on May 21, 2026.*
