// Compatibility layer to emulate Nuxt 2's component `fetch()` hook and `$fetchState` in Nuxt 3.
// It calls an Options API `fetch` method on server during SSR and on client before mount.

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    created() {
      // Initialize $fetchState early in the lifecycle
      if (!this.$fetchState) {
        this.$fetchState = {
          pending: false,
          error: null,
          timestamp: 0
        }
      }
    },
    async serverPrefetch() {
      const fetchFn = this.$options && this.$options.fetch
      if (typeof fetchFn === 'function') {
        this.$fetchState.pending = true
        this.$fetchState.error = null
        this.$fetchState.timestamp = Date.now()
        try {
          await fetchFn.call(this)
        } catch (e) {
          this.$fetchState.error = e
        } finally {
          this.$fetchState.pending = false
        }
      }
    },
    async beforeMount() {
      if (process.server) return
      if (this.__fetched_once__) return
      const fetchFn = this.$options && this.$options.fetch
      if (typeof fetchFn === 'function') {
        this.__fetched_once__ = true
        this.$fetchState.pending = true
        this.$fetchState.error = null
        this.$fetchState.timestamp = Date.now()
        try {
          await fetchFn.call(this)
        } catch (e) {
          this.$fetchState.error = e
        } finally {
          this.$fetchState.pending = false
        }
      }
    }
  })
})
