<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>
        <v-icon icon="mdi-motorbike" size="large" class="mr-2"></v-icon>
        BikerZone
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">Dashboard</h1>
            <p class="text-h6 text-grey mb-8">
              Welcome back, {{ authStore.user?.username }}!
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="card in dashboardCards" :key="card.title" cols="12" md="4">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon :icon="card.icon" size="large" color="primary" class="mr-2"></v-icon>
                {{ card.title }}
              </v-card-title>
              <v-card-text>
                <p class="text-h4 font-weight-bold">{{ card.value }}</p>
                <p class="text-grey">{{ card.description }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" color="primary">View Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title>Recent Activity</v-card-title>
              <v-card-text>
                <v-alert type="info" variant="tonal">
                  Your activity feed will appear here
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const dashboardCards = [
  {
    icon: 'mdi-post',
    title: 'Posts',
    value: '0',
    description: 'Your social posts'
  },
  {
    icon: 'mdi-calendar-check',
    title: 'Bookings',
    value: '0',
    description: 'Garage appointments'
  },
  {
    icon: 'mdi-alert',
    title: 'Alerts',
    value: '0',
    description: 'Traffic alerts sent'
  }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
