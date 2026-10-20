// The schedule page: one Monday..Sunday week at a time, paged with arrows around the current week.
// A Monday..Sunday week has a single rotation week index (ISO week % 4).
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { getBudapestDate } from './budapestTime.js'
import { addDays, getIsoWeek, getMonday } from './calendarDate.js'
import { filterShowsForWeek, getWeekIndex } from './fourWeekRotation.js'

// Paging window around the current week: a year in both directions (decided 2026-10-20)
export const WEEKS_BACK = 52
export const WEEKS_AHEAD = 52

// Same order as the old grouping: '18:00:00' -> 1800
function byStart (a, b) {
  return parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10)
}

function isListed (show) {
  return show.active && show.archive_lahmastore_base_url !== 'off-air'
}

// Listed shows of one weekday (1 = Monday .. 7 = Sunday) in one rotation week, by start time.
// Shows with any other `day` value (e.g. PROD's `day: 0`) are never listed.
export function listShowsForDay (shows, weekIndex, day) {
  return filterShowsForWeek(shows, weekIndex)
    .filter(show => isListed(show) && show.day === day)
    .sort(byStart)
}

// The Monday..Sunday week containing `isoDate` (YYYY-MM-DD, any day of the week).
// `isoYear` + `isoWeek` are for the header: 2027-01-01 is in "Week 53 · 2026".
export function buildWeekSchedule (shows, isoDate) {
  const monday = getMonday(isoDate)
  const { year, week } = getIsoWeek(monday)
  const weekIndex = getWeekIndex(monday)
  return {
    monday,
    isoYear: year,
    isoWeek: week,
    weekIndex,
    days: Array.from({ length: 7 }, (_, offset) => ({
      date: addDays(monday, offset),
      day: offset + 1,
      shows: listShowsForDay(shows, weekIndex, offset + 1)
    }))
  }
}

// Week `offset` weeks from the current one (Budapest), clamped to the paging window.
export function getWeekPage (offset = 0, now = new Date()) {
  const clamped = Math.min(WEEKS_AHEAD, Math.max(-WEEKS_BACK, offset))
  return {
    offset: clamped,
    monday: addDays(getMonday(getBudapestDate(now)), clamped * 7),
    hasPrevious: clamped > -WEEKS_BACK,
    hasNext: clamped < WEEKS_AHEAD
  }
}

// Day tab to open: today if it's in `week`, else Monday.
export function getDefaultDayIndex (week, now = new Date()) {
  return Math.max(0, week.days.findIndex(day => day.date === getBudapestDate(now)))
}
