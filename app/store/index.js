import { arcsiShowsBaseURL, config } from '~/constants'
import { WEEK_INDEXES, mergeWeeklySchedules } from '~/plugins/fourWeekRotation'

export const state = () => ({
  arcsiShowsForTiles: {},
  arcsiShowsForSchedule: {}
})

export const actions = {
  async nuxtServerInit ({ state, dispatch }, { $sentry, error }) {
    await this.$axios.get(`${arcsiShowsBaseURL}/all_details`, config)
      .then((res) => {
        state.arcsiShowsForTiles = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows for Tiles not found' })
      })
    await dispatch('fetchArcsiShowsForSchedule')
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'All Shows for Schedule not found' })
      })
  },
  // all_schedule filters by ?week (default 1), so ask for every week and merge.
  // Rejects if any week fails: callers decide how to report it.
  async fetchArcsiShowsForSchedule ({ commit }) {
    const responses = await Promise.all(WEEK_INDEXES.map(week =>
      this.$axios.get(`${arcsiShowsBaseURL}/all_schedule`, { ...config, params: { week } })
    ))
    commit('refreshArcsiShowsForSchedule', mergeWeeklySchedules(responses.map(res => res.data)))
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
