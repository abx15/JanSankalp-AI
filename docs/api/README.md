# 🔌 JanSankalp API Documentation

<div align="center">
  <img src="../../public/logojansanklp.png" alt="JanSankalp AI Logo" width="80" />
  
  **Complete API Reference**
  
  _RESTful APIs · Real-time Updates · Authentication_
</div>

---

## 🚀 Quick Start

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication
All API endpoints (except auth endpoints) require JWT authentication:
```bash
Authorization: Bearer <your-jwt-token>
```

### Content Type
```bash
Content-Type: application/json
```

---

## 📋 API Endpoints Overview

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **🔐 Authentication** | `/auth/*` | Login, registration, OTP, password reset |
| **📝 Complaints** | `/complaints/*` | CRUD operations, status updates, assignments |
| **👥 Users** | `/users/*` | User management, profiles, roles |
| **🔔 Notifications** | `/notifications/*` | Real-time updates, email notifications |
| **📊 Analytics** | `/analytics/*` | Dashboard data, statistics, reports |
| **🤖 AI Engine** | `/ai/*` | AI services, classification, recommendations |
| **🌐 Real-time** | `/stream/*` | Server-sent events, live updates |

---

## 🔐 Authentication APIs

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Arun Kumar",
  "email": "arun.kumar@example.com",
  "password": "password123",
  "role": "CITIZEN" | "OFFICER" | "ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "Arun Kumar",
    "email": "arun.kumar@example.com",
    "role": "CITIZEN"
  },
  "message": "User registered successfully"
}
```

### POST `/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "arun.kumar@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "Arun Kumar",
    "email": "arun.kumar@example.com",
    "role": "CITIZEN"
  }
}
```

### POST `/auth/forgot-password`
Request OTP for password reset.

**Request Body:**
```json
{
  "email": "arun.kumar@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### POST `/auth/verify-otp`
Verify OTP and get reset token.

**Request Body:**
```json
{
  "email": "arun.kumar@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "resetToken": "reset_token_123",
  "message": "OTP verified successfully"
}
```

---

## 📝 Complaint Management APIs

### GET `/complaints`
Get complaints with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (PENDING, IN_PROGRESS, RESOLVED, REJECTED)
- `severity` (string): Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
- `department` (string): Filter by department
- `assignedTo` (string): Filter by assigned officer ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "complaint_123",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "ROADS",
      "severity": "HIGH",
      "status": "PENDING",
      "location": {
        "lat": 12.9716,
        "lng": 77.5946,
        "address": "Main Street, Bangalore"
      },
      "author": {
        "id": "user_123",
        "name": "Arun Kumar"
      },
      "assignedTo": null,
      "createdAt": "2026-02-21T10:00:00Z",
      "updatedAt": "2026-02-21T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### POST `/complaints`
Create a new complaint.

**Request Body:**
```json
{
  "title": "Broken Streetlight",
  "description": "Streetlight not working for past week",
  "category": "STREETLIGHTS",
  "severity": "MEDIUM",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "5th Cross, Bangalore"
  },
  "photoUrl": "https://ik.imagekit.io/.../streetlight.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "complaint_456",
    "title": "Broken Streetlight",
    "status": "PENDING",
    "complaintId": "COMP-2026-0456",
    "createdAt": "2026-02-21T11:30:00Z"
  },
  "message": "Complaint registered successfully"
}
```

### PUT `/complaints/:id/assign`
Assign complaint to an officer (Admin only).

**Request Body:**
```json
{
  "assignedTo": "officer_789",
  "department": "PUBLIC_WORKS"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "complaint_456",
    "assignedTo": {
      "id": "officer_789",
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@jansankalp.gov.in"
    },
    "status": "IN_PROGRESS",
    "updatedAt": "2026-02-21T11:45:00Z"
  },
  "message": "Complaint assigned successfully"
}
```

### PUT `/complaints/:id/update`
Update complaint status and details (Officer only).

**Request Body:**
```json
{
  "status": "RESOLVED",
  "officerNotes": "Streetlight repaired and tested",
  "verificationPhoto": "https://ik.imagekit.io/.../repaired.jpg",
  "resolutionDetails": {
    "actionTaken": "Repaired streetlight",
    "timeSpent": "2 hours",
    "materialsUsed": "LED bulb, wiring"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "complaint_456",
    "status": "RESOLVED",
    "officerNotes": "Streetlight repaired and tested",
    "resolvedAt": "2026-02-21T14:30:00Z",
    "updatedAt": "2026-02-21T14:30:00Z"
  },
  "message": "Complaint updated successfully"
}
```

---

## 👥 User Management APIs

### GET `/users/profile`
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Arun Kumar",
    "email": "arun.kumar@example.com",
    "role": "CITIZEN",
    "phone": "+91 98765 43210",
    "address": "123 Main St, Bangalore",
    "createdAt": "2026-01-15T09:00:00Z",
    "stats": {
      "complaintsFiled": 5,
      "complaintsResolved": 3
    }
  }
}
```

### PUT `/users/profile`
Update user profile.

**Request Body:**
```json
{
  "name": "Arun Kumar Bind",
  "phone": "+91 98765 43210",
  "address": "123 Main St, Bangalore, Karnataka"
}
```

### GET `/users/officers`
Get list of officers (Admin only).

**Query Parameters:**
- `department` (string): Filter by department
- `available` (boolean): Filter by availability

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "officer_789",
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@jansankalp.gov.in",
      "department": "PUBLIC_WORKS",
      "phone": "+91 98765 12345",
      "stats": {
        "assignedCases": 12,
        "resolvedCases": 8,
        "pendingCases": 4
      }
    }
  ]
}
```

