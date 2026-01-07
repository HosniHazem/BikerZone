<template>
  <v-app>
    <AppNavbar />

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 mb-4">Traffic Alerts</h1>
            <p class="text-h6 text-grey mb-8">
              Stay informed about road conditions, police activity, and safety alerts
            </p>
          </v-col>
        </v-row>

        <!-- Create Alert Button -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-btn
              color="error"
              size="large"
              @click="showCreateDialog = true"
            >
              <v-icon left>mdi-alert-plus</v-icon>
              Report Alert
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedType"
              label="Alert Type"
              variant="outlined"
              :items="alertTypeOptions"
              clearable
              @update:model-value="handleFilter"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedSeverity"
              label="Severity"
              variant="outlined"
              :items="severityOptions"
              clearable
              @update:model-value="handleFilter"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              color="primary"
              size="large"
              block
              @click="getNearbyAlerts"
              :loading="alertsStore.loading"
            >
              <v-icon left>mdi-crosshairs-gps</v-icon>
              Nearby Alerts
            </v-btn>
          </v-col>
        </v-row>

        <!-- Error Alert -->
        <v-alert
          v-if="alertsStore.error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="alertsStore.clearError()"
        >
          {{ alertsStore.error }}
        </v-alert>

        <!-- Loading -->
        <div v-if="alertsStore.loading && alertsStore.alerts.length === 0" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-4">Loading alerts...</p>
        </div>

        <!-- Alerts List -->
        <v-row v-else>
          <v-col cols="12">
            <v-card
              v-for="alert in alertsStore.alerts"
              :key="alert.id"
              elevation="2"
              class="mb-4"
            >
              <v-card-title class="d-flex align-center">
                <v-icon
                  :color="getAlertIconColor(alert.type)"
                  class="mr-3"
                  size="large"
                >
                  {{ getAlertIcon(alert.type) }}
                </v-icon>
                <div class="flex-grow-1">
                  <div class="d-flex align-center">
                    <h3 class="text-h6 mr-2">{{ alert.title }}</h3>
                    <v-chip
                      :color="getSeverityColor(alert.severity)"
                      size="small"
                      variant="flat"
                    >
                      {{ alert.severity }}
                    </v-chip>
                    <v-chip
                      v-if="alert.isVerified"
                      color="success"
                      size="small"
                      variant="outlined"
                      class="ml-2"
                    >
                      <v-icon start size="small">mdi-check-circle</v-icon>
                      Verified
                    </v-chip>
                  </div>
                  <p class="text-body-2 text-grey mt-1">
                    {{ formatDate(alert.createdAt) }} • Expires: {{ formatDate(alert.validUntil) }}
                  </p>
                </div>
              </v-card-title>

              <v-card-text>
                <p class="text-body-1 mb-3">{{ alert.description }}</p>

                <div v-if="alert.location.address" class="d-flex align-center mb-2">
                  <v-icon small class="mr-1">mdi-map-marker</v-icon>
                  <span class="text-body-2">{{ alert.location.address }}</span>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-btn
                      icon
                      size="small"
                      color="success"
                      @click="upvoteAlert(alert.id)"
                      :loading="votingLoading[alert.id]"
                    >
                      <v-icon>mdi-thumb-up</v-icon>
                    </v-btn>
                    <span class="text-body-2 mx-2">{{ alert.upvotesCount }}</span>

                    <v-btn
                      icon
                      size="small"
                      color="error"
                      @click="downvoteAlert(alert.id)"
                      :loading="votingLoading[alert.id]"
                    >
                      <v-icon>mdi-thumb-down</v-icon>
                    </v-btn>
                    <span class="text-body-2 mx-2">{{ alert.downvotesCount }}</span>
                  </div>

                  <v-btn
                    variant="text"
                    color="primary"
                    @click="viewAlertDetails(alert.id)"
                  >
                    View Details
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Load More -->
        <v-row v-if="alertsStore.hasMoreAlerts" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-btn
              color="primary"
              size="large"
              @click="loadMoreAlerts"
              :loading="alertsStore.loading"
            >
              Load More
            </v-btn>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-if="!alertsStore.loading && alertsStore.alerts.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
          <p class="text-h6 mt-4">No alerts found</p>
          <p class="text-grey">Be the first to report an alert or check nearby alerts</p>
        </div>
      </v-container>
    </v-main>

    <!-- Create Alert Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon left color="error">mdi-alert-plus</v-icon>
          Report Alert
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleCreateAlert">
            <v-select
              v-model="newAlert.type"
              label="Alert Type"
              variant="outlined"
              :items="alertTypeOptions"
              :rules="[rules.required]"
              class="mb-3"
            ></v-select>

            <v-text-field
              v-model="newAlert.title"
              label="Alert Title"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="newAlert.description"
              label="Description"
              variant="outlined"
              :rules="[rules.required]"
              rows="3"
              class="mb-3"
            ></v-textarea>

            <v-select
              v-model="newAlert.severity"
              label="Severity"
              variant="outlined"
              :items="severityOptions"
              class="mb-3"
            ></v-select>

            <v-text-field
              v-model="newAlert.location.address"
              label="Location Address"
              variant="outlined"
              placeholder="Describe the location"
              class="mb-3"
            ></v-text-field>

            <v-btn
              type="submit"
              color="error"
              block
              :loading="alertsStore.loading"
            >
              Report Alert
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
import { useAlertsStore } from '@/stores/alerts'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import type { AlertType, AlertSeverity } from '@/types/alert.types'

