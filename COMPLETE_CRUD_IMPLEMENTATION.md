# BikerZone - Complete CRUD Implementation Guide

## Overview
This document details the complete CRUD implementation for all entities in the BikerZone backend, including Swagger documentation for each endpoint.

## Entities & Status

### ✅ Completed Modules (With Full CRUD + Swagger)

#### 1. **Users Module**
- Entity: User (MongoDB)
- Location: `backend/src/modules/users/`
- Status: ✅ COMPLETE
- Endpoints:
  - GET /api/v1/users - List all users
  - GET /api/v1/users/:id - Get user by ID
  - POST /api/v1/users - Create user
  - PATCH /api/v1/users/:id - Update user
  - DELETE /api/v1/users/:id - Delete user

#### 2. **Auth Module**
- Entity: User (authentication related)
- Location: `backend/src/modules/auth/`
- Status: ✅ COMPLETE
- Endpoints:
  - POST /api/v1/auth/register - Register
  - POST /api/v1/auth/login - Login
  - POST /api/v1/auth/logout - Logout
  - POST /api/v1/auth/refresh - Refresh token
  - GET /api/v1/auth/me - Get current user
  - GET /api/v1/auth/verify-email - Verify email
  - POST /api/v1/auth/request-password-reset - Request password reset
  - POST /api/v1/auth/reset-password - Reset password

#### 3. **Posts Module**
- Entity: Post (MongoDB)
- Location: `backend/src/modules/posts/`
- Status: ✅ COMPLETE
- Endpoints:
  - GET /api/v1/posts - Get posts feed
  - GET /api/v1/posts/:id - Get single post
  - POST /api/v1/posts - Create post
  - PATCH /api/v1/posts/:id - Update post
  - DELETE /api/v1/posts/:id - Delete post
  - POST /api/v1/posts/:id/like - Toggle like
  - POST /api/v1/posts/:id/comments - Add comment
  - DELETE /api/v1/posts/:id/comments/:index - Delete comment
  - GET /api/v1/posts/trending/hashtags - Get trending hashtags
  - GET /api/v1/posts/user/:userId - Get user posts

#### 4. **Garages Module**
- Entity: Garage (PostgreSQL)
- Location: `backend/src/modules/garages/`
- Status: ✅ NOW COMPLETE
- Features:
  - Full CRUD operations
  - Location-based search (nearby garages)
  - Rating system
  - Status management (active/inactive/suspended)
  - Owner-based filtering
  - Service filtering
- Endpoints:
  - GET /api/v1/garages - List all garages
  - GET /api/v1/garages/:id - Get garage by ID
  - POST /api/v1/garages - Create garage
  - PATCH /api/v1/garages/:id - Update garage
  - DELETE /api/v1/garages/:id - Delete garage
  - GET /api/v1/garages/nearby - Find nearby garages
  - GET /api/v1/garages/owner/:ownerId - Get owner's garages

### 🟡 Modules Needing Implementation

#### 5. **Bookings Module**
- Entity: Booking (PostgreSQL)
- Location: `backend/src/modules/bookings/`
- Status: 🟡 ENTITY ONLY - Need: Service, Controller, Module
- Purpose: Garage appointment bookings

#### 6. **Reviews Module** (Part of Garages)
- Entity: Review (PostgreSQL)
- Location: `backend/src/modules/garages/entities/`
- Status: 🟡 ENTITY ONLY - Need: Service, Controller
- Purpose: Garage reviews and ratings

#### 7. **Videos Module**
- Entity: Video (MongoDB - Planned)
- Location: `backend/src/modules/videos/` (TO CREATE)
- Status: ❌ NOT CREATED
- Purpose: Tutorial videos

#### 8. **Alerts Module**
- Entity: Alert (MongoDB - Planned)
- Location: `backend/src/modules/alerts/` (TO CREATE)
- Status: ❌ NOT CREATED
- Purpose: Traffic and police alerts

### 🟢 Utility Modules

#### 9. **Health Module**
- Location: `backend/src/modules/health/`
- Status: ✅ COMPLETE
- Endpoints:
  - GET /api/v1/ - Basic health check
  - GET /api/v1/health - Detailed health check

#### 10. **Upload Module**
- Location: `backend/src/modules/upload/`
- Status: ✅ COMPLETE
- Purpose: File upload handling (Cloudinary)

#### 11. **Mail Module**
- Location: `backend/src/modules/mail/`
- Status: ✅ COMPLETE
- Purpose: Email service (SendGrid)

---

## Implementation Details for Each Module

### Garages Module (✅ Complete)

**Files Created:**
```
backend/src/modules/garages/
├── entities/
│   ├── garage.entity.ts          ✅ Complete
│   └── review.entity.ts           ✅ Exists (needs integration)
├── dto/
│   ├── create-garage.dto.ts      ✅ Created
│   ├── update-garage.dto.ts      ✅ Created
│   └── filter-garage.dto.ts      ✅ Created
├── garages.service.ts            ✅ Created
├── garages.controller.ts         ✅ Created
└── garages.module.ts             ✅ Created
```

