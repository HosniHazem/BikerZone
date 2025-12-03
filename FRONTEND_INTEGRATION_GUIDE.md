# BikerZone Frontend - API Integration Guide

## Overview

This guide explains how to use the API services and stores in the BikerZone frontend application. All API endpoints have been implemented with proper TypeScript types and Pinia stores for state management.

---

## Project Structure

```
frontend/src/
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── api/
│       ├── auth.api.ts        # Authentication API calls
│       ├── posts.api.ts       # Posts API calls (NEW)
│       └── users.api.ts       # Users API calls (NEW)
├── stores/
│   ├── auth.ts                # Authentication state management
│   ├── posts.ts               # Posts state management (NEW)
│   └── users.ts               # Users state management (NEW)
├── types/
│   ├── auth.types.ts          # Authentication types
│   ├── post.types.ts          # Posts types (NEW)
│   └── user.types.ts          # Users types (NEW)
└── components/
    └── PostsList.vue          # Example component (NEW)
```

---

## API Services

### 1. Posts API (`services/api/posts.api.ts`)

Provides all post-related API calls:

```typescript
import { postsApi } from '@/services/api/posts.api';

// Create a post
const post = await postsApi.createPost({
  title: 'My Bike Adventure',
  content: 'Amazing ride today! #bikelife',
  tags: ['adventure', 'motorcycle']
});

// Get posts feed with pagination
const response = await postsApi.getPosts({
  page: 1,
  limit: 10,
  sort: 'recent',
  order: 'DESC'
});

// Get single post
const post = await postsApi.getPost(postId);

// Update post
const updated = await postsApi.updatePost(postId, {
  title: 'Updated Title',
  content: 'Updated content'
});

// Delete post
await postsApi.deletePost(postId);

// Toggle like
const likeResponse = await postsApi.toggleLike(postId);
// Returns: { isLiked: boolean, likesCount: number }

// Add comment
const postWithComment = await postsApi.addComment(postId, {
  content: 'Great post!'
});

// Delete comment
const postWithoutComment = await postsApi.deleteComment(postId, commentIndex);

// Get trending hashtags
const hashtags = await postsApi.getTrendingHashtags(10);

// Get user posts
const userPosts = await postsApi.getUserPosts(userId, page, limit);
```

### 2. Users API (`services/api/users.api.ts`)

Provides all user-related API calls:

```typescript
import { usersApi } from '@/services/api/users.api';

// Create user
const user = await usersApi.createUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe'
});

// Get all users
const users = await usersApi.getUsers();

// Get single user
const user = await usersApi.getUser(userId);

// Update user
const updated = await usersApi.updateUser(userId, {
  bio: 'Updated bio',
  location: 'New York, USA'
});

// Delete user
await usersApi.deleteUser(userId);
```

### 3. Auth API (`services/api/auth.api.ts`)

Already implemented - provides authentication:

```typescript
import { authApi } from '@/services/api/auth.api';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
await authApi.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  bikeType: 'SPORT'
});

// Logout
await authApi.logout();

// Get current user
const user = await authApi.getCurrentUser();

// Refresh token
const response = await authApi.refreshToken(refreshToken);

// Request password reset
await authApi.requestPasswordReset('user@example.com');

// Reset password
await authApi.resetPassword(token, newPassword);
```

---

## Pinia Stores

### 1. Posts Store (`stores/posts.ts`)

State management for posts:

```typescript
import { usePostsStore } from '@/stores/posts';

const postsStore = usePostsStore();

// State
postsStore.posts              // Array of posts
postsStore.currentPost        // Currently viewed post
postsStore.trendingHashtags   // Trending hashtags
postsStore.userPosts          // User's posts
postsStore.loading            // Loading state
postsStore.error              // Error message
postsStore.pagination         // Pagination info

// Getters
postsStore.postsCount         // Number of posts
postsStore.hasMorePosts       // Has more posts to load
postsStore.currentPage        // Current page number

// Actions
await postsStore.createPost(data)
await postsStore.getPosts(filters)
await postsStore.getPost(postId)
await postsStore.updatePost(postId, data)
await postsStore.deletePost(postId)
await postsStore.toggleLike(postId)
await postsStore.addComment(postId, data)
await postsStore.deleteComment(postId, commentIndex)
await postsStore.fetchTrendingHashtags(limit)
await postsStore.getUserPosts(userId, page, limit)
postsStore.clearError()
postsStore.resetPosts()
```

