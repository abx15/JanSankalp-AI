# 🏗️ System Architecture Overview

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Complete System Architecture Documentation**
  
  _Microservices · Scalability · Security · Performance_
</div>

---

## 🎯 Architecture Philosophy

### Design Principles
- **🎯 Citizen-Centric**: Every component designed for citizen experience
- **🔒 Security First**: Multi-layered security architecture
- **⚡ High Performance**: Sub-second response times
- **🔄 Scalability**: Horizontal scaling capabilities
- **🛡️ Reliability**: 99.9% uptime availability
- **🌐 Open Standards**: API-first design approach

### Architectural Goals
- **📱 Mobile-First**: Responsive design for all devices
- **🤖 AI-Driven**: Intelligent automation and insights
- **🌐 Real-Time**: Live updates and notifications
- **🔍 Observable**: Comprehensive monitoring and logging
- **🔄 Maintainable**: Clean code and documentation

---

## 🏢 High-Level Architecture

### System Components Overview
```
┌────────────────────────────────────────────────────────────────────┐
│                    JANSANKALP AI ECOSYSTEM                        │
│                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   Frontend      │  │   AI Engine     │  │   Data Layer    │    │
│  │                 │  │                 │  │                 │    │
│  │ • Next.js App   │  │ • FastAPI       │  │ • PostgreSQL    │    │
│  │ • React UI      │  │ • PyTorch       │  │ • Redis Cache   │    │
│  │ • TypeScript    │  │ • OpenAI        │  │ • Weaviate      │    │
│  │ • Tailwind CSS  │  │ • HuggingFace   │  │ • Kafka Stream  │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   External      │  │   Infrastructure │  │   Security      │    │
│  │   Services      │  │                 │  │                 │    │
│  │                 │  │ • Docker/K8s    │  │ • JWT Auth      │    │
│  │ • ImageKit      │  │ • Load Balancer │  │ • RBAC System   │    │
│  │ • Resend Email  │  │ • CDN           │  │ • Encryption    │    │
│  │ • Pusher WS     │  │ • Monitoring    │  │ • Audit Trail   │    │
│  │ • Twilio SMS    │  │ • Auto-scaling  │  │ • Rate Limiting │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

### Technology Stack Matrix

| Layer | Technology | Purpose | Key Features |
|-------|------------|---------|--------------|
| **Frontend** | Next.js 14 | Web Framework | SSR, API Routes, Middleware |
| | React 18 | UI Library | Components, Hooks, Context |
| | TypeScript | Type Safety | Static typing, Interfaces |
| | Tailwind CSS | Styling | Utility-first, Responsive |
| **Backend** | FastAPI | API Framework | Auto-docs, Validation |
| | PyTorch | ML Framework | Deep Learning, Models |
| | OpenAI API | AI Services | GPT-4, Classification |
| | HuggingFace | Computer Vision | Pre-trained Models |
| **Database** | PostgreSQL | Primary DB | ACID, JSON Support |
| | Redis | Cache | Sessions, Rate Limiting |
| | Weaviate | Vector DB | Semantic Search |
| | Kafka | Streaming | Real-time Events |
| **Infrastructure** | Docker | Containerization | Microservices, Portability |
| | Kubernetes | Orchestration | Scaling, Self-healing |
| | Nginx | Reverse Proxy | Load Balancing, SSL |
| | Prometheus | Monitoring | Metrics, Alerting |

---

## 🌐 Frontend Architecture

### Next.js Application Structure
```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── admin/                # Admin-specific routes
│   │   ├── officer/              # Officer-specific routes
│   │   └── complaints/           # Complaint management
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── complaints/           # Complaint CRUD
│   │   ├── users/                # User management
│   │   └── notifications/        # Real-time updates
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── charts/                   # Data visualization
│   └── layout/                   # Layout components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication logic
│   ├── db.ts                     # Database connection
│   ├── email-service.ts          # Email functionality
│   └── ai-service.ts             # AI engine integration
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication state
│   ├── useNotifications.ts       # Real-time updates
│   └── useComplaints.ts          # Complaint data
├── types/                        # TypeScript definitions
│   ├── auth.ts                   # Auth types
│   ├── complaint.ts              # Complaint types
│   └── user.ts                   # User types
└── styles/                       # Style files
    ├── globals.css               # Global styles
    └── components.css             # Component styles
