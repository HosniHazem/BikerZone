<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">Community Posts</h1>
            <p class="text-h6 text-grey mb-8">
              Connect with fellow riders, share experiences, and get advice
            </p>
          </v-col>
        </v-row>

        <!-- Create Post Section -->
        <v-row class="mb-4">
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
        <v-row>
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
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import PostsList from '@/components/PostsList.vue'

const postsStore = usePostsStore()

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
  await loadPosts()
})
</script>