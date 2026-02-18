# 🚀 JanSankalp AI - Setup Guide

## Overview

This guide will help you set up the JanSankalp AI development environment from scratch. Follow these steps to get the application running locally on your machine.

## Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.17 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 14 or higher
- **Git**: Version 2.30 or higher

### Development Tools (Recommended)
- **VS Code**: With recommended extensions
- **Postico/DBeaver**: For database management
- **Postman**: For API testing
- **Docker**: Optional, for containerized setup

## Step 1: Environment Setup

### 1.1 Install Node.js
```bash
# Download and install Node.js from https://nodejs.org/
# Verify installation
node --version
npm --version
```

### 1.2 Install PostgreSQL
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
# Windows: Services > PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### 1.3 Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE jansankalp;

# Create user (optional)
CREATE USER jansankalp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE jansankalp TO jansankalp_user;

# Exit
\q
```

## Step 2: Project Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/your-username/jansankalp-ai.git
cd jansankalp-ai
```

### 2.2 Install Dependencies
```bash
# Install npm packages
npm install

# Verify installation
npm list --depth=0
```

### 2.3 Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

### 2.4 Configure Environment Variables
Edit `.env` file with your actual values:

```env
# Database
DATABASE_URL="postgresql://jansankalp_user:your_password@localhost:5432/jansankalp"

# Next Auth Configuration
AUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# AI Services
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-openai-org-id"

# Email (Resend)
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Realtime (Pusher)
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"

# Cloudinary (Images & Media)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Development Credentials
ADMIN_PASSWORD="admin123"
OFFICER_PASSWORD="officer123"
CITIZEN_PASSWORD="citizen123"
```

### 2.5 Generate Auth Secret
```bash
# Generate NextAuth secret
npx auth secret
# Or use: https://generate-secret.vercel.app/32
```

## Step 3: Database Setup

### 3.1 Install Prisma CLI
```bash
npm install -g prisma
```

### 3.2 Generate Prisma Client
```bash
npx prisma generate
```

### 3.3 Run Database Migrations
```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

### 3.4 Seed Database
```bash
# Run seed script
npm run seed

# Or manually
npx ts-node --compiler-options {"module":"CommonJS"} src/lib/seed-v2.ts
```

### 3.5 Verify Database Setup
```bash
# View database schema
npx prisma studio

# Or connect with psql
psql -U jansankalp_user -d jansankalp
```

## Step 4: External Services Setup

### 4.1 OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and API key
3. Add `OPENAI_API_KEY` to `.env`
4. Optional: Add organization ID

### 4.2 Resend Email
1. Go to [Resend](https://resend.com/)
2. Create an account and API key
3. Verify your sending domain
4. Add `RESEND_API_KEY` to `.env`

### 4.3 Pusher Realtime
1. Go to [Pusher](https://pusher.com/)
2. Create a new app
3. Get your app credentials
4. Add Pusher variables to `.env`

### 4.4 Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create an account
3. Get your cloud name and API keys
4. Add Cloudinary variables to `.env`

## Step 5: Running the Application

### 5.1 Development Server
```bash
# Start development server
npm run dev

# The application will be available at http://localhost:3000
```

### 5.2 Verify Setup
1. Open http://localhost:3000 in your browser
2. Check if the application loads correctly
3. Test authentication with seed users
4. Verify database connection

### 5.3 Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jansankalp.ai","password":"admin123"}'
```

## Step 6: Development Workflow

### 6.1 Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### 6.2 Database Operations
```bash
# Create new migration
npx prisma migrate dev --name feature_name

# Reset database (development only)
npx prisma migrate reset

# View database
npx prisma studio
```

### 6.3 Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## Step 7: Troubleshooting

### 7.1 Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL service status
# Windows: Get-Service postgresql*
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Test connection
psql -U jansankalp_user -h localhost -d jansankalp
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la .env

# Check file permissions
chmod 600 .env

# Test environment loading
node -e "console.log(require('dotenv').config())"
```

#### Prisma Client Generation Issues
```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npx prisma generate
npm install
```

### 7.2 Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Prisma debug
DEBUG="prisma:*" npm run dev

# Next.js debug
NEXT_DEBUG=1 npm run dev
```

### 7.3 Log Files
```bash
# Application logs
tail -f logs/app.log

# Database logs (PostgreSQL)
tail -f /var/log/postgresql/postgresql-14-main.log

# System logs
tail -f /var/log/syslog
```

## Step 8: IDE Setup

### 8.1 VS Code Extensions
Install these recommended extensions:
- Prisma
- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens
- Thunder Client (for API testing)

### 8.2 VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/.git": true
  },
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 8.3 VS Code Tasks
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Run Database Migrations",
      "type": "shell",
      "command": "npx",
      "args": ["prisma", "migrate", "dev"],
      "group": "build"
    }
  ]
}
```

## Step 9: Docker Setup (Optional)

### 9.1 Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/jansankalp
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: jansankalp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 9.2 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 9.3 Run with Docker
```bash
# Build and start containers
docker-compose up --build

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npm run seed

# Stop containers
docker-compose down
```

## Step 10: Production Preparation

### 10.1 Build Application
```bash
# Build for production
npm run build

# Test production build
npm start
```

### 10.2 Environment Variables for Production
Create `.env.production`:
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/jansankalp"
AUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

### 10.3 Security Checklist
- [ ] Change all default passwords
- [ ] Use strong secrets and keys
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Review file upload permissions

## Step 11: Monitoring and Logging

### 11.1 Application Monitoring
```bash
# Install monitoring dependencies
npm install @sentry/nextjs

# Configure Sentry
# Create sentry.client.config.js and sentry.server.config.js
```

### 11.2 Logging Setup
```bash
# Install logging dependencies
npm install winston

# Configure logging in src/lib/logger.ts
```

### 11.3 Health Checks
```bash
# Create health check endpoint
# GET /api/health returns application status
```

## Step 12: Team Collaboration

### 12.1 Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 12.2 Code Review Process
1. Create pull request
2. Request review from team members
3. Address feedback
4. Ensure all tests pass
5. Merge to main branch

### 12.3 Release Process
```bash
# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag
git push origin v1.0.0

# Deploy to production
```

## Verification Checklist

After completing setup, verify:

- [ ] Application starts without errors
- [ ] Database connection is working
- [ ] All environment variables are loaded
- [ ] Authentication system works
- [ ] File uploads work correctly
- [ ] Email sending is configured
- [ ] Real-time features work
- [ ] API endpoints respond correctly
- [ ] Frontend renders properly
- [ ] Database seeding works

## Next Steps

Once setup is complete:

1. Read the [API Documentation](./API_DOCUMENTATION.md)
2. Review the [Architecture Guide](./ARCHITECTURE.md)
3. Check the [Security Guidelines](./SECURITY_GUIDELINES.md)
4. Follow the [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Search existing GitHub issues
4. Create a new issue with detailed information
5. Contact the development team

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
