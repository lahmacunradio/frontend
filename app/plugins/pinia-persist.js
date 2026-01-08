import { nextTick } from 'vue'

export default defineNuxtPlugin(({ $pinia }) => {
  if (!$pinia) return

  $pinia.use(({ store }) => {
    const storageKey = 'LahmaStore'

    // Hydrate store from existing localStorage (if present)
    // Use nextTick to ensure reactivity is properly triggered after hydration
    if (typeof window !== 'undefined' && window.localStorage) {
      nextTick(() => {
        try {
          const raw = window.localStorage.getItem(storageKey)
          if (raw) {
            const parsed = JSON.parse(raw)
            // If there is data for this specific store id, patch it.
            if (parsed && parsed[store.$id]) {
              // Use $patch to merge persisted state into store
              store.$patch(parsed[store.$id])
            }
          }
        } catch (e) {
          // ignore JSON parse errors
          // eslint-disable-next-line no-console
          console.error('pinia-persist: failed to hydrate from localStorage', e)
        }
      })
    }

    // Subscribe to store changes and persist them under the storageKey object
    // Only subscribe on client — server doesn't have window.localStorage
    // IMPORTANT: Removed { detached: true } to prevent memory leaks in SSR
    if (typeof window !== 'undefined' && window.localStorage && store.$subscribe) {
      store.$subscribe((mutation, state) => {
        try {
          let existing = {}
          const raw = window.localStorage.getItem(storageKey)
          if (raw) {
            existing = JSON.parse(raw) || {}
          }
          existing[store.$id] = state
          window.localStorage.setItem(storageKey, JSON.stringify(existing))
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('pinia-persist: failed to persist store', e)
        }
      })
    }
  })
})
