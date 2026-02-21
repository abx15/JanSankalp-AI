# 🔐 Security Guidelines & Best Practices

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Complete Security Architecture**
  
  _Authentication · Authorization · Data Protection · Compliance_
</div>

---

## 🛡️ Security Overview

JanSankalp AI implements a multi-layered security architecture designed to protect sensitive citizen data, ensure system integrity, and maintain compliance with government regulations.

---

## 🔐 Authentication & Authorization

### Multi-Factor Authentication (MFA)

#### Implementation
```typescript
// NextAuth.js configuration with 2FA
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text', required: false }
      },
      async authorize(credentials) {
        // Verify credentials
        const user = await verifyUser(credentials.email, credentials.password);
        
        if (user && credentials.otp) {
          // Verify 2FA
          const isValidOTP = await verifyOTP(user.id, credentials.otp);
          if (!isValidOTP) throw new Error('Invalid OTP');
        }
        
        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.departmentId = user.departmentId;
      }
      return token;
    }
  }
};
```

#### OTP Security
```typescript
// Secure OTP generation
function generateSecureOTP(): string {
  // Use cryptographically secure random number generator
  const crypto = require('crypto');
  return crypto.randomInt(100000, 999999).toString();
}

// OTP with rate limiting
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many OTP requests, please try again later'
});
```

### Role-Based Access Control (RBAC)

#### Permission Matrix
```typescript
// Role permissions configuration
const ROLE_PERMISSIONS = {
  CITIZEN: [
    'complaint:create',
    'complaint:read:own',
    'complaint:update:own',
    'notification:read:own',
    'profile:update:own'
  ],
  OFFICER: [
    'complaint:create',
    'complaint:read:assigned',
    'complaint:update:assigned',
    'complaint:assign:department',
    'notification:create',
    'notification:read:own',
    'profile:update:own',
    'analytics:read:department'
  ],
  ADMIN: [
    'complaint:*',
    'user:*',
    'department:*',
    'notification:*',
    'analytics:*',
    'system:*',
    'audit:read'
  ]
};

// Permission checking middleware
export function requirePermission(permission: string) {
  return async (req: NextRequest) => {
    const session = await getSession(req);
    
    if (!session?.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    const userPermissions = ROLE_PERMISSIONS[session.user.role] || [];
    
    if (!userPermissions.some(p => 
      p === permission || p === `${permission.split(':')[0]}:*`
    )) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    return session.user;
  };
}
```

---

## 🔒 Data Protection

### Encryption at Rest

#### Database Encryption
```sql
-- Enable PostgreSQL encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
ALTER TABLE users 
ADD COLUMN phone_encrypted TEXT,
ADD COLUMN address_encrypted TEXT;

-- Update encryption trigger
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.phone IS NOT NULL THEN
        NEW.phone_encrypted = pgp_sym_encrypt(NEW.phone, current_setting('app.encryption_key'));
    END IF;
    IF NEW.address IS NOT NULL THEN
        NEW.address_encrypted = pgp_sym_encrypt(NEW.address, current_setting('app.encryption_key'));
    END IF
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_user_data
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION encrypt_sensitive_data();
```

#### File Encryption
```typescript
// ImageKit encryption configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  // Enable server-side encryption
  transformation: [{
    type: 'encrypt',
    key: process.env.IMAGE_ENCRYPTION_KEY
  }]
});

// Encrypt uploaded files
async function uploadEncryptedImage(file: Buffer, filename: string) {
  const encryptedFile = await encryptFile(file, process.env.FILE_ENCRYPTION_KEY);
  
  return await imagekit.upload({
    file: encryptedFile,
    fileName: filename,
    useUniqueFileName: true,
    tags: ['encrypted']
  });
}
```

### Encryption in Transit

#### TLS Configuration
```typescript
// Next.js HTTPS configuration
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

#### API Security
```typescript
// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP'
});

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

## 🔍 Input Validation & Sanitization

