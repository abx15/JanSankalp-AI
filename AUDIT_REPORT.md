# JanSankalp AI Platform — Comprehensive Codebase Audit Report (Phase 0)

This report details the current architecture, dependencies, endpoints, database schemas, and data flows of the JanSankalp AI platform. It maps out existing redundancies and outlines architectural bottlenecks before migration.

---

## 1. Complete Directory Structures & Component Mappings

### `backend/fastapi-ai` (Python AI/ML Engine)
Exposes analytical models and coordinates multi-agent LLM pipelines.
*   **`app/main.py`**: Entry point registering routers, internal token validation middleware, request logger, and startup events (loading models, initializing background Kafka processors).
*   **`app/api/`**: 
    *   `routes_ai.py`: API route handlers for chat, classifications, routing, voice STT, compliance, and national twin command.
    *   `models_status.py`: Health checkpoints and dynamic reloads of local NLP/Vision models.
*   **`app/agents/`**: Core LLM nodes (`spam_agent.py`, `classification_agent.py`, `routing_agent.py`, etc.) managed by `coordinator_agent.py`.
*   **`app/services/`**: Concrete service modules implementing specific APIs (AssemblyAI voice STT, Hugging Face CCTV analysis, Q-learning RL, Weaviate RAG embedders).
*   **`app/rl/` & `app/federated/`**: Local learning agents (Q-table optimization, local decentralized federated training).
*   **`app/events/`**: Kafka stream processing processor.

### `backend/nest-api` (TypeScript NestJS Gateway)
Coordinates core database transactions and manages background queues.
*   **`src/main.ts`**: Express bootstrapper configuring CORS, Validation Pipes, Swagger docs, Helmet security headers, compression, and request correlation IDs.
*   **`src/app.module.ts`**: Imports core modules: Config, Throttler, Database, Auth, Workflows, Agents, Queue.
*   **`src/database/`**: `prisma.service.ts` connecting to PostgreSQL using a local Prisma client.
*   **`src/auth/`**: Custom passport-jwt handlers exposing authentication endpoints.
*   **`src/workflows/`**: Handles CRUD requests on complaints.
*   **`src/agents/`**: Implements WebSocket gateway `/agents` to stream LLM responses from FastAPI `/chat` via SSE, alongside proxy REST routes.
*   **`src/queue/`**: Configures BullMQ `workflow-queue` (`queue.service.ts`) and launches `WorkflowProcessor` worker (`processors/workflow.processor.ts`).

### `backend/node-services` (Express Utilities)
Handles heavy external library integrations (Stripe, Resend email dispatch, ImageKit upload signatures).
*   **`src/index.ts`**: Main script initializing Express, CORS headers, Helmet, and global exception middlewares.
*   **`src/routes/`**: Handles Express routing. Includes `email.routes.ts`, `payment.routes.ts`, and `upload.routes.ts`.
*   **`src/controllers/`**: Controller endpoints for email notification dispatches, Stripe webhooks, and ImageKit credentials signatures.
*   **`src/services/`**: Underlying service modules wrapping Stripe SDK, ImageKit API, Resend, and Nodemailer SMTP transporter.

### `frontend` (Next.js 14 Client App)
Houses UI elements, handles NextAuth authentication, and queries Prisma directly.
*   **`src/app/api/`**: Local Next.js API routes duplicating data controllers for users, complaints, budget forecasts, notifications, sovereign twin data, etc.
*   **`src/modules/`**: Contains client-side forms, schemas, state queries, and repository modules (e.g. `complaints.service.ts`, `budget.repository.ts`) containing direct SQL/Prisma operations.
*   **`src/lib/`**: Singletons like `prisma.ts`, `pusher.ts`, `pusher-client.ts`, and helper functions.
*   **`src/components/`**: Dashboards, maps, chat assistants, and notification hubs.

---

## 2. Deep Dive: The True Role of `node-services`

