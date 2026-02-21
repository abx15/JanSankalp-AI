# API Reference

## Authentication

All protected routes require a NextAuth session.
Base URL: `/api`

## Endpoints

### 📝 Complaints

- `POST /api/complaints`: Register a new civic complaint.
- `GET /api/complaints`: List complaints (supports filtering).
- `GET /api/complaints/[id]`: Get details of a specific complaint.

### 🏢 Departments

- `GET /api/departments`: List all municipal departments.
- `GET /api/departments/stats`: Get department performance metrics.

### 🤖 AI Processing

- `POST /api/ai/analyze`: Send text for AI classification and severity scoring.
- `POST /api/ai/translate`: Translate complaint text to English/Hindi.

### 👤 Profile

- `GET /api/user/profile`: Get current user info.
- `PUT /api/user/profile`: Update user address or contact info.

## Response Format

Standard JSON responses are used for all endpoints.

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## Error Codes

| Code | Description                   |
| :--- | :---------------------------- |
| 401  | Unauthorized (Not logged in)  |
| 403  | Forbidden (Insufficient role) |
| 404  | Resource not found            |
| 500  | Internal server error         |
