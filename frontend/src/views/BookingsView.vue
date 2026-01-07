<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">My Bookings</h1>
            <p class="text-h6 text-grey mb-8">
              Manage your garage appointments and service bookings
            </p>
          </v-col>
        </v-row>

        <!-- Tabs for different booking views -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-tabs v-model="activeTab" color="primary">
              <v-tab value="upcoming">Upcoming</v-tab>
              <v-tab value="past">Past</v-tab>
              <v-tab value="all">All Bookings</v-tab>
            </v-tabs>

            <v-tabs-window v-model="activeTab">
              <!-- Upcoming Bookings -->
              <v-tabs-window-item value="upcoming">
                <BookingList
                  :bookings="bookingsStore.upcomingBookings"
                  :loading="bookingsStore.loading"
                  :error="bookingsStore.error"
                  show-actions
                  @refresh="loadUpcomingBookings"
                />
              </v-tabs-window-item>

              <!-- Past Bookings -->
              <v-tabs-window-item value="past">
                <BookingList
                  :bookings="bookingsStore.pastBookings"
                  :loading="bookingsStore.loading"
                  :error="bookingsStore.error"
                  show-actions
                  @refresh="loadPastBookings"
                />
              </v-tabs-window-item>

              <!-- All Bookings -->
              <v-tabs-window-item value="all">
                <BookingList
                  :bookings="bookingsStore.bookings"
                  :loading="bookingsStore.loading"
                  :error="bookingsStore.error"
                  :has-more="bookingsStore.hasMoreBookings"
                  show-actions
                  @load-more="loadMoreBookings"
                  @refresh="loadAllBookings"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBookingsStore } from '@/stores/bookings'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import BookingList from '@/components/BookingList.vue'

const bookingsStore = useBookingsStore()

const activeTab = ref('upcoming')

const loadUpcomingBookings = async () => {
  await bookingsStore.getUpcomingBookings()
}

const loadPastBookings = async () => {
  await bookingsStore.getPastBookings()
}

const loadAllBookings = async () => {
  await bookingsStore.getBookings()
}

const loadMoreBookings = async () => {
  const nextPage = bookingsStore.page + 1
  await bookingsStore.getBookings({ page: nextPage })
}

// Watch tab changes to load appropriate data
watch(activeTab, (newTab) => {
  switch (newTab) {
    case 'upcoming':
      if (bookingsStore.upcomingBookings.length === 0) {
        loadUpcomingBookings()
      }
      break
    case 'past':
      if (bookingsStore.pastBookings.length === 0) {
        loadPastBookings()
      }
      break
    case 'all':
      if (bookingsStore.bookings.length === 0) {
        loadAllBookings()
      }
      break
  }
})

onMounted(async () => {
  await loadUpcomingBookings()
})
</script>