**Key Features:**
- Location-based search using Haversine formula
- Rating calculation system
- Owner verification
- Status management (active/inactive/suspended)
- Service filtering
- Comprehensive Swagger documentation

**API Examples:**
```bash
# Create garage
POST /api/v1/garages
{
  "name": "Premium Bike Garage",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "services": ["oil change", "tire replacement"],
  "openingTime": "08:00",
  "closingTime": "18:00"
}

# Find nearby garages
GET /api/v1/garages/nearby?latitude=40.7128&longitude=-74.0060&radius=10

# Get owner's garages
GET /api/v1/garages/owner/{ownerId}
```

---

### Bookings Module (Implementation Guide)

**Required Files:**
```
backend/src/modules/bookings/
├── entities/
│   └── booking.entity.ts         ✅ Updated
├── dto/
│   └── booking.dto.ts            ✅ Created
├── bookings.service.ts           📝 TO CREATE
├── bookings.controller.ts        📝 TO CREATE
└── bookings.module.ts            📝 TO CREATE
```

**Service Methods Needed:**
```typescript
- create(userId, createBookingDto)
- findAll(filterDto)
- findOne(id)
- findByUser(userId, page, limit)
- findByGarage(garageId, page, limit)
- update(id, userId, updateBookingDto)
- cancel(id, userId, reason)
- updateStatus(id, status)
- getUpcoming(userId)
- getPast(userId)
```

**Controller Endpoints:**
```
POST   /api/v1/bookings           - Create booking
GET    /api/v1/bookings           - List all bookings (with filters)
GET    /api/v1/bookings/:id       - Get booking by ID
PATCH  /api/v1/bookings/:id       - Update booking
DELETE /api/v1/bookings/:id       - Cancel booking
GET    /api/v1/bookings/user/:userId       - Get user's bookings
GET    /api/v1/bookings/garage/:garageId   - Get garage's bookings
GET    /api/v1/bookings/upcoming  - Get upcoming bookings
GET    /api/v1/bookings/past      - Get past bookings
```

---

### Reviews Module (Implementation Guide)

**Integrate with Garages:**
```
backend/src/modules/garages/
├── entities/
│   └── review.entity.ts          ✅ Exists
├── dto/
│   ├── create-review.dto.ts      📝 TO CREATE
│   └── update-review.dto.ts      📝 TO CREATE
├── reviews.service.ts            📝 TO CREATE
└── reviews.controller.ts         📝 TO CREATE
```

**Service Methods Needed:**
```typescript
- create(userId, garageId, createReviewDto)
- findAll(garageId, page, limit)
- findOne(id)
- update(id, userId, updateReviewDto)
- remove(id, userId)
- getAverageRating(garageId)
```

**Controller Endpoints:**
```
POST   /api/v1/garages/:garageId/reviews    - Create review
GET    /api/v1/garages/:garageId/reviews    - List garage reviews
GET    /api/v1/reviews/:id                  - Get review by ID
PATCH  /api/v1/reviews/:id                  - Update review
DELETE /api/v1/reviews/:id                  - Delete review
```

---

### Videos Module (Implementation Guide)

**Required Files:**
```
backend/src/modules/videos/
├── schemas/
│   └── video.schema.ts           📝 TO CREATE
├── dto/
│   ├── create-video.dto.ts       📝 TO CREATE
│   ├── update-video.dto.ts       📝 TO CREATE
│   └── filter-video.dto.ts       📝 TO CREATE
├── videos.service.ts             📝 TO CREATE
├── videos.controller.ts          📝 TO CREATE
└── videos.module.ts              📝 TO CREATE
```

