import { defineStore } from 'pinia'
import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const useGlobalDataStore = defineStore('globalData', {
  state: () => ({
    allShowsList: [],
    rareShows: null,
    customSchedule: null,
    lastFetched: 0
  }),
  getters: {
    returnArcsiShows: (state) => {
      if (!state.allShowsList?.length) return []
      return [...state.allShowsList].sort((a, b) => a.name.localeCompare(b.name))
    },
    returnRareShows: (state) => state.rareShows,
    returnCustomSchedule: (state) => state.customSchedule
  },
  actions: {
    async fetchGlobalData(force = false) {
      const now = Date.now()
      // Throttle unless force requested (e.g. on navigation); adjust window if needed.
      if (!force && now - this.lastFetched < 5000) return
      const { $axios, $sentry } = useNuxtApp()
      const noCacheCfg = {
        ...config,
        headers: {
          ...(config && config.headers),
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        },
        params: { t: now }
      }
      try {
        const [allShowsRes, rareRes, customRes] = await Promise.all([
          $axios.get(arcsiShowsBaseURL + '/all_without_items', noCacheCfg),
          $axios.get(rareShowsURL, { params: { t: now } }),
          $axios.get(customScheduleURL, { params: { t: now } })
        ])
        this.allShowsList = allShowsRes.data
        this.rareShows = rareRes.data.acf
        this.customSchedule = customRes.data.acf
        this.lastFetched = now
      } catch (e) {
        if ($sentry) $sentry.captureException(e)
        // Silent fail: UI can show stale data; consider exposing an error flag if needed.
      }
    },
    refreshAllShowsList(payload) { this.allShowsList = payload },
    refreshRareShows(payload) { this.rareShows = payload },
    refreshCustomSchedule(payload) { this.customSchedule = payload }
  }
})
