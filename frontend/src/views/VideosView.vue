<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">Tutorial Videos</h1>
            <p class="text-h6 text-grey mb-8">
              Learn motorcycle maintenance and riding skills with our video tutorials
            </p>
          </v-col>
        </v-row>

        <!-- Upload Video Button (for authorized users) -->
        <v-row v-if="authStore.user" class="mb-4">
          <v-col cols="12">
            <v-btn
              color="primary"
              size="large"
              @click="showUploadDialog = true"
            >
              <v-icon left>mdi-video-plus</v-icon>
              Upload Video
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters and Search -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search videos"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedCategory"
              label="Category"
              variant="outlined"
              :items="categoryOptions"
              clearable
              @update:model-value="handleFilter"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedLevel"
              label="Skill Level"
              variant="outlined"
              :items="levelOptions"
              clearable
              @update:model-value="handleFilter"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Tabs for different video sections -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-tabs v-model="activeTab" color="primary">
              <v-tab value="all">All Videos</v-tab>
              <v-tab value="popular">Popular</v-tab>
              <v-tab value="recent">Recent</v-tab>
              <v-tab value="recommended">Recommended</v-tab>
            </v-tabs>

            <v-tabs-window v-model="activeTab">
              <!-- All Videos -->
              <v-tabs-window-item value="all">
                <VideoGrid
                  :videos="videosStore.videos"
                  :loading="videosStore.loading"
                  :error="videosStore.error"
                  :has-more="videosStore.hasMoreVideos"
                  @load-more="loadMoreVideos"
                  @refresh="loadVideos"
                />
              </v-tabs-window-item>

              <!-- Popular Videos -->
              <v-tabs-window-item value="popular">
                <VideoGrid
                  :videos="videosStore.popularVideos"
                  :loading="videosStore.loading"
                  :error="videosStore.error"
                  :has-more="false"
                  @refresh="loadPopularVideos"
                />
              </v-tabs-window-item>

              <!-- Recent Videos -->
              <v-tabs-window-item value="recent">
                <VideoGrid
                  :videos="videosStore.recentVideos"
                  :loading="videosStore.loading"
                  :error="videosStore.error"
                  :has-more="false"
                  @refresh="loadRecentVideos"
                />
              </v-tabs-window-item>

              <!-- Recommended Videos -->
              <v-tabs-window-item value="recommended">
                <VideoGrid
                  :videos="videosStore.recommendedVideos"
                  :loading="videosStore.loading"
                  :error="videosStore.error"
                  :has-more="false"
                  @refresh="loadRecommendedVideos"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Upload Video Dialog -->
    <v-dialog v-model="showUploadDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-video-plus</v-icon>
          Upload Video
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleUploadVideo">
            <v-text-field
              v-model="newVideo.title"
              label="Video Title"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="newVideo.description"
              label="Description"
              variant="outlined"
              :rules="[rules.required]"
              rows="3"
              class="mb-3"
            ></v-textarea>

            <v-text-field
              v-model="newVideo.url"
              label="Video URL"
              variant="outlined"
              :rules="[rules.required, rules.url]"
              hint="YouTube, Vimeo, or direct video URL"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newVideo.thumbnail"
              label="Thumbnail URL"
              variant="outlined"
              :rules="[rules.required, rules.url]"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newVideo.duration"
              label="Duration (seconds)"
              variant="outlined"
              type="number"
              :rules="[rules.required, rules.positiveNumber]"
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="newVideo.category"
              label="Category"
              variant="outlined"
              :items="categoryOptions"
              :rules="[rules.required]"
              class="mb-3"
            ></v-select>

            <v-select
              v-model="newVideo.level"
              label="Skill Level"
              variant="outlined"
              :items="levelOptions"
              class="mb-3"
            ></v-select>

            <v-combobox
              v-model="newVideo.tags"
              label="Tags"
              multiple
              chips
              variant="outlined"
              hint="Press enter to add a tag"
              persistent-hint
              class="mb-3"
            ></v-combobox>

            <v-btn
              type="submit"
              color="primary"
              block
              :loading="videosStore.loading"
            >
              Upload Video
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVideosStore } from '@/stores/videos'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import VideoGrid from '@/components/VideoGrid.vue'
import type { BikeCategory, VideoLevel } from '@/types/video.types'

const authStore = useAuthStore()
const videosStore = useVideosStore()

const searchQuery = ref('')
const selectedCategory = ref<BikeCategory | null>(null)
const selectedLevel = ref<VideoLevel | null>(null)
const activeTab = ref('all')
const showUploadDialog = ref(false)

const newVideo = ref({
  title: '',
  description: '',
  url: '',
  thumbnail: '',
  duration: 0,
  category: '' as BikeCategory,
  level: 'beginner' as VideoLevel,
  tags: [] as string[]
})

const rules = {
  required: (value: string | number) => !!value || 'This field is required',
  url: (value: string) => {
    const pattern = /^https?:\/\/.+/i
    return pattern.test(value) || 'Invalid URL'
  },
  positiveNumber: (value: number) => value > 0 || 'Must be a positive number'
}

const categoryOptions = [
  { title: 'Sport', value: 'sport' },
  { title: 'Cruiser', value: 'cruiser' },
  { title: 'Touring', value: 'touring' },
  { title: 'Adventure', value: 'adventure' },
  { title: 'Standard', value: 'standard' },
  { title: 'Custom', value: 'custom' }
]

const levelOptions = [
  { title: 'Beginner', value: 'beginner' },
  { title: 'Intermediate', value: 'intermediate' },
  { title: 'Advanced', value: 'advanced' }
]

const handleSearch = () => {
  // Debounce search
  setTimeout(() => {
    loadVideos()
  }, 300)
}

const handleFilter = () => {
  loadVideos()
}

const loadVideos = async () => {
  await videosStore.getVideos({
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    level: selectedLevel.value || undefined
  })
}

const loadMoreVideos = async () => {
  const nextPage = videosStore.page + 1
  await videosStore.getVideos({
    page: nextPage,
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    level: selectedLevel.value || undefined
  })
}

const loadPopularVideos = async () => {
  await videosStore.getPopularVideos()
}

const loadRecentVideos = async () => {
  await videosStore.getRecentVideos()
}

const loadRecommendedVideos = async () => {
  await videosStore.getRecommendedVideos()
}

const handleUploadVideo = async () => {
  try {
    await videosStore.createVideo(newVideo.value)
    showUploadDialog.value = false
    newVideo.value = {
      title: '',
      description: '',
      url: '',
      thumbnail: '',
      duration: 0,
      category: '' as BikeCategory,
      level: 'beginner' as VideoLevel,
      tags: []
    }
    // Refresh videos list
    loadVideos()
  } catch (error) {
    // Error handled in store
  }
}

// Watch tab changes to load appropriate data
watch(activeTab, (newTab) => {
  switch (newTab) {
    case 'popular':
      if (videosStore.popularVideos.length === 0) {
        loadPopularVideos()
      }
      break
    case 'recent':
      if (videosStore.recentVideos.length === 0) {
        loadRecentVideos()
      }
      break
    case 'recommended':
      if (videosStore.recommendedVideos.length === 0) {
        loadRecommendedVideos()
      }
      break
    default:
      if (videosStore.videos.length === 0) {
        loadVideos()
      }
  }
})

onMounted(async () => {
  await loadVideos()
})
</script>