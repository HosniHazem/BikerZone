# BikerZone API - Endpoints Map

## API Structure Overview

```
http://localhost:3000/api/v1
├── Health & Status
│   ├── GET /
│   └── GET /health
├── Authentication
│   ├── POST /auth/register
│   ├── POST /auth/login
│   ├── POST /auth/refresh
│   ├── POST /auth/logout
│   ├── GET /auth/verify-email
│   ├── POST /auth/request-password-reset
│   ├── POST /auth/reset-password
│   └── GET /auth/me
├── Users
│   ├── POST /users
│   ├── GET /users
│   ├── GET /users/:id
│   ├── PATCH /users/:id
│   └── DELETE /users/:id
└── Posts
    ├── POST /posts
    ├── GET /posts
    ├── GET /posts/:id
    ├── PATCH /posts/:id
    ├── DELETE /posts/:id
    ├── POST /posts/:id/like
    ├── POST /posts/:id/comments
    ├── DELETE /posts/:id/comments/:commentIndex
    ├── GET /posts/trending/hashtags
    └── GET /posts/user/:userId
```

---

## Detailed Endpoint Reference

### Health & Status (2 endpoints)

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/` | ❌ | 200 |
| GET | `/health` | ❌ | 200 |

---

### Authentication (8 endpoints)

| Method | Endpoint | Auth | Status | Purpose |
|--------|----------|------|--------|---------|
| POST | `/auth/register` | ❌ | 201 | Register new user |
| POST | `/auth/login` | ❌ | 200 | Login and get tokens |
| POST | `/auth/refresh` | ❌ | 200 | Refresh access token |
| POST | `/auth/logout` | ✅ | 200 | Logout user |
| GET | `/auth/verify-email` | ❌ | 200 | Verify email address |
| POST | `/auth/request-password-reset` | ❌ | 200 | Request password reset |
| POST | `/auth/reset-password` | ❌ | 200 | Reset password |
| GET | `/auth/me` | ✅ | 200 | Get current user |

---

### Users (5 endpoints)

| Method | Endpoint | Auth | Status | Purpose |
|--------|----------|------|--------|---------|
| POST | `/users` | ❌ | 201 | Create user |
| GET | `/users` | ✅ | 200 | Get all users |
| GET | `/users/:id` | ✅ | 200 | Get user by ID |
| PATCH | `/users/:id` | ✅ | 200 | Update user |
| DELETE | `/users/:id` | ✅ | 200 | Delete user |

---

### Posts (10 endpoints)

| Method | Endpoint | Auth | Status | Purpose |
|--------|----------|------|--------|---------|
| POST | `/posts` | ✅ | 201 | Create post |
| GET | `/posts` | ✅ | 200 | Get posts feed |
| GET | `/posts/:id` | ✅ | 200 | Get post by ID |
| PATCH | `/posts/:id` | ✅ | 200 | Update post |
| DELETE | `/posts/:id` | ✅ | 200 | Delete post |
| POST | `/posts/:id/like` | ✅ | 200 | Toggle like |
| POST | `/posts/:id/comments` | ✅ | 201 | Add comment |
| DELETE | `/posts/:id/comments/:commentIndex` | ✅ | 200 | Delete comment |
| GET | `/posts/trending/hashtags` | ✅ | 200 | Get trending hashtags |
| GET | `/posts/user/:userId` | ✅ | 200 | Get user posts |

---

## HTTP Methods Used

| Method | Count | Endpoints |
|--------|-------|-----------|
| GET | 12 | Health, Auth, Users, Posts |
| POST | 11 | Auth, Users, Posts |
| PATCH | 2 | Users, Posts |
| DELETE | 3 | Users, Posts |
| **Total** | **28** | |

---

## Authentication Requirements

### Public Endpoints (No Auth Required)
```
GET /
GET /health
POST /auth/register
POST /auth/login
POST /auth/refresh
GET /auth/verify-email
POST /auth/request-password-reset
POST /auth/reset-password
POST /users
```

### Protected Endpoints (JWT Required)
```
POST /auth/logout
GET /auth/me
GET /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id
POST /posts
GET /posts
GET /posts/:id
PATCH /posts/:id
DELETE /posts/:id
POST /posts/:id/like
POST /posts/:id/comments
DELETE /posts/:id/comments/:commentIndex
GET /posts/trending/hashtags
GET /posts/user/:userId
```

---

## Response Status Codes

### Success Codes
- `200 OK` - Successful GET, PATCH, DELETE
- `201 Created` - Successful POST (resource created)

### Client Error Codes
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists

### Server Error Codes
- `500 Internal Server Error` - Server error

---

## Query Parameters by Endpoint

### GET /posts
```
?page=1
&limit=10
&sort=recent|popular|trending
&order=ASC|DESC
&search=term
&tags=tag1,tag2
&hashtag=#hashtag
```

### GET /posts/user/:userId
```
?page=1
&limit=10
```

### GET /posts/trending/hashtags
```
?limit=10
```

---

## Path Parameters by Endpoint

### GET /users/:id
```
:id = User ID
```

### GET /posts/:id
```
:id = Post ID
```

### PATCH /users/:id
```
:id = User ID
```

### PATCH /posts/:id
```
:id = Post ID
```

### DELETE /users/:id
```
:id = User ID
```

### DELETE /posts/:id
```
:id = Post ID
```

### POST /posts/:id/like
```
:id = Post ID
```

### POST /posts/:id/comments
```
:id = Post ID
```

### DELETE /posts/:id/comments/:commentIndex
```
:id = Post ID
:commentIndex = Comment index in array
```

### GET /posts/user/:userId
```
:userId = User ID
```

---

## Request Body Payloads

### POST /auth/register
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "bikeType": "enum"
}
```

