// Calendar math on plain YYYY-MM-DD dates: no time of day, no timezone, no DST.
// Get the date in Budapest first (budapestTime.js), then do the math here.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Whole days since 1970-01-01 (a Thursday)
function dayNumber (isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / MS_PER_DAY
}

function fromDayNumber (days) {
  return new Date(days * MS_PER_DAY).toISOString().slice(0, 10)
}

export function addDays (isoDate, days) {
  return fromDayNumber(dayNumber(isoDate) + days)
}

// ISO weekday: 1 = Monday .. 7 = Sunday (same numbering as show.day)
export function getIsoWeekday (isoDate) {
  return ((dayNumber(isoDate) + 3) % 7 + 7) % 7 + 1
}

// Monday of the Monday..Sunday week `isoDate` falls into
export function getMonday (isoDate) {
  return addDays(isoDate, 1 - getIsoWeekday(isoDate))
}

// ISO 8601 week: weeks start on Monday, week 1 is the one containing the year's first Thursday.
// `year` can differ from the calendar year: 2027-01-01 is in 2026-W53.
export function getIsoWeek (isoDate) {
  const thursday = addDays(getMonday(isoDate), 3)
  const year = Number(thursday.slice(0, 4))
  const week = Math.floor((dayNumber(thursday) - dayNumber(`${year}-01-01`)) / 7) + 1
  return { year, week }
}
