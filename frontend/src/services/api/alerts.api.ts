import apiClient from '../api';
import type {
  Alert,
  CreateAlertDto,
  UpdateAlertDto,
  FilterAlertDto,
  NearbyAlertsDto,
  AlertsResponse,
} from '@/types/alert.types';

export const alertsApi = {
  /**
   * Create a new alert
   */
  async createAlert(data: CreateAlertDto): Promise<Alert> {
    const response = await apiClient.post('/alerts', data);
    return response.data;
  },

  /**
   * Get all alerts with filtering and pagination
   */
  async getAlerts(filters?: FilterAlertDto): Promise<AlertsResponse> {
    const params = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      type: filters?.type,
      severity: filters?.severity,
      isActive: filters?.isActive,
      isVerified: filters?.isVerified,
    };

    const response = await apiClient.get('/alerts', { params });
    return response.data;
  },

  /**
   * Get a single alert by ID
   */
  async getAlert(alertId: string): Promise<Alert> {
    const response = await apiClient.get(`/alerts/${alertId}`);
    return response.data;
  },

  /**
   * Update an alert
   */
  async updateAlert(alertId: string, data: UpdateAlertDto): Promise<Alert> {
    const response = await apiClient.patch(`/alerts/${alertId}`, data);
    return response.data;
  },

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/alerts/${alertId}`);
    return response.data;
  },

  /**
   * Find nearby alerts
   */
  async getNearbyAlerts(data: NearbyAlertsDto): Promise<AlertsResponse> {
    const response = await apiClient.get('/alerts/nearby', {
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
   * Upvote an alert
   */
  async upvoteAlert(alertId: string): Promise<Alert> {
    const response = await apiClient.post(`/alerts/${alertId}/upvote`);
    return response.data;
  },

  /**
   * Downvote an alert
   */
  async downvoteAlert(alertId: string): Promise<Alert> {
    const response = await apiClient.post(`/alerts/${alertId}/downvote`);
    return response.data;
  },

  /**
   * Get active alerts
   */
  async getActiveAlerts(page: number = 1, limit: number = 10): Promise<AlertsResponse> {
    const response = await apiClient.get('/alerts/active', {
      params: { page, limit },
    });
    return response.data;
  },
};