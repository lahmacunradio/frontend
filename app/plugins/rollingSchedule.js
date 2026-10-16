// The schedule page's 7 days, starting today in Budapest. Each day is filtered by its own
// rotation week: on a Friday, the following Monday..Thursday are already in the next week.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { getBudapestDate, getBudapestWeekday } from './budapestTime.js'
import { WEEK_A_ANCHOR, filterShowsForWeek, getCurrentWeekIndex } from './fourWeekRotation.js'

const DAYS_SHOWN = 7

// Noon UTC of `isoDate` + `offset` days. Noon UTC falls on the same calendar day in
// Budapest (UTC+1 / UTC+2), so the Budapest helpers read back the intended date.
function noonUtc (isoDate, offset) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + offset, 12))
}

// Same order as the old grouping: '18:00:00' -> 1800
function byStart (a, b) {
  return parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10)
}

function isListed (show) {
  return show.active && show.archive_lahmastore_base_url !== 'off-air'
}

// [{ date: 'YYYY-MM-DD', day: 1 (Monday) .. 7 (Sunday), weekIndex: 0..3, shows }] x 7, today first.
// `day` matches show.day, so shows with any other value (e.g. PROD's `day: 0`) are not listed.
export function buildRollingSchedule (shows, now = new Date(), anchor = WEEK_A_ANCHOR) {
  const today = getBudapestDate(now)
  return Array.from({ length: DAYS_SHOWN }, (_, offset) => {
    const date = noonUtc(today, offset)
    const day = getBudapestWeekday(date) || 7
    const weekIndex = getCurrentWeekIndex(date, anchor)
    return {
      date: getBudapestDate(date),
      day,
      weekIndex,
      shows: filterShowsForWeek(shows, weekIndex)
        .filter(show => isListed(show) && show.day === day)
        .sort(byStart)
    }
  })
}
