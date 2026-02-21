# 🗄️ Database Schema Documentation

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Complete Database Architecture**
  
  _PostgreSQL · Prisma ORM · Relationships · Design_
</div>

---

## 📊 Overview

JanSankalp AI uses PostgreSQL as its primary database with Prisma as the ORM. The database schema is designed to support a comprehensive civic complaint management system with role-based access control, audit trails, and real-time data synchronization.

---

## 🏗️ Database Configuration

### Connection Details
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Connection Pooling**: Enabled
- **SSL**: Required in production
- **Vector Database**: Weaviate (for semantic search)

### Environment Variables
```env
# Primary Database
DATABASE_URL="postgresql://username:password@localhost:5432/jansankalp"

# Vector Database
WEAVIATE_URL="http://localhost:8080"

# Cache & Sessions
REDIS_URL="redis://localhost:6379"
```

---

## 📋 Schema Diagram

```mermaid
erDiagram
    User ||--o{ Complaint : "creates"
    User ||--o{ Complaint : "assigned_to"
    User ||--o{ Department : "manages"
    User ||--o{ Notification : "receives"
    User ||--o{ AuditLog : "performs"
    
    Department ||--o{ Complaint : "handles"
    Department ||--o{ Officer : "employs"
    
    Complaint ||--o{ Notification : "triggers"
    Complaint ||--o{ ComplaintPhoto : "has"
    Complaint ||--o{ ComplaintUpdate : "tracks"
    
    Officer ||--o{ Complaint : "resolves"
    Officer ||--o{ ComplaintUpdate : "creates"
    
    User {
        string id PK
        string name
        string email UK
        string password_hash
        enum role
        string phone
        string address
        float latitude
        float longitude
        datetime created_at
        datetime updated_at
        boolean is_active
        string department_id FK
    }
    
    Department {
        string id PK
        string name
        string code UK
        string description
        string head_officer_id FK
        datetime created_at
        boolean is_active
    }
    
    Complaint {
        string id PK
        string complaint_id UK
        string title
        text description
        string category
        enum severity
        enum status
        float latitude
        float longitude
        string location_address
        string author_id FK
        string assigned_to FK
        string department_id FK
        text officer_notes
        text resolution_details
        datetime resolved_at
        datetime created_at
        datetime updated_at
    }
    
    ComplaintPhoto {
        string id PK
        string complaint_id FK
        string photo_url
        string photo_type
        datetime uploaded_at
        string uploaded_by FK
    }
    
    ComplaintUpdate {
        string id PK
        string complaint_id FK
        string updated_by FK
        enum old_status
        enum new_status
        text notes
        datetime created_at
    }
    
    Notification {
        string id PK
        string user_id FK
        string title
        text message
        enum type
        boolean is_read
        string related_complaint_id FK
        datetime created_at
    }
    
    AuditLog {
        string id PK
        string user_id FK
        string action
        string resource_type
        string resource_id
        json old_values
        json new_values
        string ip_address
        string user_agent
        datetime created_at
    }
```

---

## 📊 Table Definitions

### 👥 Users Table

**Purpose**: Stores all user accounts with role-based access control

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    phone VARCHAR(20),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Roles Enum
CREATE TYPE user_role AS ENUM (
    'CITIZEN',
    'OFFICER', 
    'ADMIN'
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);
```

**Key Features**:
- Role-based access control (RBAC)
- Geographic location support
- Department assignment for officers
- Soft delete capability
- Audit trail support

### 🏢 Departments Table

**Purpose**: Manages government departments and their assignments

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    head_officer_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_head ON departments(head_officer_id);
```

### 📝 Complaints Table

**Purpose**: Core table for managing civic complaints

```sql
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity complaint_severity NOT NULL DEFAULT 'MEDIUM',
    status complaint_status NOT NULL DEFAULT 'PENDING',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address TEXT,
    author_id UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    officer_notes TEXT,
    resolution_details TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE complaint_severity AS ENUM (
    'LOW',
    'MEDIUM', 
    'HIGH',
    'CRITICAL'
);

CREATE TYPE complaint_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'RESOLVED',
    'REJECTED',
    'ON_HOLD'
);

-- Indexes for performance
CREATE INDEX idx_complaints_author ON complaints(author_id);
CREATE INDEX idx_complaints_assigned ON complaints(assigned_to);
CREATE INDEX idx_complaints_department ON complaints(department_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_severity ON complaints(severity);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created ON complaints(created_at);
```

