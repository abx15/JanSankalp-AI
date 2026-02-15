# 🗄️ JanSankalp AI - Database Schema Documentation

## Overview

JanSankalp AI uses PostgreSQL as its primary database with Prisma as the ORM. The database schema is designed to support a comprehensive civic complaint management system with role-based access control, audit trails, and real-time data synchronization.

## Database Configuration

### Connection Details
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Connection Pooling**: Enabled
- **SSL**: Required in production

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/jansankalp"
```

## Schema Diagram

```mermaid
erDiagram
    User ||--o{ Complaint : "creates"
    User ||--o{ Complaint : "assigned_to"
    User ||--o{ Department : "manages"
    User ||--o{ Remark : "authors"
    User ||--o{ AuditLog : "performs"
    
    Department ||--o{ Complaint : "handles"
    
    Complaint ||--o{ Remark : "has"
    Complaint ||--o{ Complaint : "duplicate_of"
    
    VerificationToken }|--|| User : "belongs_to"
    
    User {
        string id PK
        string name
        string email UK
        string password
        datetime emailVerified
        enum role
        int points
        string phone
        string address
        string bio
        float latitude
        float longitude
        string avatarUrl
        datetime createdAt
        datetime updatedAt
    }
    
    Complaint {
        string id PK
        string title
        string description
        string originalText
        string originalLanguage
        string translatedText
        enum status
        int severity
        string category
        float confidenceScore
        string imageUrl
        float latitude
        float longitude
        string authorId FK
        string assignedToId FK
        string departmentId FK
        string duplicateOf
        datetime createdAt
        datetime updatedAt
    }
    
    Department {
        string id PK
        string name UK
        string headId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Remark {
        string id PK
        string text
        string authorName
        enum authorRole
        string imageUrl
        string complaintId FK
        datetime createdAt
    }
    
    AuditLog {
        string id PK
        string action
        string userId FK
        string details
        datetime createdAt
    }
    
    VerificationToken {
        string id PK
        string email
        string token UK
        datetime expires
    }
```

## Tables

### 1. Users Table

**Purpose**: Stores user information and authentication data.

**Table Name**: `User`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique user identifier |
| `name` | String? | Optional | User's full name |
| `email` | String | Unique, Required | User's email address |
| `password` | String? | Optional | Hashed password (bcrypt) |
| `emailVerified` | DateTime? | Optional | Email verification timestamp |
| `role` | Role | Default: CITIZEN | User role (CITIZEN, OFFICER, ADMIN) |
| `points` | Int | Default: 0 | User's reward points |
| `phone` | String? | Optional | Phone number |
| `address` | String? | Optional | Physical address |
| `bio` | String? | Optional | User biography |
| `latitude` | Float? | Optional | Geographic latitude |
| `longitude` | Float? | Optional | Geographic longitude |
| `avatarUrl` | String? | Optional | Profile picture URL |
| `createdAt` | DateTime | Default: now() | Account creation timestamp |
| `updatedAt` | DateTime | Updated automatically | Last update timestamp |

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `role` for role-based queries
- Composite index on `latitude`, `longitude` for location queries

**Enums**:
```sql
CREATE TYPE Role AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN');
```

**Sample Data**:
```sql
INSERT INTO "User" (id, email, name, role, points) VALUES
('cuid123', 'admin@jansankalp.ai', 'System Admin', 'ADMIN', 0),
('cuid456', 'officer@jansankalp.ai', 'Municipal Officer', 'OFFICER', 0),
('cuid789', 'citizen@example.com', 'Rahul Sharma', 'CITIZEN', 25);
```

### 2. Complaints Table

**Purpose**: Stores civic complaints and their metadata.

**Table Name**: `Complaint`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique complaint identifier |
| `title` | String | Required | Complaint title |
| `description` | String | Required | Detailed complaint description |
| `originalText` | String? | Optional | Original user input text |
| `originalLanguage` | String? | Optional | Detected language code |
| `translatedText` | String? | Optional | AI-translated text |
| `status` | ComplaintStatus | Default: PENDING | Current complaint status |
| `severity` | Int | Default: 1, Min: 1, Max: 5 | Severity level (1-5) |
| `category` | String | Required | Complaint category |
| `confidenceScore` | Float? | Optional | AI classification confidence |
| `imageUrl` | String? | Optional | Evidence image URL |
| `latitude` | Float | Required | Geographic latitude |
| `longitude` | Float | Required | Geographic longitude |
| `authorId` | String | Foreign Key, Required | Complaint author |
| `assignedToId` | String? | Foreign Key, Optional | Assigned officer |
| `departmentId` | String? | Foreign Key, Optional | Responsible department |
| `duplicateOf` | String? | Optional | Reference to duplicate complaint |
| `createdAt` | DateTime | Default: now() | Creation timestamp |
| `updatedAt` | DateTime | Updated automatically | Last update timestamp |

**Indexes**:
- Primary key on `id`
- Foreign key on `authorId`
- Foreign key on `assignedToId`
- Foreign key on `departmentId`
- Index on `status` for status-based queries
- Index on `category` for category filtering
- Composite index on `latitude`, `longitude` for location queries
- Index on `createdAt` for time-based queries

**Enums**:
```sql
CREATE TYPE ComplaintStatus AS ENUM ('PENDING', 'RESUMED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
```

**Sample Data**:
```sql
INSERT INTO "Complaint" (id, title, description, status, severity, category, latitude, longitude, authorId) VALUES
('cuid001', 'Broken Street Light', 'Street light not working at main intersection', 'PENDING', 3, 'Electricity & Lighting', 40.7128, -74.0060, 'cuid789');
```

### 3. Departments Table

**Purpose**: Manages municipal departments and their hierarchy.

**Table Name**: `Department`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique department identifier |
| `name` | String | Unique, Required | Department name |
| `headId` | String? | Foreign Key, Unique, Optional | Department head |
| `createdAt` | DateTime | Default: now() | Creation timestamp |
| `updatedAt` | DateTime | Updated automatically | Last update timestamp |

**Indexes**:
- Primary key on `id`
- Unique index on `name`
- Unique index on `headId`

**Sample Data**:
```sql
INSERT INTO "Department" (id, name) VALUES
('dept001', 'Waste Management'),
('dept002', 'Roads & Infrastructure'),
('dept003', 'Water Supply'),
('dept004', 'Electricity & Lighting'),
('dept005', 'Public Health'),
('dept006', 'Drainage & Sewage');
```

### 4. Remarks Table

**Purpose**: Stores comments and updates on complaints.

**Table Name**: `Remark`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique remark identifier |
| `text` | String | Required | Remark content |
| `authorName` | String | Required | Name of remark author |
| `authorRole` | Role | Required | Role of remark author |
| `imageUrl` | String? | Optional | Supporting image URL |
| `complaintId` | String | Foreign Key, Required | Associated complaint |
| `createdAt` | DateTime | Default: now() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Foreign key on `complaintId`
- Index on `createdAt` for chronological ordering

**Sample Data**:
```sql
INSERT INTO "Remark" (id, text, authorName, authorRole, complaintId) VALUES
('rem001', 'Investigating the issue. Will visit tomorrow.', 'Municipal Officer', 'OFFICER', 'cuid001');
```

### 5. Audit Logs Table

**Purpose**: Tracks system actions for compliance and debugging.

**Table Name**: `AuditLog`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique log identifier |
| `action` | String | Required | Action performed |
| `userId` | String | Foreign Key, Required | User who performed action |
| `details` | String? | Optional | Additional action details |
| `createdAt` | DateTime | Default: now() | Log timestamp |

**Indexes**:
- Primary key on `id`
- Foreign key on `userId`
- Index on `action` for action-based queries
- Index on `createdAt` for time-based queries

**Sample Data**:
```sql
INSERT INTO "AuditLog" (action, userId, details) VALUES
('COMPLAINT_CREATED', 'cuid789', 'Created complaint: Broken Street Light'),
('COMPLAINT_ASSIGNED', 'cuid456', 'Assigned complaint to officer');
```

### 6. Verification Tokens Table

**Purpose**: Stores email verification tokens.

**Table Name**: `VerificationToken`

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | Primary Key, Default: cuid() | Unique token identifier |
| `email` | String | Required | Associated email |
| `token` | String | Unique, Required | Verification token |
| `expires` | DateTime | Required | Token expiration time |

**Indexes**:
- Primary key on `id`
- Unique index on `token`
- Composite unique index on `email`, `token`

## Relationships

### User Relationships
- **One-to-Many**: User → Complaints (as author)
- **One-to-Many**: User → Complaints (as assigned officer)
- **One-to-Many**: User → Departments (as department head)
- **One-to-Many**: User → Remarks (as author)
- **One-to-Many**: User → Audit Logs (as performer)

### Complaint Relationships
- **Many-to-One**: Complaint → User (author)
- **Many-to-One**: Complaint → User (assigned officer)
- **Many-to-One**: Complaint → Department
- **One-to-Many**: Complaint → Remarks
- **Self-Reference**: Complaint → Complaint (duplicate tracking)

### Department Relationships
- **One-to-Many**: Department → Complaints
- **One-to-One**: Department → User (department head)

## Database Constraints

### Foreign Key Constraints
```sql
-- User relationships
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_assignedToId_fkey" 
FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL;

ALTER TABLE "Department" ADD CONSTRAINT "Department_headId_fkey" 
FOREIGN KEY ("headId") REFERENCES "User"("id") ON DELETE SET NULL;

-- Complaint relationships
ALTER TABLE "Remark" ADD CONSTRAINT "Remark_complaintId_fkey" 
FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE;

-- Audit relationships
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
```

### Check Constraints
```sql
-- Severity range check
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_severity_check" 
CHECK (severity >= 1 AND severity <= 5);

-- Points non-negative
ALTER TABLE "User" ADD CONSTRAINT "User_points_check" 
CHECK (points >= 0);

-- Confidence score range
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_confidenceScore_check" 
CHECK (confidenceScore >= 0 AND confidenceScore <= 1);
```

## Database Operations

### Common Queries

#### Get User with Complaints
```sql
SELECT 
  u.*,
  COUNT(c.id) as complaint_count,
  COUNT(CASE WHEN c.status = 'RESOLVED' THEN 1 END) as resolved_count
FROM "User" u
LEFT JOIN "Complaint" c ON u.id = c.authorId
WHERE u.email = 'user@example.com'
GROUP BY u.id;
```

#### Get Department Statistics
```sql
SELECT 
  d.name,
  d.headId,
  u.name as head_name,
  COUNT(c.id) as total_complaints,
  COUNT(CASE WHEN c.status = 'RESOLVED' THEN 1 END) as resolved_complaints,
  AVG(c.severity) as avg_severity
FROM "Department" d
LEFT JOIN "User" u ON d.headId = u.id
LEFT JOIN "Complaint" c ON d.id = c.departmentId
GROUP BY d.id, u.id
ORDER BY total_complaints DESC;
```

#### Get Nearby Complaints
```sql
SELECT 
  c.*,
  u.name as author_name,
  (6371 * acos(cos(radians(40.7128)) * cos(radians(c.latitude)) * 
   cos(radians(c.longitude) - radians(-74.0060)) + 
   sin(radians(40.7128)) * sin(radians(c.latitude)))) AS distance
FROM "Complaint" c
JOIN "User" u ON c.authorId = u.id
HAVING distance < 5  -- within 5km
ORDER BY distance;
```

### Performance Optimizations

#### Indexes for Performance
```sql
-- Location-based queries
CREATE INDEX idx_complaint_location ON "Complaint" (latitude, longitude);

-- Status and category filtering
CREATE INDEX idx_complaint_status_category ON "Complaint" (status, category);

-- Time-based queries
CREATE INDEX idx_complaint_created_at ON "Complaint" (createdAt DESC);

-- User activity tracking
CREATE INDEX idx_audit_user_created ON "AuditLog" (userId, createdAt DESC);
```

#### Partitioning Strategy (Future)
```sql
-- Partition complaints by year
CREATE TABLE "Complaint_2024" PARTITION OF "Complaint"
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE "Complaint_2025" PARTITION OF "Complaint"
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

## Data Migration

### Seed Data
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create departments
  const departments = await Promise.all([
    prisma.department.create({ data: { name: 'Waste Management' } }),
    prisma.department.create({ data: { name: 'Roads & Infrastructure' } }),
    prisma.department.create({ data: { name: 'Water Supply' } }),
    prisma.department.create({ data: { name: 'Electricity & Lighting' } }),
    prisma.department.create({ data: { name: 'Public Health' } }),
    prisma.department.create({ data: { name: 'Drainage & Sewage' } })
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jansankalp.ai',
      name: 'System Admin',
      role: 'ADMIN',
      password: hashedPassword
    }
  });

  const officer = await prisma.user.create({
    data: {
      email: 'officer@jansankalp.ai',
      name: 'Municipal Officer',
      role: 'OFFICER',
      password: hashedPassword
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Backup and Recovery

### Backup Strategy
```bash
# Full database backup
pg_dump -h localhost -U username -d jansankalp > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U username -d jansankalp | gzip > backup_$(date +%Y%m%d).sql.gz

# Schema-only backup
pg_dump -h localhost -U username -d jansankalp --schema-only > schema_$(date +%Y%m%d).sql
```

### Recovery Process
```bash
# Restore from backup
psql -h localhost -U username -d jansankalp < backup_20240101.sql

# Restore from compressed backup
gunzip -c backup_20240101.sql.gz | psql -h localhost -U username -d jansankalp
```

## Monitoring and Maintenance

### Performance Monitoring
```sql
-- Slow query analysis
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Maintenance Tasks
```sql
-- Update statistics
ANALYZE;

-- Rebuild indexes
REINDEX DATABASE jansankalp;

-- Vacuum analyze
VACUUM ANALYZE;

-- Check for bloat
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
       pg_relation_size(schemaname||'.'||tablename)) as bloat
FROM pg_tables
WHERE schemaname = 'public';
```

## Security Considerations

### Data Encryption
- **At Rest**: PostgreSQL TDE (Transparent Data Encryption)
- **In Transit**: SSL/TLS encryption
- **Column Level**: Sensitive columns encrypted at application level

### Access Control
```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE jansankalp TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Create application user
CREATE USER app_user WITH PASSWORD 'app_password';
GRANT CONNECT ON DATABASE jansankalp TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### Row Level Security
```sql
-- Enable RLS
ALTER TABLE "Complaint" ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own complaints
CREATE POLICY user_own_complaints ON "Complaint"
FOR SELECT USING (authorId = current_setting('app.current_user_id'));

-- Policy for officers to see assigned complaints
CREATE POLICY officer_assigned_complaints ON "Complaint"
FOR SELECT USING (assignedToId = current_setting('app.current_user_id'));
```

## Database Versioning

### Migration Management
```bash
# Generate migration
npx prisma migrate dev --name add_new_feature

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

### Migration Scripts
```typescript
// prisma/migrations/001_add_complaint_duplicates/migration.sql
ALTER TABLE "Complaint" ADD COLUMN "duplicateOf" TEXT;

CREATE INDEX idx_complaint_duplicate_of ON "Complaint"("duplicateOf");

-- Add constraint to prevent circular references
ALTER TABLE "Complaint" ADD CONSTRAINT "no_circular_duplicates" 
CHECK ("id" != "duplicateOf");
```

## Scaling Considerations

### Read Replicas
```env
DATABASE_URL="postgresql://username:password@primary-db:5432/jansankalp"
DATABASE_READ_URL="postgresql://username:password@replica-db:5432/jansankalp"
```

### Connection Pooling
```typescript
// prisma/connection-pool.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings
  __internal: {
    engine: {
      connectionLimit: 10,
      poolTimeout: 10,
      connectTimeout: 10,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