```

### Component Architecture

#### Atomic Design Pattern
```
🧬 Component Hierarchy
├── 📦 Atoms (Smallest)
│   ├── Button
│   ├── Input
│   ├── Icon
│   └── Badge
├── 🧩 Molecules
│   ├── FormField
│   ├── Card
│   ├── Modal
│   └── DataTable
├─ 🎭 Organisms
│   ├── Header
│   ├── Sidebar
│   ├── ComplaintForm
│   └── Dashboard
└─ 🏛️ Templates
    ├── DashboardLayout
    ├── AuthLayout
    └── PublicLayout
```

#### State Management Strategy
```typescript
// Client State - React Context + Hooks
const AuthContext = createContext<AuthState>();
const NotificationContext = createContext<NotificationState>();
const ComplaintContext = createContext<ComplaintState>();

// Server State - Next.js API + SWR
const useComplaints = () => {
  return useSWR('/api/complaints', fetcher);
};

// Real-time State - Server-Sent Events
const useRealTimeUpdates = () => {
  const [data, setData] = useState();
  
  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');
    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => eventSource.close();
  }, []);
  
  return data;
};
```

---

## 🤖 AI Engine Architecture

### FastAPI Microservices Structure
```
ai-engine/
├── app/
│   ├── main.py                   # FastAPI application entry
│   ├── api/                      # API endpoints
│   │   ├── v1/                   # API version 1
│   │   │   ├── classification.py # Complaint classification
│   │   │   ├── analytics.py      # Analytics endpoints
│   │   │   ├── federated.py      # Federated learning
│   │   │   └── vision.py         # Computer vision
│   │   └── dependencies.py        # API dependencies
│   ├── core/                     # Core business logic
│   │   ├── config.py             # Configuration
│   │   ├── security.py           # Security utilities
│   │   └── database.py           # Database connections
│   ├── services/                 # Business services
│   │   ├── classification.py     # AI classification
│   │   ├── vision.py             # Computer vision
│   │   ├── analytics.py          # Data analytics
│   │   └── federated.py          # Federated learning
│   ├── models/                   # ML models
│   │   ├── classification/       # Classification models
│   │   ├── vision/               # Computer vision models
│   │   └── federated/            # Federated learning models
│   └── utils/                    # Utility functions
│       ├── preprocessing.py      # Data preprocessing
│       ├── postprocessing.py     # Output processing
│       └── monitoring.py         # Performance monitoring
├── tests/                        # Test suite
├── requirements.txt              # Python dependencies
└── Dockerfile                    # Container configuration
```

### AI Pipeline Architecture
```
🧠 AI Processing Pipeline
├─ 📥 Input Processing
│  ├─ 📝 Text Preprocessing (NLP pipeline)
│  ├─ 🖼️ Image Preprocessing (CV pipeline)
│  ├─ 📍 Location Processing (Geospatial)
│  └─ 📊 Metadata Enrichment (Context)
├─ 🤖 Model Inference
│  ├─ 🧠 Classification Model (Complaint categorization)
│  ├─ ⚡ Severity Model (Priority assessment)
│  ├─ 🎯 Department Model (Assignment logic)
│  └─ 🔍 Duplicate Model (Similarity detection)
├─ 📊 Post-Processing
│  ├─ 📈 Confidence Scoring (Model confidence)
│  ├─ 🎯 Result Aggregation (Multi-model fusion)
│  ├─ 🔍 Quality Check (Output validation)
│  └─ 📝 Explanation Generation (Interpretability)
└─ 📤 Output Generation
   ├─ 🏷️ Structured Output (JSON response)
   ├─ 📊 Analytics Data (Metrics tracking)
   ├─ 🔄 Feedback Loop (Model improvement)
   └─ 📝 Logging (Audit trail)
```

### Model Architecture Details

#### Classification Model
```python
# Multi-modal classification architecture
class ComplaintClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        # Text processing branch
        self.text_encoder = AutoModel.from_pretrained('bert-base-multilingual')
        self.text_classifier = nn.Linear(768, 256)
        
        # Image processing branch
        self.image_encoder = ResNet50(pretrained=True)
        self.image_classifier = nn.Linear(2048, 256)
        
        # Location processing branch
        self.location_encoder = nn.Linear(2, 64)  # lat, lng
        
        # Fusion layer
        self.fusion = nn.Linear(256 + 256 + 64, 512)
        self.classifier = nn.Linear(512, num_categories)
        self.severity_classifier = nn.Linear(512, 4)  # severity levels
    
    def forward(self, text, image, location):
        text_features = self.text_encoder(text)
        image_features = self.image_encoder(image)
        location_features = self.location_encoder(location)
        
        # Fusion and classification
        fused = torch.cat([text_features, image_features, location_features], dim=1)
        output = self.classifier(fused)
        severity = self.severity_classifier(fused)
        
        return output, severity
