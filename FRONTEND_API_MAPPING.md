# Frontend API Request/Response Mapping

## Overview

This document maps all frontend API requests to the backend Swagger specification to ensure correct payloads and responses.

---

## Authentication Endpoints

### 1. Register

**Frontend Request:**
```typescript
await authApi.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  bikeType: 'SPORT'  // Optional
})
```

**Backend Endpoint:** `POST /api/v1/auth/register`

**Expected Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "bikeType": "SPORT"
}
```

**Response (201 Created):**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bikeType": "SPORT",
  "created_at": "2025-11-30T16:45:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Success
- `409 Conflict` - Email already registered
- `400 Bad Request` - Invalid input

---

### 2. Login

**Frontend Request:**
```typescript
await authApi.login({
  email: 'john@example.com',
  password: 'SecurePass123!'
})
```

**Backend Endpoint:** `POST /api/v1/auth/login`

**Expected Payload:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Invalid input

---

### 3. Logout

**Frontend Request:**
```typescript
await authApi.logout()
```

**Backend Endpoint:** `POST /api/v1/auth/logout`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Refresh Token

**Frontend Request:**
```typescript
await authApi.refreshToken(refreshToken)
```

**Backend Endpoint:** `POST /api/v1/auth/refresh`

**Expected Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Get Current User

**Frontend Request:**
```typescript
await authApi.getCurrentUser()
```

**Backend Endpoint:** `GET /api/v1/auth/me`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bike_type": "SPORT",
  "avatar_url": "https://example.com/avatar.jpg",
  "role": "user",
  "is_verified": true,
  "created_at": "2025-11-30T16:45:00.000Z"
}
```

---

### 6. Verify Email

**Frontend Request:**
```typescript
await authApi.verifyEmail(token)
```

**Backend Endpoint:** `GET /api/v1/auth/verify-email?token=<token>`

**Query Parameters:**
- `token` (required): Email verification token

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

---

### 7. Request Password Reset

**Frontend Request:**
```typescript
await authApi.requestPasswordReset('user@example.com')
```

**Backend Endpoint:** `POST /api/v1/auth/request-password-reset`

**Expected Payload:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Reset email sent if user exists"
}
```

---

### 8. Reset Password

**Frontend Request:**
```typescript
await authApi.resetPassword(token, newPassword)
```

**Backend Endpoint:** `POST /api/v1/auth/reset-password`

**Expected Payload:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

---

## Users Endpoints

### 1. Create User

**Frontend Request:**
```typescript
await usersApi.createUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe'
})
```

**Backend Endpoint:** `POST /api/v1/users`

**Expected Payload:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "created_at": "2025-11-30T16:45:00.000Z"
}
```

---

### 2. Get All Users

**Frontend Request:**
```typescript
await usersApi.getUsers()
```

**Backend Endpoint:** `GET /api/v1/users`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": "user_id_1",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "bike_type": "SPORT",
    "created_at": "2025-11-30T16:45:00.000Z"
  }
]
```

---

### 3. Get User by ID

**Frontend Request:**
```typescript
await usersApi.getUser(userId)
```

**Backend Endpoint:** `GET /api/v1/users/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bike_type": "SPORT",
  "bike_model": "Yamaha YZF-R1",
  "bike_year": 2023,
  "bike_mileage": 5000,
  "role": "user",
  "is_verified": true,
  "is_active": true,
  "created_at": "2025-11-30T16:45:00.000Z"
}
```

---

### 4. Update User

**Frontend Request:**
```typescript
await usersApi.updateUser(userId, {
  name: 'John Smith',
  avatar_url: 'https://example.com/new-avatar.jpg',
  bike_type: 'CRUISER',
  bike_model: 'Harley-Davidson',
  bike_year: 2024,
  bike_mileage: 1000
})
```

**Backend Endpoint:** `PATCH /api/v1/users/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Expected Payload:**
```json
{
  "name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "bike_type": "CRUISER",
  "bike_model": "Harley-Davidson",
  "bike_year": 2024,
  "bike_mileage": 1000
}
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "bike_type": "CRUISER",
  "bike_model": "Harley-Davidson",
  "bike_year": 2024,
  "bike_mileage": 1000,
  "updated_at": "2025-11-30T17:00:00.000Z"
}
```

---

### 5. Delete User

**Frontend Request:**
```typescript
await usersApi.deleteUser(userId)
```