### Request Validation
```typescript
// Comprehensive input validation
import { z } from 'zod';

const complaintSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s.,!?-]+$/, 'Invalid characters in title'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(val => sanitizeHtml(val, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      allowedAttributes: {}
    })),
  
  category: z.enum(['ROADS', 'WATER', 'ELECTRICITY', 'SANITATION', 'OTHER']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().max(500).optional()
  }).optional(),
  
  photos: z.array(z.string().url()).max(5).optional()
});

// Validation middleware
export function validateBody(schema: z.ZodSchema) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      throw new ValidationError('Invalid input data', error.errors);
    }
  };
}
```

### SQL Injection Prevention
```typescript
// Prisma ORM protection
export async function getComplaints(filters: ComplaintFilters) {
  // Prisma automatically parameterizes queries
  return await prisma.complaint.findMany({
    where: {
      status: filters.status,
      severity: filters.severity,
      departmentId: filters.departmentId,
      // Safe parameterized queries
      author: filters.authorId ? { id: filters.authorId } : undefined
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: false // Exclude sensitive data
        }
      }
    }
  });
}

// Raw query protection (when needed)
export async function getAnalytics(departmentId: string) {
  // Use parameterized queries
  const query = `
    SELECT 
      status,
      COUNT(*) as count,
      AVG(resolution_time) as avg_resolution_time
    FROM complaints 
    WHERE department_id = $1 
      AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY status
  `;
  
  return await prisma.$queryRawUnsafe(query, departmentId);
}
```

---

## 📊 Audit & Compliance

### Comprehensive Audit Trail
```typescript
// Audit logging middleware
export function auditLog(action: string, resourceType: string) {
  return async (req: NextRequest, result: any) => {
    const session = await getSession(req);
    const auditData = {
      userId: session?.user?.id,
      action,
      resourceType,
      resourceId: result?.id,
      oldValues: result?._oldValues,
      newValues: result?._newValues,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date()
    };
    
    // Store audit log
    await prisma.auditLog.create({ data: auditData });
    
    // Log to external system for compliance
    await logToExternalSystem(auditData);
  };
}

// Usage in API routes
export async function POST(req: NextRequest) {
  const data = await validateBody(complaintSchema)(req);
  
  try {
    const result = await prisma.complaint.create({ data });
    
    // Audit the creation
    await auditLog('CREATE', 'COMPLAINT')(req, result);
    
    return Response.json(result);
  } catch (error) {
    await auditLog('CREATE_FAILED', 'COMPLAINT')(req, { error: error.message });
    throw error;
  }
}
```

### Data Retention Policy
```typescript
// Automated data cleanup
export class DataRetentionService {
  static async cleanupOldData() {
    const retentionPeriods = {
      auditLogs: { years: 7 },
      notifications: { months: 6 },
      resolvedComplaints: { years: 10 },
      userSessions: { days: 30 }
    };
    
    // Clean up old audit logs
    await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - retentionPeriods.auditLogs.years * 365 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Clean up old notifications
    await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: {
          lt: new Date(Date.now() - retentionPeriods.notifications.months * 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
  }
}
```

---

## 🚨 Security Monitoring

### Intrusion Detection
```typescript
// Anomaly detection
export class SecurityMonitor {
  static async detectAnomalies(userId: string) {
    const timeWindow = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    
    const recentActivity = await prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: { gte: timeWindow }
      }
    });
    
    // Detect suspicious patterns
    const anomalies = [];
    
    // Too many failed logins
    const failedLogins = recentActivity.filter(log => 
      log.action === 'LOGIN_FAILED'
    ).length;
    
    if (failedLogins > 5) {
      anomalies.push({
        type: 'MULTIPLE_FAILED_LOGINS',
        count: failedLogins,
        severity: 'HIGH'
      });
    }
    
    // Unusual access patterns
    const uniqueIPs = new Set(recentActivity.map(log => log.ipAddress)).size;
    if (uniqueIPs > 3) {
      anomalies.push({
        type: 'MULTIPLE_IP_ACCESS',
        count: uniqueIPs,
        severity: 'MEDIUM'
      });
    }
    
    // Report anomalies
    if (anomalies.length > 0) {
      await this.reportAnomalies(userId, anomalies);
    }
    
    return anomalies;
  }
  
  static async reportAnomalies(userId: string, anomalies: any[]) {
    // Create security alert
    await prisma.notification.create({
      data: {
        userId,
        title: 'Security Alert',
        message: `Suspicious activity detected: ${anomalies.map(a => a.type).join(', ')}`,
        type: 'SECURITY_ALERT'
      }
    });
    
    // Notify security team
    await emailService.sendSecurityAlert({
      userId,
      anomalies,
      timestamp: new Date()
    });
    
    // Log to security system
    await securityLogger.log({
      event: 'ANOMALY_DETECTED',
      userId,
      anomalies,
      timestamp: new Date()
    });
  }
}
```

