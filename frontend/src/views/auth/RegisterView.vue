<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="8" class="pa-4">
              <v-card-title class="text-h4 text-center mb-4">
                <v-icon icon="mdi-motorbike" size="large" color="primary" class="mr-2"></v-icon>
                BikerZone
              </v-card-title>
              <v-card-subtitle class="text-center mb-4">
                Create your account
              </v-card-subtitle>

              <v-form @submit.prevent="handleRegister" ref="form">
                <v-text-field
                  v-model="formData.name"
                  label="Full Name"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :rules="[rules.required]"
                  class="mb-2"
                ></v-text-field>

                <v-select
                  v-model="formData.bikeType"
                  :items="bikeTypes"
                  item-title="label"
                  item-value="value"
                  label="Bike Type (optional)"
                  prepend-inner-icon="mdi-motorbike"
                  variant="outlined"
                  clearable
                  class="mb-2"
                ></v-select>

                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="formData.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  :rules="[rules.required, rules.minLength]"
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirm Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  :rules="[rules.required, rules.passwordMatch]"
                  class="mb-4"
                ></v-text-field>

                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                  closable
                  @click:close="error = ''"
                >
                  {{ error }}
                </v-alert>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  class="mb-4"
                >
                  Register
                </v-btn>

                <div class="text-center">
                  <span class="text-grey">Already have an account?</span>
                  <v-btn
                    to="/login"
                    variant="text"
                    color="primary"
                    class="ml-2"
                  >
                    Login
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = ref()
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  bikeType: undefined as string | undefined,
})

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  minLength: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
  passwordMatch: (v: string) => v === formData.value.password || 'Passwords must match',
}

const bikeTypes = [
  { label: 'Standard', value: 'standard' },
  { label: 'Sport', value: 'sport' },
  { label: 'Cruiser', value: 'cruiser' },
  { label: 'Touring', value: 'touring' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Custom', value: 'custom' },
]

const handleRegister = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    error.value = ''
    
    await authStore.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      bikeType: formData.value.bikeType || undefined,
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
