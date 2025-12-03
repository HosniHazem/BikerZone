import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usersApi } from '@/services/api/users.api';
import type { UserProfile, UpdateUserDto } from '@/types/user.types';

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<UserProfile[]>([]);
  const currentUserProfile = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const usersCount = computed(() => users.value.length);

  // Actions
  async function getUsers() {
    try {
      loading.value = true;
      error.value = null;

      const data = await usersApi.getUsers();
      users.value = data;

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getUser(userId: string) {
    try {
      loading.value = true;
      error.value = null;

      const user = await usersApi.getUser(userId);
      currentUserProfile.value = user;

      return user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(userId: string, data: UpdateUserDto) {
    try {
      loading.value = true;
      error.value = null;

      const updatedUser = await usersApi.updateUser(userId, data);

      // Update in users list
      const index = users.value.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }

      // Update current user profile
      if (currentUserProfile.value?.id === userId) {
        currentUserProfile.value = updatedUser;
      }

      return updatedUser;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(userId: string) {
    try {
      loading.value = true;
      error.value = null;

      await usersApi.deleteUser(userId);

      // Remove from users list
      users.value = users.value.filter((u) => u.id !== userId);

      // Clear current user profile if deleted
      if (currentUserProfile.value?.id === userId) {
        currentUserProfile.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function resetUsers() {
    users.value = [];
    currentUserProfile.value = null;
  }

  return {
    // State
    users,
    currentUserProfile,
    loading,
    error,
    // Getters
    usersCount,
    // Actions
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    clearError,
    resetUsers,
  };
});
