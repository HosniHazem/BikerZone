<template>
  <v-bottom-navigation v-model="activeTab" color="primary" grow>
    <v-btn value="home" to="/">
      <v-icon>mdi-home</v-icon>
      <span>Home</span>
    </v-btn>

    <v-btn value="posts" to="/posts">
      <v-icon>mdi-post</v-icon>
      <span>Posts</span>
    </v-btn>

    <v-btn value="garages" to="/garages">
      <v-icon>mdi-wrench</v-icon>
      <span>Garages</span>
    </v-btn>

    <v-btn value="alerts" to="/alerts">
      <v-icon>mdi-alert-circle</v-icon>
      <span>Alerts</span>
    </v-btn>

    <v-btn value="profile" to="/profile">
      <v-icon>mdi-account</v-icon>
      <span>Profile</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = ref('home');

watch(() => route.path, (path) => {
  if (path === '/') activeTab.value = 'home';
  else if (path.startsWith('/posts')) activeTab.value = 'posts';
  else if (path.startsWith('/garages')) activeTab.value = 'garages';
  else if (path.startsWith('/alerts')) activeTab.value = 'alerts';
  else if (path.startsWith('/profile')) activeTab.value = 'profile';
}, { immediate: true });
</script>
