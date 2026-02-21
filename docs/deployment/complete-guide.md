# 🚀 Complete Deployment Guide

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Production Deployment Guide**
  
  _Docker · Cloud · Security · Monitoring · Scaling_
</div>

---

## 🎯 Deployment Overview

This guide covers complete deployment strategies for JanSankalp AI in production environments, including cloud deployment, Docker containerization, security hardening, and monitoring setup.

---

## 🐳 Docker Deployment

### Multi-Service Docker Compose

#### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend (Next.js)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXT_PUBLIC_AI_ENGINE_URL=http://ai-engine:10000
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
      - ai-engine
    restart: unless-stopped
    networks:
      - jansankalp-network
    volumes:
      - ./uploads:/app/uploads
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AI Engine (FastAPI)
  ai-engine:
    build:
      context: ./ai-engine
      dockerfile: Dockerfile
    ports:
      - "10000:10000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - WEAVIATE_URL=http://weaviate:8080
    depends_on:
      - postgres
      - kafka
      - weaviate
    restart: unless-stopped
    networks:
      - jansankalp-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:10000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - jansankalp-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - jansankalp-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Apache Kafka
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: true
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    volumes:
      - kafka_data:/var/lib/kafka/data
    restart: unless-stopped
    networks:
      - jansankalp-network

  # Zookeeper (required for Kafka)
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    volumes:
      - zookeeper_data:/var/lib/zookeeper/data
    restart: unless-stopped
    networks:
      - jansankalp-network

  # Weaviate Vector Database
  weaviate:
    image: semitechnologies/weaviate:latest
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate'
    volumes:
      - weaviate_data:/var/lib/weaviate
    ports:
      - "8080:8080"
    restart: unless-stopped
    networks:
      - jansankalp-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - ai-engine
    restart: unless-stopped
    networks:
      - jansankalp-network

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - jansankalp-network

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    restart: unless-stopped
    networks:
      - jansankalp-network

volumes:
  postgres_data:
  redis_data:
  kafka_data:
  zookeeper_data:
  weaviate_data:
  prometheus_data:
  grafana_data:

networks:
  jansankalp-network:
    driver: bridge
```

#### Frontend Dockerfile
```dockerfile
# Dockerfile.frontend
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

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### AI Engine Dockerfile
```dockerfile
# ai-engine/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
```

---

## 🌐 Cloud Deployment

### AWS Deployment

#### ECS Task Definition
```json
{
  "family": "jansankalp-ai",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/jansankalp-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:jansankalp/db-url"
        },
        {
          "name": "AUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:jansankalp/auth-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/jansankalp-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Terraform Configuration
```hcl
# terraform/main.tf
provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "jansankalp" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "jansankalp-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "jansankalp" {
  name = "jansankalp-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "jansankalp" {
  name               = "jansankalp-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "jansankalp-alb"
  }
}

# RDS Database
resource "aws_db_instance" "jansankalp" {
  identifier     = "jansankalp-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted    = true
  
  db_name  = "jansankalp"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.jansankalp.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  
  tags = {
    Name = "jansankalp-db"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "jansankalp" {
  name       = "jansankalp-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "jansankalp" {
  cluster_id           = "jansankalp-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.jansankalp.name
  security_group_ids  = [aws_security_group.redis.id]
  
  tags = {
    Name = "jansankalp-redis"
  }
}
```

### DigitalOcean Deployment

#### Kubernetes Manifests
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: jansankalp

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jansankalp-config
  namespace: jansankalp
data:
  NODE_ENV: "production"
  NEXTAUTH_URL: "https://jansankalp.gov.in"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: jansankalp-secrets
  namespace: jansankalp
type: Opaque
data:
  DATABASE_URL: <base64-encoded-db-url>
  AUTH_SECRET: <base64-encoded-auth-secret>
  NEXTAUTH_SECRET: <base64-encoded-nextauth-secret>

---
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: jansankalp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: jansankalp/frontend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: jansankalp-config
        - secretRef:
            name: jansankalp-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: jansankalp
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jansankalp-ingress
  namespace: jansankalp
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - jansankalp.gov.in
    secretName: jansankalp-tls
  rules:
  - host: jansankalp.gov.in
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

---

## 🔒 Security Hardening

### SSL/TLS Configuration

#### Nginx Configuration
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    upstream frontend {
        server frontend:3000;
    }

    upstream ai-engine {
        server ai-engine:10000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name jansankalp.gov.in;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name jansankalp.gov.in;

        ssl_certificate /etc/nginx/ssl/jansankalp.gov.in.crt;
        ssl_certificate_key /etc/nginx/ssl/jansankalp.gov.in.key;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Apply rate limiting to API
            location /api/ {
                limit_req zone=api burst=20 nodelay;
                proxy_pass http://frontend;
            }
            
            # Stricter rate limiting for auth
            location /api/auth/ {
                limit_req zone=login burst=5 nodelay;
                proxy_pass http://frontend;
            }
        }

        # AI Engine
        location /ai/ {
            proxy_pass http://ai-engine/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Firewall Configuration

#### UFW Rules
```bash
#!/bin/bash
# firewall-setup.sh

# Reset firewall
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (with rate limiting)
ufw limit ssh

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow application ports from internal network only
ufw allow from 10.0.0.0/8 to any port 3000
ufw allow from 10.0.0.0/8 to any port 10000
ufw allow from 10.0.0.0/8 to any port 5432
ufw allow from 10.0.0.0/8 to any port 6379

# Enable firewall
ufw --force enable

# Show status
ufw status verbose
```

### Security Monitoring

#### Fail2Ban Configuration
```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
```

---

## 📊 Monitoring & Logging

### Prometheus Configuration

#### prometheus.yml
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'ai-engine'
    static_configs:
      - targets: ['ai-engine:10000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

#### Alert Rules
```yaml
# monitoring/alert_rules.yml
groups:
  - name: jansankalp_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL database is not responding"

      - alert: RedisDown
        expr: up{job="redis"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis is down"
          description: "Redis cache is not responding"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}%"
```

### Grafana Dashboards

#### Dashboard Configuration
```json
{
  "dashboard": {
    "title": "JanSankalp AI Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends",
            "legendFormat": "Active Connections"
          }
        ]
      }
    ]
  }
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
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
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
          # For example: kubectl apply -f k8s/
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

