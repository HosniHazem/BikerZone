import apiClient from '../api';
import type {
  Garage,
  Review,
  CreateGarageDto,
  UpdateGarageDto,
  FilterGarageDto,
  NearbyGaragesDto,
  GaragesResponse,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewsResponse,
} from '@/types/garage.types';

export const garagesApi = {
  /**
   * Create a new garage
   */
  async createGarage(data: CreateGarageDto): Promise<Garage> {
    const response = await apiClient.post('/garages', data);
    return response.data;
  },

  /**
   * Get all garages with filtering and pagination
   */
  async getGarages(filters?: FilterGarageDto): Promise<GaragesResponse> {
    const params = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      search: filters?.search,
      services: filters?.services,
      status: filters?.status,
      isVerified: filters?.isVerified,
    };

    const response = await apiClient.get('/garages', { params });
    return response.data;
  },

  /**
   * Get a single garage by ID
   */
  async getGarage(garageId: string): Promise<Garage> {
    const response = await apiClient.get(`/garages/${garageId}`);
    return response.data;
  },

  /**
   * Update a garage
   */
  async updateGarage(garageId: string, data: UpdateGarageDto): Promise<Garage> {
    const response = await apiClient.patch(`/garages/${garageId}`, data);
    return response.data;
  },

  /**
   * Delete a garage
   */
  async deleteGarage(garageId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/garages/${garageId}`);
    return response.data;
  },

  /**
   * Find nearby garages
   */
  async getNearbyGarages(data: NearbyGaragesDto): Promise<GaragesResponse> {
    const response = await apiClient.get('/garages/nearby', {
      params: {
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius ?? 10,
        limit: data.limit ?? 20,
      },
    });
    return response.data;
  },

  /**
   * Get garages owned by a specific user
   */
  async getOwnerGarages(ownerId: string, page: number = 1, limit: number = 10): Promise<GaragesResponse> {
    const response = await apiClient.get(`/garages/owner/${ownerId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Create a review for a garage
   */
  async createReview(garageId: string, data: CreateReviewDto): Promise<Review> {
    const response = await apiClient.post(`/garages/${garageId}/reviews`, data);
    return response.data;
  },

  /**
   * Get reviews for a garage
   */
  async getGarageReviews(
    garageId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    const response = await apiClient.get(`/garages/${garageId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a single review
   */
  async getReview(reviewId: string): Promise<Review> {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Update a review
   */
  async updateReview(reviewId: string, data: UpdateReviewDto): Promise<Review> {
    const response = await apiClient.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};