# 🔒 JanSankalp AI - Security Guidelines

## Overview

This document outlines comprehensive security practices for JanSankalp AI, covering authentication, data protection, API security, infrastructure security, and compliance requirements. All team members must follow these guidelines to ensure the security and integrity of the application and user data.

## Security Principles

### 1. Defense in Depth
- Multiple layers of security controls
- No single point of failure
- Redundant security measures

### 2. Least Privilege
- Users have minimum necessary permissions
- Services run with minimal privileges
- Access granted on need-to-know basis

### 3. Zero Trust
- Never trust, always verify
- All requests require authentication
- Continuous monitoring and validation

## Authentication & Authorization

### 1. Password Security
```typescript
// Password hashing configuration
const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

// Password requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
```

### 2. Session Management
```typescript
// NextAuth.js configuration
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};
```

### 3. Role-Based Access Control (RBAC)
```typescript
// Role definitions
export enum Role {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  ADMIN = 'ADMIN'
}

// Permission matrix
const permissions = {
  [Role.CITIZEN]: [
    'complaint:create',
    'complaint:read:own',
    'remark:create:own'
  ],
  [Role.OFFICER]: [
    'complaint:read:assigned',
    'complaint:update:assigned',
    'remark:create:any',
    'department:read'
  ],
  [Role.ADMIN]: [
    'complaint:any',
    'user:any',
    'department:any',
    'system:admin'
  ]
};
```

### 4. Multi-Factor Authentication (MFA)
```typescript
// MFA implementation (future enhancement)
import { authenticator } from 'otplib';

// Generate secret
const secret = authenticator.generateSecret();

// Generate QR code
const qrCode = authenticator.keyuri(user.email, 'JanSankalp AI', secret);

// Verify token
const isValid = authenticator.verify({ token, secret });
```

## Data Protection

### 1. Encryption at Rest
```typescript
// Database encryption
// Use PostgreSQL TDE or application-level encryption

// Sensitive data encryption
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}
```

### 2. Encryption in Transit
```typescript
// HTTPS enforcement
export const middleware = (request: NextRequest) => {
  if (request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }
};
```

### 3. Data Masking
```typescript
// PII masking for logs
function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
}

function maskPhone(phone: string): string {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
}
```

### 4. Data Retention Policy
```typescript
// Automatic data cleanup
export const cleanupOldData = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Delete old audit logs
  await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo
      }
    }
  });
  
  // Anonymize old user data
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  await prisma.user.updateMany({
    where: {
      createdAt: {
        lt: oneYearAgo
      },
      role: 'CITIZEN'
    },
    data: {
      phone: null,
      address: null,
      bio: null
    }
  });
};
```

## API Security

### 1. Input Validation
```typescript
// Zod schemas for validation
import { z } from 'zod';

export const createComplaintSchema = z.object({
  title: z.string().min(5).max(200).regex(/^[a-zA-Z0-9\s.,!?-]+$/),
  description: z.string().min(10).max(2000),
  category: z.enum(['Waste Management', 'Roads & Infrastructure', 'Water Supply', 
                   'Electricity & Lighting', 'Public Health', 'Drainage & Sewage']),
  severity: z.number().min(1).max(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().optional()
});

// Middleware for validation
export const validateRequest = (schema: z.ZodSchema) => {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      schema.parse(body);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
  };
};
```

### 2. Rate Limiting
```typescript
// Rate limiting implementation
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limits for sensitive endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
});
```

### 3. CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

### 4. API Key Management
```typescript
// API key validation
export const validateApiKey = (request: NextRequest) => {
  const apiKey = request.headers.get('X-API-Key');
  const validKeys = process.env.API_KEYS?.split(',') || [];
  
  if (!apiKey || !validKeys.includes(apiKey)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
};
```

## Infrastructure Security

### 1. Environment Security
```bash
# .env file permissions
chmod 600 .env

# Environment variable validation
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi
```

### 2. Docker Security
```dockerfile
# Use non-root user
FROM node:18-alpine AS base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Security scanning
RUN npm audit --audit-level high

# Minimal base image
FROM node:18-alpine AS runner
USER nextjs
```

