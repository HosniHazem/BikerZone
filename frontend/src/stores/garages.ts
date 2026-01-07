import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Garage,
  Review,
  FilterGarageDto,
  NearbyGaragesDto,
  GaragesResponse,
  ReviewsResponse,
} from '@/types/garage.types';
import { garagesApi } from '@/services/api/garages.api';

export const useGaragesStore = defineStore('garages', () => {
  // State
  const garages = ref<Garage[]>([]);
  const currentGarage = ref<Garage | null>(null);
  const garageReviews = ref<Review[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);

  // Computed
  const hasMoreGarages = computed(() => page.value < totalPages.value);
  const garagesCount = computed(() => total.value);

  // Actions
  const clearError = () => {
    error.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const getGarages = async (filters?: FilterGarageDto) => {
    try {
      setLoading(true);
      clearError();

      const response: GaragesResponse = await garagesApi.getGarages(filters);

      garages.value = response.garages;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load garages';
      console.error('Failed to load garages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGarage = async (garageId: string) => {
    try {
      setLoading(true);
      clearError();

      const garage = await garagesApi.getGarage(garageId);
      currentGarage.value = garage;
      return garage;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load garage';
      console.error('Failed to load garage:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createGarage = async (data: any) => {
    try {
      setLoading(true);
      clearError();

      const garage = await garagesApi.createGarage(data);
      garages.value.unshift(garage);
      return garage;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create garage';
      console.error('Failed to create garage:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGarage = async (garageId: string, data: any) => {
    try {
      setLoading(true);
      clearError();

      const updatedGarage = await garagesApi.updateGarage(garageId, data);

      // Update in list
      const index = garages.value.findIndex(g => g.id === garageId);
      if (index !== -1) {
        garages.value[index] = updatedGarage;
      }

      // Update current garage if it's the same
      if (currentGarage.value?.id === garageId) {
        currentGarage.value = updatedGarage;
      }

      return updatedGarage;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update garage';
      console.error('Failed to update garage:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGarage = async (garageId: string) => {
    try {
      setLoading(true);
      clearError();

      await garagesApi.deleteGarage(garageId);

      // Remove from list
      garages.value = garages.value.filter(g => g.id !== garageId);

      // Clear current garage if it's the deleted one
      if (currentGarage.value?.id === garageId) {
        currentGarage.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete garage';
      console.error('Failed to delete garage:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNearbyGarages = async (data: NearbyGaragesDto) => {
    try {
      setLoading(true);
      clearError();

      const response: GaragesResponse = await garagesApi.getNearbyGarages(data);

      garages.value = response.garages;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load nearby garages';
      console.error('Failed to load nearby garages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOwnerGarages = async (ownerId: string, pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: GaragesResponse = await garagesApi.getOwnerGarages(ownerId, pageNum, pageLimit);

      garages.value = response.garages;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load owner garages';
      console.error('Failed to load owner garages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGarageReviews = async (garageId: string, pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: ReviewsResponse = await garagesApi.getGarageReviews(garageId, pageNum, pageLimit);
      garageReviews.value = response.reviews;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load garage reviews';
      console.error('Failed to load garage reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (garageId: string, data: any) => {
    try {
      setLoading(true);
      clearError();

      const review = await garagesApi.createReview(garageId, data);
      garageReviews.value.unshift(review);
      return review;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create review';
      console.error('Failed to create review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    garages,
    currentGarage,
    garageReviews,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,

    // Computed
    hasMoreGarages,
    garagesCount,

    // Actions
    clearError,
    getGarages,
    getGarage,
    createGarage,
    updateGarage,
    deleteGarage,
    getNearbyGarages,
    getOwnerGarages,
    getGarageReviews,
    createReview,
  };
});