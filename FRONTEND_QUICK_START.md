# Frontend Quick Start Guide

## Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server
```bash
npm run dev
```

---

## Using API Services

### Posts

```typescript
import { usePostsStore } from '@/stores/posts';

const postsStore = usePostsStore();

// Load posts
await postsStore.getPosts({ page: 1, limit: 10 });

// Create post
await postsStore.createPost({
  title: 'My Post',
  content: 'Post content',
  tags: ['tag1']
});

// Like post
await postsStore.toggleLike(postId);

// Add comment
await postsStore.addComment(postId, { content: 'Nice!' });

// Get trending hashtags
await postsStore.fetchTrendingHashtags(10);

// Get user posts
await postsStore.getUserPosts(userId, 1, 10);
```

### Users

```typescript
import { useUsersStore } from '@/stores/users';

const usersStore = useUsersStore();

// Get all users
await usersStore.getUsers();

// Get user profile
await usersStore.getUser(userId);

// Update user
await usersStore.updateUser(userId, {
  bio: 'New bio',
  location: 'New York'
});

// Delete user
await usersStore.deleteUser(userId);
```

### Auth

```typescript
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Login
await authStore.login({
  email: 'user@example.com',
  password: 'password'
});

// Register
await authStore.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password',
  bikeType: 'SPORT'
});

// Logout
await authStore.logout();

// Get current user
await authStore.fetchCurrentUser();
```

---

## Using in Components

### Display Posts

```vue
<template>
  <div>
    <v-progress-linear v-if="postsStore.loading" indeterminate></v-progress-linear>
    
    <v-card v-for="post in postsStore.posts" :key="post.id" class="mb-4">
      <v-card-title>{{ post.title }}</v-card-title>
      <v-card-text>{{ post.content }}</v-card-text>
      <v-card-actions>
        <v-btn @click="like(post.id)">
          <v-icon>{{ post.isLikedByUser ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
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

const like = async (postId: string) => {
  await postsStore.toggleLike(postId);
};

onMounted(async () => {
  await postsStore.getPosts();
});
</script>
```

### Create Post Form

```vue
<template>
  <v-form @submit.prevent="submit">
    <v-text-field v-model="form.title" label="Title" required></v-text-field>
    <v-textarea v-model="form.content" label="Content" required></v-textarea>
    <v-combobox v-model="form.tags" label="Tags" multiple chips></v-combobox>
    <v-btn type="submit" :loading="postsStore.loading">Create</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { usePostsStore } from '@/stores/posts';
import { ref } from 'vue';

const postsStore = usePostsStore();
const form = ref({ title: '', content: '', tags: [] });

const submit = async () => {
  await postsStore.createPost(form.value);
  form.value = { title: '', content: '', tags: [] };
};
</script>
```

### User Profile

```vue
<template>
  <div v-if="usersStore.currentUserProfile">
    <h1>{{ usersStore.currentUserProfile.firstName }}</h1>
    <p>{{ usersStore.currentUserProfile.bio }}</p>
    <p>{{ usersStore.currentUserProfile.location }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const usersStore = useUsersStore();
const route = useRoute();

onMounted(async () => {
  await usersStore.getUser(route.params.userId as string);
});
</script>
```

---

## Common Patterns

### Load Data on Mount
```typescript
onMounted(async () => {
  try {
    await postsStore.getPosts();
  } catch (err) {
    console.error('Error:', err);
  }
});
```

### Handle Form Submission
```typescript
const submit = async () => {
  try {
    await postsStore.createPost(form.value);
    // Success
  } catch (err) {
    error.value = err.response?.data?.message;
  }
};
```

### Pagination
```typescript
const loadPage = async (page: number) => {
  await postsStore.getPosts({ page, limit: 10 });
};
```

### Search
```typescript
const search = async (query: string) => {
  await postsStore.getPosts({ search: query, page: 1 });
};
```

---

## Error Handling

```typescript
try {
  await postsStore.getPosts();
} catch (err) {
  console.error('Error:', postsStore.error);
}

// Clear error
postsStore.clearError();
```

---

## Loading States

```typescript
if (postsStore.loading) {
  // Show spinner
}
```

---

## Filtering

```typescript
// Search
await postsStore.getPosts({ search: 'bike' });

// By tags
await postsStore.getPosts({ tags: ['adventure'] });

// By hashtag
await postsStore.getPosts({ hashtag: '#bikelife' });

// Sort
await postsStore.getPosts({ sort: 'popular', order: 'DESC' });
```

---

## Available Stores

### Posts Store
```typescript
import { usePostsStore } from '@/stores/posts';
```

### Users Store
```typescript
import { useUsersStore } from '@/stores/users';
```

### Auth Store
```typescript
import { useAuthStore } from '@/stores/auth';
```

---

## Available Types

### Post Types
```typescript
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  AddCommentDto,
  FilterPostDto,
  PostsResponse,
  LikeResponse,
  TrendingHashtag,
  UserPostsResponse
} from '@/types/post.types';
```

### User Types
```typescript
import type {
  UserProfile,
  CreateUserDto,
  UpdateUserDto
} from '@/types/user.types';
```

### Auth Types
```typescript
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '@/types/auth.types';
```

---

## Build for Production

```bash
npm run build
```

---

## Run Tests

```bash
npm run test:unit
npm run test:e2e
```

---

## Lint Code

```bash
npm run lint
```

---

## Format Code

```bash
npm run format
```

---

## Troubleshooting

### API calls fail with 401
- Check if logged in
- Refresh token
- Re-login

### CORS errors
- Ensure API server is running
- Check VITE_API_URL is correct

### Types not found
- Run `npm install`
- Check import paths

### Store not updating
- Use `await` for async actions
- Check store is imported correctly

---

## Next Steps

1. Create pages for posts, users, profiles
2. Add routing for all features
3. Implement search and filtering UI
4. Add image upload
5. Implement real-time notifications
6. Add tests

---

## Documentation

- **FRONTEND_INTEGRATION_GUIDE.md** - Complete guide
- **FRONTEND_IMPLEMENTATION_COMPLETE.md** - Implementation details
- **API_DOCUMENTATION.md** - Backend API docs

---

**Ready to build! 🚀**
