# BikerZone API Documentation

## Overview
BikerZone API is a comprehensive RESTful API for a motorcycle community platform. The API is built with NestJS and includes authentication, user management, social posts, and more.

**Base URL:** `http://localhost:3000/api/v1`  
**Swagger Documentation:** `http://localhost:3000/api/docs`

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## API Endpoints

### 1. Health & Status

#### Health Check
- **Endpoint:** `GET /`
- **Description:** Basic health check
- **Authentication:** Not required
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "BikerZone API is running",
    "timestamp": "2025-11-30T16:45:00.000Z",
    "version": "1.0.0"
  }
  ```

#### Detailed Health Check
- **Endpoint:** `GET /health`
- **Description:** Detailed health check with uptime and environment info
- **Authentication:** Not required
- **Response:**
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

### 2. Authentication

#### Register
- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "bikeType": "SPORT"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bikeType": "SPORT",
    "createdAt": "2025-11-30T16:45:00.000Z"
  }
  ```
- **Error Responses:**
  - `409 Conflict`: Email already registered

#### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Login user and get JWT tokens
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response:** `200 OK`
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
- **Error Responses:**
  - `401 Unauthorized`: Invalid credentials

#### Refresh Token
- **Endpoint:** `POST /auth/refresh`
- **Description:** Refresh access token using refresh token
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid refresh token

#### Logout
- **Endpoint:** `POST /auth/logout`
- **Description:** Logout user
- **Authentication:** Required (JWT)
- **Response:** `200 OK`
  ```json
  {
    "message": "Logout successful"
  }
  ```

#### Verify Email
- **Endpoint:** `GET /auth/verify-email?token=<verification_token>`
- **Description:** Verify user email address
- **Authentication:** Not required
- **Query Parameters:**
  - `token` (required): Email verification token
- **Response:** `200 OK`
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid verification token

#### Request Password Reset
- **Endpoint:** `POST /auth/request-password-reset`
- **Description:** Request password reset email
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Reset email sent if user exists"
  }
  ```

#### Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Description:** Reset password using reset token
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "token": "abc123-def456-ghi789",
    "password": "NewSecurePass123!"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Password reset successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid reset token

#### Get Current User
- **Endpoint:** `GET /auth/me`
- **Description:** Get current authenticated user profile
- **Authentication:** Required (JWT)
- **Response:** `200 OK`
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bikeType": "SPORT",
    "profilePicture": "https://example.com/avatar.jpg",
    "bio": "Motorcycle enthusiast",
    "location": "New York, USA",
    "phoneNumber": "+1234567890"
  }
  ```

---

### 3. Users

#### Create User
- **Endpoint:** `POST /users`
- **Description:** Create a new user
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-11-30T16:45:00.000Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid input data

#### Get All Users
- **Endpoint:** `GET /users`
- **Description:** Get all users (paginated)
- **Authentication:** Required (JWT)
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "user_id_1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    {
      "id": "user_id_2",
      "username": "janedoe",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe"
    }
  ]
  ```

#### Get User by ID
- **Endpoint:** `GET /users/:id`
- **Description:** Get user by unique identifier
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): User ID
- **Response:** `200 OK`
  ```json
  {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://example.com/avatar.jpg",
    "bio": "Motorcycle enthusiast",
    "location": "New York, USA",
    "phoneNumber": "+1234567890"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: User not found

#### Update User
- **Endpoint:** `PATCH /users/:id`
- **Description:** Update user information
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): User ID
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "profilePicture": "https://example.com/new-avatar.jpg",
    "bio": "Updated bio",
    "location": "Los Angeles, USA",
    "phoneNumber": "+1987654321"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "profilePicture": "https://example.com/new-avatar.jpg",
    "bio": "Updated bio",
    "location": "Los Angeles, USA",
    "phoneNumber": "+1987654321"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: User not found