### 2. Users Store (`stores/users.ts`)

State management for users:

```typescript
import { useUsersStore } from '@/stores/users';

const usersStore = useUsersStore();

// State
usersStore.users              // Array of users
usersStore.currentUserProfile // Currently viewed user
usersStore.loading            // Loading state
usersStore.error              // Error message

// Getters
usersStore.usersCount         // Number of users

// Actions
await usersStore.getUsers()
await usersStore.getUser(userId)
await usersStore.updateUser(userId, data)
await usersStore.deleteUser(userId)
usersStore.clearError()
usersStore.resetUsers()
```

### 3. Auth Store (`stores/auth.ts`)

Already implemented - state management for authentication:

```typescript
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// State
authStore.user                // Current user
authStore.token               // Access token
authStore.refreshToken        // Refresh token
authStore.loading             // Loading state
authStore.error               // Error message

// Getters
authStore.isAuthenticated     // Is user logged in
authStore.userRole            // User role
authStore.bikeType            // User bike type

// Actions
await authStore.login(credentials)
await authStore.register(data)
await authStore.logout()
await authStore.fetchCurrentUser()
await authStore.refreshAccessToken()
await authStore.updateProfile(updates)
```

---

## Type Definitions

### Post Types (`types/post.types.ts`)

```typescript
interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  hashtags?: string[];
  likes?: string[];
  likesCount: number;
  comments?: Comment[];
  commentsCount: number;
  isActive: boolean;
  isLikedByUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CreatePostDto {
  title: string;
  content: string;
  tags?: string[];
}

interface UpdatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
}

interface AddCommentDto {
  content: string;
}

interface FilterPostDto {
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'trending';
  hashtag?: string;
  order?: 'ASC' | 'DESC';
}

interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  hasMore: boolean;
}

interface LikeResponse {
  isLiked: boolean;
  likesCount: number;
}

interface TrendingHashtag {
  tag: string;
  count: number;
}

interface UserPostsResponse {
  data: Post[];
  total: number;
}
```

### User Types (`types/user.types.ts`)

```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
}
```

---

## Usage Examples

### Example 1: Display Posts Feed

```vue
<template>
  <div>
    <v-progress-linear v-if="postsStore.loading" indeterminate></v-progress-linear>
    
    <v-alert v-if="postsStore.error" type="error">
      {{ postsStore.error }}
    </v-alert>

    <v-card v-for="post in postsStore.posts" :key="post.id" class="mb-4">
      <v-card-title>{{ post.title }}</v-card-title>
      <v-card-text>{{ post.content }}</v-card-text>
      <v-card-actions>
        <v-btn @click="toggleLike(post.id)">
          <v-icon :color="post.isLikedByUser ? 'red' : 'grey'">
            {{ post.isLikedByUser ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          {{ post.likesCount }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/stores/posts';
import { onMounted } from 'vue';

const postsStore = usePostsStore();

const toggleLike = async (postId: string) => {
  try {
    await postsStore.toggleLike(postId);
  } catch (err) {
    console.error('Failed to toggle like:', err);
  }
};

onMounted(async () => {
  try {
    await postsStore.getPosts({ page: 1, limit: 10 });
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
});
</script>
```

### Example 2: Create a Post

```vue
<template>
  <v-form @submit.prevent="submitPost">
    <v-text-field
      v-model="form.title"
      label="Post Title"
      required
    ></v-text-field>

    <v-textarea
      v-model="form.content"
      label="Post Content"
      required
    ></v-textarea>

    <v-combobox
      v-model="form.tags"
      label="Tags"
      multiple
      chips
    ></v-combobox>

    <v-btn type="submit" color="primary" :loading="postsStore.loading">
      Create Post
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/stores/posts';
import { ref } from 'vue';
import type { CreatePostDto } from '@/types/post.types';

const postsStore = usePostsStore();
const form = ref<CreatePostDto>({
  title: '',
  content: '',
  tags: []
});

const submitPost = async () => {
  try {
    await postsStore.createPost(form.value);
    form.value = { title: '', content: '', tags: [] };
    // Show success message
  } catch (err) {
    console.error('Failed to create post:', err);
  }
};
</script>
```

### Example 3: Display User Profile

