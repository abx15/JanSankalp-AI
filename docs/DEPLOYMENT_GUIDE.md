# 🚀 JanSankalp AI - Deployment Guide

## Overview

This guide covers various deployment strategies for JanSankalp AI, from development to production environments. We'll cover Vercel (recommended), Docker, and traditional server deployments.

## Deployment Options

### 1. Vercel (Recommended)
- **Best for**: Quick deployment, automatic scaling, serverless
- **Pros**: Zero config, automatic HTTPS, global CDN
- **Cons**: Vendor lock-in, limited control

### 2. Docker + Cloud Provider
- **Best for**: Full control, custom configurations
- **Pros**: Portable, scalable, customizable
- **Cons**: More complex, requires DevOps knowledge

### 3. Traditional VPS
- **Best for**: Budget constraints, full control
- **Pros**: Cost-effective, complete control
- **Cons**: Manual setup, maintenance overhead

## Option 1: Vercel Deployment

### 1.1 Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

### 1.2 Setup Vercel Project
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

### 1.3 Vercel Configuration
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "AUTH_SECRET": "@auth_secret",
    "OPENAI_API_KEY": "@openai_api_key"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "framework": "nextjs"
}
```

### 1.4 Environment Variables in Vercel
```bash
# Add environment variables via Vercel dashboard or CLI
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add OPENAI_API_KEY
vercel env add RESEND_API_KEY
vercel env add NEXT_PUBLIC_PUSHER_KEY
```

### 1.5 Database Setup for Vercel
```bash
# Use managed PostgreSQL service
# Recommended: Neon, Supabase, or PlanetScale

# Example with Neon
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

### 1.6 Custom Domain
```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# A record: CNAME -> cname.vercel-dns.com
```

### 1.7 Monitoring Vercel
- Vercel Analytics (built-in)
- Vercel Speed Insights
- Vercel Logs (real-time)

## Option 2: Docker Deployment

### 2.1 Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2.2 Docker Compose
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2.3 Nginx Configuration
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/ssl/cert.pem;
        ssl_certificate_key /etc/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /api {
            proxy_pass http://app;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }
    }
}
```

### 2.4 Production Environment
Create `.env.production`:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@db:5432/jansankalp
AUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
REDIS_URL=redis://redis:6379
```

### 2.5 Deploy with Docker
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Seed database (if needed)
docker-compose -f docker-compose.prod.yml exec app npm run seed

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

## Option 3: Traditional VPS Deployment

### 3.1 Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

### 3.2 Database Setup
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE jansankalp;
CREATE USER jansankalp_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE jansankalp TO jansankalp_user;
\q
```

### 3.3 Application Setup
```bash
# Clone repository
git clone https://github.com/your-username/jansankalp-ai.git
cd jansankalp-ai

# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
npm run build
```

### 3.4 PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'jansankalp-ai',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 3.5 Start Application
```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### 3.6 Nginx Configuration
Create `/etc/nginx/sites-available/jansankalp-ai`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.7 Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jansankalp-ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## SSL/TLS Setup

### 1. Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Manual SSL
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out certificate.csr

# Submit CSR to CA for certificate
```

## Database Management

### 1. Backups
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="jansankalp"

# Create backup
pg_dump -h localhost -U jansankalp_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### 2. Monitoring
```bash
# Database health check
#!/bin/bash
pg_isready -h localhost -p 5432 -U jansankalp_user

# Check disk space
df -h

# Check database size
psql -U jansankalp_user -d jansankalp -c "SELECT pg_size_pretty(pg_database_size('jansankalp'));"
```

## Monitoring and Logging

### 1. Application Monitoring
```bash
# Install monitoring tools
npm install @sentry/nextjs winston

# Configure Sentry
# sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Log Management
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/jansankalp-ai

# Content:
/path/to/jansankalp-ai/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload jansankalp-ai
    endscript
}
```

### 3. Health Checks
Create `/api/health` endpoint:
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
```

## Performance Optimization

### 1. Caching
```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

# Start Redis
sudo systemctl start redis-server
```

### 2. CDN Configuration
```bash
# Configure CloudFlare or similar CDN
# Cache static assets
# Enable Brotli compression
# Set up security headers
```

### 3. Database Optimization
```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_complaint_status ON "Complaint" (status);
CREATE INDEX CONCURRENTLY idx_complaint_created ON "Complaint" (createdAt DESC);
CREATE INDEX CONCURRENTLY idx_user_email ON "User" (email);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "Complaint" WHERE status = 'PENDING';
```

## Security Hardening

### 1. Firewall Setup
```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

### 2. Security Headers
```nginx
# Add to Nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Rate Limiting
```bash
# Install rate limiting
npm install express-rate-limit

# Configure rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

## CI/CD Pipeline

### 1. GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 2. Environment Secrets
Set up secrets in GitHub:
- `DATABASE_URL`
- `AUTH_SECRET`
- `OPENAI_API_KEY`
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`

## Disaster Recovery

### 1. Backup Strategy
```bash
# Daily database backups
0 2 * * * /path/to/backup-script.sh

# Weekly file backups
0 3 * * 0 rsync -av /path/to/app/ /path/to/backup/
```

### 2. Recovery Process
```bash
# Restore database
psql -U jansankalp_user -d jansankalp < backup_20240101.sql

# Restore application files
rsync -av /path/to/backup/ /path/to/app/

# Restart services
pm2 restart jansankalp-ai
sudo systemctl restart nginx
```

## Scaling Strategies

### 1. Horizontal Scaling
```bash
# Load balancer setup
# Multiple app instances
# Database read replicas
# CDN for static assets
```

### 2. Vertical Scaling
```bash
# Increase server resources
# Optimize database queries
# Implement caching
# Use CDN
```

## Troubleshooting

### 1. Common Issues
```bash
# Check application logs
pm2 logs jansankalp-ai

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Check system resources
htop
df -h
free -h
```

### 2. Performance Issues
```bash
# Monitor CPU usage
top

# Monitor memory usage
free -m

# Check disk I/O
iotop

# Analyze slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC;
```

## Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security headers set
- [ ] Rate limiting configured

### Post-deployment
- [ ] Application responds correctly
- [ ] Database connection works
- [ ] Authentication functions
- [ ] File uploads work
- [ ] Email sending works
- [ ] Real-time features work
- [ ] Monitoring alerts configured
- [ ] Performance benchmarks met

## Maintenance

### Regular Tasks
- Weekly: Update dependencies
- Monthly: Review and rotate secrets
- Quarterly: Performance audit
- Annually: Security audit

### Monitoring Alerts
Set up alerts for:
- High error rates
- Slow response times
- Database connection issues
- High memory usage
- Disk space warnings

## Support and Documentation

- [Application Architecture](./ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Security Guidelines](./SECURITY_GUIDELINES.md)
- [Setup Guide](./SETUP_GUIDE.md)

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Test database connectivity
4. Review configuration files
5. Contact support team if needed