### 3. Database Security
```sql
-- Row Level Security
ALTER TABLE "Complaint" ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own complaints
CREATE POLICY user_own_complaints ON "Complaint"
FOR SELECT USING (authorId = current_setting('app.current_user_id'));

-- Policy for officers to see assigned complaints
CREATE POLICY officer_assigned_complaints ON "Complaint"
FOR SELECT USING (assignedToId = current_setting('app.current_user_id'));

-- Audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "AuditLog" (action, userId, details)
  VALUES (
    TG_OP || '_' || TG_TABLE_NAME,
    current_setting('app.current_user_id'),
    row_to_json(NEW)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger
CREATE TRIGGER audit_complaints
AFTER INSERT OR UPDATE OR DELETE ON "Complaint"
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

### 4. Network Security
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' wss:;" always;

# Hide server version
server_tokens off;

# Limit request size
client_max_body_size 10M;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## File Upload Security

### 1. File Validation
```typescript
// File upload validation
export const validateFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  // Scan for malware (integration with ClamAV or similar)
  return true;
};
```

### 2. Secure Storage
```typescript
// Cloudinary security configuration
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload with security options
export const uploadFile = async (file: Buffer, options: any) => {
  return cloudinary.uploader.upload(file, {
    resource_type: 'auto',
    format: 'webp',
    quality: 'auto:good',
    fetch_format: 'auto',
    secure: true,
    overwrite: true,
    invalidate: true,
    ...options
  });
};
```

### 3. Access Control
```typescript
// File access middleware
export const checkFileAccess = async (request: NextRequest) => {
  const { fileId } = request.params;
  const user = await getCurrentUser(request);
  
  const file = await prisma.uploadedFile.findUnique({
    where: { id: fileId }
  });
  
  if (!file || file.uploadedBy !== user.id) {
    return NextResponse.json(
      { error: 'File not found or access denied' },
      { status: 404 }
    );
  }
  
  return NextResponse.next();
};
```

## Logging and Monitoring

### 1. Security Logging
```typescript
// Security event logger
export const logSecurityEvent = async (
  event: string,
  userId: string,
  details: any,
  severity: 'low' | 'medium' | 'high' = 'medium'
) => {
  await prisma.securityLog.create({
    data: {
      event,
      userId,
      details: JSON.stringify(details),
      severity,
      ipAddress: details.ip,
      userAgent: details.userAgent,
      timestamp: new Date()
    }
  });
  
  // Send alerts for high severity events
  if (severity === 'high') {
    await sendSecurityAlert(event, details);
  }
};
```

### 2. Intrusion Detection
```typescript
// Suspicious activity detection
export const detectSuspiciousActivity = async (userId: string) => {
  const recentAttempts = await prisma.securityLog.findMany({
    where: {
      userId,
      timestamp: {
        gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
      }
    }
  });
  
  const failedLogins = recentAttempts.filter(log => 
    log.event === 'LOGIN_FAILED'
  ).length;
  
  if (failedLogins > 5) {
    await lockAccount(userId);
    await logSecurityEvent('ACCOUNT_LOCKED', userId, { reason: 'Too many failed attempts' }, 'high');
  }
};
```

### 3. Monitoring Dashboard
```typescript
// Security metrics
export const getSecurityMetrics = async () => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return {
    failedLogins: await prisma.securityLog.count({
      where: {
        event: 'LOGIN_FAILED',
        timestamp: { gte: last24Hours }
      }
    }),
    suspiciousActivity: await prisma.securityLog.count({
      where: {
        severity: 'high',
        timestamp: { gte: last24Hours }
      }
    }),
    activeSessions: await prisma.session.count({
      where: {
        expires: { gt: new Date() }
      }
    })
  };
};
```

## Compliance and Legal

### 1. GDPR Compliance
```typescript
// Data subject rights implementation
export const exportUserData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      complaints: true,
      remarks: true,
      auditLogs: true
    }
  });
  
  // Format data for export
  return {
    personalData: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    },
    activity: {
      complaints: user.complaints,
      remarks: user.remarks,
      auditLogs: user.auditLogs
    }
  };
};

