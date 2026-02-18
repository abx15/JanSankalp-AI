# Deployment Guide

## Recommended Platform: Vercel

JanSankalp AI is optimized for Vercel.

### 1. Push to GitHub

Sync your repository with GitHub.

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New Project**.
3. Select your repository.

### 3. Configure Environment

Add all variables from your `.env` to Vercel's Environment Variables section.

### 4. Deploy

Vercel will automatically detect the Next.js project and deploy it.

## Self-Hosting (Docker)

To deploy using Docker on a VPS:

```bash
docker build -t jansankalp-ai -f docker/Dockerfile .
docker run -p 3000:3000 --env-file .env jansankalp-ai
```

## Build Checklist

- [ ] Run `npm run build` locally to verify.
- [ ] Ensure `DATABASE_URL` is accessible from production.
- [ ] Set `NEXTAUTH_URL` to your production domain.
- [ ] Configure SSL for secure communication.
