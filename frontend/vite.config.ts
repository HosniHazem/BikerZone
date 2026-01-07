import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    host: true,
  },
  optimizeDeps: {
    // Exclude libraries that can be problematic with esbuild pre-bundling in Docker
    exclude: [
      'vuetify',
      'video.js',
      'leaflet',
      'firebase',
      '@capacitor/core',
      '@capacitor/app',
      '@capacitor/camera',
      '@capacitor/geolocation',
      '@capacitor/push-notifications',
      'socket.io-client',
      '@mdi/font'
    ],
    // Force regeneration of optimized deps on server start
    force: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    commonjsOptions: {
      // Helps when dependencies mix CJS and ESM modules
      transformMixedEsModules: true,
    },
  }
})
