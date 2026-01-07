import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/services/api/auth.api';
import router from '@/router';
import type { User, LoginCredentials, RegisterData } from '@/types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const bikeType = computed(() => user.value?.bike_type || null);

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true;
      error.value = null;

      const response = await authApi.login(credentials);

      // Store tokens
      token.value = response.accessToken;
      refreshToken.value = response.refreshToken;
      user.value = response.user;

      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);

      router.push('/');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData) {
    try {
      loading.value = true;
      error.value = null;

      await authApi.register(data);

      router.push('/login?registered=true');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state
      user.value = null;
      token.value = null;
      refreshToken.value = null;

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      router.push('/login');
    }
  }

  async function fetchCurrentUser() {
    try {
      const userData = await authApi.getCurrentUser();
      user.value = userData;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      await logout();
    }
  }

  async function refreshAccessToken() {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshToken.value);

      token.value = response.accessToken;

      localStorage.setItem('access_token', response.accessToken);

      return response.accessToken;
    } catch (err) {
      await logout();
      throw err;
    }
  }

  async function updateProfile() {
    try {
      loading.value = true;
      // API call to update profile
      // const updatedUser = await userApi.updateProfile(updates);
      // user.value = { ...user.value, ...updatedUser };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Update failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    bikeType,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshAccessToken,
    updateProfile,
  };
});
