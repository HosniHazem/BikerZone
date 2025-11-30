<template>
  <v-app>
    <AppNavbar v-if="isAuthenticated" />
    
    <v-main>
      <router-view />
    </v-main>

    <BottomNavigation v-if="isAuthenticated && isMobile" />

    <!-- Global Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import AppNavbar from '@/components/layout/AppNavbar.vue';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isMobile = computed(() => window.innerWidth < 960);
const snackbar = computed(() => notificationStore.snackbar);

onMounted(async () => {
  // Check if user is logged in
  if (authStore.token) {
    await authStore.fetchCurrentUser();
  }

  // Initialize FCM for push notifications
  if (isAuthenticated.value) {
    await notificationStore.initializeFCM();
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.v-application {
  background: #f5f5f5 !important;
}
</style>
