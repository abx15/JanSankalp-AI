-- National Scale Partitioning Strategy
-- Partitioning the 'Complaint' table by districtId

-- 1. Create the master table as a partitioned table
-- Note: In a real migration, we'd rename the existing table, create this, and move data.
/*
ALTER TABLE "Complaint" RENAME TO "Complaint_old";

CREATE TABLE "Complaint" (
    id TEXT PRIMARY KEY,
    ticketId TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    severity INTEGER DEFAULT 1,
    category TEXT NOT NULL,
    authorId TEXT NOT NULL,
    stateId TEXT,
    districtId TEXT NOT NULL, -- PARTITION KEY
    cityId TEXT,
    wardId TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE
) PARTITION BY LIST (districtId);
*/

-- 2. Define Partitions for major districts
CREATE TABLE "Complaint_Delhi" PARTITION OF "Complaint"
    FOR VALUES IN ('delhi-central', 'delhi-north', 'delhi-south');

CREATE TABLE "Complaint_Mumbai" PARTITION OF "Complaint"
    FOR VALUES IN ('mumbai-city', 'mumbai-suburban');

CREATE TABLE "Complaint_Bangalore" PARTITION OF "Complaint"
    FOR VALUES IN ('bangalore-urban', 'bangalore-rural');

-- 3. Default partition for other districts
CREATE TABLE "Complaint_Default" PARTITION OF "Complaint" DEFAULT;

-- 4. Indexing Strategy for Shards
CREATE INDEX idx_complaint_district_status ON "Complaint" (districtId, status);
CREATE INDEX idx_complaint_created_at ON "Complaint" (createdAt DESC);

-- 5. Audit Log Partitioning by Time
/*
CREATE TABLE "AuditLog" (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    userId TEXT NOT NULL,
    details TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (createdAt);

CREATE TABLE "AuditLog_2026_Q1" PARTITION OF "AuditLog"
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
*/