### 📸 Complaint Photos Table

**Purpose**: Stores photo evidence for complaints

```sql
CREATE TABLE complaint_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_type photo_type_enum DEFAULT 'EVIDENCE',
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE photo_type_enum AS ENUM (
    'EVIDENCE',
    'VERIFICATION',
    'RESOLUTION'
);

-- Indexes
CREATE INDEX idx_complaint_photos_complaint ON complaint_photos(complaint_id);
CREATE INDEX idx_complaint_photos_type ON complaint_photos(photo_type);
```

### 🔄 Complaint Updates Table

**Purpose**: Tracks status changes and updates to complaints

```sql
CREATE TABLE complaint_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by UUID NOT NULL REFERENCES users(id),
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_complaint_updates_complaint ON complaint_updates(complaint_id);
CREATE INDEX idx_complaint_updates_updated_by ON complaint_updates(updated_by);
```

### 🔔 Notifications Table

**Purpose**: Manages user notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_complaint_id UUID REFERENCES complaints(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
    'COMPLAINT_CREATED',
    'COMPLAINT_ASSIGNED',
    'COMPLAINT_UPDATED',
    'COMPLAINT_RESOLVED',
    'SYSTEM_ANNOUNCEMENT',
    'REMINDER'
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_complaint ON notifications(related_complaint_id);
```

### 📋 Audit Logs Table

**Purpose**: Comprehensive audit trail for compliance

```sql
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

-- Indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

## 🔍 Database Relationships

### Primary Relationships

#### User-Centric Relationships
```mermaid
graph LR
    A[User] --> B[Complaints Created]
    A --> C[Complaints Assigned]
    A --> D[Notifications]
    A --> E[Audit Logs]
    A --> F[Department Managed]
```

#### Complaint Lifecycle
```mermaid
graph TD
    A[Complaint Created] --> B[Assigned to Department]
    B --> C[Assigned to Officer]
    C --> D[Status Updates]
    D --> E[Resolution]
    E --> F[Notifications Sent]
```

#### Department Structure
```mermaid
graph TB
    A[Department] --> B[Head Officer]
    A --> C[Officers]
    C --> D[Assigned Complaints]
    D --> E[Resolutions]
```

---

## 🚀 Performance Optimization

### Indexing Strategy

#### Primary Indexes
```sql
-- User performance indexes
CREATE INDEX CONCURRENTLY idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_users_role_department ON users(role, department_id);

-- Complaint performance indexes
CREATE INDEX CONCURRENTLY idx_complaints_status_severity ON complaints(status, severity);
CREATE INDEX CONCURRENTLY idx_complaints_location ON complaints(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_complaints_time_status ON complaints(created_at DESC, status);

-- Notification performance indexes
CREATE INDEX CONCURRENTLY idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;
```

#### Composite Indexes
```sql
-- For dashboard queries
CREATE INDEX CONCURRENTLY idx_complaints_dashboard ON complaints(assigned_to, status, created_at DESC);

-- For analytics
CREATE INDEX CONCURRENTLY idx_complaints_analytics ON complaints(department_id, category, created_at);

-- For search
CREATE INDEX CONCURRENTLY idx_complaints_search ON complaints(title, description) USING gin(to_tsvector('english', title || ' ' || description));
```

### Query Optimization

#### Common Query Patterns
```sql
-- Get user's complaints with pagination
SELECT c.*, u.name as author_name 
FROM complaints c
JOIN users u ON c.author_id = u.id
WHERE c.author_id = $1
ORDER BY c.created_at DESC
LIMIT $2 OFFSET $3;

-- Get officer's assigned cases
SELECT c.*, d.name as department_name
FROM complaints c
JOIN departments d ON c.department_id = d.id
WHERE c.assigned_to = $1 AND c.status != 'RESOLVED'
ORDER BY c.severity DESC, c.created_at ASC;

-- Department statistics
SELECT 
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
FROM complaints 
WHERE department_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY status;
```

---

## 🔐 Security & Compliance

### Data Protection

#### Encryption
```sql
-- Enable column-level encryption for sensitive data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Example: Encrypt sensitive notes
ALTER TABLE complaints ADD COLUMN officer_notes_encrypted TEXT;
UPDATE complaints 
SET officer_notes_encrypted = pgp_sym_encrypt(officer_notes, 'encryption_key')
WHERE officer_notes IS NOT NULL;
```

#### Row-Level Security
```sql
-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own complaints
CREATE POLICY user_own_complaints ON complaints
    FOR SELECT
    USING (author_id = current_setting('app.current_user_id')::UUID);

-- Policy: Officers can see complaints assigned to them
CREATE POLICY officer_assigned_complaints ON complaints
    FOR SELECT
    USING (assigned_to = current_setting('app.current_user_id')::UUID);
```

### Audit Trail

#### Comprehensive Logging
```sql
-- Trigger for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        current_setting('app.current_user_id')::UUID,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        row_to_json(OLD),
        row_to_json(NEW),
        current_setting('app.client_ip')
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER audit_complaints
    AFTER INSERT OR UPDATE OR DELETE ON complaints
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

## 📊 Analytics & Reporting

### Materialized Views

#### Department Performance
```sql
CREATE MATERIALIZED VIEW department_performance AS
SELECT 
    d.id,
    d.name,
    COUNT(c.id) as total_complaints,
    COUNT(CASE WHEN c.status = 'RESOLVED' THEN 1 END) as resolved_complaints,
    AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/3600) as avg_resolution_hours,
    COUNT(CASE WHEN c.severity = 'CRITICAL' THEN 1 END) as critical_complaints
