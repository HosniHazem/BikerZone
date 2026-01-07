import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Booking,
  FilterBookingDto,
  BookingsResponse,
} from '@/types/booking.types';
import { bookingsApi } from '@/services/api/bookings.api';

export const useBookingsStore = defineStore('bookings', () => {
  // State
  const bookings = ref<Booking[]>([]);
  const currentBooking = ref<Booking | null>(null);
  const upcomingBookings = ref<Booking[]>([]);
  const pastBookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);

  // Computed
  const hasMoreBookings = computed(() => page.value < totalPages.value);
  const bookingsCount = computed(() => total.value);

  // Actions
  const clearError = () => {
    error.value = null;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const getBookings = async (filters?: FilterBookingDto) => {
    try {
      setLoading(true);
      clearError();

      const response: BookingsResponse = await bookingsApi.getBookings(filters);

      bookings.value = response.bookings;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load bookings';
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      clearError();

      const booking = await bookingsApi.getBooking(bookingId);
      currentBooking.value = booking;
      return booking;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load booking';
      console.error('Failed to load booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (data: any) => {
    try {
      setLoading(true);
      clearError();

      const booking = await bookingsApi.createBooking(data);
      bookings.value.unshift(booking);
      return booking;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create booking';
      console.error('Failed to create booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId: string, data: any) => {
    try {
      setLoading(true);
      clearError();

      const updatedBooking = await bookingsApi.updateBooking(bookingId, data);

      // Update in list
      const index = bookings.value.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings.value[index] = updatedBooking;
      }

      // Update current booking if it's the same
      if (currentBooking.value?.id === bookingId) {
        currentBooking.value = updatedBooking;
      }

      return updatedBooking;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update booking';
      console.error('Failed to update booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      setLoading(true);
      clearError();

      const cancelledBooking = await bookingsApi.cancelBooking(bookingId, reason ? { reason } : undefined);

      // Update in list
      const index = bookings.value.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings.value[index] = cancelledBooking;
      }

      // Update current booking if it's the same
      if (currentBooking.value?.id === bookingId) {
        currentBooking.value = cancelledBooking;
      }

      return cancelledBooking;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel booking';
      console.error('Failed to cancel booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = async (userId: string, pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: BookingsResponse = await bookingsApi.getUserBookings(userId, pageNum, pageLimit);

      bookings.value = response.bookings;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load user bookings';
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGarageBookings = async (garageId: string, pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: BookingsResponse = await bookingsApi.getGarageBookings(garageId, pageNum, pageLimit);

      bookings.value = response.bookings;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load garage bookings';
      console.error('Failed to load garage bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingBookings = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: BookingsResponse = await bookingsApi.getUpcomingBookings(pageNum, pageLimit);
      upcomingBookings.value = response.bookings;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load upcoming bookings';
      console.error('Failed to load upcoming bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPastBookings = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      setLoading(true);
      clearError();

      const response: BookingsResponse = await bookingsApi.getPastBookings(pageNum, pageLimit);
      pastBookings.value = response.bookings;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load past bookings';
      console.error('Failed to load past bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    bookings,
    currentBooking,
    upcomingBookings,
    pastBookings,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,

    // Computed
    hasMoreBookings,
    bookingsCount,

    // Actions
    clearError,
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    getUserBookings,
    getGarageBookings,
    getUpcomingBookings,
    getPastBookings,
  };
});