import { arcsiServerURL, arcsiShowsBaseURL, rareShowsURL, customScheduleURL } from '~/constants'

export const state = () => ({
  arcsiShows: {},
  fullSchedule: {},
  rareShows: {},
  customSchedule: {}
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
    await this.$axios.get(arcsiShowsBaseURL + '/schedule')
      .then((res) => {
        state.fullSchedule = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Schedule not found' })
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
  refreshFullSchedule (state, payload) {
    state.fullSchedule = payload
  },
  refreshRareShows (state, payload) {
    state.rareShows = payload
  },
  refreshCustomSchedule (state, payload) {
    state.customSchedule = payload
  }
}

export const getters = {
  // return back the list of full show data from /schedule endpoint
  returnArcsiShows (state) {
    return state.fullSchedule
  },
  returnSchedule (state) {
    return state.fullSchedule
  },
  returnRareShows (state) {
    return state.rareShows
  },
  returnCustomSchedule (state) {
    return state.customSchedule
  }
}
