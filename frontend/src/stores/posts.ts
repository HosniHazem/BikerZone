import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { postsApi } from '@/services/api/posts.api';
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  AddCommentDto,
  FilterPostDto,
  TrendingHashtag,
} from '@/types/post.types';

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref<Post[]>([]);
  const currentPost = ref<Post | null>(null);
  const trendingHashtags = ref<TrendingHashtag[]>([]);
  const userPosts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });

  // Getters
  const postsCount = computed(() => posts.value.length);
  const hasMorePosts = computed(() => pagination.value.hasMore);
  const currentPage = computed(() => pagination.value.page);

  // Actions
  async function createPost(data: CreatePostDto) {
    try {
      loading.value = true;
      error.value = null;

      const newPost = await postsApi.createPost(data);
      posts.value.unshift(newPost);

      return newPost;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getPosts(filters?: FilterPostDto) {
    try {
      loading.value = true;
      error.value = null;

      const response = await postsApi.getPosts({
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        sort: filters?.sort ?? 'recent',
        order: filters?.order ?? 'DESC',
        search: filters?.search,
        tags: filters?.tags,
        hashtag: filters?.hashtag,
      });

      posts.value = response.data;
      pagination.value = {
        page: response.page,
        limit: filters?.limit || 10,
        total: response.total,
        hasMore: response.hasMore,
      };

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch posts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getPost(postId: string) {
    try {
      loading.value = true;
      error.value = null;

      const post = await postsApi.getPost(postId);
      currentPost.value = post;

      return post;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePost(postId: string, data: UpdatePostDto) {
    try {
      loading.value = true;
      error.value = null;

      const updatedPost = await postsApi.updatePost(postId, data);

      // Update in posts list
      const index = posts.value.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      // Update current post
      if (currentPost.value?.id === postId) {
        currentPost.value = updatedPost;
      }

      return updatedPost;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deletePost(postId: string) {
    try {
      loading.value = true;
      error.value = null;

      await postsApi.deletePost(postId);

      // Remove from posts list
      posts.value = posts.value.filter((p) => p.id !== postId);

      // Clear current post if deleted
      if (currentPost.value?.id === postId) {
        currentPost.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function toggleLike(postId: string) {
    try {
      error.value = null;

      const response = await postsApi.toggleLike(postId);

      // Update in posts list
      const post = posts.value.find((p) => p.id === postId);
      if (post) {
        post.likesCount = response.likesCount;
        post.isLikedByUser = response.isLiked;
      }

      // Update current post
      if (currentPost.value?.id === postId) {
        currentPost.value.likesCount = response.likesCount;
        currentPost.value.isLikedByUser = response.isLiked;
      }

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle like';
      throw err;
    }
  }

  async function addComment(postId: string, data: AddCommentDto) {
    try {
      error.value = null;

      const updatedPost = await postsApi.addComment(postId, data);

      // Update in posts list
      const index = posts.value.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      // Update current post
      if (currentPost.value?.id === postId) {
        currentPost.value = updatedPost;
      }

      return updatedPost;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add comment';
      throw err;
    }
  }

  async function deleteComment(postId: string, commentIndex: number) {
    try {
      error.value = null;

      const updatedPost = await postsApi.deleteComment(postId, commentIndex);

      // Update in posts list
      const index = posts.value.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      // Update current post
      if (currentPost.value?.id === postId) {
        currentPost.value = updatedPost;
      }

      return updatedPost;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete comment';
      throw err;
    }
  }

  async function fetchTrendingHashtags(limit: number = 10) {
    try {
      error.value = null;

      const hashtags = await postsApi.getTrendingHashtags(limit);
      trendingHashtags.value = hashtags;

      return hashtags;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch trending hashtags';
      throw err;
    }
  }

  async function getUserPosts(userId: string, page: number = 1, limit: number = 10) {
    try {
      loading.value = true;
      error.value = null;

      const response = await postsApi.getUserPosts(userId, page, limit);
      userPosts.value = response.data;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user posts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function resetPosts() {
    posts.value = [];
    currentPost.value = null;
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
    };
  }

  return {
    // State
    posts,
    currentPost,
    trendingHashtags,
    userPosts,
    loading,
    error,
    pagination,
    // Getters
    postsCount,
    hasMorePosts,
    currentPage,
    // Actions
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    fetchTrendingHashtags,
    getUserPosts,
    clearError,
    resetPosts,
  };
});
