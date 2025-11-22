import { arcsiServerURL, arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const state = () => ({
  arcsiShows: {},
  allShowsList: {},
  rareShows: {},
  customSchedule: {}
})

export const actions = {
  // Keep initial server-side population (Nuxt 2 only). For each SSR request.
  async nuxtServerInit ({ dispatch }) {
    await dispatch('fetchGlobalData')
  },
  // Reusable fetch that can be called on each navigation via middleware.
  async fetchGlobalData ({ state }) {
    const noCacheCfg = {
      ...config,
      headers: {
        ...(config && config.headers),
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      },
      params: { t: Date.now() }
    }
    try {
      const [allShowsRes, rareRes, customRes] = await Promise.all([
        this.$axios.get(arcsiShowsBaseURL + '/all_without_items', noCacheCfg),
        this.$axios.get(rareShowsURL, { params: { t: Date.now() } }),
        this.$axios.get(customScheduleURL, { params: { t: Date.now() } })
      ])
      state.allShowsList = allShowsRes.data
      state.rareShows = rareRes.data.acf
      state.customSchedule = customRes.data.acf
    } catch (e) {
      if (this.$sentry) this.$sentry.captureException(e)
      // Fail silently on client navigations; initial load handled by nuxtServerInit error pages.
    }
  }
}

export const mutations = {
  refreshAllShowsList (state, payload) {
    state.allShowsList = payload
  },
  refreshRareShows (state, payload) {
    state.rareShows = payload
  },
  refreshCustomSchedule (state, payload) {
    state.customSchedule = payload
  }
}

export const getters = {
  returnArcsiShows (state) {
    return state.allShowsList
  },
  returnRareShows (state) {
    return state.rareShows
  },
  returnCustomSchedule (state) {
    return state.customSchedule
  }
}