const router = useRouter()
const alertsStore = useAlertsStore()

const selectedType = ref<AlertType | null>(null)
const selectedSeverity = ref<AlertSeverity | null>(null)
const showCreateDialog = ref(false)
const votingLoading = ref<Record<string, boolean>>({})

const newAlert = ref({
  type: '' as AlertType,
  title: '',
  description: '',
  severity: 'medium' as AlertSeverity,
  location: {
    lat: 0,
    lng: 0,
    address: ''
  },
  validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
})

const rules = {
  required: (value: string) => !!value || 'This field is required'
}

const alertTypeOptions = [
  { title: 'Police', value: 'police' },
  { title: 'Traffic', value: 'traffic' },
  { title: 'Accident', value: 'accident' },
  { title: 'Roadwork', value: 'roadwork' },
  { title: 'Weather', value: 'weather' },
  { title: 'Other', value: 'other' }
]

const severityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' }
]

const getAlertIcon = (type: AlertType) => {
  const icons = {
    police: 'mdi-shield-alert',
    traffic: 'mdi-car-multiple',
    accident: 'mdi-car-emergency',
    roadwork: 'mdi-cone',
    weather: 'mdi-weather-cloudy',
    other: 'mdi-alert-circle'
  }
  return icons[type] || 'mdi-alert-circle'
}

const getAlertIconColor = (type: AlertType) => {
  const colors = {
    police: 'error',
    traffic: 'warning',
    accident: 'error',
    roadwork: 'orange',
    weather: 'blue',
    other: 'grey'
  }
  return colors[type] || 'grey'
}

const getSeverityColor = (severity: AlertSeverity) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return colors[severity] || 'grey'
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString()
}

const handleFilter = () => {
  alertsStore.getAlerts({
    type: selectedType.value || undefined,
    severity: selectedSeverity.value || undefined
  })
}

const getNearbyAlerts = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alertsStore.getNearbyAlerts({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 10
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }
}

const viewAlertDetails = (alertId: string) => {
  router.push(`/alerts/${alertId}`)
}

const upvoteAlert = async (alertId: string) => {
  votingLoading.value[alertId] = true
  try {
    await alertsStore.upvoteAlert(alertId)
  } catch (error) {
    // Error handled in store
  } finally {
    votingLoading.value[alertId] = false
  }
}

const downvoteAlert = async (alertId: string) => {
  votingLoading.value[alertId] = true
  try {
    await alertsStore.downvoteAlert(alertId)
  } catch (error) {
    // Error handled in store
  } finally {
    votingLoading.value[alertId] = false
  }
}

const loadMoreAlerts = async () => {
  const nextPage = alertsStore.page + 1
  await alertsStore.getAlerts({
    page: nextPage,
    type: selectedType.value || undefined,
    severity: selectedSeverity.value || undefined
  })
}

const handleCreateAlert = async () => {
  try {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          newAlert.value.location.lat = position.coords.latitude
          newAlert.value.location.lng = position.coords.longitude

          await alertsStore.createAlert(newAlert.value)
          showCreateDialog.value = false
          newAlert.value = {
            type: '' as AlertType,
            title: '',
            description: '',
            severity: 'medium' as AlertSeverity,
            location: {
              lat: 0,
              lng: 0,
              address: ''
            },
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          // Still create alert without location
          alertsStore.createAlert(newAlert.value)
        }
      )
    } else {
      await alertsStore.createAlert(newAlert.value)
    }
  } catch (error) {
    // Error handled in store
  }
}

onMounted(async () => {
  await alertsStore.getActiveAlerts()
})
</script>