### Deployment Day
- [ ] Database backed up
- [ ] Current version tagged
- [ ] Zero-downtime deployment tested
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Monitoring alerts tested
- [ ] Load testing performed
- [ ] Security scanning completed

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring dashboards verified
- [ ] Performance metrics checked
- [ ] Error rates monitored
- [ ] User feedback collected
- [ ] Documentation updated
- [ ] Team debrief conducted
- [ ] Improvements documented

---

## 🚨 Emergency Procedures

### Rollback Plan
```bash
#!/bin/bash
# rollback.sh

echo "Starting rollback procedure..."

# Get current deployment version
CURRENT_VERSION=$(kubectl get deployment frontend -o jsonpath='{.spec.template.spec.containers[0].image}')
echo "Current version: $CURRENT_VERSION"

# Rollback to previous version
kubectl rollout undo deployment/frontend
kubectl rollout undo deployment/ai-engine

# Wait for rollback to complete
kubectl rollout status deployment/frontend --timeout=300s
kubectl rollout status deployment/ai-engine --timeout=300s

# Verify rollback
NEW_VERSION=$(kubectl get deployment frontend -o jsonpath='{.spec.template.spec.containers[0].image}')
echo "Rolled back to: $NEW_VERSION"

# Run health checks
curl -f https://jansankalp.gov.in/api/health || exit 1

echo "Rollback completed successfully"
```

### Incident Response
```bash
#!/bin/bash
# incident-response.sh

INCIDENT_TYPE=$1
SEVERITY=$2

echo "Incident Response: $INCIDENT_TYPE ($SEVERITY)"

# Case 1: Database issues
if [ "$INCIDENT_TYPE" = "database" ]; then
    echo "Handling database incident..."
    # Check database status
    kubectl exec -it postgres-0 -- pg_isready
    # Restart database if needed
    kubectl rollout restart deployment/postgres
    # Scale down frontend to prevent errors
    kubectl scale deployment frontend --replicas=0
fi

# Case 2: High load
if [ "$INCIDENT_TYPE" = "high_load" ]; then
    echo "Handling high load incident..."
    # Scale up services
    kubectl scale deployment frontend --replicas=10
    kubectl scale deployment ai-engine --replicas=5
    # Enable caching
    kubectl patch deployment frontend -p '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","env":[{"name":"ENABLE_CACHE","value":"true"}]}]}}}'
fi

# Case 3: Security incident
if [ "$INCIDENT_TYPE" = "security" ]; then
    echo "Handling security incident..."
    # Block suspicious IPs
    # Enable enhanced logging
    # Notify security team
fi
```

---

## 📈 Performance Optimization

### Database Optimization
```sql
-- Performance tuning for PostgreSQL
-- Increase shared buffers
ALTER SYSTEM SET shared_buffers = '256MB';

-- Enable effective cache size
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Optimize work_mem
ALTER SYSTEM SET work_mem = '4MB';

-- Enable parallel queries
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;

-- Create performance indexes
CREATE INDEX CONCURRENTLY idx_complaints_performance 
ON complaints(status, severity, created_at DESC);

-- Analyze tables for query planner
ANALYZE complaints;
ANALYZE users;
ANALYZE departments;
```

### Application Optimization
```typescript
// Performance monitoring
import { performance } from 'perf_hooks';

export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      // Log performance metrics
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      // Send to monitoring system
      await sendMetric('function_duration', duration, { name });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Performance: ${name} failed after ${duration.toFixed(2)}ms`, error);
      
      await sendMetric('function_error', duration, { name, error: error.message });
      throw error;
    }
  };
}

// Usage
export const getComplaints = withPerformanceMonitoring(
  async (filters: ComplaintFilters) => {
    return await prisma.complaint.findMany({ where: filters });
  },
  'getComplaints'
);
```

---

## 🔄 Maintenance Schedule

### Regular Maintenance Tasks

#### Daily (Automated)
- [ ] Database backup verification
- [ ] Log rotation
- [ ] Performance metrics collection
- [ ] Security scan
- [ ] Health checks

#### Weekly
- [ ] Performance review
- [ ] Security patch updates
- [ ] Backup restoration test
- [ ] Capacity planning review
- [ ] User feedback review

#### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation update
- [ ] Disaster recovery test
- [ ] Team training

#### Quarterly
- [ ] Major security review
- [ ] Architecture review
- [ ] Capacity planning
- [ ] Budget review
- [ ] Strategic planning

---

<div align="center">
  <p><strong>🚀 Production-Ready Deployment Guide</strong></p>
  <p><em>Scalable, secure, and monitored deployment infrastructure</em></p>
  <p><strong>Last updated: February 21, 2026</strong></p>
</div>
