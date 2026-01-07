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
              Welcome back, {{ authStore.user?.name }}!
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
                <v-btn variant="text" color="primary" @click="handleCardAction(card.action)">
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Create Post Section -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title>Create New Post</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="handleCreatePost">
                  <v-text-field
                    v-model="newPost.title"
                    label="Post Title"
                    variant="outlined"
                    :rules="[rules.required]"
                    class="mb-3"
                  ></v-text-field>
                  
                  <v-textarea
                    v-model="newPost.content"
                    label="Post Content (use #hashtags)"
                    variant="outlined"
                    :rules="[rules.required]"
                    rows="3"
                    class="mb-3"
                  ></v-textarea>
                  
                  <v-combobox
                    v-model="newPost.tags"
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
                    :loading="postsStore.loading"
                    block
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Create Post
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Posts Feed -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center justify-space-between">
                <span>Recent Posts</span>
                <v-btn
                  icon
                  size="small"
                  @click="loadPosts"
                  :loading="postsStore.loading"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-card-title>
              
              <v-card-text>
                <v-alert
                  v-if="postsStore.error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="postsStore.clearError()"
                >
                  {{ postsStore.error }}
                </v-alert>

                <div v-if="postsStore.loading && postsStore.posts.length === 0" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="mt-4">Loading posts...</p>
                </div>

                <div v-else-if="postsStore.posts.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey">mdi-post-outline</v-icon>
                  <p class="text-h6 mt-4">No posts yet</p>
                  <p class="text-grey">Be the first to create a post!</p>
                </div>

                <PostsList v-else :posts="postsStore.posts" @refresh="loadPosts" />
                
                <div v-if="postsStore.hasMorePosts" class="text-center mt-4">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    @click="loadMorePosts"
                    :loading="postsStore.loading"
                  >
                    Load More
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import { useGaragesStore } from '@/stores/garages'
import { useAlertsStore } from '@/stores/alerts'
import { useVideosStore } from '@/stores/videos'
import { useBookingsStore } from '@/stores/bookings'
import PostsList from '@/components/PostsList.vue'

const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()
const garagesStore = useGaragesStore()
const alertsStore = useAlertsStore()
const videosStore = useVideosStore()
const bookingsStore = useBookingsStore()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const newPost = ref({
  title: '',
  content: '',
  tags: [] as string[]
})

const rules = {
  required: (value: string) => !!value || 'This field is required'
}

const dashboardCards = computed(() => [
  {
    icon: 'mdi-post',
    title: 'Posts',
    value: postsStore.postsCount.toString(),
    description: 'Your social posts',
    action: 'posts'
  },
  {
    icon: 'mdi-wrench',
    title: 'Garages',
    value: garagesStore.garagesCount.toString(),
    description: 'Available garages',
    action: 'garages'
  },
  {
    icon: 'mdi-alert',
    title: 'Alerts',
    value: alertsStore.alertsCount.toString(),
    description: 'Active alerts',
    action: 'alerts'
  },
  {
    icon: 'mdi-video',
    title: 'Videos',
    value: videosStore.videosCount.toString(),
    description: 'Tutorial videos',
    action: 'videos'
  },
  {
    icon: 'mdi-calendar-check',
    title: 'Bookings',
    value: bookingsStore.bookingsCount.toString(),
    description: 'Your appointments',
    action: 'bookings'
  }
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleCardAction = (action: string) => {
  router.push(`/${action}`)
}

const handleCreatePost = async () => {
  try {
    await postsStore.createPost(newPost.value)
    
    // Reset form
    newPost.value = {
      title: '',
      content: '',
      tags: []
    }
    
    showSnackbar('Post created successfully!', 'success')
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to create post', 'error')
  }
}

const loadPosts = async () => {
  try {
    await postsStore.getPosts({ 
      page: 1, 
      limit: 10,
      sort: 'recent',
      order: 'DESC'
    })
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const loadMorePosts = async () => {
  try {
    const nextPage = postsStore.currentPage + 1
    await postsStore.getPosts({ 
      page: nextPage, 
      limit: 10,
      sort: 'recent',
      order: 'DESC'
    })
  } catch (error) {
    console.error('Failed to load more posts:', error)
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

onMounted(async () => {
  // Fetch current user if not already loaded
  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }
  
  // Load posts
  await loadPosts()
})
</script>
