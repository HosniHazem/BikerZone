export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bike_type?: string;
  bike_model?: string;
  bike_year?: number;
  bike_mileage?: number;
  role?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bikeType?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
