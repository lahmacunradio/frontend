// Disabled: Global data fetching is now handled by middleware/global-data.global.js
// This prevents duplicate fetches that were causing unnecessary memory churn on SSR.
// The plugin is kept as a no-op to avoid breaking nuxt.config.js references.

export default defineNuxtPlugin(() => {
  // No-op: Middleware handles data fetching
})