```

---

## 💾 Data Architecture

### Database Design

#### PostgreSQL Schema
```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- CITIZEN, OFFICER, ADMIN
    phone VARCHAR(20),
    address TEXT,
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    head_officer_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Complaints
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) UNIQUE NOT NULL, -- COMP-2026-0456
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    photo_urls TEXT[], -- Array of photo URLs
    author_id UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    officer_notes TEXT,
    verification_photos TEXT[],
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- COMPLAINT_*, SYSTEM_*
    read BOOLEAN DEFAULT FALSE,
    related_complaint_id UUID REFERENCES complaints(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Redis Cache Strategy
```python
# Cache key patterns and TTL
CACHE_KEYS = {
    'user_session': 'session:{user_id}',  # TTL: 30 days
    'complaint_list': 'complaints:{user_id}:{page}',  # TTL: 5 minutes
    'department_stats': 'dept_stats:{dept_id}',  # TTL: 1 hour
    'ai_classification': 'ai_class:{hash}',  # TTL: 24 hours
    'rate_limit': 'rate_limit:{user_id}:{endpoint}',  # TTL: 15 minutes
    'notification_count': 'notif_count:{user_id}',  # TTL: 1 minute
}

# Cache implementation example
@cache(key=lambda user_id, page: f"complaints:{user_id}:{page}", ttl=300)
async def get_user_complaints(user_id: str, page: int):
    return await db.query(Complaint).filter(
        Complaint.author_id == user_id
    ).offset(page * 20).limit(20).all()
```

#### Kafka Event Streaming
```python
# Kafka topics configuration
KAFKA_TOPICS = {
    'complaint_submitted': {
        'partitions': 6,
        'replication_factor': 3,
        'retention': '7days'
    },
    'complaint_updated': {
        'partitions': 6,
        'replication_factor': 3,
        'retention': '30days'
    },
    'notification_events': {
        'partitions': 3,
        'replication_factor': 3,
        'retention': '7days'
    },
    'analytics_events': {
        'partitions': 3,
        'replication_factor': 3,
        'retention': '90days'
    }
}

# Event schema
class ComplaintEvent(BaseModel):
    event_id: str
    event_type: str  # CREATED, UPDATED, ASSIGNED, RESOLVED
    complaint_id: str
    user_id: str
    timestamp: datetime
    data: Dict[str, Any]
    metadata: Dict[str, Any]
```

---

## 🔐 Security Architecture

### Multi-Layer Security Model
```
🛡️ Security Layers
├─ 🌐 Network Security
│  ├─ 🔥 Web Application Firewall (WAF)
│  ├─ 🚫 DDoS Protection (Cloudflare)
│  ├─ 🔒 SSL/TLS Encryption (TLS 1.3)
│  └─ 🌍 CDN Security (Edge protection)
├─ 🏛️ Application Security
│  ├─ 🔐 Authentication (JWT + Refresh tokens)
│  ├─ 🛡️ Authorization (RBAC + ABAC)
│  ├─ 🔍 Input Validation (Pydantic schemas)
│  ├─ 🚨 SQL Injection Prevention (ORM)
│  └─ 🛡️ XSS Protection (Content Security Policy)
├─ 💾 Data Security
│  ├─ 🔒 Encryption at Rest (AES-256)
│  ├─ 🔐 Encryption in Transit (TLS)
│  ├─ 🗑️ Data Masking (PII protection)
│  ├─ 🔄 Key Rotation (Automated)
│  └─ 📋 Access Logging (Audit trail)
├─ 👥 Operational Security
│  ├─ 📋 Audit Logging (All actions)
│  ├─ 👁️ Monitoring (24/7 surveillance)
│  ├─ 🚨 Incident Response (Automated)
│  ├─ 🧪 Penetration Testing (Quarterly)
│  └─ 📚 Security Training (Regular)
└- 🏛️ Compliance
   ├─ 🇮🇳 IT Act 2000 (Indian compliance)
   ├─ 🔒 GDPR (Data protection)
   ├─ 📊 Right to Information (Transparency)
   └─ 🏛️ Government Standards (Security frameworks)
```

### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  permissions: string[]; // User permissions
  iat: number;        // Issued at
  exp: number;        // Expiration
  jti: string;        // Token ID
}

