# JanSankalp AI — Step-by-Step Vercel & Render Deployment Guide

This guide walks you through deploying the **JanSankalp AI Smart Civic Governance Platform** to production. 
*   **Frontend**: Deployed on **Vercel**
*   **Backends (3 Microservices)**: Deployed on **Render**
*   **Databases (PostgreSQL & Redis)**: Provisioned on **Render** (or **Neon** / **Upstash**)

---

## Part 1: Provisioning Databases on Render

Before deploying any service, we must set up the database and cache instances.

### 1. Create a PostgreSQL Database
1. Go to the [Render Dashboard](https://dashboard.render.com/) and log in.
2. Click **New +** in the top right and select **PostgreSQL**.
3. Fill in the fields:
    *   **Name**: `jansankalp-postgres`
    *   **Database**: `jansankalp`
    *   **User**: `dbadmin`
    *   **Region**: Select a region close to your target audience (e.g., `Singapore` or `Oregon`).
4. Click **Create Database**.
5. Once active, copy the **External Connection String** (it starts with `postgresql://...`). Save this as your `DATABASE_URL`.

### 2. Create a Redis Instance (for BullMQ queues)
1. In the Render Dashboard, click **New +** and select **Redis**.
2. Fill in the fields:
    *   **Name**: `jansankalp-redis`
    *   **Region**: **MUST select the same region as PostgreSQL** for minimal latency.
3. Click **Create Redis**.
4. Once active, copy the **External Connection String** (it starts with `rediss://...`). Save this as your `REDIS_URL`.

---

## Part 2: Deploying the 3 Backend APIs on Render

We will deploy all three backend services using their pre-configured **Dockerfiles** already present in the directories.

```
                  ┌───────────────────────┐
                  │ Render Web Dashboard  │
                  └───────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
│ 1. fastapi-ai   │  │ 2. node-services │  │ 3. nest-api    │
│ (Python Engine) │  │ (Node Utilities) │  │ (Core Gateway) │
└─────────────────┘  └──────────────────┘  └────────────────┘
```

---

### Service 1: `fastapi-ai` (Python AI Engine)

1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. In the configuration page:
    *   **Name**: `jansankalp-fastapi-ai`
    *   **Region**: Select the same region as the database.
    *   **Root Directory**: `backend/fastapi-ai` (Very Important!)
    *   **Runtime**: `Docker` (Render will automatically locate the `Dockerfile` inside `backend/fastapi-ai`).
4. Scroll down to **Environment Variables** and click **Add Environment Variable**:
    *   `PORT` = `8000`
    *   `INTERNAL_SERVICE_TOKEN` = `jansankalp-internal-secret-service-token-2026` *(Ensure this matches across all backends!)*
    *   `OPENAI_API_KEY` = `your_openai_api_key`
    *   `GROK_API_KEY` = `your_grok_api_key`
    *   `HUGGINGFACE_API_KEY` = `your_huggingface_key`
    *   `COHERE_API_KEY` = `your_cohere_key`
    *   `ASSEMBLY_AI_API_KEY` = `your_assembly_ai_key`
5. Click **Create Web Service**. 
6. Once deployed, copy your service's live URL (e.g. `https://jansankalp-fastapi-ai.onrender.com`). Save this as `AI_SERVICE_URL`.

---

### Service 2: `node-services` (Express Utility Processor)

1. Click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. In the configuration page:
    *   **Name**: `jansankalp-node-services`
    *   **Region**: Same region.
    *   **Root Directory**: `backend/node-services` (Very Important!)
    *   **Runtime**: `Docker`
4. Add the following **Environment Variables**:
    *   `PORT` = `3001`
    *   `NODE_ENV` = `production`
    *   `INTERNAL_SERVICE_TOKEN` = `jansankalp-internal-secret-service-token-2026`
    *   `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` = `your_imagekit_public_key`
    *   `IMAGEKIT_PRIVATE_KEY` = `your_imagekit_private_key`
    *   `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` = `your_imagekit_url`
    *   `RESEND_API_KEY` = `your_resend_api_key`
    *   `SMTP_PASS` = `your_smtp_password`
    *   `SMTP_FROM` = `alerts@jansankalp.org`
    *   `NEST_API_INTERNAL_URL` = `Temporary placeholder - update after deploying nest-api`
5. Click **Create Web Service**.
6. Once deployed, copy your service's live URL (e.g. `https://jansankalp-node-services.onrender.com`). Save this as `NODE_SERVICES_URL`.

---

### Service 3: `nest-api` (Core Business & Queue Gateway)

1. Click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. In the configuration page:
    *   **Name**: `jansankalp-nest-api`
    *   **Region**: Same region.
    *   **Root Directory**: `backend/nest-api` (Very Important!)
    *   **Runtime**: `Docker`
4. Add the following **Environment Variables**:
    *   `PORT` = `4000`
    *   `DATABASE_URL` = `your_render_postgresql_external_connection_string` *(From Part 1)*
    *   `REDIS_URL` = `your_render_redis_connection_string` *(From Part 1)*
    *   `AUTH_SECRET` = `I/9TpoQCI36gforZOYZ2MsOS7MjqWMdPwTBJW1WWQpg=`
    *   `INTERNAL_SERVICE_TOKEN` = `jansankalp-internal-secret-service-token-2026`
    *   `AI_SERVICE_URL` = `your_live_fastapi_ai_url` *(From Service 1)*
    *   `NODE_SERVICES_URL` = `your_live_node_services_url` *(From Service 2)*
    *   `RESEND_API_KEY` = `your_resend_api_key`
    *   `SMTP_EMAIL` = `your_alert_email`
    *   `SMTP_PASSWORD` = `your_alert_email_password`
5. Click **Create Web Service**.
6. Once deployed, copy your service's live URL (e.g. `https://jansankalp-nest-api.onrender.com`). Save this as `NEXT_PUBLIC_BASE_URL`.
    *   *Note: Add `/api` to the end of this URL to create your `NEXT_PUBLIC_API_URL` (e.g. `https://jansankalp-nest-api.onrender.com/api`).*

### 🔄 Retroactive Fix: Update `node-services`
1. Go back to `jansankalp-node-services` on the Render dashboard.
2. Click **Environment** in the left menu.
3. Update `NEST_API_INTERNAL_URL` with your live NestJS Gateway URL: `https://jansankalp-nest-api.onrender.com`.
4. Save the changes. Render will automatically redeploy it.

---

## Part 3: Deploying Frontend (Next.js) on Vercel

```
  ┌────────────────────────────────────────────────────────┐
  │                   Vercel Dashboard                     │
  └───────────────────────────┬────────────────────────────┘
                              ▼
                 Select Root Dir: "frontend/"
                              ▼
                Set environment vars & Build!
```

1. Go to the [Vercel Dashboard](https://vercel.com/) and log in.
2. Click **Add New...** and select **Project**.
3. Select and import your GitHub repository.
4. On the configuration screen:
    *   **Project Name**: `jansankalp-frontend`
    *   **Framework Preset**: `Next.js`
    *   **Root Directory**: Click **Edit** next to Root Directory and select the `frontend` folder. Click **Continue**.
5. Expand the **Environment Variables** section and paste the following keys:
    *   `NEXT_PUBLIC_API_URL` = `https://jansankalp-nest-api.onrender.com/api` *(From Service 3)*
    *   `NEXT_PUBLIC_BASE_URL` = `https://jansankalp-nest-api.onrender.com` *(From Service 3)*
    *   `NEXT_PUBLIC_AI_URL` = `https://jansankalp-fastapi-ai.onrender.com` *(From Service 1)*
    *   `NEXT_PUBLIC_UTILS_URL` = `https://jansankalp-node-services.onrender.com` *(From Service 2)*
    *   `DATABASE_URL` = `your_render_postgresql_external_connection_string` *(Same database URL for Prisma Client compilation)*
    *   `NEXTAUTH_SECRET` = `I/9TpoQCI36gforZOYZ2MsOS7MjqWMdPwTBJW1WWQpg=` *(Must match backend)*
    *   `AUTH_SECRET` = `I/9TpoQCI36gforZOYZ2MsOS7MjqWMdPwTBJW1WWQpg=` *(Must match backend)*
    *   `NEXTAUTH_URL` = `Temporary placeholder - you will update this with Vercel's generated URL`
6. Click **Deploy**. Vercel will build the frontend, run the Prisma generation, and compile all static dashboards successfully!
7. Once deployed, copy your Vercel deployment URL (e.g. `https://jansankalp-frontend.vercel.app`).
8. **Update `NEXTAUTH_URL`**: Go to your Vercel Project **Settings** -> **Environment Variables**, edit `NEXTAUTH_URL` to match your Vercel live URL (`https://jansankalp-frontend.vercel.app`), and redeploy the project for the authentication handshake to operate flawlessly.

---

> [!IMPORTANT]
> **Database Seed & Init**: 
> The first time you deploy, make sure your PostgreSQL database tables are initialized. Vercel automatically runs `prisma generate` during its build process. You can easily seed your tables using the command line locally:
> ```bash
> cd frontend
> npx prisma db push --accept-data-loss
> ```
> This configures the relational tables in your live PostgreSQL cloud.
