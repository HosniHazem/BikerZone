<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-h5 font-weight-bold">
              <v-icon left>mdi-motorbike</v-icon>
              BikerZone
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-6">
            <v-alert
              v-if="registeredSuccess"
              type="success"
              variant="tonal"
              class="mb-4"
            >
              Registration successful! Please check your email to verify your account.
            </v-alert>

            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="authStore.error = null"
            >
              {{ authStore.error }}
            </v-alert>

            <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                class="mb-2"
              />

              <v-text-field
                v-model="credentials.password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                color="primary"
                class="mt-n2"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="authStore.loading"
                class="mb-4"
              >
                Login
              </v-btn>

              <div class="text-center">
                <router-link
                  to="/forgot-password"
                  class="text-primary text-decoration-none"
                >
                  Forgot password?
                </router-link>
              </div>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6 pt-4">
            <div class="w-100 text-center">
              <span class="text-body-2">Don't have an account?</span>
              <router-link
                to="/register"
                class="text-primary text-decoration-none font-weight-bold ml-2"
              >
                Sign up
              </router-link>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const formRef = ref();
const valid = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

const credentials = ref({
  email: '',
  password: '',
});

const registeredSuccess = computed(() => route.query.registered === 'true');

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
};

const handleLogin = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (!isValid) return;

  await authStore.login(credentials.value);
};

onMounted(() => {
  // Clear any previous errors
  authStore.error = null;
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  border-radius: 16px !important;
}
</style>
