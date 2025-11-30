export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin' | 'garage_owner';
  bike_type?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  phone?: string;
  bike_type?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
