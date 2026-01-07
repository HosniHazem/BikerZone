import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Snackbar {
  show: boolean;
  message: string;
  color: string;
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const snackbar = ref<Snackbar>({
    show: false,
    message: '',
    color: 'info',
  });

  // Actions
  function showSuccess(message: string) {
    snackbar.value = {
      show: true,
      message,
      color: 'success',
    };
  }

  function showError(message: string) {
    snackbar.value = {
      show: true,
      message,
      color: 'error',
    };
  }

  function showInfo(message: string) {
    snackbar.value = {
      show: true,
      message,
      color: 'info',
    };
  }

  function showWarning(message: string) {
    snackbar.value = {
      show: true,
      message,
      color: 'warning',
    };
  }

  async function initializeFCM() {
    // FCM initialization would go here
    // For now, just a placeholder
    console.log('FCM initialization placeholder');
  }

  return {
    snackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    initializeFCM,
  };
});