```vue
<template>
  <div v-if="usersStore.currentUserProfile">
    <v-card>
      <v-card-title>{{ usersStore.currentUserProfile.firstName }}</v-card-title>
      <v-card-text>
        <p><strong>Email:</strong> {{ usersStore.currentUserProfile.email }}</p>
        <p><strong>Bio:</strong> {{ usersStore.currentUserProfile.bio }}</p>
        <p><strong>Location:</strong> {{ usersStore.currentUserProfile.location }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="editProfile">Edit Profile</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const usersStore = useUsersStore();
const route = useRoute();

const editProfile = () => {
  // Navigate to edit profile page
};

onMounted(async () => {
  try {
    await usersStore.getUser(route.params.userId as string);
  } catch (err) {
    console.error('Failed to load user:', err);
  }
});
</script>
```

### Example 4: Filter Posts

```typescript
// Search posts
await postsStore.getPosts({
  search: 'motorcycle',
  page: 1,
  limit: 10
});

// Filter by tags
await postsStore.getPosts({
  tags: ['adventure', 'touring'],
  page: 1,
  limit: 10
});

// Filter by hashtag
await postsStore.getPosts({
  hashtag: '#bikelife',
  page: 1,
  limit: 10
});

// Sort by popular
await postsStore.getPosts({
  sort: 'popular',
  order: 'DESC',
  page: 1,
  limit: 10
});

// Combined filters
await postsStore.getPosts({
  search: 'bike',
  sort: 'recent',
  page: 1,
  limit: 10,
  order: 'DESC'
});
```

---

## Error Handling

All stores include error handling:

```typescript
try {
  await postsStore.getPosts();
} catch (err) {
  console.error('Error:', postsStore.error);
  // Handle error
}

// Clear error
postsStore.clearError();
```

---

## Loading States

All stores have loading state:

```typescript
if (postsStore.loading) {
  // Show loading spinner
}
```

---

## Pagination

Posts support pagination:

```typescript
// Get page 2
await postsStore.getPosts({
  page: 2,
  limit: 10
});

// Check if more posts available
if (postsStore.hasMorePosts) {
  // Load next page
}

// Current pagination info
console.log(postsStore.pagination);
// { page: 1, limit: 10, total: 100, hasMore: true }
```

---

## API Interceptors

The API client includes automatic interceptors:

1. **Request Interceptor**: Adds JWT token to all requests
2. **Response Interceptor**: Handles 401 errors by logging out user

```typescript
// In services/api.ts
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Best Practices

1. **Always use stores** instead of calling API directly
2. **Handle errors** in try-catch blocks
3. **Show loading states** while fetching data
4. **Clear errors** after displaying them
5. **Use TypeScript types** for type safety
6. **Validate input** before sending to API
7. **Cache data** where appropriate
8. **Implement pagination** for large datasets
9. **Use computed properties** for derived state
10. **Test API calls** with different scenarios

---

## Common Patterns

### Pattern 1: Load Data on Mount

```typescript
onMounted(async () => {
  try {
    await postsStore.getPosts();
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
});
```

### Pattern 2: Handle Form Submission

```typescript
const submitForm = async () => {
  try {
    loading.value = true;
    await postsStore.createPost(formData.value);
    // Reset form and show success
  } catch (err) {
    error.value = err.response?.data?.message || 'Error occurred';
  } finally {
    loading.value = false;
  }
};
```

### Pattern 3: Implement Search

```typescript
const searchPosts = async (query: string) => {
  try {
    await postsStore.getPosts({
      search: query,
      page: 1,
      limit: 10
    });
  } catch (err) {
    console.error('Search failed:', err);
  }
};
```

### Pattern 4: Pagination

```typescript
const loadPage = async (page: number) => {
  try {
    await postsStore.getPosts({
      page,
      limit: 10
    });
  } catch (err) {
    console.error('Failed to load page:', err);
  }
};
```

---

## Troubleshooting

### Issue: 401 Unauthorized
- Check if token is valid
- Refresh token using `authStore.refreshAccessToken()`
- Re-login if token is expired

### Issue: 404 Not Found
- Verify resource ID is correct
- Check if resource exists
- Verify endpoint path is correct

### Issue: 400 Bad Request
- Check request payload format
- Verify all required fields are present
- Check data types match schema

### Issue: Network Error
- Check API server is running
- Verify API URL in environment variables
- Check network connectivity

---

## Environment Variables

Set in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

---

## Summary

The frontend now has:

✅ Complete API service layer  
✅ Pinia stores for state management  
✅ TypeScript types for all data  
✅ Error handling and loading states  
✅ Pagination and filtering support  
✅ Example components  
✅ Best practices documentation  

All 28 API endpoints are now ready to use in the frontend!