FROM departments d
LEFT JOIN complaints c ON d.id = c.department_id
WHERE c.created_at >= NOW() - INTERVAL '90 days'
GROUP BY d.id, d.name;

-- Refresh schedule
CREATE OR REPLACE FUNCTION refresh_department_performance()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY department_performance;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (requires pg_cron)
SELECT cron.schedule('refresh-dept-performance', '0 */6 * * *', 'SELECT refresh_department_performance();');
```

#### User Activity
```sql
CREATE MATERIALIZED VIEW user_activity_summary AS
SELECT 
    u.id,
    u.name,
    u.role,
    COUNT(c.id) as complaints_created,
    COUNT(ca.id) as complaints_assigned,
    COUNT(CASE WHEN c.status = 'RESOLVED' AND ca.id IS NOT NULL THEN 1 END) as complaints_resolved,
    MAX(c.created_at) as last_activity
FROM users u
LEFT JOIN complaints c ON u.id = c.author_id
LEFT JOIN complaints ca ON u.id = ca.assigned_to
GROUP BY u.id, u.name, u.role;
```

---

## 🔄 Data Migration & Seeding

### Database Seeding Script

#### Comprehensive Seed Data
```sql
-- Insert departments
INSERT INTO departments (id, name, code, description) VALUES
    (gen_random_uuid(), 'Public Works', 'PW', 'Road maintenance, streetlights, and infrastructure'),
    (gen_random_uuid(), 'Water Department', 'WD', 'Water supply, drainage, and sewage'),
    (gen_random_uuid(), 'Sanitation', 'SAN', 'Garbage collection and cleaning'),
    (gen_random_uuid(), 'Electricity', 'ELEC', 'Streetlights and power infrastructure'),
    (gen_random_uuid(), 'Traffic Police', 'TP', 'Traffic management and signals');

-- Insert admin users
INSERT INTO users (id, name, email, password_hash, role, department_id) VALUES
    (gen_random_uuid(), 'System Admin', 'admin@jansankalp.gov.in', '$2b$12$...', 'ADMIN', NULL),
    (gen_random_uuid(), 'Public Works Head', 'pw.head@jansankalp.gov.in', '$2b$12$...', 'ADMIN', (SELECT id FROM departments WHERE code = 'PW'));

