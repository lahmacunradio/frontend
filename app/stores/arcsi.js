import { defineStore } from 'pinia'

export const useArcsiStore = defineStore('arcsi', {
  state: () => ({
    allShows: [],
    sortedShows: [],
    rareShows: null,
    customSchedule: null,
    lastFetched: 0,
    isLoading: false,
    errorMessage: null
  }),
  getters: {
    returnArcsiShows: (state) => state.sortedShows,
    returnRareShows: (state) => state.rareShows,
    returnCustomSchedule: (state) => state.customSchedule,
    getIsLoading: (state) => state.isLoading,
    getErrorMessage: (state) => state.errorMessage
  },
  actions: {
    refreshAllShowsList (shows) {
      this.allShows = Array.isArray(shows) ? shows : []
      // Pre-compute and cache sorted list to avoid repeated cloning + sorting per render
      this.sortedShows = [...this.allShows].sort((a, b) => a.name.localeCompare(b.name))
    },
    refreshRareShows (shows) { this.rareShows = shows },
    refreshCustomSchedule (schedule) { this.customSchedule = schedule },
    async fetchGlobalData (force = true) {
      const now = Date.now()
      if (!force && now - this.lastFetched < 5000) return
      this.isLoading = true
      this.errorMessage = null
      const { $sentry } = useNuxtApp()
      try {
        // Use local proxy API routes (now internally cached) to avoid CORS issues
        const [allShowsRes, rareRes, customRes] = await Promise.all([
          $fetch('/api/arcsi/shows'),
          $fetch('/api/rare-shows'),
          $fetch('/api/custom-schedule')
        ])
        this.allShows = allShowsRes
        this.sortedShows = [...this.allShows].sort((a, b) => a.name.localeCompare(b.name))
        this.rareShows = rareRes.acf
        this.customSchedule = customRes.acf
        this.lastFetched = now
      } catch (e) {
        if ($sentry) $sentry.captureException(e)
        this.errorMessage = 'Failed to refresh radio data'
      } finally {
        this.isLoading = false
      }
    }
  }
})
