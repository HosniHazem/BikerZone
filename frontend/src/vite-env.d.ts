/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly BASE_URL: string
  // add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}