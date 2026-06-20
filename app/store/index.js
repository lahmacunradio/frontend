import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const state = () => ({
  arcsiShowsForTiles: {},
  arcsiShowsForSchedule: {},
  rareShows: {},
  customSchedule: {}
})

export const actions = {
  async nuxtServerInit ({ state }, { $sentry, error }) {
    await this.$axios.get(`${arcsiShowsBaseURL}/allall_details_tiles`, config)
      .then((res) => {
        state.arcsiShowsForTiles = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows for Tiles not found' })
      })
    await this.$axios.get(`${arcsiShowsBaseURL}/all_schedule`, config)
      .then((res) => {
        state.arcsiShowsForSchedule = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows for Schedule not found' })
      })
    await this.$axios.get(rareShowsURL)
      .then((res) => {
        state.rareShows = res.data.acf
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Rare shows not found' })
      })
    await this.$axios.get(customScheduleURL)
      .then((res) => {
        state.customSchedule = res.data.acf
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Custom Schedule not found' })
      })
  }
}

export const mutations = {
  refreshArcsiShowsForTiles (state, payload) {
    state.arcsiShowsForTiles = payload
  },
  refreshArcsiShowsForSchedule (state, payload) {
    state.arcsiShowsForSchedule = payload
  },
  refreshRareShows (state, payload) {
    state.rareShows = payload
  },
  refreshCustomSchedule (state, payload) {
    state.customSchedule = payload
  }
}

export const getters = {
  returnArcsiShowsForTiles (state) {
    return state.arcsiShowsForTiles
  },
  returnArcsiShowsForSchedule (state) {
    return state.arcsiShowsForSchedule
  },
  returnRareShows (state) {
    return state.rareShows
  },
  returnCustomSchedule (state) {
    return state.customSchedule
  }
}
