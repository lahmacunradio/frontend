// Baseline for the current (pre-4-week) schedule. No `week` field: the old UI
// neither requests nor reads it, and the characterization tests pass without it.

import { makeItem, makeShow } from './factories.js'

export const scheduleBaseline = [
  // Monday: listed out of start order on purpose (8001 starts after 8002)
  makeShow({ id: 8001, name: 'Monday Evening', day: 1, start: '18:00:00', end: '19:00:00', frequency: 1, items: makeItem({ id: 80011 }) }),
  makeShow({ id: 8002, name: 'Monday Morning', day: 1, start: '08:00:00', end: '09:00:00', frequency: 4, items: makeItem({ id: 80021 }) }),
  makeShow({ id: 8003, name: 'Tuesday Night', day: 2, start: '20:00:00', end: '21:00:00', frequency: 2, items: makeItem({ id: 80031 }) }),
  makeShow({ id: 8004, name: 'Wednesday Morning', day: 3, start: '10:00:00', end: '11:00:00', frequency: 1, items: makeItem({ id: 80041 }) }),
  makeShow({ id: 8005, name: 'Thursday Late', day: 4, start: '22:00:00', end: '23:00:00', frequency: 2, items: makeItem({ id: 80051 }) }),
  makeShow({ id: 8006, name: 'Friday Noon', day: 5, start: '12:00:00', end: '13:00:00', frequency: 1, items: makeItem({ id: 80061 }) }),
  makeShow({ id: 8007, name: 'Saturday Afternoon', day: 6, start: '16:00:00', end: '17:00:00', frequency: 4, items: makeItem({ id: 80071 }) }),
  // Sunday (day 7): also out of start order
  makeShow({ id: 8008, name: 'Sunday Night', day: 7, start: '21:00:00', end: '22:00:00', frequency: 1, items: makeItem({ id: 80081 }) }),
  makeShow({ id: 8009, name: 'Sunday Morning', day: 7, start: '09:00:00', end: '10:00:00', frequency: 2, items: makeItem({ id: 80091 }) }),

  // hidden by the existing filter: inactive
  makeShow({ id: 8010, name: 'Inactive Tuesday', day: 2, start: '12:00:00', end: '13:00:00', frequency: 1, active: false }),
  // hidden by the existing filter: off-air
  makeShow({ id: 8011, name: 'Off-air Wednesday', day: 3, start: '18:00:00', end: '19:00:00', frequency: 1, archive_lahmastore_base_url: 'off-air' }),
  // frequency 0 exists in DEV (1 show) -> 'Not defined'
  makeShow({ id: 8012, name: 'Thursday Undefined Frequency', day: 4, start: '14:00:00', end: '15:00:00', frequency: 0, items: makeItem({ id: 80121 }) })
]

export default scheduleBaseline
