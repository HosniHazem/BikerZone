<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row justify="center" align="center">
          <v-col cols="12" class="text-center">
            <v-icon icon="mdi-alert-circle-outline" size="120" color="grey"></v-icon>
            <h1 class="text-h2 mb-4">404</h1>
            <p class="text-h5 text-grey mb-6">Page Not Found</p>
            <v-btn to="/" color="primary" size="large">
              Go Home
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>