-- Insert officers
INSERT INTO users (name, email, password_hash, role, department_id) VALUES
    ('Rajesh Kumar', 'rajesh.kumar@jansankalp.gov.in', '$2b$12$...', 'OFFICER', (SELECT id FROM departments WHERE code = 'PW')),
    ('Priya Sharma', 'priya.sharma@jansankalp.gov.in', '$2b$12$...', 'OFFICER', (SELECT id FROM departments WHERE code = 'WD'));

-- Insert sample complaints
INSERT INTO complaints (complaint_id, title, description, category, severity, author_id, department_id) VALUES
    ('COMP-2026-0001', 'Pothole on Main Street', 'Large pothole causing traffic issues', 'ROADS', 'HIGH', 
     (SELECT id FROM users WHERE role = 'CITIZEN' LIMIT 1), 
     (SELECT id FROM departments WHERE code = 'PW'));
```

---

## 🚨 Backup & Recovery

### Backup Strategy

#### Automated Backups
```bash
#!/bin/bash
# backup_database.sh

DB_NAME="jansankalp"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# Full backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/jansankalp_full_$DATE.sql.gz

# Schema only backup
pg_dump -U $DB_USER -h localhost --schema-only $DB_NAME > $BACKUP_DIR/jansankalp_schema_$DATE.sql

# Data only backup
pg_dump -U $DB_USER -h localhost --data-only $DB_NAME | gzip > $BACKUP_DIR/jansankalp_data_$DATE.sql.gz

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "jansankalp_*.sql.gz" -mtime +30 -delete
```

#### Point-in-Time Recovery
```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f';

-- Create restore point
SELECT pg_create_restore_point('before_major_update');

-- Recovery configuration
-- In recovery.conf:
-- restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
-- recovery_target_time = '2026-02-21 10:00:00'
```

---

## 📈 Monitoring & Maintenance

### Performance Monitoring

#### Query Performance
```sql
-- Slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;  # Log queries > 1s
ALTER SYSTEM SET log_statement = 'all';

-- Monitor active queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

#### Database Health
```sql
-- Database size monitoring
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;

-- Table size monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔧 Maintenance Tasks

### Regular Maintenance

#### Automated Maintenance
```sql
-- Update statistics
ANALYZE;

-- Reindex fragmented indexes
REINDEX DATABASE jansankalp;

-- Vacuum and reindex
VACUUM FULL ANALYZE;

-- Clean up old audit logs (keep 1 year)
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

-- Clean up old notifications (keep 6 months)
DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '6 months' AND is_read = true;
```

#### Scheduled Tasks
```bash
# maintenance.sh
#!/bin/bash

echo "Starting database maintenance..."

# Update statistics
psql -U postgres -d jansankalp -c "ANALYZE;"

# Rebuild indexes
psql -U postgres -d jansankalp -c "REINDEX DATABASE jansankalp;"

# Vacuum
psql -U postgres -d jansankalp -c "VACUUM FULL ANALYZE;"

# Clean old data
psql -U postgres -d jansankalp -c "
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
    DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '6 months' AND is_read = true;
"

echo "Maintenance completed."
```

---

## 📚 Best Practices

### Development Guidelines

#### Schema Changes
1. **Always use migrations** - Never modify schema directly
2. **Backward compatibility** - Maintain compatibility during transitions
3. **Test migrations** - Test on staging before production
4. **Document changes** - Update documentation with schema changes

#### Query Optimization
1. **Use appropriate indexes** - Based on query patterns
2. **Avoid N+1 queries** - Use joins and subqueries effectively
3. **Monitor performance** - Regular query performance analysis
4. **Use connection pooling** - Optimize database connections

#### Data Integrity
1. **Use constraints** - Foreign keys, check constraints, unique constraints
2. **Validate input** - Application-level validation
3. **Handle transactions** - Proper transaction management
4. **Error handling** - Comprehensive error handling

---

<div align="center">
  <p><strong>🗄️ Robust Database Architecture for Smart Governance</strong></p>
  <p><em>Scalable, secure, and optimized for performance</em></p>
  <p><strong>Last updated: February 21, 2026</strong></p>
</div>
