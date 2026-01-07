import apiClient from '../api';
import type { UserProfile, CreateUserDto, UpdateUserDto } from '@/types/user.types';

export const usersApi = {
  /**
   * Create a new user
   */
  async createUser(data: CreateUserDto): Promise<UserProfile> {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  /**
   * Get all users
   */
  async getUsers(): Promise<UserProfile[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<UserProfile> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update a user
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<UserProfile> {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },
};
