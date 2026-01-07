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
    <div v-if="loading && bookings.length === 0" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">Loading bookings...</p>
    </div>

    <!-- Bookings List -->
    <v-row v-else>
      <v-col cols="12">
        <v-card
          v-for="booking in bookings"
          :key="booking.id"
          elevation="2"
          class="mb-4"
        >
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <h3 class="text-h6">{{ booking.title }}</h3>
              <p class="text-body-2 text-grey">
                {{ formatDate(booking.startDate) }}
                <span v-if="booking.endDate"> - {{ formatDate(booking.endDate) }}</span>
              </p>
            </div>
            <v-chip
              :color="getStatusColor(booking.status)"
              variant="flat"
            >
              {{ booking.status }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <div v-if="booking.description" class="mb-3">
              <p class="text-body-1">{{ booking.description }}</p>
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex align-center mb-2">
                  <v-icon small class="mr-2">mdi-wrench</v-icon>
                  <span class="text-body-2">
                    Service: {{ booking.service || 'General Service' }}
                  </span>
                </div>

                <div v-if="booking.bikeModel" class="d-flex align-center mb-2">
                  <v-icon small class="mr-2">mdi-motorbike</v-icon>
                  <span class="text-body-2">
                    Bike: {{ booking.bikeModel }}
                    <span v-if="booking.bikePlate"> ({{ booking.bikePlate }})</span>
                  </span>
                </div>

                <div v-if="booking.price" class="d-flex align-center">
                  <v-icon small class="mr-2">mdi-cash</v-icon>
                  <span class="text-body-2">
                    Price: ${{ booking.price }}
                  </span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div v-if="booking.notes" class="mb-2">
                  <p class="text-body-2 text-grey">Notes: {{ booking.notes }}</p>
                </div>

                <div v-if="booking.cancellationReason" class="mb-2">
                  <p class="text-body-2 text-error">
                    Cancellation: {{ booking.cancellationReason }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions v-if="showActions">
            <v-btn
              v-if="canCancel(booking)"
              color="error"
              variant="text"
              @click="cancelBooking(booking.id)"
              :loading="cancelLoading[booking.id]"
            >
              Cancel
            </v-btn>
            <v-btn
              v-if="canEdit(booking)"
              color="primary"
              variant="text"
              @click="editBooking(booking.id)"
            >
              Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="outlined"
              @click="viewBooking(booking.id)"
            >
              View Details
            </v-btn>
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
    <v-row v-if="bookings.length > 0" class="mt-4">
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
    <div v-if="!loading && bookings.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
      <p class="text-h6 mt-4">No bookings found</p>
      <p class="text-grey">You don't have any bookings yet</p>
      <v-btn
        color="primary"
        class="mt-4"
        to="/garages"
      >
        Find a Garage
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import type { Booking } from '@/types/booking.types'
import { BookingStatus } from '@/types/booking.types'

interface Props {
  bookings: Booking[]
  loading: boolean
  error: string | null
  hasMore?: boolean
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  hasMore: false,
  showActions: false
})

const emit = defineEmits<{
  loadMore: []
  refresh: []
}>()

const router = useRouter()
const bookingsStore = useBookingsStore()

const cancelLoading = ref<Record<string, boolean>>({})

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString()
}

const getStatusColor = (status: BookingStatus) => {
  const colors: Record<BookingStatus, string> = {
    pending: 'warning',
    confirmed: 'info',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const canCancel = (booking: Booking) => {
  const cancellableStatuses: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED]
  const bookingDate = new Date(booking.startDate)
  const now = new Date()
  const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  return cancellableStatuses.includes(booking.status) && hoursUntilBooking > 24
}

const canEdit = (booking: Booking) => {
  const editableStatuses: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED]
  return editableStatuses.includes(booking.status)
}

const cancelBooking = async (bookingId: string) => {
  const reason = prompt('Please provide a reason for cancellation (optional):')
  cancelLoading.value[bookingId] = true
  try {
    await bookingsStore.cancelBooking(bookingId, reason || undefined)
  } catch (error) {
    // Error handled in store
  } finally {
    cancelLoading.value[bookingId] = false
  }
}

const editBooking = (bookingId: string) => {
  router.push(`/bookings/edit/${bookingId}`)
}

const viewBooking = (bookingId: string) => {
  router.push(`/bookings/${bookingId}`)
}
</script>