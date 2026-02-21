# 🚀 Complete Setup Guide

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Installation and Configuration Guide**
  
  _Development · Production · Docker · All Platforms_
</div>

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher (LTS recommended)
- **Python**: 3.9+ (for AI Engine)
- **PostgreSQL**: 14+ (Local or Hosted)
- **Redis**: 6+ (for caching and sessions)
- **Git**: Latest version
- **Docker**: 20.10+ (optional, for containerized setup)

### Platform Compatibility
| Platform | Support Level | Notes |
|----------|---------------|-------|
| **Windows 10/11** | ✅ Full | WSL2 recommended for AI Engine |
| **macOS** | ✅ Full | Native support |
| **Linux (Ubuntu/Debian)** | ✅ Full | Recommended for production |
| **WSL2** | ✅ Full | Windows Subsystem for Linux |

---

## ⚡ Quick Start (Automated)

### One-Click Setup
Run the included setup script from the root directory:

```bash
# For Unix/macOS
./scripts/setup.sh

# For Windows
.\scripts\setup.bat
```

**What the script does:**
- ✅ Checks all prerequisites
- ✅ Installs dependencies (Node.js, Python packages)
- ✅ Sets up environment files
- ✅ Initializes database
- ✅ Seeds initial data
- ✅ Starts all services

---

## 🔧 Manual Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/abx15/JanSankalp-AI.git
cd JanSankalp-AI
```

### Step 2: Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install

# Verify installation
npm --version  # Should be 18.x or higher
node --version  # Should be 18.x or higher
```

### Step 3: Setup AI Engine (Python)

```bash
cd ai-engine

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Return to root directory
cd ..
```

### Step 4: Environment Configuration

#### Frontend Environment
```bash
# Copy environment template
cp .env.example .env.local
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jansankalp"

# Authentication
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Engine
NEXT_PUBLIC_AI_ENGINE_URL="http://localhost:10000"

# External Services
OPENAI_API_KEY="sk-..."
RESEND_API_KEY="re_..."
NEXT_PUBLIC_PUSHER_KEY="pusher-key"
PUSHER_SECRET="pusher-secret"

# File Upload
IMAGEKIT_PRIVATE_KEY="ik-private-key"
IMAGEKIT_PUBLIC_KEY="ik-public-key"
IMAGEKIT_URL_ENDPOINT="ik-url-endpoint"
```

#### AI Engine Environment
```bash
# Copy AI engine environment template
cp ai-engine/.env.example ai-engine/.env
```

**AI Engine Environment Variables:**
```env
# OpenAI
OPENAI_API_KEY="sk-..."

# Computer Vision
HUGGINGFACE_API_KEY="hf_..."

# Speech Processing
ASSEMBLY_AI_API_KEY="..."

# Translation
COHERE_API_KEY="..."

# Streaming
KAFKA_BOOTSTRAP_SERVERS="localhost:9092"

# Vector Database
WEAVIATE_URL="http://localhost:8080"
```

### Step 5: Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS (with Homebrew):
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres createdb jansankalp
sudo -u postgres createuser --interactive
```

#### Option B: NeonDB (Recommended)
1. Visit [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `.env.local`

#### Database Initialization
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with test data
npx prisma db seed
```

### Step 6: Start All Services

#### Terminal 1: Frontend
```bash
npm run dev
# → Runs at http://localhost:3000
```

#### Terminal 2: AI Engine
```bash
cd ai-engine
# Activate virtual environment (if not already active)
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Start AI Engine
python -m app.main
# → Runs at http://localhost:10000
```

#### Terminal 3: Kafka (Optional)
```bash
# Using Docker
docker run -d -p 9092:9092 apache/kafka:latest

# Or using Kafka binaries
# Download and start Kafka as per official documentation
```

---

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Docker Compose

### Quick Docker Setup
```bash
# Start all services with one command
docker compose -f docker/docker-compose.yml up

# Or in detached mode
docker compose -f docker/docker-compose.yml up -d
```

### Docker Services
The Docker setup includes:
- **Frontend**: Next.js application (Port 3000)
- **AI Engine**: FastAPI application (Port 10000)
- **PostgreSQL**: Database (Port 5432)
- **Redis**: Cache (Port 6379)
- **Kafka**: Event streaming (Port 9092)
- **Weaviate**: Vector database (Port 8080)

### Docker Environment Files
```bash
# Copy Docker environment templates
cp docker/.env.example docker/.env
cp docker/.env.ai-engine.example docker/.env.ai-engine
```

---

## 🌐 Production Setup

### Environment Configuration

#### Production Environment Variables
```env
# Production Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Production URLs
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_AI_ENGINE_URL="https://ai.yourdomain.com"

# Production Secrets (use strong, randomly generated secrets)
AUTH_SECRET="256-character-random-string"
NEXTAUTH_SECRET="256-character-random-string"

# Production Services
RESEND_FROM_EMAIL="noreply@yourdomain.com"
REDIS_URL="redis://user:pass@host:6379"

# Monitoring and Logging
SENTRY_DSN="https://sentry-dsn"
LOG_LEVEL="info"
```

### Database Production Setup

