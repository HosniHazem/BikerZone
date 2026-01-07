<template>
  <div>
    <!-- Error Alert -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
    >
      {{ error }}
    </v-alert>

    <!-- Loading -->
    <div v-if="loading && videos.length === 0" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">Loading videos...</p>
    </div>

    <!-- Videos Grid -->
    <v-row v-else>
      <v-col
        v-for="video in videos"
        :key="video.id"
        cols="12"
        md="6"
        lg="4"
        xl="3"
      >
        <v-card elevation="2" class="h-100" @click="playVideo(video.id)">
          <v-img
            :src="video.thumbnail"
            height="200"
            cover
            class="cursor-pointer"
          >
            <v-overlay
              contained
              class="d-flex align-center justify-center"
              opacity="0.8"
            >
              <v-icon size="48" color="white">mdi-play-circle</v-icon>
            </v-overlay>
          </v-img>

          <v-card-title class="pb-2">
            <div class="text-truncate">{{ video.title }}</div>
          </v-card-title>

          <v-card-text class="pt-0">
            <p class="text-body-2 text-grey text-truncate mb-2">
              {{ video.description }}
            </p>

            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center">
                <v-icon small color="primary" class="mr-1">mdi-eye</v-icon>
                <span class="text-caption">{{ formatViews(video.views) }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon small color="error" class="mr-1">mdi-heart</v-icon>
                <span class="text-caption">{{ video.likesCount }}</span>
              </div>
            </div>

            <div class="d-flex align-center justify-space-between">
              <v-chip
                :color="getCategoryColor(video.category)"
                size="small"
                variant="outlined"
              >
                {{ video.category }}
              </v-chip>
              <v-chip
                :color="getLevelColor(video.level)"
                size="small"
                variant="flat"
              >
                {{ video.level }}
              </v-chip>
            </div>

            <div v-if="video.tags && video.tags.length > 0" class="mt-2">
              <v-chip
                v-for="tag in video.tags.slice(0, 2)"
                :key="tag"
                size="x-small"
                variant="outlined"
                class="mr-1"
              >
                {{ tag }}
              </v-chip>
              <v-chip
                v-if="video.tags.length > 2"
                size="x-small"
                variant="outlined"
              >
                +{{ video.tags.length - 2 }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn
              icon
              size="small"
              color="error"
              @click.stop="toggleLike(video.id)"
              :loading="likeLoading[video.id]"
            >
              <v-icon :color="video.likes?.includes(userId) ? 'error' : 'grey'">
                {{ video.likes?.includes(userId) ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-caption text-grey">
              {{ formatDuration(video.duration) }}
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Load More -->
    <v-row v-if="hasMore" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          size="large"
          @click="$emit('loadMore')"
          :loading="loading"
        >
          Load More
        </v-btn>
      </v-col>
    </v-row>

    <!-- Refresh Button -->
    <v-row v-if="videos.length > 0" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn
          variant="outlined"
          @click="$emit('refresh')"
          :loading="loading"
        >
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-if="!loading && videos.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey">mdi-video-off</v-icon>
      <p class="text-h6 mt-4">No videos found</p>
      <p class="text-grey">Try adjusting your filters or check back later</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVideosStore } from '@/stores/videos'
import type { Video } from '@/types/video.types'

interface Props {
  videos: Video[]
  loading: boolean
  error: string | null
  hasMore: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  loadMore: []
  refresh: []
}>()

const authStore = useAuthStore()
const videosStore = useVideosStore()

const userId = computed(() => authStore.user?.id || '')
const likeLoading = ref<Record<string, boolean>>({})

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    sport: 'error',
    cruiser: 'warning',
    touring: 'info',
    adventure: 'success',
    standard: 'primary',
    custom: 'secondary'
  }
  return colors[category] || 'primary'
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  }
  return colors[level] || 'primary'
}

const playVideo = async (videoId: string) => {
  // Track view
  await videosStore.trackView(videoId)
  // Navigate to video player or open modal
  // For now, just log
  console.log('Playing video:', videoId)
}

const toggleLike = async (videoId: string) => {
  likeLoading.value[videoId] = true
  try {
    await videosStore.toggleLike(videoId)
  } catch (error) {
    // Error handled in store
  } finally {
    likeLoading.value[videoId] = false
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>