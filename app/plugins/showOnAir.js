// "Now playing by time" fallback for the radio player, used when Azuracast has no now-playing info.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.
//
// Moved 1:1 out of RadioPlayer.vue's checkNowPlaying, quirks included (see docs/KNOWN_ISSUES.md):
// hour-only string comparison, inclusive end, and no match -> the last show of the day.

import { removeMinutesAndSeconds } from './mixinCommonMethods.js'

// `todayShows`: today's shows sorted by start (groupShowsByDay(...)[0]).
// `currentHour`: two-digit Budapest hour string, as getCurrentTimeHourCET() returns it.
// Returns null for an empty day.
export function findShowOnAir (todayShows, currentHour) {
  let show = null
  for (let i = 0; i < todayShows.length; i++) {
    show = todayShows[i]
    // Shows are ordered by start, so the first hit is the one currently running
    if (removeMinutesAndSeconds(show.start) <= currentHour && removeMinutesAndSeconds(show.end) >= currentHour) {
      break
    }
  }
  return show
}