#### PostgreSQL Production
```bash
# Use managed service (recommended)
# - NeonDB
# - AWS RDS
# - Google Cloud SQL
# - Azure Database for PostgreSQL

# Or self-hosted with replication
# - Master + read replicas
# - Automated backups
# - Monitoring and alerting
```

#### Redis Production
```bash
# Use managed service (recommended)
# - Redis Cloud
# - AWS ElastiCache
# - Google Memorystore

# Or self-hosted cluster
# - Redis Cluster setup
# - Persistence configuration
# - High availability
```

### Security Configuration

#### SSL/TLS Setup
```bash
# Use Let's Encrypt for free SSL certificates
certbot --nginx -d yourdomain.com

# Or use cloud provider SSL
# - AWS Certificate Manager
# - Google Cloud SSL
# - Azure Key Vault
```

#### Firewall Configuration
```bash
# Only allow necessary ports
# - 80, 443 (HTTP/HTTPS)
# - 22 (SSH for admin access)
# - Block all other ports
```

---

## 🔍 Verification and Testing

### Health Checks

#### Frontend Health Check
```bash
curl http://localhost:3000/api/health
# Expected: {"status": "ok", "timestamp": "..."}
```

#### AI Engine Health Check
```bash
curl http://localhost:10000/health
# Expected: {"status": "healthy", "version": "..."}
```

#### Database Connection Test
```bash
npx prisma db pull
# Should connect successfully and show schema
```

### Integration Tests

#### Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123", "role": "CITIZEN"}'
```

#### Test Complaint Filing
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Test Complaint", "description": "This is a test", "category": "ROADS", "severity": "MEDIUM"}'
```

#### Test AI Classification
```bash
curl -X POST http://localhost:10000/classify \
  -H "Content-Type: application/json" \
  -d '{"title": "Pothole on main road", "description": "Large pothole causing accidents"}'
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U username -d jansankalp

# Reset database
npx prisma migrate reset
```

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :10000

# Kill processes using ports
sudo kill -9 <PID>
```

#### AI Engine Issues
```bash
# Check Python environment
python --version
pip list

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

#### Frontend Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Log Locations

#### Development Logs
- **Frontend**: Console output and `.next` directory
- **AI Engine**: Console output and `logs/` directory
- **Database**: PostgreSQL logs in `/var/log/postgresql/`

#### Production Logs
- **Frontend**: `/var/log/jansankalp/frontend/`
- **AI Engine**: `/var/log/jansankalp/ai-engine/`
- **Nginx**: `/var/log/nginx/`
- **System**: `/var/log/syslog`

---

## 📱 Mobile Development Setup

### React Native Setup (Optional)
```bash
# Install React Native CLI
npm install -g react-native-cli

# Setup for Android
# Install Android Studio and Android SDK

# Setup for iOS
# Install Xcode and iOS Simulator

# Run mobile app
cd mobile-app
npm install
npx react-native run-android  # or run-ios
```

### Expo Setup (Alternative)
```bash
# Install Expo CLI
npm install -g @expo/cli

# Run with Expo
cd mobile-app
npx expo start
```

---

## 🔄 CI/CD Setup

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy JanSankalp AI
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: echo "Deploy to production server"
```

---

## 📊 Performance Optimization

### Development Performance
```bash
# Enable Next.js optimizations
NEXT_TELEMETRY_DISABLED=1 npm run dev

# Use SWC for faster compilation
NEXT_BUILD_WORKERS=true npm run build

# Enable React Fast Refresh
# Automatically enabled in development
```

### Production Performance
```bash
# Enable production optimizations
npm run build
npm run start

# Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

---

## 📚 Next Steps

After successful setup:

1. **📖 Read Documentation**: Explore the [main documentation](../README.md)
2. **👤 Create Test Account**: Register as citizen, officer, and admin
3. **📝 File Test Complaint**: Try the complete complaint workflow
4. **🔧 Explore Admin Panel**: Check system configuration and analytics
5. **🤖 Test AI Features**: Verify AI classification and recommendations
6. **📱 Try Mobile App**: Test mobile responsiveness and features

---

## 🆘 Getting Help

### Support Channels
- **Documentation**: [Complete docs](../README.md)
- **GitHub Issues**: [Report bugs](https://github.com/abx15/JanSankalp-AI/issues)
- **Community**: [Discussions](https://github.com/abx15/JanSankalp-AI/discussions)
- **Email**: support@jansankalp.gov.in

### Common Setup Questions

| Question | Answer |
|----------|--------|
| **Do I need all services for development?** | No, you can start with just frontend and database |
| **Can I use SQLite instead of PostgreSQL?** | Not recommended, but possible for basic testing |
| **Do I need to setup Kafka for local development?** | No, Kafka is optional for basic functionality |
| **Can I run on Windows without WSL2?** | Frontend works, but AI Engine requires WSL2 or similar |

---

<div align="center">
  <p><strong>🎉 Setup Complete! Welcome to JanSankalp AI</strong></p>
  <p><em>Your smart governance platform is ready to use</em></p>
  <p><strong>Next: <a href="../README.md">Explore Documentation</a></strong></p>
</div>