**Yes, `node-services` is a separate utility microservice.** It is *not* legacy code, nor does it represent direct duplication of business logic. Its purpose is to isolate heavy external SDKs and specific body-parsing rules:
1.  **Stripe Webhook Parsing**: Stripe signatures must be checked against raw requests (`express.raw({ type: 'application/json' })`). Implementing this in NestJS often conflicts with global JSON body parser configurations. `node-services` receives the raw body, verifies the signature, and forwards the parsed event to `nest-api/api/payments/webhook`.
2.  **Notification Dispatches**: Isolates email dependencies (`resend`, `nodemailer`) from the core gateway, preserving its execution thread and footprint.
3.  **Media Uploads Signatures**: Generates ImageKit client-side signatures to allow direct uploads from browsers without overloading server bandwidth.

**Recommendation**: Keep `node-services` as a separate utility service to isolate third-party libraries. However, it should only be accessible internally via the Nginx API gateway or internal service-to-service networks.

---

## 3. Endpoints Matrix

### `backend/nest-api` Endpoints

| HTTP Method | Route | Purpose | Request Body / Response Shape |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | User registration | **Req**: `{ email, password, name, role, ... }`<br>**Res**: `{ success: true, user, accessToken }` |
| **POST** | `/auth/login` | User login (returns JWT) | **Req**: `{ email, password }`<br>**Res**: `{ success: true, user, accessToken }` |
| **POST** | `/auth/refresh` | Obtains new JWT using Refresh Cookie | **Req**: `Cookie: refreshToken`<br>**Res**: `{ success: true, user, accessToken }` |
| **POST** | `/auth/logout` | Clears refresh cookie | **Req**: `None`<br>**Res**: `{ success: true, message }` |
| **GET** | `/auth/session` | Fetches active session info | **Req**: `Bearer JWT`<br>**Res**: `{ success: true, user }` |
| **GET** | `/workflows/complaints` | Paginated complaint filters (Cursor-based) | **Req**: `Query params (status, category, limit, cursor)` <br>**Res**: `{ success: true, data: Complaint[], nextCursor }` |
| **GET** | `/workflows/complaints/:id` | Fetches a single complaint by ID | **Req**: `None`<br>**Res**: `{ success: true, data: Complaint }` |
| **POST** | `/workflows/complaints` | Files complaint & enqueues BullMQ pipeline | **Req**: `{ title, description, category, severity, lat, lng }`<br>**Res**: `{ success: true, data: Complaint }` |
| **POST** | `/workflows/complaints/assign` | Assigns complaint to officer | **Req**: `{ complaintId, officerId }`<br>**Res**: `{ success: true, ... }` |
| **PUT** | `/workflows/complaints/:id` | Updates complaint status or details | **Req**: `{ status, category, ... }`<br>**Res**: `{ success: true, data: Complaint }` |
| **POST** | `/agents/chat` | Proxies chat message to FastAPI | **Req**: `{ message, history }`<br>**Res**: `{ response: string }` |
| **POST** | `/agents/classify` | Proxies category classification to FastAPI | **Req**: `{ text }`<br>**Res**: `{ category, severity, confidence, reasoning }` |
| **POST** | `/agents/duplicate-check` | Proxies duplicate checks to FastAPI | **Req**: `{ text, latitude, longitude }`<br>**Res**: `{ is_duplicate, duplicate_of }` |
| **POST** | `/agents/spam-check` | Proxies spam detection to FastAPI | **Req**: `{ text }`<br>**Res**: `{ is_spam, confidence }` |
| **POST** | `/agents/process-workflow` | Triggers FastAPI RAG/ML pipelines | **Req**: `{ complaintId, text, latitude, longitude }`<br>**Res**: `{ ...aiResult }` |
| **POST** | `/agents/assistant/chat` | Proxies conversational queries | **Req**: `{ message, context }`<br>**Res**: `{ text, assistant_name, intent, ... }` |
| **GET** | `/health` | Core microservice health check | **Res**: `{ status: "online", service: "nest-api" }` |

### `backend/node-services` Endpoints

