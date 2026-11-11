// The schedule repeats every 4 weeks: A/B/C/D = week index 0..3.
// Each show's `week` array lists the indexes it airs in.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { getBudapestDate } from './budapestTime.js'
import { getIsoWeek } from './calendarDate.js'

const WEEKS_IN_CYCLE = 4

// Index = ISO week number % 4, the same formula arcsi uses (`week % 4`, playout defaults to the
// current ISO week). Confirmed by admins 2026-10-19. Not a continuous cycle: in 53-week years
// W53 and the next W01 are both 1 (B). Copied as-is so the site matches what airs.
export function getWeekIndex (isoDate) {
  return getIsoWeek(isoDate).week % WEEKS_IN_CYCLE
}

const WEEK_LETTERS = ['A', 'B', 'C', 'D']

// Letter shown for a week index: 0 -> 'A' .. 3 -> 'D'
export function getWeekLetter (weekIndex) {
  return WEEK_LETTERS[weekIndex]
}

// Week index of `date` in Budapest: rolls over at Budapest midnight Sunday -> Monday.
export function getCurrentWeekIndex (date = new Date()) {
  return getWeekIndex(getBudapestDate(date))
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
