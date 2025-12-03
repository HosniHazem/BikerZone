# BikerZone API - Quick Reference Guide

## Base URL
```
http://localhost:3000/api/v1
```

## Swagger Documentation
```
http://localhost:3000/api/docs
```

---

## Authentication

### Get JWT Token (Login)
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Use Token in Requests
```bash
Authorization: Bearer <accessToken>
```

### Refresh Token
```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Posts Endpoints

### Create Post
```bash
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Post Title",
  "content": "Post content with #hashtags",
  "tags": ["tag1", "tag2"]
}
```

### Get Posts Feed
```bash
GET /posts?page=1&limit=10&sort=recent&order=DESC
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: recent | popular | trending (default: recent)
- `order`: ASC | DESC (default: DESC)
- `search`: Search term
- `tags`: Filter by tags (comma-separated)
- `hashtag`: Filter by hashtag

### Get Single Post
```bash
GET /posts/{postId}
Authorization: Bearer <token>
```

### Update Post
```bash
PATCH /posts/{postId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated"]
}
```

### Delete Post
```bash
DELETE /posts/{postId}
Authorization: Bearer <token>
```

### Like/Unlike Post
```bash
POST /posts/{postId}/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isLiked": true,
  "likesCount": 5
}
```

### Add Comment
```bash
POST /posts/{postId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Comment text"
}
```

### Delete Comment
```bash
DELETE /posts/{postId}/comments/{commentIndex}
Authorization: Bearer <token>
```

### Get Trending Hashtags
```bash
GET /posts/trending/hashtags?limit=10
Authorization: Bearer <token>
```

### Get User Posts
```bash
GET /posts/user/{userId}?page=1&limit=10
Authorization: Bearer <token>
```

---

## Users Endpoints

### Create User
```bash
POST /users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Get All Users
```bash
GET /users
Authorization: Bearer <token>
```

### Get User by ID
```bash
GET /users/{userId}
Authorization: Bearer <token>
```

### Update User
```bash
PATCH /users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "location": "New York, USA",
  "profilePicture": "https://example.com/avatar.jpg",
  "phoneNumber": "+1234567890"
}
```

### Delete User
```bash
DELETE /users/{userId}
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "bikeType": "SPORT"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Logout
```bash
POST /auth/logout
Authorization: Bearer <token>
```

### Get Current User
```bash
GET /auth/me
Authorization: Bearer <token>
```

### Verify Email
```bash
GET /auth/verify-email?token={verificationToken}
```

### Request Password Reset
```bash
POST /auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```bash
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

---

## Health Endpoints

### Basic Health Check
```bash
GET /
```

**Response:**
```json
{
  "status": "ok",
  "message": "BikerZone API is running",
  "timestamp": "2025-11-30T16:45:00.000Z",
  "version": "1.0.0"
}
```

### Detailed Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "BikerZone API",
  "timestamp": "2025-11-30T16:45:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Common Payloads

### CreatePostDto
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "tags": ["string"] (optional)
}
```

### UpdatePostDto
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "tags": ["string"] (optional)
}
```

### AddCommentDto
```json
{
  "content": "string (required)"
}
```

### FilterPostDto
```json
{
  "search": "string (optional)",
  "tags": ["string"] (optional),
  "page": "number (optional, default: 1)",
  "limit": "number (optional, default: 10)",
  "sort": "recent|popular|trending (optional, default: recent)",
  "hashtag": "string (optional)",
  "order": "ASC|DESC (optional, default: DESC)"
}
```

### CreateUserDto
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "firstName": "string (required)",
  "lastName": "string (required)"
}
```

### UpdateUserDto
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

### RegisterDto
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "bikeType": "SPORT|CRUISER|TOURING|STANDARD|ADVENTURE (optional)"
}
```

### LoginDto
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

---

## Useful cURL Examples

### Login and Save Token
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.accessToken')

echo $TOKEN
```

### Create Post with Token
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Bike Adventure",
    "content": "Amazing ride today! #bikelife",
    "tags": ["adventure", "motorcycle"]
  }'
```

### Get Posts Feed
```bash
curl -X GET "http://localhost:3000/api/v1/posts?page=1&limit=10&sort=recent" \
  -H "Authorization: Bearer $TOKEN"
```

### Like a Post
```bash
curl -X POST http://localhost:3000/api/v1/posts/{postId}/like \
  -H "Authorization: Bearer $TOKEN"
```

### Add Comment
```bash
curl -X POST http://localhost:3000/api/v1/posts/{postId}/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "Great post!"}'
```

---

## Pagination Example

### Get Page 2 with 20 Items
```bash
GET /posts?page=2&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [...],
  "total": 100,
  "page": 2,
  "hasMore": true
}
```

---

## Filtering Examples

### Search Posts
```bash
GET /posts?search=motorcycle
Authorization: Bearer <token>
```

### Filter by Tags
```bash
GET /posts?tags=adventure,touring
Authorization: Bearer <token>
```

### Filter by Hashtag
```bash
GET /posts?hashtag=bikelife
Authorization: Bearer <token>
```

### Sort by Popular
```bash
GET /posts?sort=popular&order=DESC
Authorization: Bearer <token>
```

### Combined Filters
```bash
GET /posts?search=bike&sort=recent&page=1&limit=10&order=DESC
Authorization: Bearer <token>
```

---

## Tips & Best Practices

1. **Always include Content-Type header** for POST/PATCH requests
2. **Store tokens securely** (not in localStorage for sensitive apps)
3. **Refresh tokens before expiration** using the refresh endpoint
4. **Handle 401 responses** by redirecting to login
5. **Validate input** on the client side before sending
6. **Use pagination** for large result sets
7. **Cache responses** where appropriate
8. **Implement retry logic** for network failures
9. **Log errors** for debugging
10. **Test with Swagger UI** before implementing in code

---

## Rate Limiting

- Login: 5 requests per minute
- Register: 3 requests per minute
- Other endpoints: No limit (for now)

---

## Support

For detailed API documentation, visit: `http://localhost:3000/api/docs`