// Role-Based Access Control (RBAC)
const ROLE_PERMISSIONS = {
  'CITIZEN': [
    'complaint:create',
    'complaint:read:own',
    'notification:read:own',
    'profile:update:own'
  ],
  'OFFICER': [
    ...ROLE_PERMISSIONS.CITIZEN,
    'complaint:read:assigned',
    'complaint:update:assigned',
    'notification:create',
    'analytics:read:department'
  ],
  'ADMIN': [
    ...ROLE_PERMISSIONS.OFFICER,
    'user:*',
    'complaint:*',
    'department:*',
    'system:*',
    'analytics:*'
  ]
};

// Middleware implementation
export const requirePermission = (permission: string) => {
  return async (req: NextRequest) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const payload = await verifyJWT(token);
    
    if (!payload.permissions.includes(permission)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    return payload;
  };
};
```

---

## 📊 Performance Architecture

### Performance Optimization Strategy

#### Frontend Performance
```typescript
// Next.js Performance Optimizations
const performanceConfig = {
  // Image Optimization
  images: {
    domains: ['ik.imagekit.io'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Caching Strategy
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' }
        ]
      }
    ];
  },
  
  // Bundle Optimization
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  }
};

// React Performance Optimizations
const MemoizedComplaintCard = memo(ComplaintCard, (prev, next) => {
  return prev.complaint.id === next.complaint.id &&
         prev.complaint.status === next.complaint.status;
});

// Virtual Scrolling for Large Lists
const VirtualizedComplaintList = () => {
  return (
    <FixedSizeList
      height={600}
      itemCount={complaints.length}
      itemSize={120}
      itemData={complaints}
    >
      {MemoizedComplaintRow}
    </FixedSizeList>
  );
};
```

#### Backend Performance
```python
# FastAPI Performance Optimizations
from fastapi import FastAPI, Depends
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Redis Caching
@lru_cache(maxsize=1000)
async def get_department_stats(dept_id: str):
    # Cache department statistics
    pass

# Database Optimization
class DatabaseConfig:
    # Connection Pooling
    pool_size = 20
    max_overflow = 30
    pool_timeout = 30
    pool_recycle = 3600
    
    # Query Optimization
    statement_timeout = 30000  # 30 seconds
    idle_in_transaction_session_timeout = 60000  # 1 minute

# Async Database Operations
async def get_complaints_async(
    skip: int = 0,
    limit: int = 20,
    filters: ComplaintFilters = None
):
    query = select(Complaint).offset(skip).limit(limit)
    
    if filters.status:
        query = query.where(Complaint.status == filters.status)
    if filters.department:
        query = query.where(Complaint.department_id == filters.department)
    
    # Use database-specific optimizations
    result = await session.execute(query)
    return result.scalars().unique().all()
```

#### Monitoring & Observability
```python
# Prometheus Metrics
from prometheus_client import Counter, Histogram, Gauge

# Business Metrics
complaints_total = Counter('complaints_total', 'Total complaints', ['status', 'category'])
resolution_time = Histogram('complaint_resolution_time_hours', 'Time to resolve complaints')
active_users = Gauge('active_users_total', 'Number of active users')

# System Metrics
api_requests_total = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
api_response_time = Histogram('api_response_time_seconds', 'API response time')
database_connections = Gauge('database_connections_active', 'Active database connections')

# Custom Metrics
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    
    # Record metrics
    api_requests_total.labels(
        method=request.method,
        endpoint=request.url.path
    ).inc()
    
    api_response_time.observe(
        time.time() - start_time
    )
    
    return response
```

---

## 🚀 Deployment Architecture

### Container Strategy
```dockerfile
# Multi-stage Dockerfile for Next.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
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

### Kubernetes Deployment
```yaml
# Kubernetes Deployment Configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jansankalp-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jansankalp-frontend
  template:
    metadata:
      labels:
        app: jansankalp-frontend
    spec:
      containers:
      - name: frontend
        image: jansankalp/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: jansankalp-secrets
              key: database-url
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
apiVersion: v1
kind: Service
metadata:
  name: jansankalp-frontend-service
spec:
  selector:
    app: jansankalp-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
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
    
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: docker/build-push-action@v3
      with:
        push: true
        tags: jansankalp/frontend:${{ github.sha }}
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
        images: |
          jansankalp/frontend:${{ github.sha }}
```

