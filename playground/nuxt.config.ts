export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  modelIndex: {
    baseUrl: 'http://localhost:8000',
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-01-09',
})
