import { arcsiShowsBaseURL, config } from '~/constants'
import { getBudapestDate } from '~/plugins/budapestTime'
import { WEEK_INDEXES, filterShowsForWeek, getWeekIndex, mergeWeeklySchedules } from '~/plugins/fourWeekRotation'
import { ERROR, LOADING, needsFetch, weekIndexesToRefresh } from '~/plugins/scheduleCache'

// Dev only: USE_SCHEDULE_FIXTURE=true in .env serves the varied-weeks test fixture
// (DEV airs every show every week). Decided at module level, outside any async function,
// so webpack can see the constant and drop the fixture chunk from production builds.
const loadScheduleFixture = process.env.NODE_ENV === 'production'
  ? null
  : () => import('~/tests/fixtures/scheduleWeeks')

// One week of all_schedule. The fixture is filtered the way arcsi filters `?week`.
async function requestScheduleWeek (axios, weekIndex) {
  if (loadScheduleFixture && process.env.USE_SCHEDULE_FIXTURE === 'true') {
    const { scheduleWeeks } = await loadScheduleFixture()
    // Fresh deep copy, like a real response (see fetchArcsiShowsForSchedule)
    return JSON.parse(JSON.stringify(filterShowsForWeek(scheduleWeeks, weekIndex)))
  }
  const res = await axios.get(`${arcsiShowsBaseURL}/all_schedule`, { ...config, params: { week: weekIndex } })
  return res.data
}

export const state = () => ({
  arcsiShowsForTiles: {},
  arcsiShowsForSchedule: {},
  // Budapest date (YYYY-MM-DD) the site treats as today; set on SSR, then by the clock tick
  today: '',
  // all_schedule?week=N per rotation week index: { [weekIndex]: shows }
  scheduleShowsByWeekIndex: {},
  // { [weekIndex]: LOADING | ERROR }, no entry when the last request succeeded
  scheduleStatusByWeekIndex: {}
})

export const actions = {
  async nuxtServerInit ({ state, commit, dispatch }, { $sentry, error }) {
    commit('setToday', getBudapestDate())
    // Never rejects: on failure the week is marked ERROR and the client retries on its first tick
    await dispatch('fetchScheduleWeek', getWeekIndex(state.today))
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
      // A fresh deep copy each time, like a real response: the same reference would be a no-op for Vue
      // (nothing re-runs on refresh), and shared objects would become reactive state shared across SSR requests
      commit('refreshArcsiShowsForSchedule', JSON.parse(JSON.stringify(scheduleWeeks)))
      return
    }
    const responses = await Promise.all(WEEK_INDEXES.map(week =>
      this.$axios.get(`${arcsiShowsBaseURL}/all_schedule`, { ...config, params: { week } })
    ))
    commit('refreshArcsiShowsForSchedule', mergeWeeklySchedules(responses.map(res => res.data)))
  },
  // One week, never rejects: a failure is reported to Sentry and marks the week ERROR.
  // Data from an earlier request stays (stale beats empty).
  async fetchScheduleWeek ({ commit }, weekIndex) {
    commit('setScheduleWeekStatus', { weekIndex, status: LOADING })
    try {
      const shows = await requestScheduleWeek(this.$axios, weekIndex)
      commit('setScheduleWeek', { weekIndex, shows })
    } catch (e) {
      commit('setScheduleWeekStatus', { weekIndex, status: ERROR })
      this.$sentry.captureException(e)
    }
  },
  ensureScheduleWeek ({ state, dispatch }, weekIndex) {
    if (needsFetch(state.scheduleShowsByWeekIndex, state.scheduleStatusByWeekIndex, weekIndex)) {
      return dispatch('fetchScheduleWeek', weekIndex)
    }
  },
  // Today's week plus every loaded one, each request on its own
  refreshScheduleWeeks ({ state, dispatch }) {
    const weekIndexes = weekIndexesToRefresh(state.scheduleShowsByWeekIndex, state.scheduleStatusByWeekIndex, state.today)
    return Promise.all(weekIndexes.map(weekIndex => dispatch('fetchScheduleWeek', weekIndex)))
  },
  // Clock tick: moves `today` across midnight and loads the new week if needed
  tick ({ state, commit, dispatch }) {
    commit('setToday', getBudapestDate())
    return dispatch('ensureScheduleWeek', getWeekIndex(state.today))
  }
}

export const mutations = {
  setToday (state, today) {
    state.today = today
  },
  // New objects instead of adding keys: Vue 2 doesn't see new keys on an existing object
  setScheduleWeek (state, { weekIndex, shows }) {
    state.scheduleShowsByWeekIndex = { ...state.scheduleShowsByWeekIndex, [weekIndex]: shows }
    const status = { ...state.scheduleStatusByWeekIndex }
    delete status[weekIndex]
    state.scheduleStatusByWeekIndex = status
  },
  setScheduleWeekStatus (state, { weekIndex, status }) {
    state.scheduleStatusByWeekIndex = { ...state.scheduleStatusByWeekIndex, [weekIndex]: status }
  },
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
  },
  today (state) {
    return state.today
  },
  currentWeekIndex (state) {
    return getWeekIndex(state.today)
  },
  // Shows of one week index, or null while it isn't loaded
  scheduleForWeekIndex: state => (weekIndex) => {
    return state.scheduleShowsByWeekIndex[weekIndex] || null
  },
  // LOADING, ERROR, or null
  scheduleStatusForWeekIndex: state => (weekIndex) => {
    return state.scheduleStatusByWeekIndex[weekIndex] || null
  }
}