### Real-time Threat Detection
```typescript
// Rate limiting with dynamic adjustment
export class AdaptiveRateLimiter {
  private static limits = new Map<string, {
    count: number;
    windowStart: number;
    blocked: boolean;
  }>();
  
  static async checkLimit(identifier: string, limit: number, windowMs: number) {
    const now = Date.now();
    const record = this.limits.get(identifier) || {
      count: 0,
      windowStart: now,
      blocked: false
    };
    
    // Reset window if expired
    if (now - record.windowStart > windowMs) {
      record.count = 0;
      record.windowStart = now;
    }
    
    record.count++;
    
    // Block if limit exceeded
    if (record.count > limit) {
      record.blocked = true;
      await this.handleRateLimitExceeded(identifier);
      throw new RateLimitError('Rate limit exceeded');
    }
    
    this.limits.set(identifier, record);
    return true;
  }
  
  static async handleRateLimitExceeded(identifier: string) {
    // Log security event
    await securityLogger.log({
      event: 'RATE_LIMIT_EXCEEDED',
      identifier,
      timestamp: new Date()
    });
    
    // Temporarily block IP
    await this.temporaryBlock(identifier, 15 * 60 * 1000); // 15 minutes
  }
}
```

---

## 🔧 Security Configuration

### Environment Security
```typescript
// Secure environment configuration
export class SecurityConfig {
  static validate() {
    const requiredVars = [
      'DATABASE_URL',
      'AUTH_SECRET',
      'NEXTAUTH_SECRET',
      'ENCRYPTION_KEY'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate secret strength
    if (process.env.AUTH_SECRET?.length < 32) {
      throw new Error('AUTH_SECRET must be at least 32 characters');
    }
  }
  
  static generateSecureSecret(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}
```

### Session Security
```typescript
// Secure session configuration
export const sessionConfig = {
  strategy: 'jwt' as const,
  maxAge: 30 * 60, // 30 minutes
  updateAge: 5 * 60, // Update every 5 minutes
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 // 30 minutes
      }
    },
    callbackToken: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 // 5 minutes
      }
    }
  }
};
```

---

## 📋 Security Checklist

### Development Phase
- [ ] Environment variables are properly configured
- [ ] All inputs are validated and sanitized
- [ ] Authentication is properly implemented
- [ ] Authorization checks are in place
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are regularly updated
- [ ] Security headers are configured
- [ ] CORS is properly configured

### Testing Phase
- [ ] Penetration testing completed
- [ ] Vulnerability scanning performed
- [ ] Security testing automated
- [ ] Access control testing completed
- [ ] Data encryption verified
- [ ] Session management tested
- [ ] Rate limiting tested
- [ ] Audit logging verified

### Production Phase
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Intrusion detection system active
- [ ] Backup encryption enabled
- [ ] Monitoring systems active
- [ ] Incident response plan ready
- [ ] Security team notified
- [ ] Compliance audit completed

---

## 🚨 Incident Response

