import apiClient from '../api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await apiClient.post('/auth/register', data);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
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
