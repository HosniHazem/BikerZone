export interface UserProfile {
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

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  avatar_url?: string;
  bike_type?: string;
  bike_model?: string;
  bike_year?: number;
  bike_mileage?: number;
}
