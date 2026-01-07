<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="$router.back()"></v-app-bar-nav-icon>
      <v-app-bar-title>Profile</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card elevation="2">
              <v-card-text class="text-center pa-8">
                <v-avatar size="120" color="primary" class="mb-4">
                  <v-icon size="80">mdi-account</v-icon>
                </v-avatar>
                <h2 class="text-h4 mb-2">{{ authStore.user?.name }}</h2>
                <p class="text-h6 text-grey mb-4">{{ authStore.user?.email }}</p>
                <v-chip color="primary" class="mb-4">{{ authStore.user?.email }}</v-chip>
              </v-card-text>
              
              <v-divider></v-divider>
              
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Member Since</v-list-item-title>
                    <v-list-item-subtitle>{{ memberSince }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Account Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip color="success" size="small">Active</v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
              
              <v-card-actions class="justify-center pa-4">
                <v-btn color="primary" variant="outlined">Edit Profile</v-btn>
                <v-btn color="error" variant="outlined" @click="handleLogout">Logout</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const memberSince = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
