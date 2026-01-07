import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Alert,
  FilterAlertDto,
  NearbyAlertsDto,
  AlertsResponse,
} from '@/types/alert.types';
import { alertsApi } from '@/services/api/alerts.api';

export const useAlertsStore = defineStore('alerts', () => {
  // State
  const alerts = ref<Alert[]>([]);
  const currentAlert = ref<Alert | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);

  // Computed
  const hasMoreAlerts = computed(() => page.value < totalPages.value);
  const alertsCount = computed(() => total.value);

  // Actions
  const clearError = () => {
    error.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const getAlerts = async (filters?: FilterAlertDto) => {
    try {
      setLoading(true);
      clearError();

      const response: AlertsResponse = await alertsApi.getAlerts(filters);

      alerts.value = response.alerts;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load alerts';
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlert = async (alertId: string) => {
    try {
      setLoading(true);
      clearError();

      const alert = await alertsApi.getAlert(alertId);
      currentAlert.value = alert;
      return alert;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load alert';
      console.error('Failed to load alert:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (data: any) => {
    try {
      setLoading(true);
      clearError();

      const alert = await alertsApi.createAlert(data);
      alerts.value.unshift(alert);
      return alert;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create alert';
      console.error('Failed to create alert:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (alertId: string, data: any) => {
    try {
      setLoading(true);
      clearError();

      const updatedAlert = await alertsApi.updateAlert(alertId, data);

      // Update in list
      const index = alerts.value.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts.value[index] = updatedAlert;
      }

      // Update current alert if it's the same
      if (currentAlert.value?.id === alertId) {
        currentAlert.value = updatedAlert;
      }

      return updatedAlert;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update alert';
      console.error('Failed to update alert:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      setLoading(true);
      clearError();

      await alertsApi.deleteAlert(alertId);

      // Remove from list
      alerts.value = alerts.value.filter(a => a.id !== alertId);

      // Clear current alert if it's the deleted one
      if (currentAlert.value?.id === alertId) {
        currentAlert.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete alert';
      console.error('Failed to delete alert:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNearbyAlerts = async (data: NearbyAlertsDto) => {
    try {
      setLoading(true);
      clearError();

      const response: AlertsResponse = await alertsApi.getNearbyAlerts(data);

      alerts.value = response.alerts;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load nearby alerts';
      console.error('Failed to load nearby alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const upvoteAlert = async (alertId: string) => {
    try {
      clearError();

      const updatedAlert = await alertsApi.upvoteAlert(alertId);

      // Update in list
      const index = alerts.value.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts.value[index] = updatedAlert;
      }

      // Update current alert if it's the same
      if (currentAlert.value?.id === alertId) {
        currentAlert.value = updatedAlert;
      }

      return updatedAlert;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to upvote alert';
      console.error('Failed to upvote alert:', err);
      throw err;
    }
  };

  const downvoteAlert = async (alertId: string) => {
    try {
      clearError();

      const updatedAlert = await alertsApi.downvoteAlert(alertId);

      // Update in list
      const index = alerts.value.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts.value[index] = updatedAlert;
      }

      // Update current alert if it's the same
      if (currentAlert.value?.id === alertId) {
        currentAlert.value = updatedAlert;
      }

      return updatedAlert;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to downvote alert';
      console.error('Failed to downvote alert:', err);
      throw err;
    }
  };

  const getActiveAlerts = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: AlertsResponse = await alertsApi.getActiveAlerts(pageNum, pageLimit);

      alerts.value = response.alerts;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load active alerts';
      console.error('Failed to load active alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    alerts,
    currentAlert,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,

    // Computed
    hasMoreAlerts,
    alertsCount,

    // Actions
    clearError,
    getAlerts,
    getAlert,
    createAlert,
    updateAlert,
    deleteAlert,
    getNearbyAlerts,
    upvoteAlert,
    downvoteAlert,
    getActiveAlerts,
  };
});