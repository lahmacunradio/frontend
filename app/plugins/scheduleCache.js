// Schedule responses cached per rotation week index (0..3): GET all_schedule?week=N only depends
// on N % 4, so 4 entries cover every week the schedule page can page to.
// Decides what to fetch; the store does the fetching. `shows` / `status` are the store's
// `{ [weekIndex]: ... }` maps.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

import { getWeekIndex } from './fourWeekRotation.js'

export const LOADING = 'loading'
export const ERROR = 'error'

// Fetch unless the week is already loaded (stale data counts as loaded) or on its way.
// A failed week without data is fetched again.
export function needsFetch (shows, status, weekIndex) {
  return !(weekIndex in shows) && status[weekIndex] !== LOADING
}

// Week indexes to re-request on a refresh: today's (even if never loaded, e.g. SSR failed or the
// week just rolled over) plus every loaded one. In-flight requests are skipped.
export function weekIndexesToRefresh (shows, status, today) {
  const indexes = new Set(Object.keys(shows).map(Number))
  if (today) {
    indexes.add(getWeekIndex(today))
  }
  return [...indexes]
    .filter(weekIndex => status[weekIndex] !== LOADING)
    .sort((a, b) => a - b)
}
