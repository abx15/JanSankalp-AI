# 📚 JanSankalp AI - API Documentation

## Overview

JanSankalp AI provides a RESTful API built on Next.js API Routes. All endpoints follow REST conventions and return JSON responses. The API includes authentication, data validation, error handling, and real-time capabilities.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

### Authentication Method
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Token Source**: NextAuth.js session

### Authentication Flow
```typescript
// Get session token
const session = await getSession();
const token = session.accessToken;

// Include in API requests
const response = await fetch('/api/complaints', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## API Endpoints

### 1. Authentication Endpoints

#### `POST /api/auth/signin`
Sign in a user with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CITIZEN"
  },
  "token": "jwt_token_here"
}
```

#### `POST /api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "CITIZEN"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "new_user_id",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "CITIZEN"
  }
}
```

#### `POST /api/auth/signout`
Sign out the current user.

**Response:**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

### 2. User Management

#### `GET /api/users/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CITIZEN",
    "points": 100,
    "phone": "+1234567890",
    "address": "123 Main St",
    "bio": "User bio",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `PUT /api/users/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+1234567890",
  "address": "123 Updated St",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Updated Name",
    "phone": "+1234567890",
    "address": "123 Updated St",
    "bio": "Updated bio"
  }
}
```

### 3. Complaint Management

