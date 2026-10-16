import { arcsiShowsBaseURL, config } from '~/constants'
import { WEEK_INDEXES, mergeWeeklySchedules } from '~/plugins/fourWeekRotation'

// Dev only: USE_SCHEDULE_FIXTURE=true in .env serves the varied-weeks test fixture
// (DEV airs every show every week). Decided at module level, outside any async function,
// so webpack can see the constant and drop the fixture chunk from production builds.
const loadScheduleFixture = process.env.NODE_ENV === 'production'
  ? null
  : () => import('~/tests/fixtures/scheduleWeeks')

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
    if (loadScheduleFixture && process.env.USE_SCHEDULE_FIXTURE === 'true') {
      const { scheduleWeeks } = await loadScheduleFixture()
      commit('refreshArcsiShowsForSchedule', scheduleWeeks)
      return
    }
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
