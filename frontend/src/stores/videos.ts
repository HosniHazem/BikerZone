import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Video,
  FilterVideoDto,
  VideosResponse,
} from '@/types/video.types';
import { videosApi } from '@/services/api/videos.api';

export const useVideosStore = defineStore('videos', () => {
  // State
  const videos = ref<Video[]>([]);
  const currentVideo = ref<Video | null>(null);
  const popularVideos = ref<Video[]>([]);
  const recentVideos = ref<Video[]>([]);
  const recommendedVideos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);

  // Computed
  const hasMoreVideos = computed(() => page.value < totalPages.value);
  const videosCount = computed(() => total.value);

  // Actions
  const clearError = () => {
    error.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const getVideos = async (filters?: FilterVideoDto) => {
    try {
      setLoading(true);
      clearError();

      const response: VideosResponse = await videosApi.getVideos(filters);

      videos.value = response.videos;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load videos';
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVideo = async (videoId: string) => {
    try {
      setLoading(true);
      clearError();

      const video = await videosApi.getVideo(videoId);
      currentVideo.value = video;
      return video;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load video';
      console.error('Failed to load video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (data: any) => {
    try {
      setLoading(true);
      clearError();

      const video = await videosApi.createVideo(data);
      videos.value.unshift(video);
      return video;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create video';
      console.error('Failed to create video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (videoId: string, data: any) => {
    try {
      setLoading(true);
      clearError();

      const updatedVideo = await videosApi.updateVideo(videoId, data);

      // Update in list
      const index = videos.value.findIndex(v => v.id === videoId);
      if (index !== -1) {
        videos.value[index] = updatedVideo;
      }

      // Update current video if it's the same
      if (currentVideo.value?.id === videoId) {
        currentVideo.value = updatedVideo;
      }

      return updatedVideo;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update video';
      console.error('Failed to update video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      setLoading(true);
      clearError();

      await videosApi.deleteVideo(videoId);

      // Remove from list
      videos.value = videos.value.filter(v => v.id !== videoId);

      // Clear current video if it's the deleted one
      if (currentVideo.value?.id === videoId) {
        currentVideo.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete video';
      console.error('Failed to delete video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (videoId: string) => {
    try {
      await videosApi.trackView(videoId);

      // Update view count locally
      const video = videos.value.find(v => v.id === videoId);
      if (video) {
        video.views += 1;
      }

      if (currentVideo.value?.id === videoId) {
        currentVideo.value.views += 1;
      }
    } catch (err: any) {
      console.error('Failed to track view:', err);
      // Don't show error for view tracking
    }
  };

  const toggleLike = async (videoId: string) => {
    try {
      clearError();

      const updatedVideo = await videosApi.toggleLike(videoId);

      // Update in list
      const index = videos.value.findIndex(v => v.id === videoId);
      if (index !== -1) {
        videos.value[index] = updatedVideo;
      }

      // Update current video if it's the same
      if (currentVideo.value?.id === videoId) {
        currentVideo.value = updatedVideo;
      }

      return updatedVideo;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle like';
      console.error('Failed to toggle like:', err);
      throw err;
    }
  };

  const getPopularVideos = async (limitNum: number = 10) => {
    try {
      const videos = await videosApi.getPopularVideos(limitNum);
      popularVideos.value = videos;
    } catch (err: any) {
      console.error('Failed to load popular videos:', err);
    }
  };

  const getRecentVideos = async (limitNum: number = 10) => {
    try {
      const videos = await videosApi.getRecentVideos(limitNum);
      recentVideos.value = videos;
    } catch (err: any) {
      console.error('Failed to load recent videos:', err);
    }
  };

  const getRecommendedVideos = async () => {
    try {
      const videos = await videosApi.getRecommendedVideos();
      recommendedVideos.value = videos;
    } catch (err: any) {
      console.error('Failed to load recommended videos:', err);
    }
  };

  return {
    // State
    videos,
    currentVideo,
    popularVideos,
    recentVideos,
    recommendedVideos,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,

    // Computed
    hasMoreVideos,
    videosCount,

    // Actions
    clearError,
    getVideos,
    getVideo,
    createVideo,
    updateVideo,
    deleteVideo,
    trackView,
    toggleLike,
    getPopularVideos,
    getRecentVideos,
    getRecommendedVideos,
  };
});