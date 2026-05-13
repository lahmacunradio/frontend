import { arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const state = () => ({
  arcsiShows: {},
  allShowsList: {},
  rareShows: {},
  customSchedule: {}
})

export const actions = {
  async nuxtServerInit ({ state }, { $sentry, error }) {
    await this.$axios.get(`${arcsiShowsBaseURL}/all_without_items`, config)
      .then((res) => {
        state.allShowsList = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows not found' })
      })
    await this.$axios.get(`${arcsiShowsBaseURL}/all_tiles`, config)
      .then((res) => {
        state.arcsiShowsForTiles = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows not found' })
      })
    await this.$axios.get(`${arcsiShowsBaseURL}/all_schedule`, config)
      .then((res) => {
        state.arcsiShowsForSchedule = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows not found' })
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
  refreshAllShowsList (state, payload) {
    state.allShowsList = payload
  },
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
  returnArcsiShows (state) {
    return state.allShowsList
  },
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
