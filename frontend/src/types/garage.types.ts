export enum GarageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface Garage {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  services?: string[];
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
  status: GarageStatus;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  garageId: string;
  title: string;
  content: string;
  rating: number;
  images?: string[];
  isActive: boolean;
  ownerResponse?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGarageDto {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  services?: string[];
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
}

export interface UpdateGarageDto {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  services?: string[];
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
  status?: GarageStatus;
}

export interface FilterGarageDto {
  page?: number;
  limit?: number;
  search?: string;
  services?: string[];
  status?: GarageStatus;
  isVerified?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface NearbyGaragesDto {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}

export interface GaragesResponse {
  garages: Garage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateReviewDto {
  title: string;
  content: string;
  rating: number;
  images?: string[];
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
  rating?: number;
  images?: string[];
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}