### Security Incident Procedure
```typescript
// Incident response automation
export class IncidentResponse {
  static async handleSecurityIncident(incident: SecurityIncident) {
    // 1. Immediate containment
    await this.containIncident(incident);
    
    // 2. Assessment
    const assessment = await this.assessImpact(incident);
    
    // 3. Notification
    await this.notifyStakeholders(incident, assessment);
    
    // 4. Investigation
    const investigation = await this.investigateIncident(incident);
    
    // 5. Recovery
    await this.recoverFromIncident(incident, investigation);
    
    // 6. Post-incident review
    await this.postIncidentReview(incident, investigation);
  }
  
  static async containIncident(incident: SecurityIncident) {
    // Block affected accounts
    if (incident.affectedUsers?.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: incident.affectedUsers } },
        data: { isActive: false }
      });
    }
    
    // Block suspicious IPs
    if (incident.sourceIPs?.length > 0) {
      for (const ip of incident.sourceIPs) {
        await this.blockIP(ip, 24 * 60 * 60 * 1000); // 24 hours
      }
    }
    
    // Enable enhanced monitoring
    await this.enableEnhancedMonitoring();
  }
}
```

### Security Alert System
```typescript
// Real-time security alerts
export class SecurityAlertSystem {
  static async sendAlert(alert: SecurityAlert) {
    const channels = [];
    
    // High severity - immediate notification
    if (alert.severity === 'CRITICAL') {
      channels.push(
        this.sendSMSAlert(alert),
        this.sendEmailAlert(alert),
        this.sendSlackAlert(alert)
      );
    }
    
    // Medium severity - email notification
    if (alert.severity === 'HIGH') {
      channels.push(
        this.sendEmailAlert(alert),
        this.sendDashboardAlert(alert)
      );
    }
    
    // Low severity - dashboard notification
    if (alert.severity === 'MEDIUM') {
      channels.push(
        this.sendDashboardAlert(alert)
      );
    }
    
    await Promise.all(channels);
  }
}
```

---

## 📊 Compliance & Regulations

### GDPR Compliance
```typescript
// GDPR data management
export class GDPRService {
  static async handleDataRequest(userId: string, requestType: 'PORTABILITY' | 'DELETION') {
    switch (requestType) {
      case 'PORTABILITY':
        return await this.exportUserData(userId);
      
      case 'DELETION':
        return await this.deleteUserData(userId);
      
      default:
        throw new Error('Invalid request type');
    }
  }
  
  static async exportUserData(userId: string) {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        complaints: true,
        notifications: true
      }
    });
    
    // Remove sensitive data
    const sanitizedData = {
      personalInfo: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address
      },
      complaints: userData.complaints.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status,
        createdAt: c.createdAt
      })),
      exportDate: new Date()
    };
    
    return sanitizedData;
  }
  
  static async deleteUserData(userId: string) {
    // Anonymize instead of delete for audit purposes
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@deleted.com`,
        name: 'Deleted User',
        phone: null,
        address: null,
        isActive: false
      }
    });
    
    // Delete sensitive data
    await prisma.notification.deleteMany({
      where: { userId }
    });
  }
}
```

### Government Compliance
```typescript
// Right to Information Act compliance
export class RTICompliance {
  static async generateRTIReport(requestId: string) {
    const reportData = {
      requestId,
      generatedAt: new Date(),
      totalComplaints: await prisma.complaint.count(),
      resolvedComplaints: await prisma.complaint.count({
        where: { status: 'RESOLVED' }
      }),
      averageResolutionTime: await this.getAverageResolutionTime(),
      departmentPerformance: await this.getDepartmentPerformance(),
      citizenSatisfaction: await this.getCitizenSatisfaction()
    };
    
    return reportData;
  }
}
```

---

## 🔮 Future Security Enhancements

### Planned Improvements
- **Zero Trust Architecture**: Implement comprehensive zero-trust model
- **AI-Powered Threat Detection**: Machine learning for anomaly detection
- **Blockchain Audit Trail**: Immutable audit records
- **Biometric Authentication**: Fingerprint and facial recognition
- **Quantum-Resistant Encryption**: Prepare for quantum computing threats

### Security Roadmap
1. **Q1 2026**: Implement advanced threat detection
2. **Q2 2026**: Deploy zero-trust architecture
3. **Q3 2026**: Add biometric authentication
4. **Q4 2026**: Implement blockchain audit trail

---

<div align="center">
  <p><strong>🔒 Comprehensive Security for Smart Governance</strong></p>
  <p><em>Protecting citizen data with industry-leading security practices</em></p>
  <p><strong>Last updated: February 21, 2026</strong></p>
</div>
