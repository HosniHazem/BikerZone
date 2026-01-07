export enum AlertType {
  POLICE = 'police',
  TRAFFIC = 'traffic',
  ACCIDENT = 'accident',
  ROADWORK = 'roadwork',
  WEATHER = 'weather',
  OTHER = 'other',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity: AlertSeverity;
  userId: string;
  validUntil: Date;
  upvotes: string[];
  upvotesCount: number;
  downvotes: string[];
  downvotesCount: number;
  isActive: boolean;
  isVerified: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAlertDto {
  type: AlertType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity?: AlertSeverity;
  validUntil: Date;
  imageUrl?: string;
}

export interface UpdateAlertDto {
  type?: AlertType;
  title?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity?: AlertSeverity;
  validUntil?: Date;
  isActive?: boolean;
  isVerified?: boolean;
  imageUrl?: string;
}

export interface FilterAlertDto {
  page?: number;
  limit?: number;
  type?: AlertType;
  severity?: AlertSeverity;
  isActive?: boolean;
  isVerified?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface NearbyAlertsDto {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VoteAlertDto {
  vote: boolean; // true for upvote, false for downvote
}