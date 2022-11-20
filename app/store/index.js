import { arcsiServerURL, arcsiShowsBaseURL, rareShowsURL, customScheduleURL, config } from '~/constants'

export const state = () => ({
  arcsiShows: [],
  allShowsList: [],
  rareShows: [],
  customSchedule: []
})

export const actions = {
  async nuxtServerInit ({ state }, { $sentry, error }) {
    /* Legacy api with all items
    await this.$axios.get(arcsiServerURL)
      .then((res) => {
        state.arcsiShows = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Arcsi Shows not found' })
      })
    */
    await this.$axios.get(arcsiShowsBaseURL + '/all_without_items', config)
      .then((res) => {
        state.allShowsList = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        const statusCode = e.response.status || 404
        const message = statusCode === 401 ? 'Arcsi unauthorized' : e.message || 'Shows not found'
        error({ statusCode, message })
      })
    await this.$axios.get(rareShowsURL)
      .then((res) => {
        state.rareShows = res.data.acf
      })
      .catch((e) => {
        $sentry.captureException(e)
        const statusCode = e.response.status || 404
        const message = statusCode === 401 ? 'Arcsi unauthorized' : e.message || 'Rare shows not found'
        error({ statusCode, message })
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
