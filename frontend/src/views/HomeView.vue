<template>
  <v-app>

    <v-main>
      <v-container>
        <v-row justify="center" align="center" style="min-height: 70vh;">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 mb-4">Welcome to BikerZone</h1>
            <p class="text-h5 text-grey mb-6">
              The ultimate motorcycle community platform
            </p>
            <template v-if="isAuthenticated">
              <v-btn
                to="/posts"
                color="primary"
                size="x-large"
                class="mr-4"
              >
                Go to Feed
              </v-btn>
              <v-btn
                to="/profile"
                variant="outlined"
                size="x-large"
              >
                View Profile
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                to="/register"
                color="primary"
                size="x-large"
                class="mr-4"
              >
                Get Started
              </v-btn>
              <v-btn
                to="/login"
                variant="outlined"
                size="x-large"
              >
                Sign In
              </v-btn>
            </template>
          </v-col>
        </v-row>

        <v-row class="mt-12">
          <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
            <v-card elevation="2" class="pa-4 text-center">
              <v-icon :icon="feature.icon" size="64" color="primary" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">{{ feature.title }}</h3>
              <p class="text-body-1">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer color="grey-darken-3" class="text-center mt-12">
      <v-col cols="12">
        <p class="text-white">© 2024 BikerZone. All rights reserved.</p>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const features = [
  {
    icon: 'mdi-account-group',
    title: 'Community',
    description: 'Connect with fellow motorcycle enthusiasts and share your passion'
  },
  {
    icon: 'mdi-wrench',
    title: 'Garage Services',
    description: 'Find and book trusted garages for maintenance and repairs'
  },
  {
    icon: 'mdi-alert-circle',
    title: 'Real-time Alerts',
    description: 'Stay informed about traffic conditions and police presence'
  }
]
</script>

<style scoped>
.v-card {
  transition: transform 0.3s;
}

.v-card:hover {
  transform: translateY(-8px);
}
</style>
