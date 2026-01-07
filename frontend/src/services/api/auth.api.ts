import apiClient from '../api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { access_token, refresh_token, user } = response.data;
    return { accessToken: access_token, refreshToken: refresh_token, user } as AuthResponse;
  },

  async register(data: RegisterData): Promise<void> {
    await apiClient.post('/auth/register', data);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const { access_token, refresh_token } = response.data;
    // Returning only tokens; user will remain as current store user
    return { accessToken: access_token, refreshToken: refresh_token, user: undefined as any } as AuthResponse;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/request-password-reset', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  },
};