---

## 🔔 Notification APIs

### GET `/notifications`
Get user notifications.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `read` (boolean): Filter by read status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "title": "Complaint Resolved",
      "message": "Your complaint 'Broken Streetlight' has been resolved",
      "type": "COMPLAINT_RESOLVED",
      "read": false,
      "createdAt": "2026-02-21T14:30:00Z",
      "relatedComplaint": {
        "id": "complaint_456",
        "title": "Broken Streetlight"
      }
    }
  ]
}
```

### PUT `/notifications/:id/read`
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### GET `/notifications/stream`
Server-sent events for real-time notifications.

**Usage:**
```javascript
const eventSource = new EventSource('/api/notifications/stream');

eventSource.onmessage = function(event) {
  const notification = JSON.parse(event.data);
  console.log('New notification:', notification);
};
```

---

## 📊 Analytics APIs

### GET `/analytics/dashboard`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalComplaints": 150,
      "pendingComplaints": 45,
      "inProgressComplaints": 30,
      "resolvedComplaints": 75,
      "averageResolutionTime": "48 hours"
    },
    "byCategory": {
      "ROADS": 45,
      "WATER": 30,
      "STREETLIGHTS": 25,
      "GARBAGE": 20,
      "OTHER": 30
    },
    "bySeverity": {
      "LOW": 60,
      "MEDIUM": 50,
      "HIGH": 30,
      "CRITICAL": 10
    },
    "trends": [
      {
        "date": "2026-02-21",
        "complaints": 12,
        "resolved": 8
      }
    ]
  }
}
```

---

## 🤖 AI Engine Integration

### POST `/ai/classify`
Classify complaint using AI.

**Request Body:**
```json
{
  "title": "Large pothole on main road",
  "description": "There is a big pothole causing accidents",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "ROADS",
    "severity": "HIGH",
    "department": "PUBLIC_WORKS",
    "estimatedResolutionTime": "72 hours",
    "confidence": 0.92,
    "suggestedActions": [
      "Immediate inspection required",
      "Traffic diversion recommended",
      "Priority repair scheduling"
    ]
  }
}
```

### POST `/ai/chat`
AI chat assistant for citizens.

**Request Body:**
```json
{
  "message": "How do I file a complaint about garbage collection?",
  "context": "help"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "To file a garbage collection complaint...",
    "suggestions": [
      "File new complaint",
      "Track existing complaint",
      "Contact support"
    ]
  }
}
```

---

## 🌐 Real-time APIs

### GET `/stream/complaints/:id`
Real-time updates for a specific complaint.

**Usage:**
```javascript
const eventSource = new EventSource('/api/stream/complaints/complaint_123');

eventSource.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Complaint update:', update);
};
```

### POST `/webhooks/complaint-updated`
Webhook for external systems.

**Request Body:**
```json
{
  "complaintId": "complaint_456",
  "status": "RESOLVED",
  "updatedBy": "officer_789",
  "timestamp": "2026-02-21T14:30:00Z"
}
```

---

## ❌ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate, etc.) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📝 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth endpoints | 5 requests | 15 minutes |
| Complaint creation | 10 requests | 1 hour |
| Other endpoints | 100 requests | 15 minutes |

---

## 🔧 SDK Examples

### JavaScript/TypeScript
```typescript
import { JanSankalpAPI } from '@jansankalp/api-client';

const api = new JanSankalpAPI({
  baseURL: 'http://localhost:3000/api',
  token: 'your-jwt-token'
});

// File a complaint
const complaint = await api.complaints.create({
  title: 'Pothole on Main Street',
  description: 'Large pothole causing traffic issues',
  category: 'ROADS',
  severity: 'HIGH',
  location: { lat: 12.9716, lng: 77.5946 }
});
```

### Python
```python
from jansankalp_client import JanSankalpAPI

api = JanSankalpAPI(
    base_url='http://localhost:3000/api',
    token='your-jwt-token'
)

# Get complaints
complaints = api.complaints.list(status='PENDING')
```

---

## 📚 Additional Resources

- [Authentication Guide](auth.md)
- [Real-time Updates Guide](real-time.md)
- [AI Engine Integration](ai-engine.md)
- [Error Handling Guide](errors.md)
- [SDK Documentation](../guides/sdk-integration.md)

---

<div align="center">
  <p><strong>📞 Need API Support?</strong></p>
  <p>Contact: <a href="mailto:api-support@jansankalp.gov.in">api-support@jansankalp.gov.in</a></p>
</div>
