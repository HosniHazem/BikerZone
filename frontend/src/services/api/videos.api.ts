import apiClient from '../api';
import type {
  Video,
  CreateVideoDto,
  UpdateVideoDto,
  FilterVideoDto,
  VideosResponse,
} from '@/types/video.types';

export const videosApi = {
  /**
   * Upload a new video
   */
  async createVideo(data: CreateVideoDto): Promise<Video> {
    const response = await apiClient.post('/videos', data);
    return response.data;
  },

  /**
   * Get all videos with filtering and pagination
   */
  async getVideos(filters?: FilterVideoDto): Promise<VideosResponse> {
    const params = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      search: filters?.search,
      category: filters?.category,
      level: filters?.level,
      tags: filters?.tags,
      isActive: filters?.isActive,
      isFeatured: filters?.isFeatured,
      sort: filters?.sort ?? 'recent',
      order: filters?.order ?? 'DESC',
    };

    const response = await apiClient.get('/videos', { params });
    return response.data;
  },

  /**
   * Get a single video by ID
   */
  async getVideo(videoId: string): Promise<Video> {
    const response = await apiClient.get(`/videos/${videoId}`);
    return response.data;
  },

  /**
   * Update a video
   */
  async updateVideo(videoId: string, data: UpdateVideoDto): Promise<Video> {
    const response = await apiClient.patch(`/videos/${videoId}`, data);
    return response.data;
  },

  /**
   * Delete a video
   */
  async deleteVideo(videoId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return response.data;
  },

  /**
   * Increment video view count
   */
  async trackView(videoId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/videos/${videoId}/view`);
    return response.data;
  },

  /**
   * Toggle like on a video
   */
  async toggleLike(videoId: string): Promise<Video> {
    const response = await apiClient.post(`/videos/${videoId}/like`);
    return response.data;
  },

  /**
   * Get popular videos
   */
  async getPopularVideos(limit: number = 10): Promise<Video[]> {
    const response = await apiClient.get('/videos/popular', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get recent videos
   */
  async getRecentVideos(limit: number = 10): Promise<Video[]> {
    const response = await apiClient.get('/videos/recent', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get recommended videos for a user
   */
  async getRecommendedVideos(): Promise<Video[]> {
    const response = await apiClient.get('/videos/recommended');
    return response.data;
  },
};