#### `GET /api/complaints`
Get complaints with filtering and pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status
- `category` (string): Filter by category
- `assignedTo` (string): Filter by assigned officer

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "complaint_id",
      "title": "Broken Street Light",
      "description": "Street light not working",
      "status": "PENDING",
      "severity": 3,
      "category": "Electricity & Lighting",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "author": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "assignedTo": null,
      "department": {
        "id": "dept_id",
        "name": "Electricity & Lighting"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### `POST /api/complaints`
Create a new complaint.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Broken Street Light",
  "description": "The street light at the corner of Main St and Oak Ave is not working",
  "category": "Electricity & Lighting",
  "severity": 3,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "complaint": {
    "id": "new_complaint_id",
    "title": "Broken Street Light",
    "description": "The street light at the corner of Main St and Oak Ave is not working",
    "status": "PENDING",
    "severity": 3,
    "category": "Electricity & Lighting",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "author": {
      "id": "user_id",
      "name": "User Name"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/complaints/[id]`
Get a specific complaint by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "complaint": {
    "id": "complaint_id",
    "title": "Broken Street Light",
    "description": "Street light not working",
    "status": "IN_PROGRESS",
    "severity": 3,
    "category": "Electricity & Lighting",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "author": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "assignedTo": {
      "id": "officer_id",
      "name": "Officer Name",
      "email": "officer@example.com"
    },
    "department": {
      "id": "dept_id",
      "name": "Electricity & Lighting"
    },
    "remarks": [
      {
        "id": "remark_id",
        "text": "Investigating the issue",
        "authorName": "Officer Name",
        "authorRole": "OFFICER",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `PUT /api/complaints/[id]`
Update a complaint (officers and admins only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "assignedToId": "officer_id",
  "departmentId": "dept_id"
}
```

**Response:**
```json
{
  "success": true,
  "complaint": {
    "id": "complaint_id",
    "status": "IN_PROGRESS",
    "assignedTo": {
      "id": "officer_id",
      "name": "Officer Name"
    },
    "department": {
      "id": "dept_id",
      "name": "Electricity & Lighting"
    },
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Remarks Management

#### `POST /api/complaints/[id]/remarks`
Add a remark to a complaint.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Investigating the issue. Will visit the location tomorrow.",
  "imageUrl": "https://example.com/remark-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "remark": {
    "id": "remark_id",
    "text": "Investigating the issue. Will visit the location tomorrow.",
    "authorName": "Officer Name",
    "authorRole": "OFFICER",
    "imageUrl": "https://example.com/remark-image.jpg",
    "complaintId": "complaint_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Department Management

#### `GET /api/departments`
Get all departments.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "departments": [
    {
      "id": "dept_id",
      "name": "Electricity & Lighting",
      "head": {
        "id": "head_id",
        "name": "Department Head",
        "email": "head@example.com"
      },
      "complaintCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/departments`
Create a new department (admins only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Department",
  "headId": "user_id"
}
```

**Response:**
```json
{
  "success": true,
  "department": {
    "id": "new_dept_id",
    "name": "New Department",
    "headId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. AI Processing

#### `POST /api/ai/process-complaint`
Process complaint text with AI.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "The street light is broken and it's very dark here",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "processed": {
    "category": "Electricity & Lighting",
    "severity": 3,
    "confidence": 0.95,
    "translatedText": "The street light is broken and it's very dark here",
    "detectedLanguage": "en",
    "keywords": ["street light", "broken", "dark"]
  }
}
```

#### `POST /api/ai/detect-duplicates`
Check for duplicate complaints.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Broken Street Light",
  "description": "Street light not working",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "success": true,
  "duplicates": [
    {
      "id": "complaint_id",
      "title": "Street Light Issue",
      "similarity": 0.89,
      "distance": 0.05
    }
  ],
  "isDuplicate": false
}
```

### 7. File Upload

#### `POST /api/upload`
Upload files to Cloudinary.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
file: <image_file>
type: "complaint" | "avatar" | "remark"
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image.jpg",
  "publicId": "image_public_id",
  "format": "jpg",
  "size": 1024000
}
```

### 8. Notifications

#### `GET /api/notifications`
Get user notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif_id",
      "title": "New Complaint Assigned",
      "message": "You have been assigned a new complaint",
      "type": "complaint_assigned",
      "read": false,
      "data": {
        "complaintId": "complaint_id"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `PUT /api/notifications/[id]/read`
Mark notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "notif_id",
    "read": true,
    "readAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

### Limits
- **Authenticated users**: 100 requests per 15 minutes
- **Unauthenticated users**: 20 requests per 15 minutes
- **File uploads**: 10 uploads per hour

### Headers
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Real-time Events

### WebSocket Connection
```javascript
const pusher = new Pusher('PUSHER_KEY', {
  cluster: 'PUSHER_CLUSTER',
  authEndpoint: '/api/pusher/auth'
});

// Subscribe to user-specific channel
const channel = pusher.subscribe(`user-${userId}`);

// Listen for events
channel.bind('complaint:assigned', (data) => {
  console.log('New complaint assigned:', data);
});
```

### Event Types
- `complaint:created`: New complaint submitted
- `complaint:updated`: Complaint status changed
- `remark:added`: New remark added
- `user:notification`: New notification

## Data Validation

### Request Validation
All API requests are validated using Zod schemas. Invalid requests return detailed error messages.

### Example Validation Schema
```typescript
const createComplaintSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1),
  severity: z.number().min(1).max(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().optional()
});
```

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field
- `order`: Sort order (asc|desc)

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
// API Client Class
class JanSankalpAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async createComplaint(data: CreateComplaintData) {
    const response = await fetch(`${this.baseUrl}/complaints`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

### Python
```python
import requests

class JanSankalpAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def create_complaint(self, data):
        response = requests.post(
            f'{self.base_url}/complaints',
            headers=self.headers,
            json=data
        )
        return response.json()
```

## Testing

### API Testing Tools
- **Postman**: Import collection from `docs/api-collection.json`
- **Insomnia**: Import from `docs/api-insomnia.json`
- **cURL**: Command-line examples in documentation

### Test Environment
- **URL**: `http://localhost:3000/api`
- **Test Credentials**: See `LOGIN_DETAILS.md`
- **Test Data**: Use seed script for test data

## API Versioning

### Current Version: v1
- **Base Path**: `/api/v1`
- **Backward Compatibility**: Maintained for 6 months
- **Deprecation Notice**: Sent via headers and notifications

### Version Headers
```
API-Version: v1
Supported-Versions: v1,v2
Deprecated-Versions: v0
```
