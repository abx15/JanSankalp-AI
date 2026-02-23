# 🌐 Browser Deployment Guide - JanSankalp AI

## 📋 Browser se Deployment Karne Ke Liye Simple Steps

---

## 🎯 Part 1: Vercel (Frontend) - Browser se

### Step 1: Vercel Website pe Jao
👉 [https://vercel.com](https://vercel.com)

### Step 2: Login karo
- GitHub se login karo (recommended)
- Ya Google/Email se login karo

### Step 3: New Project Banayo
1. Dashboard pe "Add New..." → "Project" click karo
2. GitHub repo connect karo
3. **JanSankalp AI** repo select karo

### Step 4: Project Settings (Important!)
```
📁 Root Directory: client
🔧 Framework Preset: Next.js
📦 Build Command: npm run build
📂 Output Directory: .next
⬇️ Install Command: npm install
```

### Step 5: Environment Variables Add karo
```
NEXTAUTH_URL=https://your-app-name.vercel.app
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

### Step 6: Deploy!
- "Deploy" button pe click karo
- Wait karo (5-10 minutes)

---

## 🎯 Part 2: Render (Backend) - Browser se

### Step 1: Render Website pe Jao
👉 [https://render.com](https://render.com)

### Step 2: Login karo
- GitHub se login karo (recommended)

### Step 3: New Web Service Banayo
1. Dashboard pe "New +" → "Web Service" click karo
2. GitHub repo connect karo
3. **JanSankalp AI** repo select karo

### Step 4: Service Settings (Exactly ye fill karo!)
```
📝 Name: jansankalp-backend
📁 Root Directory: server
🐍 Environment: Python 3
🔧 Build Command: pip install -r requirements.txt
🚀 Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
💰 Plan: Free (default)
```

### Step 5: Environment Variables Add karo
Render dashboard mein "Environment" tab pe jaake ye add karo:
```
DATABASE_URL=your-render-db-url
NEXTAUTH_URL=https://your-app-name.vercel.app
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

### Step 6: Create Web Service
- "Create Web Service" button pe click karo
- Wait karo (5-10 minutes)

---

## 🎯 Part 3: Database (PostgreSQL) - Browser se

### Step 1: Render pe Database Banayo
1. Render dashboard pe "New +" → "PostgreSQL" click karo
2. Settings fill karo:
```
📝 Name: jansankalp-db
🗄️ Database Name: jansankalp
👤 User: jansankalp_user
💰 Plan: Free (default)
```

### Step 2: Database Connection String Copy karo
- Database create hone ke baad
- "Connections" tab pe jao
- **External Database URL** copy karo

### Step 3: Database Seed karo
1. Vercel pe jaake **Redeploy** karo
2. Environment variables update karo:
   - `DATABASE_URL` = copied connection string
3. Phir se redeploy karo

---

## 🔗 Important URLs After Deployment

### Vercel Frontend:
```
https://your-app-name.vercel.app
```

### Render Backend:
```
https://your-backend-name.onrender.com
```

### Render Database:
```
postgresql://username:password@host:port/database
```

---

## ✅ Final Testing

### Test Frontend:
```
https://your-app-name.vercel.app
```

### Test Backend:
```
https://your-backend-name.onrender.com/health
```

### Test Login:
- Email: `admin@jansankalp.gov.in`
- Password: `password123`

---

## 🚨 Troubleshooting

### Common Issues:

#### 1. CORS Error:
- Backend mein CORS update karo
- Vercel URL allow karo

#### 2. Database Connection:
- DATABASE_URL check karo
- SSL enabled hai ya nahi

#### 3. Build Fail:
- Node.js version check karo
- Environment variables check karo

---

## 🎉 Complete!

**Your App is Live!**
- 🌐 Frontend: Vercel pe
- 🔧 Backend: Render pe  
- 🗄️ Database: Render PostgreSQL pe

**Users can now:**
- Register/Login
- File complaints
- Officers can manage complaints
- Real-time updates working

---

## 📞 Quick Help

### Koi problem hai to:
1. **Vercel**: Function logs check karo
2. **Render**: Service logs check karo  
3. **Database**: Connection test karo
4. **Environment**: Variables double check karo

### Deployment Time:
- **Frontend**: 5-10 minutes
- **Backend**: 5-10 minutes
- **Database**: 2-5 minutes

**Total Time: ~20 minutes** ⏰

---

## 📝 Summary (Cheat Sheet)

### Vercel Settings:
```
Root: client
Framework: Next.js
Build: npm run build
Output: .next
```

### Render Settings:
```
Root: server
Environment: Python 3
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Database:
```
Type: PostgreSQL
Provider: Render
Connection: External URL copy
```

Bas! Ab aapka application live hai! 🚀
