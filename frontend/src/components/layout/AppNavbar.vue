<template>
  <v-app-bar color="primary" elevation="2" prominent>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
    
    <v-app-bar-title>
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <div class="d-flex align-center">
          <v-icon icon="mdi-motorbike" size="large" class="mr-2"></v-icon>
          <span class="text-h5 font-weight-bold">BikerZone</span>
        </div>
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex align-center">
      <v-btn to="/" variant="text" class="mx-1">
        <v-icon icon="mdi-home" class="mr-1"></v-icon>
        Home
      </v-btn>
      <v-btn to="/posts" variant="text" class="mx-1">
        <v-icon icon="mdi-post" class="mr-1"></v-icon>
        Posts
      </v-btn>
      <v-btn to="/garages" variant="text" class="mx-1">
        <v-icon icon="mdi-wrench" class="mr-1"></v-icon>
        Garages
      </v-btn>
      <v-btn to="/alerts" variant="text" class="mx-1">
        <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
        Alerts
      </v-btn>
      <v-btn to="/videos" variant="text" class="mx-1">
        <v-icon icon="mdi-video" class="mr-1"></v-icon>
        Videos
      </v-btn>
      <v-btn to="/bookings" variant="text" class="mx-1">
        <v-icon icon="mdi-calendar-check" class="mr-1"></v-icon>
        Bookings
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon icon="mdi-account"></v-icon>
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <template v-slot:prepend>
              <v-icon icon="mdi-cog"></v-icon>
            </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout"></v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item to="/" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-home"></v-icon>
        </template>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/posts" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-post"></v-icon>
        </template>
        <v-list-item-title>Posts</v-list-item-title>
      </v-list-item>
      <v-list-item to="/garages" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-wrench"></v-icon>
        </template>
        <v-list-item-title>Garages</v-list-item-title>
      </v-list-item>
      <v-list-item to="/alerts" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-alert-circle"></v-icon>
        </template>
        <v-list-item-title>Alerts</v-list-item-title>
      </v-list-item>
      <v-list-item to="/videos" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-video"></v-icon>
        </template>
        <v-list-item-title>Videos</v-list-item-title>
      </v-list-item>
      <v-list-item to="/bookings" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-check"></v-icon>
        </template>
        <v-list-item-title>Bookings</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item to="/profile" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-account"></v-icon>
        </template>
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item to="/settings" @click="drawer = false">
        <template v-slot:prepend>
          <v-icon icon="mdi-cog"></v-icon>
        </template>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleLogout">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"></v-icon>
        </template>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const drawer = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  drawer.value = false;
};
</script>
