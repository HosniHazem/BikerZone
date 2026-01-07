export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Booking {
  id: string;
  userId: string;
  garageId: string;
  title: string;
  description?: string;
  service?: string;
  bikeModel?: string;
  bikePlate?: string;
  startDate: Date;
  endDate?: Date;
  status: BookingStatus;
  price?: number;
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingDto {
  garageId: string;
  title: string;
  description?: string;
  service?: string;
  bikeModel?: string;
  bikePlate?: string;
  startDate: Date;
  endDate?: Date;
  price?: number;
  notes?: string;
}

export interface UpdateBookingDto {
  title?: string;
  description?: string;
  service?: string;
  bikeModel?: string;
  bikePlate?: string;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus;
  price?: number;
  notes?: string;
  cancellationReason?: string;
}

export interface FilterBookingDto {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  garageId?: string;
  userId?: string;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CancelBookingDto {
  reason?: string;
}