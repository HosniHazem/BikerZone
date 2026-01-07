import apiClient from '../api';
import type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  FilterBookingDto,
  BookingsResponse,
  CancelBookingDto,
} from '@/types/booking.types';

export const bookingsApi = {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  /**
   * Get all bookings with filtering and pagination
   */
  async getBookings(filters?: FilterBookingDto): Promise<BookingsResponse> {
    const params = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      status: filters?.status,
      startDate: filters?.startDate?.toISOString(),
      endDate: filters?.endDate?.toISOString(),
      garageId: filters?.garageId,
      userId: filters?.userId,
    };

    const response = await apiClient.get('/bookings', { params });
    return response.data;
  },

  /**
   * Get a single booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Update a booking
   */
  async updateBooking(bookingId: string, data: UpdateBookingDto): Promise<Booking> {
    const response = await apiClient.patch(`/bookings/${bookingId}`, data);
    return response.data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, data?: CancelBookingDto): Promise<Booking> {
    const response = await apiClient.delete(`/bookings/${bookingId}`, {
      data,
    });
    return response.data;
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BookingsResponse> {
    const response = await apiClient.get(`/bookings/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get garage's bookings
   */
  async getGarageBookings(
    garageId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BookingsResponse> {
    const response = await apiClient.get(`/bookings/garage/${garageId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(page: number = 1, limit: number = 10): Promise<BookingsResponse> {
    const response = await apiClient.get('/bookings/upcoming', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get past bookings
   */
  async getPastBookings(page: number = 1, limit: number = 10): Promise<BookingsResponse> {
    const response = await apiClient.get('/bookings/past', {
      params: { page, limit },
    });
    return response.data;
  },
};