**Video Schema (MongoDB):**
```typescript
{
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: BikeType;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  views: number;
  likes: string[];
  uploadedBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Controller Endpoints:**
```
POST   /api/v1/videos           - Upload video
GET    /api/v1/videos           - List videos (with filters)
GET    /api/v1/videos/:id       - Get video by ID
PATCH  /api/v1/videos/:id       - Update video
DELETE /api/v1/videos/:id       - Delete video
POST   /api/v1/videos/:id/view  - Increment view count
POST   /api/v1/videos/:id/like  - Toggle like
GET    /api/v1/videos/popular   - Get popular videos
GET    /api/v1/videos/recent    - Get recent videos
```

---

### Alerts Module (Implementation Guide)

**Required Files:**
```
backend/src/modules/alerts/
├── schemas/
│   └── alert.schema.ts           📝 TO CREATE
├── dto/
│   ├── create-alert.dto.ts       📝 TO CREATE
│   ├── update-alert.dto.ts       📝 TO CREATE
│   └── filter-alert.dto.ts       📝 TO CREATE
├── alerts.service.ts             📝 TO CREATE
├── alerts.controller.ts          📝 TO CREATE
└── alerts.module.ts              📝 TO CREATE
```

**Alert Schema (MongoDB):**
```typescript
{
  type: 'police' | 'traffic' | 'accident' | 'roadwork' | 'other';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high';
  userId: string;
  validUntil: Date;
  upvotes: string[];
  downvotes: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Controller Endpoints:**
```
POST   /api/v1/alerts           - Create alert
GET    /api/v1/alerts           - List alerts (with filters)
GET    /api/v1/alerts/:id       - Get alert by ID
PATCH  /api/v1/alerts/:id       - Update alert
DELETE /api/v1/alerts/:id       - Delete alert
POST   /api/v1/alerts/:id/upvote   - Upvote alert
POST   /api/v1/alerts/:id/downvote - Downvote alert
GET    /api/v1/alerts/nearby    - Get nearby alerts
GET    /api/v1/alerts/active    - Get active alerts
```

---

## Swagger Documentation Standards

### All Endpoints Must Include:

1. **@ApiTags** - Group endpoints
2. **@ApiOperation** - Describe the operation
3. **@ApiResponse** - Document all possible responses
4. **@ApiBearerAuth** - For protected endpoints
5. **@ApiParam** - For path parameters
6. **@ApiQuery** - For query parameters
7. **@ApiBody** - For request body

### Example:
```typescript
@Post()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Resource')
@ApiOperation({
  summary: 'Create resource',
  description: 'Detailed description of what this endpoint does'
})
@ApiBody({ type: CreateResourceDto })
@ApiResponse({
  status: 201,
  description: 'Resource created successfully',
  type: Resource,
})
@ApiResponse({
  status: 400,
  description: 'Invalid input data',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
create(@Request() req, @Body() createDto: CreateResourceDto) {
  return this.service.create(req.user.id, createDto);
}
```

---

## Database Migrations

### PostgreSQL Entities (TypeORM):
- User (currently MongoDB, should migrate)
- Garage ✅
- Booking ✅
- Review ✅

### MongoDB Collections (Mongoose):
- User (currently here)
- Post ✅
- Video (to create)
- Alert (to create)

### Migration Command:
```bash
npm run typeorm migration:generate -- -n AddGaragesAndBookings
npm run typeorm migration:run
```

---

## Testing Checklist

### For Each Module:
- [ ] Entity properly defined
- [ ] DTOs with validation
- [ ] Service with all CRUD methods
- [ ] Controller with Swagger docs
- [ ] Module properly configured
- [ ] Imported in app.module.ts
- [ ] Tested with Swagger UI
- [ ] Tested with Postman/curl
- [ ] Error handling working
- [ ] Auth guards applied
- [ ] Database indexes added

---

## Next Steps

### Priority 1 (Essential):
1. ✅ Complete Garages module
2. 📝 Complete Bookings module
3. 📝 Integrate Reviews with Garages

### Priority 2 (Important):
4. 📝 Create Videos module
5. 📝 Create Alerts module

### Priority 3 (Enhancement):
6. Add real-time notifications
7. Add file upload for videos
8. Add image upload for garages
9. Add push notifications (FCM)
10. Add search with Elasticsearch

---

## Integration with Frontend

Once backend is complete, frontend needs:

### New Services:
```typescript
// frontend/src/services/api/garages.api.ts
// frontend/src/services/api/bookings.api.ts
// frontend/src/services/api/reviews.api.ts
// frontend/src/services/api/videos.api.ts
// frontend/src/services/api/alerts.api.ts
```

### New Stores:
```typescript
// frontend/src/stores/garages.ts
// frontend/src/stores/bookings.ts
// frontend/src/stores/reviews.ts
// frontend/src/stores/videos.ts
// frontend/src/stores/alerts.ts
```

### New Views:
```vue
// frontend/src/views/GaragesView.vue
// frontend/src/views/GarageDetailView.vue
// frontend/src/views/BookingsView.vue
// frontend/src/views/VideosView.vue
// frontend/src/views/AlertsView.vue
```

---

## Summary

### Current Status:
- ✅ 4 modules fully complete with CRUD + Swagger
- 🟡 2 modules need completion (Bookings, Reviews)
- ❌ 2 modules need creation (Videos, Alerts)

### Completion Percentage:
- **Backend Entities**: 70% complete
- **CRUD Operations**: 50% complete
- **Swagger Documentation**: 50% complete
- **Overall Project**: 55% complete

### Estimated Time to Complete:
- Bookings Module: 2-3 hours
- Reviews Integration: 1-2 hours
- Videos Module: 3-4 hours
- Alerts Module: 3-4 hours
- **Total**: 10-13 hours of development

---

**Last Updated**: January 7, 2026
**Version**: 1.0.0