| HTTP Method | Route | Purpose | Request Body / Response Shape |
| :--- | :--- | :--- | :--- |
| **POST** | `/utils/payment/webhook` | Stripe webhook parser and verifier | **Req**: `Raw Stripe signature headers` + body<br>**Res**: `{ received: true }` |
| **POST** | `/utils/email/send` | Dispatches emails (Internally authenticated) | **Req**: `{ to, subject, html }`<br>**Res**: `{ success: true, id }` |
| **GET** | `/utils/upload/imagekit-auth` | Client ImageKit signature generator | **Req**: `None`<br>**Res**: `{ token, signature, expire }` |
| **GET** | `/health` | Public microservice health check | **Res**: `{ status: "online", service: "node-services" }` |
| **GET** | `/utils/health` | Alternate health endpoint | **Res**: `{ status: "online", service: "node-services (via utils)" }` |

### `backend/fastapi-ai` Endpoints

*Note: All endpoints except `/health`, `/docs`, and `/openapi.json` require an `INTERNAL_SERVICE_TOKEN` authorization header.*

| HTTP Method | Route | Purpose | Request Body / Response Shape |
| :--- | :--- | :--- | :--- |
| **POST** | `/chat` | Generates direct LLM chatbot response | **Req**: `{ message, history }`<br>**Res**: `{ response }` |
| **POST** | `/classify` | Infers category, severity, and department | **Req**: `{ text }`<br>**Res**: `{ category, severity, confidence, reasoning }` |
| **POST** | `/duplicate-check` | Performs local vector search to find duplicates | **Req**: `{ text, latitude, longitude }`<br>**Res**: `{ is_duplicate, duplicate_of }` |
| **POST** | `/route` | Custom RL-based optimal officer/department route | **Req**: `{ category, severity }`<br>**Res**: `{ department_id, officer_id }` |
| **POST** | `/spam-check` | Filters out spam/gibberish reports | **Req**: `{ text }`<br>**Res**: `{ is_spam, confidence }` |
| **POST** | `/verify-resolution` | Validates completion using text/evidence image | **Req**: `{ complaint_text, resolution_text, evidence_image_url }`<br>**Res**: `{ resolution_verified, reasoning }` |
| **POST** | `/process-workflow` | Coordinates classification → dedup → route → ETA | **Req**: `{ complaint_id, text, latitude, longitude }`<br>**Res**: `{ is_spam, is_duplicate, assigned_department, analysis, ... }` |
| **GET** | `/analytics/rl` | Returns Q-table dimensions and training stats | **Res**: `{ policy_size, epsilon, efficiency_gain, reward_trend }` |
| **POST** | `/analytics` | Summarizes civic data forecasting indicators | **Res**: `{ ...aggregatedData }` |
| **GET** | `/analytics/federated` | Returns status of local district models | **Res**: `{ status, district_updates }` |
| **POST** | `/federated/train-round` | Simulates a decentralized district PyTorch train round | **Res**: `{ success: true, updated_weights }` |
| **POST** | `/iot/ingest` | Receives sensor data and updates health status | **Req**: `{ sensor_id, sensor_type, value, unit, lat, lng }`<br>**Res**: `{ success: true }` |
| **POST** | `/vision/analyze` | Evaluates raw camera snapshots using HF models | **Req**: `{ source_type, image_url, lat, lng }`<br>**Res**: `{ anomaly_detected, severity }` |
| **GET** | `/analytics/infrastructure`| Generates city risks and active sensors lists | **Res**: `{ health_map, active_sensors, flood_risk, alert_count }` |
| **POST** | `/voice-to-text` | transcribes voice uploads using AssemblyAI | **Req**: `{ audio_url }`<br>**Res**: `{ text }` |
| **POST** | `/translate` | Translates text between regional languages | **Req**: `{ text, target }`<br>**Res**: `{ translated_text }` |
| **POST** | `/predict-eta` | Forecasts ticket resolution time | **Req**: `{ category, severity, location_density }`<br>**Res**: `{ predicted_eta_hours }` |
| **GET** | `/compliance/audit-summary`| Lists blockchain hash keys and audit statistics | **Res**: `{ block_count, integrity_checked }` |
| **GET** | `/compliance/bias-report` | Evaluates demographics routing fairness | **Res**: `{ fairness_index }` |
| **GET** | `/urban/risk-heatmap` | Generates location coordinates for heatmaps | **Res**: `{ heatpoints: [] }` |
| **POST** | `/mayor/simulate` | Predicts approval ratings for policy parameters | **Req**: `{ params }`<br>**Res**: `{ predicted_ratings }` |
| **GET** | `/un/sdg-status` | Evaluates alignment indexes against UN SDGs | **Res**: `{ sdg_index }` |
| **POST** | `/security/check` | Evaluates threat flags (SQLi, Prompt injections) | **Req**: `{ payload }`<br>**Res**: `{ threat_detected, confidence }` |
| **POST** | `/governance/optimize-routing`| Recalculates reinforcement learning parameters | **Res**: `{ success: true, updated_policy }` |
| **POST** | `/assistant/chat` | Sync chat response generator | **Req**: `{ user_id, message, role, context }`<br>**Res**: `{ text, ... }` |
| **POST** | `/assistant/stream` | Streams assistant response via SSE | **Req**: `{ user_id, message, role, context }`<br>**Res**: `SSE chunks event-stream` |
| **GET** | `/health` | Core microservice health check | **Res**: `{ status: "online", service: "fastapi-ai" }` |
| **GET** | `/models/status` | Reports configuration status of models | **Res**: `{ success, data }` |
| **GET** | `/models/health` | Validates models execution status | **Res**: `{ status, models, device }` |
| **POST** | `/models/reload` | Flushes models and triggers reload | **Res**: `{ success, message }` |