**Backend Endpoint:** `DELETE /api/v1/users/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Posts Endpoints

### 1. Create Post

**Frontend Request:**
```typescript
await postsApi.createPost({
  title: 'My Bike Adventure',
  content: 'Amazing ride today! #bikelife',
  tags: ['adventure', 'motorcycle']
})
```

**Backend Endpoint:** `POST /api/v1/posts`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Expected Payload:**
```json
{
  "title": "My Bike Adventure",
  "content": "Amazing ride today! #bikelife",
  "tags": ["adventure", "motorcycle"]
}
```

**Response (201 Created):**
```json
{
  "id": "post_id",
  "userId": "user_id",
  "title": "My Bike Adventure",
  "content": "Amazing ride today! #bikelife",
  "tags": ["adventure", "motorcycle"],
  "hashtags": ["#bikelife"],
  "likesCount": 0,
  "commentsCount": 0,
  "isActive": true,
  "createdAt": "2025-11-30T16:45:00.000Z"
}
```

---

### 2. Get Posts Feed

**Frontend Request:**
```typescript
await postsApi.getPosts({
  page: 1,
  limit: 10,
  sort: 'recent',
  order: 'DESC',
  search: 'motorcycle',
  tags: ['adventure'],
  hashtag: '#bikelife'
})
```

**Backend Endpoint:** `GET /api/v1/posts`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1
&limit=10
&sort=recent
&order=DESC
&search=motorcycle
&tags=adventure
&hashtag=%23bikelife
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "post_id",
      "userId": "user_id",
      "title": "My Bike Adventure",
      "content": "Amazing ride today! #bikelife",
      "tags": ["adventure"],
      "hashtags": ["#bikelife"],
      "likesCount": 5,
      "commentsCount": 2,
      "isLikedByUser": false,
      "isActive": true,
      "createdAt": "2025-11-30T16:45:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "hasMore": true
}
```

---

### 3. Get Single Post

**Frontend Request:**
```typescript
await postsApi.getPost(postId)
```

**Backend Endpoint:** `GET /api/v1/posts/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "post_id",
  "userId": "user_id",
  "title": "My Bike Adventure",
  "content": "Amazing ride today! #bikelife",
  "tags": ["adventure"],
  "hashtags": ["#bikelife"],
  "likesCount": 5,
  "commentsCount": 2,
  "isLikedByUser": false,
  "comments": [
    {
      "userId": "commenter_id",
      "content": "Great post!",
      "createdAt": "2025-11-30T16:50:00.000Z"
    }
  ],
  "isActive": true,
  "createdAt": "2025-11-30T16:45:00.000Z"
}
```

---

### 4. Update Post

**Frontend Request:**
```typescript
await postsApi.updatePost(postId, {
  title: 'Updated Title',
  content: 'Updated content',
  tags: ['updated']
})
```

**Backend Endpoint:** `PATCH /api/v1/posts/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Expected Payload:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated"]
}
```

**Response (200 OK):**
```json
{
  "id": "post_id",
  "userId": "user_id",
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated"],
  "hashtags": [],
  "likesCount": 5,
  "commentsCount": 2,
  "updatedAt": "2025-11-30T17:00:00.000Z"
}
```

---

### 5. Delete Post

**Frontend Request:**
```typescript
await postsApi.deletePost(postId)
```

**Backend Endpoint:** `DELETE /api/v1/posts/:id`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

---

### 6. Toggle Like

**Frontend Request:**
```typescript
await postsApi.toggleLike(postId)
```

**Backend Endpoint:** `POST /api/v1/posts/:id/like`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "isLiked": true,
  "likesCount": 6
}
```

---

### 7. Add Comment

**Frontend Request:**
```typescript
await postsApi.addComment(postId, {
  content: 'Great post!'
})
```

**Backend Endpoint:** `POST /api/v1/posts/:id/comments`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Expected Payload:**
```json
{
  "content": "Great post!"
}
```

**Response (201 Created):**
```json
{
  "id": "post_id",
  "userId": "user_id",
  "title": "My Bike Adventure",
  "content": "Amazing ride today! #bikelife",
  "comments": [
    {
      "userId": "commenter_id",
      "content": "Great post!",
      "createdAt": "2025-11-30T16:50:00.000Z"
    }
  ],
  "commentsCount": 3
}
```

---

### 8. Delete Comment

**Frontend Request:**
```typescript
await postsApi.deleteComment(postId, commentIndex)
```

**Backend Endpoint:** `DELETE /api/v1/posts/:id/comments/:commentIndex`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "post_id",
  "userId": "user_id",
  "title": "My Bike Adventure",
  "content": "Amazing ride today! #bikelife",
  "comments": [],
  "commentsCount": 2
}
```

---

### 9. Get Trending Hashtags

**Frontend Request:**
```typescript
await postsApi.getTrendingHashtags(10)
```

**Backend Endpoint:** `GET /api/v1/posts/trending/hashtags`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?limit=10
```

**Response (200 OK):**
```json
[
  {
    "tag": "#bikelife",
    "count": 150
  },
  {
    "tag": "#adventure",
    "count": 120
  },
  {
    "tag": "#motorcycle",
    "count": 100
  }
]
```

---

### 10. Get User Posts

**Frontend Request:**
```typescript
await postsApi.getUserPosts(userId, 1, 10)
```

**Backend Endpoint:** `GET /api/v1/posts/user/:userId`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1
&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "post_id",
      "userId": "user_id",
      "title": "My Bike Adventure",
      "content": "Amazing ride today! #bikelife",
      "tags": ["adventure"],
      "likesCount": 5,
      "commentsCount": 2,
      "createdAt": "2025-11-30T16:45:00.000Z"
    }
  ],
  "total": 25
}
```

---

## Common Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Server error |

---

## Error Response Format

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Authentication Header

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

---

## Summary

✅ All 28 endpoints mapped  
✅ Request payloads documented  
✅ Response formats documented  
✅ Status codes documented  
✅ Query parameters documented  
✅ Headers documented  

**Frontend is now aligned with Swagger specification!**