#### Delete User
- **Endpoint:** `DELETE /users/:id`
- **Description:** Delete user by unique identifier
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): User ID
- **Response:** `200 OK`
  ```json
  {
    "message": "User deleted successfully"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: User not found

---

### 4. Posts

#### Create Post
- **Endpoint:** `POST /posts`
- **Description:** Create a new post
- **Authentication:** Required (JWT)
- **Request Body:**
  ```json
  {
    "title": "My new bike adventure",
    "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
    "tags": ["adventure", "mountains"]
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "post_id",
    "userId": "user_id",
    "title": "My new bike adventure",
    "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
    "tags": ["adventure", "mountains"],
    "hashtags": ["#bikelife"],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2025-11-30T16:45:00.000Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid input data

#### Get Posts Feed
- **Endpoint:** `GET /posts`
- **Description:** Get paginated posts feed with filtering and sorting
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `search` (optional): Search term
  - `tags` (optional): Filter by tags (array)
  - `page` (optional, default: 1): Page number
  - `limit` (optional, default: 10): Items per page
  - `sort` (optional, default: 'recent'): Sort by - 'recent', 'popular', 'trending'
  - `hashtag` (optional): Filter by hashtag
  - `order` (optional, default: 'DESC'): Sort order - 'ASC' or 'DESC'
- **Response:** `200 OK`
  ```json
  {
    "data": [
      {
        "id": "post_id_1",
        "userId": "user_id",
        "title": "My new bike adventure",
        "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
        "tags": ["adventure", "mountains"],
        "hashtags": ["#bikelife"],
        "likesCount": 5,
        "commentsCount": 2,
        "isLikedByUser": false,
        "createdAt": "2025-11-30T16:45:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "hasMore": true
  }
  ```

#### Get Post by ID
- **Endpoint:** `GET /posts/:id`
- **Description:** Get a specific post by ID
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
- **Response:** `200 OK`
  ```json
  {
    "id": "post_id",
    "userId": "user_id",
    "title": "My new bike adventure",
    "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
    "tags": ["adventure", "mountains"],
    "hashtags": ["#bikelife"],
    "likesCount": 5,
    "commentsCount": 2,
    "isLikedByUser": false,
    "comments": [
      {
        "userId": "commenter_id",
        "content": "Great post! Love the pics.",
        "createdAt": "2025-11-30T16:50:00.000Z"
      }
    ],
    "createdAt": "2025-11-30T16:45:00.000Z"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found

#### Update Post
- **Endpoint:** `PATCH /posts/:id`
- **Description:** Update a post (only owner can update)
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
- **Request Body:**
  ```json
  {
    "title": "Updated title",
    "content": "Updated content with new hashtags #updated",
    "tags": ["updated", "new"]
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": "post_id",
    "userId": "user_id",
    "title": "Updated title",
    "content": "Updated content with new hashtags #updated",
    "tags": ["updated", "new"],
    "hashtags": ["#updated"],
    "likesCount": 5,
    "commentsCount": 2,
    "updatedAt": "2025-11-30T16:55:00.000Z"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found
  - `403 Forbidden`: You can only update your own posts

#### Delete Post
- **Endpoint:** `DELETE /posts/:id`
- **Description:** Delete a post (soft delete, only owner can delete)
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
- **Response:** `200 OK`
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found
  - `403 Forbidden`: You can only delete your own posts

#### Toggle Like on Post
- **Endpoint:** `POST /posts/:id/like`
- **Description:** Like or unlike a post
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
- **Response:** `200 OK`
  ```json
  {
    "isLiked": true,
    "likesCount": 6
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found

#### Add Comment to Post
- **Endpoint:** `POST /posts/:id/comments`
- **Description:** Add a comment to a post
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
- **Request Body:**
  ```json
  {
    "content": "Great post! Love the pics."
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "post_id",
    "userId": "user_id",
    "title": "My new bike adventure",
    "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
    "comments": [
      {
        "userId": "commenter_id",
        "content": "Great post! Love the pics.",
        "createdAt": "2025-11-30T16:50:00.000Z"
      }
    ],
    "commentsCount": 3
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found

#### Delete Comment from Post
- **Endpoint:** `DELETE /posts/:id/comments/:commentIndex`
- **Description:** Delete a comment from a post (only comment owner can delete)
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `id` (required): Post ID
  - `commentIndex` (required): Comment index
- **Response:** `200 OK`
  ```json
  {
    "message": "Comment deleted successfully"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post or comment not found
  - `403 Forbidden`: You can only delete your own comments

#### Get Trending Hashtags
- **Endpoint:** `GET /posts/trending/hashtags`
- **Description:** Get trending hashtags
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `limit` (optional, default: 10): Number of hashtags to return
- **Response:** `200 OK`
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

#### Get User Posts
- **Endpoint:** `GET /posts/user/:userId`
- **Description:** Get all posts from a specific user
- **Authentication:** Required (JWT)
- **Path Parameters:**
  - `userId` (required): User ID
- **Query Parameters:**
  - `page` (optional, default: 1): Page number
  - `limit` (optional, default: 10): Items per page
- **Response:** `200 OK`
  ```json
  {
    "data": [
      {
        "id": "post_id_1",
        "userId": "user_id",
        "title": "My new bike adventure",
        "content": "Just took my bike on an amazing ride through the mountains! #bikelife",
        "tags": ["adventure", "mountains"],
        "likesCount": 5,
        "commentsCount": 2,
        "createdAt": "2025-11-30T16:45:00.000Z"
      }
    ],
    "total": 25
  }
  ```

---

## Error Handling

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful GET, PATCH, DELETE request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Authenticated but not authorized for this action
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., email already registered)
- `500 Internal Server Error`: Server error

---

## Rate Limiting

The API implements rate limiting on authentication endpoints to prevent brute force attacks. Default limits:
- 5 requests per minute for login attempts
- 3 requests per minute for registration

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page

**Response Format:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "hasMore": true
}
```

---

## Sorting

Supported sort options for posts:
- `recent`: Sort by creation date (newest first)
- `popular`: Sort by likes count
- `trending`: Sort by engagement (likes + comments)

**Sort Order:**
- `ASC`: Ascending order
- `DESC`: Descending order (default)

---

## Filtering

### Posts Filtering

- **search**: Search in post title and content
- **tags**: Filter by post tags (array)
- **hashtag**: Filter by hashtag in content
- **sort**: Sort by recent, popular, or trending
- **order**: Sort order (ASC or DESC)

---

## Examples

### Example 1: Register and Login

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "bikeType": "SPORT"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Example 2: Create and Get Posts

```bash
# Create a post
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My bike adventure",
    "content": "Amazing ride today! #bikelife",
    "tags": ["adventure"]
  }'

# Get posts feed
curl -X GET "http://localhost:3000/api/v1/posts?page=1&limit=10&sort=recent" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get trending hashtags
curl -X GET "http://localhost:3000/api/v1/posts/trending/hashtags?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example 3: Like and Comment on Post

```bash
# Like a post
curl -X POST http://localhost:3000/api/v1/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add a comment
curl -X POST http://localhost:3000/api/v1/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Great post!"
  }'
```

---

## Support

For issues or questions about the API, please refer to the Swagger documentation at `/api/docs` or contact the development team.
