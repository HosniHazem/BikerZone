import apiClient from '../api';
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  AddCommentDto,
  FilterPostDto,
  PostsResponse,
  LikeResponse,
  TrendingHashtag,
  UserPostsResponse,
} from '@/types/post.types';

export const postsApi = {
  /**
   * Create a new post
   */
  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  /**
   * Get posts feed with pagination and filtering
   */
  async getPosts(filters?: FilterPostDto): Promise<PostsResponse> {
    const params = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      sort: filters?.sort ?? 'recent',
      order: filters?.order ?? 'DESC',
      search: filters?.search,
      tags: filters?.tags,
      hashtag: filters?.hashtag,
    };

    const response = await apiClient.get('/posts', { params });
    return response.data;
  },

  /**
   * Get a single post by ID
   */
  async getPost(postId: string): Promise<Post> {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Update a post
   */
  async updatePost(postId: string, data: UpdatePostDto): Promise<Post> {
    const response = await apiClient.patch(`/posts/${postId}`, data);
    return response.data;
  },

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Toggle like on a post
   */
  async toggleLike(postId: string): Promise<LikeResponse> {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, data: AddCommentDto): Promise<Post> {
    const response = await apiClient.post(`/posts/${postId}/comments`, data);
    return response.data;
  },

  /**
   * Delete a comment from a post
   */
  async deleteComment(postId: string, commentIndex: number): Promise<Post> {
    const response = await apiClient.delete(
      `/posts/${postId}/comments/${commentIndex}`
    );
    return response.data;
  },

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(limit: number = 10): Promise<TrendingHashtag[]> {
    const response = await apiClient.get('/posts/trending/hashtags', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get posts from a specific user
   */
  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<UserPostsResponse> {
    const response = await apiClient.get(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};
