// Calendar facts as seen in Budapest, the station's local time (CET/CEST, DST handled by Intl).
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

const budapestFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Budapest',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short'
})

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function budapestParts (date) {
  const parts = {}
  budapestFormatter.formatToParts(date).forEach(({ type, value }) => { parts[type] = value })
  return parts
}

// Budapest calendar date as YYYY-MM-DD
export function getBudapestDate (date = new Date()) {
  const { year, month, day } = budapestParts(date)
  return `${year}-${month}-${day}`
}

// Budapest weekday, JS convention: 0 = Sunday .. 6 = Saturday
export function getBudapestWeekday (date = new Date()) {
  return WEEKDAYS.indexOf(budapestParts(date).weekday)
}
