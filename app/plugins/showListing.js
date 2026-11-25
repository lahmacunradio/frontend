// Which arcsi shows a schedule lists, and in what order. Shared by the schedule page (weekSchedule.js)
// and the player / homepage grouping (groupShowsByDay in mixinCommonMethods.js).
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

// Inactive and off-air shows are never listed
export function isListed (show) {
  return show.active && show.archive_lahmastore_base_url !== 'off-air'
}

// By start time: '18:00:00' -> 1800 (only the first ':' is removed, parseInt stops at the second)
export function byStart (a, b) {
  return parseInt(a.start.replace(':', ''), 10) - parseInt(b.start.replace(':', ''), 10)
}
