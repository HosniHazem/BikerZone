<template>
  <div class="posts-list">
    <!-- Posts Grid -->
    <v-row v-if="posts.length > 0" class="mt-4">
      <v-col v-for="post in posts" :key="post.id" cols="12" md="6" lg="4">
        <v-card elevation="2" class="h-100 d-flex flex-column">
          <!-- Post Header -->
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6">{{ post.title }}</h3>
              <p class="text-caption text-grey">{{ formatDate(post.createdAt) }}</p>
            </div>
            <v-menu v-if="isPostOwner(post)">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item @click="editPost(post)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deletePostHandler(post.id)">
                  <v-list-item-title class="text-error">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <!-- Post Content -->
          <v-card-text class="flex-grow-1">
            <p class="text-body2">{{ post.content }}</p>
            <div v-if="post.tags && post.tags.length > 0" class="mt-2">
              <v-chip
                v-for="tag in post.tags"
                :key="tag"
                size="small"
                class="mr-1"
                variant="outlined"
              >
                {{ tag }}
              </v-chip>
            </div>
          </v-card-text>

          <!-- Post Actions -->
          <v-card-actions class="mt-auto">
            <v-btn
              :icon="post.isLikedByUser ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="post.isLikedByUser ? 'error' : 'default'"
              size="small"
              @click="toggleLikeHandler(post.id)"
            >
              {{ post.likesCount }}
            </v-btn>
            <v-btn icon="mdi-comment-outline" size="small">
              {{ post.commentsCount }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              size="small"
              color="primary"
              @click="viewPost(post.id)"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-alert v-else type="info" variant="tonal" class="mt-4">
      No posts found. Create one to get started!
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { usePostsStore } from '@/stores/posts';
import { useAuthStore } from '@/stores/auth';
import type { Post } from '@/types/post.types';

interface Props {
  posts: Post[];
}

defineProps<Props>();
const emit = defineEmits<{
  refresh: [];
}>();

const postsStore = usePostsStore();
const authStore = useAuthStore();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const isPostOwner = (post: Post) => {
  return authStore.user?.id === post.userId;
};

const toggleLikeHandler = async (postId: string) => {
  try {
    await postsStore.toggleLike(postId);
  } catch (err) {
    console.error('Failed to toggle like:', err);
  }
};

const deletePostHandler = async (postId: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await postsStore.deletePost(postId);
      emit('refresh');
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }
};

const editPost = (post: Post) => {
  // Implement edit functionality
  console.log('Edit post:', post);
};

const viewPost = (postId: string) => {
  // Could navigate to post detail view if you create one
  console.log('View post:', postId);
};
</script>

<style scoped>
.posts-list {
  width: 100%;
}
</style>
