# JanSankalp AI Deployment Guide

This project consists of two main components that need to be deployed separately for production.

## 1. AI Engine (Python FastAPI) - Recommended: Render / Railway

The AI microservice handles complex NLP and ML tasks. Vercel is not ideal for long-running Python services with large dependencies.

### Deployment Steps (Render.com)

1. **Create a New Web Service**: Link your GitHub repository.
2. **Root Directory**: `ai-engine`
3. **Environment**: `Python 3`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `python -m app.main` (or `uvicorn app.main:app --host 0.0.0.0 --port $PORT`)
6. **Environment Variables**: Add all keys from `ai-engine/.env.example`.
   - `OPENAI_API_KEY`
   - `GROK_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `COHERE_API_KEY`
   - `ASSEMBLY_AI_API_KEY`

---

## 2. Frontend (Next.js) - Recommended: Vercel

Deployment to Vercel is standard for Next.js.

### Deployment Steps (Vercel)

1. **Import Project**: Choose the root of the repo.
2. **Framework Preset**: Next.js
3. **Environment Variables**:
   - Copy all keys from your root `.env`.
   - **CRITICAL**: Set `AI_SERVICE_URL` to the URL provided by Render (e.g., `https://your-ai-engine.onrender.com`).
4. **Deploy**: Click Deploy.

---

## 3. Production Connectivity Check

Once both are deployed:

1. Ensure the Vercel app can reach the Render URL.
2. If using restricted origins, add your Vercel URL to the `allow_origins` list in `ai-engine/app/main.py`.
3. Verify that `POST /api/ai/suggestions` on Vercel returns data from your AI Engine on Render.

## Global Environment Checklist

| Key                   | Used By   | Description                     |
| --------------------- | --------- | ------------------------------- |
| `AI_SERVICE_URL`      | Next.js   | Points to the FastAPI service   |
| `DATABASE_URL`        | Next.js   | Neon Postgres connection string |
| `NEXTAUTH_SECRET`     | Next.js   | Auth.js security key            |
| `IMAGEKIT_*`          | Next.js   | Image upload credentials        |
| `OPENAI_API_KEY`      | Both      | AI processing and embeddings    |
| `ASSEMBLY_AI_API_KEY` | AI Engine | Voice-to-text processing        |