// Right to be forgotten
export const deleteUserData = async (userId: string) => {
  await prisma.$transaction([
    // Anonymize complaints instead of deleting for audit purposes
    prisma.complaint.updateMany({
      where: { authorId: userId },
      data: { 
        authorId: null,
        originalText: '[REDACTED]',
        description: '[REDACTED]'
      }
    }),
    // Delete personal data
    prisma.user.delete({
      where: { id: userId }
    })
  ]);
};
```

### 2. Data Processing Agreement
```typescript
// Data processing records
export const logDataProcessing = async (
  operation: string,
  dataCategory: string,
  purpose: string,
  legalBasis: string
) => {
  await prisma.dataProcessingRecord.create({
    data: {
      operation,
      dataCategory,
      purpose,
      legalBasis,
      timestamp: new Date()
    }
  });
};
```

### 3. Cookie Compliance
```typescript
// Cookie consent management
export const cookieConsent = {
  necessary: ['session', 'csrf'],
  analytics: ['ga', 'clarity'],
  marketing: ['fb_pixel', 'adwords'],
  
  getConsentedCookies(consent: any) {
    const cookies = [...this.necessary];
    
    if (consent.analytics) cookies.push(...this.analytics);
    if (consent.marketing) cookies.push(...this.marketing);
    
    return cookies;
  }
};
```

## Security Testing

### 1. Automated Security Testing
```bash
# npm scripts for security testing
{
  "scripts": {
    "security:audit": "npm audit --audit-level high",
    "security:sast": "semgrep --config=auto src/",
    "security:dast": "zap-baseline.py -t http://localhost:3000",
    "security:dependencies": "npm audit --json | jq .vulnerabilities"
  }
}
```

### 2. Penetration Testing Checklist
```bash
# Authentication testing
- [ ] Test weak passwords
- [ ] Test session hijacking
- [ ] Test privilege escalation
- [ ] Test MFA bypass

# API testing
- [ ] Test SQL injection
- [ ] Test XSS vulnerabilities
- [ ] Test CSRF attacks
- [ ] Test rate limiting bypass

