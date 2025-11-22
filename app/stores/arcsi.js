import { defineStore } from 'pinia'
import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const useArcsiStore = defineStore('arcsi', {
  state: () => ({
    allShows: [],
    rareShows: null,
    customSchedule: null,
    lastFetched: 0,
    isLoading: false,
    errorMessage: null
  }),
  getters: {
    returnArcsiShows: (state) => {
      if (!state.allShows?.length) return []
      return [...state.allShows].sort((a, b) => a.name.localeCompare(b.name))
    },
    returnRareShows: (state) => state.rareShows,
    returnCustomSchedule: (state) => state.customSchedule,
    getIsLoading: (state) => state.isLoading,
    getErrorMessage: (state) => state.errorMessage
  },
  actions: {
    refreshAllShowsList (shows) { this.allShows = shows },
    refreshRareShows (shows) { this.rareShows = shows },
    refreshCustomSchedule (schedule) { this.customSchedule = schedule },
    async fetchGlobalData (force = true) {
      const now = Date.now()
      if (!force && now - this.lastFetched < 5000) return
      this.isLoading = true
      this.errorMessage = null
      const { $sentry } = useNuxtApp()
      try {
        // Use local proxy API routes to avoid CORS issues
        const [allShowsRes, rareRes, customRes] = await Promise.all([
          $fetch('/api/arcsi/shows', { params: { t: now } }),
          $fetch('/api/rare-shows', { params: { t: now } }),
          $fetch('/api/custom-schedule', { params: { t: now } })
        ])
        this.allShows = allShowsRes
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