---

## 📈 Scalability Architecture

### Horizontal Scaling Strategy

#### Auto-scaling Configuration
```yaml
# Kubernetes Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: jansankalp-frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jansankalp-frontend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
```

#### Database Scaling
```python
# Read Replica Configuration
DATABASE_CONFIG = {
    'master': {
        'host': 'postgres-master.internal',
        'port': 5432,
        'database': 'jansankalp',
        'user': 'app_user',
        'password': os.getenv('DB_PASSWORD'),
        'pool_size': 20,
        'max_overflow': 30
    },
    'replicas': [
        {
            'host': 'postgres-replica1.internal',
            'port': 5432,
            'database': 'jansankalp',
            'user': 'readonly_user',
            'password': os.getenv('READONLY_PASSWORD'),
            'pool_size': 10,
            'max_overflow': 15
        },
        {
            'host': 'postgres-replica2.internal',
            'port': 5432,
            'database': 'jansankalp',
            'user': 'readonly_user',
            'password': os.getenv('READONLY_PASSWORD'),
            'pool_size': 10,
            'max_overflow': 15
        }
    ]
}

# Database Router for Read/Write Split
class DatabaseRouter:
    def __init__(self):
        self.master = create_engine(**DATABASE_CONFIG['master'])
        self.replicas = [
            create_engine(**config) 
            for config in DATABASE_CONFIG['replicas']
        ]
    
    def get_read_connection(self):
        return random.choice(self.replicas)
    
    def get_write_connection(self):
        return self.master
```

---

## 🔄 Integration Architecture

### API Gateway Pattern
```python
# API Gateway Configuration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

gateway = FastAPI(title="JanSankalp API Gateway")

# Middleware Configuration
gateway.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jansankalp.gov.in"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gateway.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["jansankalp.gov.in", "*.jansankalp.gov.in"]
)

# Service Routing
@gateway.api_router.get("/api/v1/complaints")
async def route_complaints(request: Request):
    # Route to appropriate microservice
    service_url = get_service_url("complaint-service")
    return await proxy_request(request, service_url)

@gateway.api_router.get("/api/v1/analytics")
async def route_analytics(request: Request):
    # Route to analytics service
    service_url = get_service_url("analytics-service")
    return await proxy_request(request, service_url)
```

### Event-Driven Architecture
```python
# Event Bus Implementation
from kafka import KafkaProducer, KafkaConsumer
import json

class EventBus:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=['kafka:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    
    async def publish_event(self, topic: str, event: dict):
        await self.producer.send(topic, event)
        await self.producer.flush()
    
    def subscribe_to_events(self, topic: str, handler):
        consumer = KafkaConsumer(
            topic,
            bootstrap_servers=['kafka:9092'],
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        
        for message in consumer:
            handler(message.value)

# Event Handlers
async def handle_complaint_created(event):
    # Send notification
    await notification_service.send_notification(
        user_id=event['author_id'],
        message=f"Complaint {event['complaint_id']} created successfully"
    )
    
    # Update analytics
    await analytics_service.update_metrics(
        metric='complaints_created',
        value=1,
        tags={'category': event['category']}
    )
    
    # Trigger AI classification
    await ai_service.classify_complaint(event['complaint_id'])
```

---

## 📊 Monitoring & Observability

### Comprehensive Monitoring Stack
```yaml
# Monitoring Stack (docker-compose.yml)
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
  
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./loki.yml:/etc/loki/local-config.yaml
  
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "14268:14268"

volumes:
  prometheus_data:
  grafana_data:
```

### Distributed Tracing
```python
# OpenTelemetry Integration
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Configure tracing
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)

span_processor = BatchSpanProcessor(jaeger_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Distributed tracing in API endpoints
@app.post("/api/complaints")
async def create_complaint(complaint: ComplaintCreate):
    with tracer.start_as_current_span("create_complaint") as span:
        span.set_attribute("user.id", complaint.author_id)
        span.set_attribute("complaint.category", complaint.category)
        
        # Business logic
        result = await complaint_service.create(complaint)
        
        span.set_attribute("complaint.id", result.id)
        return result
```

---

<div align="center">
  <p><strong>🏗️ Robust Architecture for Smart Governance</strong></p>
  <p><em>Built for scalability, security, and performance</em></p>
  <p><strong>Last updated: February 21, 2026</strong></p>
</div>