# Infrastructure testing
- [ ] Test network security
- [ ] Test server hardening
- [ ] Test data encryption
- [ ] Test backup security
```

### 3. Security Headers Testing
```typescript
// Security headers validation
export const validateSecurityHeaders = async (url: string) => {
  const response = await fetch(url);
  const requiredHeaders = [
    'x-frame-options',
    'x-xss-protection',
    'x-content-type-options',
    'referrer-policy',
    'content-security-policy'
  ];
  
  const missingHeaders = requiredHeaders.filter(header => 
    !response.headers.get(header)
  );
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing security headers: ${missingHeaders.join(', ')}`);
  }
  
  return true;
};
```

## Incident Response

### 1. Incident Classification
```typescript
// Incident severity levels
export enum IncidentSeverity {
  LOW = 'low',      // Minor security issue
  MEDIUM = 'medium', // Potential data exposure
  HIGH = 'high',    // Active security breach
  CRITICAL = 'critical' // System compromise
}

// Incident response procedures
const responseProcedures = {
  [IncidentSeverity.LOW]: {
    responseTime: '24 hours',
    actions: ['Log incident', 'Monitor for patterns', 'Review security measures']
  },
  [IncidentSeverity.MEDIUM]: {
    responseTime: '4 hours',
    actions: ['Immediate investigation', 'Contain threat', 'Notify stakeholders']
  },
  [IncidentSeverity.HIGH]: {
    responseTime: '1 hour',
    actions: ['Emergency response', 'System lockdown', 'Legal notification']
  },
  [IncidentSeverity.CRITICAL]: {
    responseTime: '15 minutes',
    actions: ['Immediate shutdown', 'Forensic investigation', 'Public disclosure']
  }
};
```

### 2. Incident Response Team
```typescript
// Team roles and responsibilities
export const incidentResponseTeam = {
  incidentCommander: {
    role: 'Overall coordination',
    contact: 'security@jansankalp.ai'
  },
  technicalLead: {
    role: 'Technical investigation',
    contact: 'tech-lead@jansankalp.ai'
  },
  communicationsLead: {
    role: 'Internal/external communication',
    contact: 'comms@jansankalp.ai'
  },
  legalAdvisor: {
    role: 'Legal compliance',
    contact: 'legal@jansankalp.ai'
  }
};
```

### 3. Incident Reporting
```typescript
// Incident reporting system
export const reportIncident = async (
  severity: IncidentSeverity,
  description: string,
  affectedSystems: string[],
  discoveredBy: string
) => {
  const incident = await prisma.securityIncident.create({
    data: {
      severity,
      description,
      affectedSystems,
      discoveredBy,
      status: 'OPEN',
      createdAt: new Date()
    }
  });
  
  // Notify response team
  await notifyResponseTeam(incident);
  
  // Create response plan
  await createResponsePlan(incident);
  
  return incident;
};
```

## Security Training

### 1. Developer Security Training
```typescript
// Security coding guidelines
export const secureCodingGuidelines = {
  inputValidation: 'Always validate and sanitize user input',
  authentication: 'Use strong authentication and authorization',
  errorHandling: 'Don't expose sensitive information in error messages',
  logging: 'Log security events without sensitive data',
  dependencies: 'Regularly update and audit dependencies',
  testing: 'Include security testing in development process'
};
```

### 2. Security Awareness Training
- Monthly security newsletters
- Quarterly security workshops
- Annual security certification
- Phishing simulation exercises

### 3. Security Resources
```typescript
// Security documentation and resources
export const securityResources = {
  guidelines: '/docs/security-guidelines.md',
  checklists: '/docs/security-checklists.md',
  contacts: {
    securityTeam: 'security@jansankalp.ai',
    incidentResponse: 'incident@jansankalp.ai',
    legal: 'legal@jansankalp.ai'
  },
  tools: {
    vulnerabilityScanner: 'Nessus',
    codeAnalysis: 'SonarQube',
    monitoring: 'Splunk',
    testing: 'OWASP ZAP'
  }
};
```

## Security Checklist

### Daily Security Checks
- [ ] Review security logs for suspicious activity
- [ ] Check for failed login attempts
- [ ] Monitor system resource usage
- [ ] Verify backup completion

### Weekly Security Tasks
- [ ] Update security patches
- [ ] Review user access permissions
- [ ] Scan for vulnerabilities
- [ ] Test security controls

### Monthly Security Reviews
- [ ] Conduct security audit
- [ ] Review incident reports
- [ ] Update security policies
- [ ] Perform penetration testing

### Quarterly Security Assessments
- [ ] Full security audit
- [ ] Risk assessment update
- [ ] Compliance verification
- [ ] Security training review

## Emergency Contacts

### Security Team
- **Security Lead**: security@jansankalp.ai
- **Incident Response**: incident@jansankalp.ai
- **Legal Counsel**: legal@jansankalp.ai

### External Services
- **Cybersecurity Consultant**: consultant@securityfirm.com
- **Law Enforcement**: cybercrime@localpolice.gov
- **Data Protection Authority**: gdpr@privacyauthority.eu

## Security Tools and Services

### Monitoring Tools
- **Application Monitoring**: Sentry, Datadog
- **Infrastructure Monitoring**: Prometheus, Grafana
- **Log Management**: ELK Stack, Splunk
- **Security Monitoring**: OSSEC, Wazuh

### Security Testing Tools
- **Static Analysis**: SonarQube, Semgrep
- **Dynamic Analysis**: OWASP ZAP, Burp Suite
- **Dependency Scanning**: npm audit, Snyk
- **Container Security**: Trivy, Clair

### Compliance Tools
- **GDPR Compliance**: OneTrust, TrustArc
- **Security Standards**: ISO 27001, SOC 2
- **Risk Management**: RiskLens, LogicGate

## Conclusion

Security is an ongoing process that requires constant vigilance, regular updates, and continuous improvement. All team members must prioritize security in their daily work and follow these guidelines to protect our users and systems.

Remember: Security is everyone's responsibility. If you see something suspicious, say something immediately.

For questions or concerns about security, contact the security team at security@jansankalp.ai.
