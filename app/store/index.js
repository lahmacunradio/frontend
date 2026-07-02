import { arcsiShowsBaseURL, config } from '~/constants'

export const state = () => ({
  arcsiShowsForTiles: {},
  arcsiShowsForSchedule: {}
})

export const actions = {
  async nuxtServerInit ({ state }, { $sentry, error }) {
    await this.$axios.get(`${arcsiShowsBaseURL}/all_details`, config)
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
  }
}

export const mutations = {
  refreshArcsiShowsForTiles (state, payload) {
    state.arcsiShowsForTiles = payload
  },
  refreshArcsiShowsForSchedule (state, payload) {
    state.arcsiShowsForSchedule = payload
  }
}

export const getters = {
  returnArcsiShowsForTiles (state) {
    return state.arcsiShowsForTiles
  },
  returnArcsiShowsForSchedule (state) {
    return state.arcsiShowsForSchedule
  }
}
