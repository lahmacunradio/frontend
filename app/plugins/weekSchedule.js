// The schedule page: one Monday..Sunday week at a time, paged with arrows around the current week.
// A Monday..Sunday week has a single rotation week index (ISO week % 4).
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { addDays, daysBetween, getIsoWeek, getIsoWeekday, getMonday } from './calendarDate.js'
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

// Shows of one weekday (1 = Monday .. 7 = Sunday), by start time.
// Shows with any other `day` value (e.g. PROD's `day: 0`) are never listed.
function showsOnDay (shows, day) {
  return shows.filter(show => show.day === day).sort(byStart)
}

// The Monday..Sunday week containing `isoDate` (YYYY-MM-DD, any day of the week).
// `isoYear` + `isoWeek` are for the header: 2027-01-01 is in "Week 53 · 2026".
export function buildWeekSchedule (shows, isoDate) {
  const monday = getMonday(isoDate)
  const { year, week } = getIsoWeek(monday)
  const weekIndex = getWeekIndex(monday)
  const weekShows = filterShowsForWeek(shows, weekIndex).filter(isListed)
  return {
    monday,
    isoYear: year,
    isoWeek: week,
    weekIndex,
    days: Array.from({ length: 7 }, (_, offset) => ({
      date: addDays(monday, offset),
      day: offset + 1,
      shows: showsOnDay(weekShows, offset + 1)
    }))
  }
}

// Paging state of the week starting `monday`, relative to the week containing `today` (both YYYY-MM-DD).
// `offset` can fall outside the window after a midnight rollover; the arrows then only lead back in.
export function getWeekPage (monday, today) {
  const offset = daysBetween(getMonday(today), monday) / 7
  return {
    monday,
    offset,
    hasPrevious: offset > -WEEKS_BACK,
    hasNext: offset < WEEKS_AHEAD
  }
}

// Monday `step` weeks away from `monday`, clamped to the paging window around `today`'s week.
export function stepWeek (monday, step, today) {
  const offset = getWeekPage(monday, today).offset + step
  const clamped = Math.min(WEEKS_AHEAD, Math.max(-WEEKS_BACK, offset))
  return addDays(getMonday(today), clamped * 7)
}

// Day tab to open: `today` if it's in `week`, else Monday.
export function getDefaultDayIndex (week, today) {
  return Math.max(0, week.days.findIndex(day => day.date === today))
}

// Where the page goes when `today` changes (midnight, or a tab woken up later). `page` = { monday, selectedDay }.
// On the current week: follow it into the new week, and if today's tab was open, move to the new today.
// On a paged week: stay put.
export function followToday (page, oldToday, newToday) {
  if (!oldToday || page.monday !== getMonday(oldToday)) {
    return page
  }
  const wasOnToday = page.selectedDay === getIsoWeekday(oldToday) - 1
  return {
    monday: getMonday(newToday),
    selectedDay: wasOnToday ? getIsoWeekday(newToday) - 1 : page.selectedDay
  }
}
