// Temporary Sentry compatibility shim for Nuxt 3 migration.
// Provides $sentry.captureException to avoid breaking existing code paths.
export default defineNuxtPlugin(() => {
  const sentry = {
    captureException: (e) => {
      if (process.dev) {
        console.error('[Sentry mock] captureException:', e)
      }
    }
  }
  // Let Nuxt handle injection and globalProperties mapping.
  // Access via useNuxtApp().$sentry or this.$sentry in Options API.
  return { provide: { sentry } }
})