### Redundancies & Mappings Analysis
*   **Duplicate Endpoints**: `/api/complaints`, `/api/budget/*`, and `/api/notifications` routes are defined *both* in Next.js internal Serverless API routes (`frontend/src/app/api/...`) and NestJS (`backend/nest-api`). Currently, the frontend UI components call relative Next.js paths (e.g. `fetch("/api/complaints")`), completely bypassing `nest-api`.
*   **Real-time Logic**: The frontend uses `Pusher` inside components (`RealTimeNotifications.tsx`) and contexts (`LiveEventContext.tsx`) for real-time notifications. The NestJS WebSocket Gateway `/agents` is unutilized on the frontend.

---

## 4. Current Frontend Integration Model

The frontend uses `fetch` to make HTTP requests:
1.  **Relative Internal Calls**: Component and page modules call internal Next.js routes (e.g., `fetch("/api/complaints")`). These serverless routes then perform database transactions directly via a local Prisma Client instance.
2.  **Unused API client**: `frontend/src/lib/api.ts` contains `apiFetch`, which intercepts path prefixes (`/ai/` and `/utils/`) and routes them to `NEXT_PUBLIC_AI_URL` and `NEXT_PUBLIC_UTILS_URL` respectively. However, `apiFetch` is never imported or called in the codebase.
3.  **Real-Time Data**: Subscribes directly to `Pusher` channels (`governance-channel` and user-specific rooms) rather than opening connections to the NestJS Gateway.

---

## 5. Check on Frontend `prisma/` Folder & Database Access

*   **Database Target**: The frontend's `prisma/schema.prisma` is identical to root and `nest-api` schemas. It points to a Neon cloud PostgreSQL instance using `DATABASE_URL`.
*   **Direct Database Access**: Next.js uses server-side Prisma adapter calls within `src/modules/` repositories (e.g., `user.repository.ts`, `complaint.repository.ts`, `budget.service.ts`). When Next.js routes are executed on the server, they query PostgreSQL directly.
*   **Issues**: This setup violates microservices boundary practices. The frontend should query database resources only via the central gateway (`nest-api`). Sharing database access credentials across multiple services invites write conflicts, schema drift, and transaction deadlocks.

---

## 6. Database Systems & Driver Mappings

