# JanSankalp AI - Deployment Guide

## 🚀 Complete Deployment Guide for Vercel (Frontend) and Render (Backend)

### 📋 Prerequisites
- Node.js 18+ installed
- Git repository setup
- Vercel account (free)
- Render account (free tier)
- All environment variables ready

---

## 🎯 Part 1: Frontend Deployment on Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Prepare Frontend for Deployment
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create production build
npm run build

# Test production build locally
npm start
```

### Step 4: Deploy to Vercel
```bash
# From client directory
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name? jansankalp-ai-frontend
# - Directory? . (current directory)
# - Want to override settings? No
```

### Step 5: Configure Environment Variables on Vercel
```bash
# Add environment variables via Vercel dashboard or CLI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add IK_PUBLIC_KEY
vercel env add IK_URL_ENDPOINT
vercel env add IK_AUTHENTICATION_ENDPOINT
vercel env add IK_PRIVATE_KEY
vercel env add PUSHER_APP_ID
vercel env add PUSHER_KEY
vercel env add PUSHER_SECRET
vercel env add PUSHER_CLUSTER
vercel env add PUSHER_USE_TLS
```

---

## 🎯 Part 2: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment
```bash
# Navigate to server directory
cd server

# Install dependencies
pip install -r requirements.txt

# Create requirements.txt if not exists
pip freeze > requirements.txt
```

### Step 2: Create Render Configuration Files

#### Create render.yaml
```bash
# In server directory
cat > render.yaml << EOF
services:
  - type: web
    name: jansankalp-ai-backend
    env: python
    plan: free
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: NEXTAUTH_URL
        sync: false
      - key: NEXTAUTH_SECRET
        sync: false
      - key: IK_PUBLIC_KEY
        sync: false
      - key: IK_URL_ENDPOINT
        sync: false
      - key: IK_AUTHENTICATION_ENDPOINT
        sync: false
      - key: IK_PRIVATE_KEY
        sync: false
      - key: PUSHER_APP_ID
        sync: false
      - key: PUSHER_KEY
        sync: false
      - key: PUSHER_SECRET
        sync: false
      - key: PUSHER_CLUSTER
        sync: false
      - key: PUSHER_USE_TLS
        sync: false
EOF
```

### Step 3: Update Backend Configuration

#### Update main.py for Render
```python
# Add to server/app/main.py
import os
from fastapi.middleware.cors import CORSMiddleware

# CORS configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",  # Replace with your Vercel URL
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the server folder
5. Configure:
   - **Name**: jansankalp-ai-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables
7. Click "Create Web Service"

---

## 🎯 Part 3: Database Setup (PostgreSQL on Render)

### Step 1: Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: jansankalp-db
   - **Database Name**: jansankalp
   - **User**: jansankalp_user
4. Click "Create Database"

### Step 2: Get Database Connection String
```bash
# From Render dashboard, copy the connection string
# Format: postgresql://username:password@host:port/database
```

### Step 3: Run Database Migrations
```bash
# Navigate to client directory (contains Prisma)
cd client

# Update DATABASE_URL in .env
echo "DATABASE_URL=your-render-db-connection-string" >> .env

# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed the database
node prisma/comprehensive_seed.js
```

---

## 🎯 Part 4: Final Configuration

### Step 1: Update Frontend API URLs
```bash
# In client/.env.local
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NEXTAUTH_URL=https://your-frontend-app.vercel.app
```

### Step 2: Update CORS in Backend
```python
# In server/app/main.py, update allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-app.vercel.app",  # Your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Redeploy Both Services
```bash
# Redeploy frontend
cd client
vercel --prod

# Backend will auto-redeploy on git push
git add .
git commit -m "Configure for production deployment"
git push origin main
```

---

## 🔧 Environment Variables Checklist

### Frontend (Vercel)
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-render-db-url
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
IK_PUBLIC_KEY=your-imagekit-key
IK_URL_ENDPOINT=your-imagekit-endpoint
IK_AUTHENTICATION_ENDPOINT=your-imagekit-auth
IK_PRIVATE_KEY=your-imagekit-private
PUSHER_APP_ID=your-pusher-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
PUSHER_USE_TLS=true
```

### Backend (Render)
```
DATABASE_URL=your-render-db-url
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
IK_PUBLIC_KEY=your-imagekit-key
IK_URL_ENDPOINT=your-imagekit-endpoint
IK_AUTHENTICATION_ENDPOINT=your-imagekit-auth
IK_PRIVATE_KEY=your-imagekit-private
PUSHER_APP_ID=your-pusher-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
PUSHER_USE_TLS=true
```

---

## 🚀 Quick Deployment Commands

### One-Command Frontend Deploy
```bash
cd client && npm run build && vercel --prod
```

### One-Command Backend Deploy (via Git)
```bash
git add . && git commit -m "Production deployment" && git push origin main
```

### Database Setup
```bash
cd client && npx prisma db push && node prisma/comprehensive_seed.js
```

---

## ✅ Testing Your Deployment

### Test Frontend
```bash
curl https://your-app.vercel.app
```

### Test Backend
```bash
curl https://your-backend.onrender.com/health
```

### Test Database Connection
```bash
cd client && npx prisma db pull
```

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. CORS Errors
- Update CORS origins in backend
- Ensure frontend URL is whitelisted

#### 2. Database Connection Issues
- Verify DATABASE_URL format
- Check if database is accepting connections
- Ensure SSL is enabled

#### 3. Build Failures
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check environment variables

#### 4. Authentication Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set
- Ensure cookies domain is correct

---

## 📞 Support

For deployment issues:
1. Check Vercel and Render logs
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration

---

## 🎉 Deployment Complete!

Your JanSankalp AI application is now live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: PostgreSQL on Render

Users can now access the application and file complaints!