### POST /auth/login
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /auth/refresh
```json
{
  "refreshToken": "string"
}
```

### POST /auth/request-password-reset
```json
{
  "email": "string"
}
```

### POST /auth/reset-password
```json
{
  "token": "string",
  "password": "string"
}
```

### POST /users
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

### PATCH /users/:id
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "location": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

### POST /posts
```json
{
  "title": "string",
  "content": "string",
  "tags": ["string"] (optional)
}
```

### PATCH /posts/:id
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "tags": ["string"] (optional)
}
```

### POST /posts/:id/comments
```json
{
  "content": "string"
}
```

---

## Response Body Examples

### GET / (Health Check)
```json
{
  "status": "ok",
  "message": "BikerZone API is running",
  "timestamp": "2025-11-30T16:45:00.000Z",
  "version": "1.0.0"
}
```

### POST /auth/login
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### GET /users
```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
]
```

### GET /posts
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "content": "string",
      "tags": ["string"],
      "hashtags": ["string"],
      "likesCount": "number",
      "commentsCount": "number",
      "isLikedByUser": "boolean",
      "createdAt": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "hasMore": "boolean"
}
```

### POST /posts/:id/like
```json
{
  "isLiked": "boolean",
  "likesCount": "number"
}
```

### GET /posts/trending/hashtags
```json
[
  {
    "tag": "string",
    "count": "number"
  }
]
```

---

## Error Response Format

### Standard Error
```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string"
}
```

### Example: 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input data",
  "error": "Bad Request"
}
```

### Example: 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Example: 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

---

## Endpoint Categories

### CRUD Operations
- **Create**: POST /posts, POST /users, POST /auth/register
- **Read**: GET /posts, GET /posts/:id, GET /users, GET /users/:id
- **Update**: PATCH /posts/:id, PATCH /users/:id
- **Delete**: DELETE /posts/:id, DELETE /users/:id

### Social Features
- **Like**: POST /posts/:id/like
- **Comment**: POST /posts/:id/comments, DELETE /posts/:id/comments/:commentIndex
- **Trending**: GET /posts/trending/hashtags

### User Features
- **Authentication**: POST /auth/login, POST /auth/register, POST /auth/logout
- **Profile**: GET /auth/me, GET /users/:id, PATCH /users/:id
- **Security**: POST /auth/refresh, POST /auth/request-password-reset, POST /auth/reset-password

### Feed Features
- **Posts Feed**: GET /posts
- **User Posts**: GET /posts/user/:userId
- **Post Details**: GET /posts/:id

---

## Pagination & Filtering

### Supported on:
- GET /posts (posts feed)
- GET /posts/user/:userId (user posts)
- GET /users (all users)

### Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Sorting:
- `sort`: recent, popular, trending (default: recent)
- `order`: ASC, DESC (default: DESC)

### Filtering:
- `search`: Search term
- `tags`: Array of tags
- `hashtag`: Specific hashtag

---

## Rate Limiting

### Applied to:
- POST /auth/login: 5 requests/minute
- POST /auth/register: 3 requests/minute

### Other endpoints: No limit (for now)

---

## CORS Configuration

### Allowed Origins:
- http://localhost:8080
- http://localhost:3000

### Allowed Methods:
- GET, POST, PUT, PATCH, DELETE, OPTIONS

### Allowed Headers:
- Content-Type
- Authorization
- X-Requested-With

---

## API Versioning

### Current Version: v1
### URL Pattern: `/api/v1/...`
### Default Version: v1 (if not specified)

---

## Documentation Access

- **Interactive UI**: `http://localhost:3000/api/docs`
- **JSON Schema**: `http://localhost:3000/api/docs-json`
- **YAML Schema**: `http://localhost:3000/api/docs-yaml`

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Endpoints | 28 |
| GET Methods | 12 |
| POST Methods | 11 |
| PATCH Methods | 2 |
| DELETE Methods | 3 |
| Public Endpoints | 9 |
| Protected Endpoints | 19 |
| Status Codes | 6 |
| Query Parameters | 7 |
| Path Parameters | 8 |

---

**Last Updated:** November 30, 2025  
**API Version:** 1.0  
**Status:** ✅ Complete