| Service | Database Connected | Driver / ORM Tool | Active Models / Schemas |
| :--- | :--- | :--- | :--- |
| **`frontend`** | PostgreSQL (Neon) | Prisma Client (`@prisma/client`) | Full schema (20+ entities: Users, Wards, Complaints, Budgets, etc.) |
| **`nest-api`** | PostgreSQL (Neon) | Prisma Client (`@prisma/client`) | Full schema (20+ entities: Users, Wards, Complaints, Budgets, etc.) |
| **`fastapi-ai`** | None (Stateless) | None | Uses internal vectors (Weaviate) for semantic duplicate checking. |
| **`node-services`** | None (Stateless) | None | None |

### Key Issues:
1.  **Overlapping Schema Control**: Both `frontend` and `nest-api` share the Postgres connection and generate their own Prisma clients. `nest-api` should be the sole service communicating with Postgres.
2.  **Missing MongoDB Layer**: Although MongoDB is defined in `docker-compose.yml`, no service currently initiates database connections or defines Mongoose models.

---

## 7. Authentication Setup & Tenancy Validation

Currently, authentication is duplicated across services:
1.  **Next.js Frontend (NextAuth v5)**: NextAuth validates email and credentials on the server side using the database adapter, generating a session token stored in cookie headers. NextAuth callbacks inject custom user fields (role, tenantId, stateId, districtId, etc.) into the JWT session.
2.  **NestJS Backend (`passport-jwt`)**: `nest-api` implements a separate JWT strategy (`src/auth/guards/jwt-auth.guard.ts`) and rolls its own login/registration flows. The JWT secret is shared via environmental configs.
3.  **Authentication Gaps**: Because Next.js doesn't call NestJS, NextJS's validation filters are bypassed. The frontend and NestJS are isolated auth islands.

---

## 8. Real-Time Setup Gaps (Stale Data & Polling)

The codebase has several polling loops that retrieve data via `setInterval`. Under 100k+ concurrent users, this polling behavior will overload database connections:

*   **Infrastructure Dashboard** (`InfraDashboard.tsx`): Polling every 15 seconds (`fetchData`).
*   **Federated Learning** (`FLDashboard.tsx`): Polling every 30 seconds (`fetchMetrics`).
*   **AI Processing Center** (`AIProcessingCenter.tsx`): Polling every 60 seconds (`fetchAll`).
*   **UN Governance** (`un-governance/page.tsx`): Polling every 30 seconds (`fetchMetrics`).
*   **National Command** (`national-command/page.tsx`): Polling every 20 seconds (`fetchMetrics`).
*   **Incident Telemetry** (`incident/page.tsx`): Polling every 10 seconds (`fetchTelemetry`).
*   **User Sessions** (`SessionGuard.tsx`): Polling session refresh endpoints.

All these pollers must be replaced by WebSocket listeners bound to namespaces (e.g. `/dashboard`, `/infrastructure`, `/national-command`) managed by NestJS.

---

## 9. Key Code Smells & Scalability Bottlenecks

1.  **Direct Database Queries in Next.js Server**: Prevents horizontal scaling of business logic and creates connection spikes on the PostgreSQL pool.
2.  **Unbounded Database Fetches**: Several frontend and NestJS repositories run queries without pagination or page-limit logic. For example, `complaint.repository.ts` runs `prisma.complaint.findMany({ where: ... })` which will break when complaints scale.
3.  **Next.js Docker Port Conflict**: The production `docker-compose.yml` binds the frontend container directly to host port `80:80`. Because the Nginx gateway is also bound to host port `80:80`, this setup will crash on launch due to port binding conflicts. Next.js port binding in Compose should be removed, leaving Nginx as the single entry point.
4.  **No Connection Pooling**: Prisma is initialized without connection pooling parameters. Under high load, connection pools will exhaust, dropping database requests.
5.  **Direct Client-to-FastAPI Calls**: The design requires all requests to pass through the API gateway. Direct frontend calls to FastAPI violate security policies and bypass authentication.
6.  **Missing Circuit Breakers**: If the python AI engine fails or becomes slow, NestJS HTTP calls will block, consuming container threads and leading to a cascading failure.
