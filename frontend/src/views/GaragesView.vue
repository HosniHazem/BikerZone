<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">Garages</h1>
            <p class="text-h6 text-grey mb-8">
              Find and book motorcycle repair services near you
            </p>
          </v-col>
        </v-row>

        <!-- Search and Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Search garages"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedServices"
              label="Services"
              variant="outlined"
              multiple
              chips
              :items="serviceOptions"
              @update:model-value="handleFilter"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              size="large"
              block
              @click="getNearbyGarages"
              :loading="garagesStore.loading"
            >
              <v-icon left>mdi-crosshairs-gps</v-icon>
              Find Nearby
            </v-btn>
          </v-col>
        </v-row>

        <!-- Create Garage Button (for owners) -->
        <v-row v-if="authStore.user" class="mb-4">
          <v-col cols="12">
            <v-btn
              color="success"
              size="large"
              @click="showCreateDialog = true"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Your Garage
            </v-btn>
          </v-col>
        </v-row>

        <!-- Error Alert -->
        <v-alert
          v-if="garagesStore.error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="garagesStore.clearError()"
        >
          {{ garagesStore.error }}
        </v-alert>

        <!-- Loading -->
        <div v-if="garagesStore.loading && garagesStore.garages.length === 0" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-4">Loading garages...</p>
        </div>

        <!-- Garages Grid -->
        <v-row v-else>
          <v-col
            v-for="garage in garagesStore.garages"
            :key="garage.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card elevation="2" class="h-100">
              <v-img
                v-if="garage.images && garage.images.length > 0"
                :src="garage.images[0]"
                height="200"
                cover
              >
                <v-chip
                  v-if="garage.isVerified"
                  color="success"
                  size="small"
                  class="ma-2"
                >
                  <v-icon start>mdi-check-circle</v-icon>
                  Verified
                </v-chip>
              </v-img>
              <v-card-title class="pb-2">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-wrench</v-icon>
                  {{ garage.name }}
                </div>
              </v-card-title>
              <v-card-text>
                <p class="text-body-2 text-grey mb-2">{{ garage.description }}</p>
                <div class="d-flex align-center mb-2">
                  <v-icon small color="warning" class="mr-1">mdi-star</v-icon>
                  <span class="text-body-2">{{ garage.rating.toFixed(1) }}</span>
                  <span class="text-body-2 text-grey ml-1">({{ garage.reviewsCount }} reviews)</span>
                </div>
                <div v-if="garage.address" class="d-flex align-center mb-2">
                  <v-icon small class="mr-1">mdi-map-marker</v-icon>
                  <span class="text-body-2">{{ garage.address }}</span>
                </div>
                <div v-if="garage.phone" class="d-flex align-center mb-2">
                  <v-icon small class="mr-1">mdi-phone</v-icon>
                  <span class="text-body-2">{{ garage.phone }}</span>
                </div>
                <div v-if="garage.services && garage.services.length > 0" class="mb-2">
                  <v-chip
                    v-for="service in garage.services.slice(0, 3)"
                    :key="service"
                    size="small"
                    variant="outlined"
                    class="mr-1 mb-1"
                  >
                    {{ service }}
                  </v-chip>
                  <v-chip
                    v-if="garage.services.length > 3"
                    size="small"
                    variant="outlined"
                  >
                    +{{ garage.services.length - 3 }} more
                  </v-chip>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="viewGarage(garage.id)"
                >
                  View Details
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  variant="text"
                  @click="bookGarage(garage.id)"
                >
                  Book Now
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Load More -->
        <v-row v-if="garagesStore.hasMoreGarages" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-btn
              color="primary"
              size="large"
              @click="loadMoreGarages"
              :loading="garagesStore.loading"
            >
              Load More
            </v-btn>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-if="!garagesStore.loading && garagesStore.garages.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey">mdi-wrench</v-icon>
          <p class="text-h6 mt-4">No garages found</p>
          <p class="text-grey">Try adjusting your search or location</p>
        </div>
      </v-container>
    </v-main>

    <!-- Create Garage Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-plus</v-icon>
          Add Your Garage
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleCreateGarage">
            <v-text-field
              v-model="newGarage.name"
              label="Garage Name"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="newGarage.description"
              label="Description"
              variant="outlined"
              rows="3"
              class="mb-3"
            ></v-textarea>

            <v-text-field
              v-model="newGarage.address"
              label="Address"
              variant="outlined"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newGarage.phone"
              label="Phone"
              variant="outlined"
              class="mb-3"
            ></v-text-field>

            <v-combobox
              v-model="newGarage.services"
              label="Services"
              multiple
              chips
              variant="outlined"
              :items="serviceOptions"
              hint="Press enter to add a service"
              persistent-hint
              class="mb-3"
            ></v-combobox>

            <v-btn
              type="submit"
              color="success"
              block
              :loading="garagesStore.loading"
            >
              Create Garage
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGaragesStore } from '@/stores/garages'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const garagesStore = useGaragesStore()

const searchQuery = ref('')
const selectedServices = ref<string[]>([])
const showCreateDialog = ref(false)

const newGarage = ref({
  name: '',
  description: '',
  address: '',
  phone: '',
  services: [] as string[]
})

const rules = {
  required: (value: string) => !!value || 'This field is required'
}

const serviceOptions = [
  'Oil Change',
  'Tire Replacement',
  'Brake Service',
  'Engine Repair',
  'Electrical Work',
  'Custom Work',
  'General Maintenance'
]

const handleSearch = () => {
  // Debounce search
  setTimeout(() => {
    garagesStore.getGarages({
      search: searchQuery.value || undefined,
      services: selectedServices.value.length > 0 ? selectedServices.value : undefined
    })
  }, 300)
}

const handleFilter = () => {
  garagesStore.getGarages({
    search: searchQuery.value || undefined,
    services: selectedServices.value.length > 0 ? selectedServices.value : undefined
  })
}

const getNearbyGarages = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        garagesStore.getNearbyGarages({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 10
        })
      },
      (error) => {
        console.error('Error getting location:', error)
        // Fallback to default location or show error
      }
    )
  }
}

const viewGarage = (garageId: string) => {
  router.push(`/garages/${garageId}`)
}

const bookGarage = (garageId: string) => {
  router.push(`/bookings/create?garage=${garageId}`)
}

const loadMoreGarages = async () => {
  const nextPage = garagesStore.page + 1
  await garagesStore.getGarages({
    page: nextPage,
    search: searchQuery.value || undefined,
    services: selectedServices.value.length > 0 ? selectedServices.value : undefined
  })
}

const handleCreateGarage = async () => {
  try {
    await garagesStore.createGarage(newGarage.value)
    showCreateDialog.value = false
    newGarage.value = {
      name: '',
      description: '',
      address: '',
      phone: '',
      services: []
    }
  } catch (error) {
    // Error is handled in the store
  }
}

onMounted(async () => {
  await garagesStore.getGarages()
})
</script>