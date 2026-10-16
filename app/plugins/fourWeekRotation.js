// The schedule repeats every 4 weeks: A/B/C/D = week index 0..3.
// Each show's `week` array lists the indexes it airs in.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { getBudapestDate } from './budapestTime.js'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const WEEKS_IN_CYCLE = 4

// Budapest calendar date (YYYY-MM-DD) of a Monday in week A.
// TODO: confirm with admins (fixed date or a formula, e.g. ISO week number mod 4?)
export const WEEK_A_ANCHOR = '2026-10-12'

// Whole days since 1970-01-01 for a YYYY-MM-DD calendar date.
// Counting calendar days instead of elapsed milliseconds keeps DST out of the math.
function dayNumber (isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / MS_PER_DAY
}

// Week index 0..3 of the cycle `date` falls into. Rolls over at Budapest midnight
// Sunday -> Monday, as long as `anchor` is a Monday. Works for dates before the anchor too.
export function getCurrentWeekIndex (date = new Date(), anchor = WEEK_A_ANCHOR) {
  const daysSinceAnchor = dayNumber(getBudapestDate(date)) - dayNumber(anchor)
  const weeksSinceAnchor = Math.floor(daysSinceAnchor / 7)
  return ((weeksSinceAnchor % WEEKS_IN_CYCLE) + WEEKS_IN_CYCLE) % WEEKS_IN_CYCLE
}

// Shows airing in the given week. Shows without a `week` array are dropped.
export function filterShowsForWeek (shows, weekIndex) {
  return shows.filter(show => show.week?.includes(weekIndex))
}

// Week indexes to request from GET {arcsiShowsBaseURL}/all_schedule?week=N
export const WEEK_INDEXES = [0, 1, 2, 3]

// One list from the per-week responses. A show airing in several weeks comes back
// in each of those responses: keep its first occurrence.
export function mergeWeeklySchedules (responses) {
  const showsById = new Map()
  for (const show of responses.flat()) {
    if (!showsById.has(show.id)) {
      showsById.set(show.id, show)
    }
  }
  return [...showsById.values()]
}
