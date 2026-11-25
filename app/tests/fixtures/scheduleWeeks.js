// Shaped like GET {arcsiShowsBaseURL}/all_schedule (DEV, verified 2026-10-13):
// - `day` is 1 (Monday) .. 7 (Sunday)
// - `week` is 0-indexed: 0..3 = A..D of the 4-week cycle
// - `items` is a single embedded episode object, or `[]` when the show has no episode (verified 2026-10-14)
// DEV seeds every show with week [0,1,2,3], so this fixture is the only data
// that exercises per-week filtering until real data diversifies.

import { makeItem, makeShow } from './factories.js'

// `items` omitted entirely
const showWithoutItems = makeShow({
  id: 9009,
  name: 'No Episode Missing Show',
  archive_lahmastore_base_url: 'no-episode-missing-show',
  day: 5,
  start: '21:00:00',
  end: '22:00:00',
  frequency: 1,
  week: [2]
})
delete showWithoutItems.items

export const scheduleWeeks = [
  // airs every week
  makeShow({
    id: 9001,
    name: 'Every Week Show',
    archive_lahmastore_base_url: 'every-week-show',
    day: 1,
    start: '18:00:00',
    end: '19:00:00',
    frequency: 4,
    week: [0, 1, 2, 3],
    items: makeItem({ id: 90011, name: 'Every Week Episode', number: 12 })
  }),

  // 9002 + 9003 share Tuesday 20:00 in different weeks:
  // picking "on air" by day/time alone without a week filter returns the wrong one
  makeShow({
    id: 9002,
    name: 'Week A Show',
    archive_lahmastore_base_url: 'week-a-show',
    day: 2,
    start: '20:00:00',
    end: '21:00:00',
    frequency: 1,
    week: [0],
    items: makeItem({ id: 90021, name: 'Week A Episode', number: 3 })
  }),
  makeShow({
    id: 9003,
    name: 'Week B Show',
    archive_lahmastore_base_url: 'week-b-show',
    day: 2,
    start: '20:00:00',
    end: '21:00:00',
    frequency: 1,
    week: [1],
    items: makeItem({ id: 90031, name: 'Week B Episode', number: 7 })
  }),

  // 9004 + 9005: complementary biweekly pair sharing Wednesday 19:00
  makeShow({
    id: 9004,
    name: 'Biweekly Odd Show',
    archive_lahmastore_base_url: 'biweekly-odd-show',
    day: 3,
    start: '19:00:00',
    end: '20:00:00',
    frequency: 2,
    week: [1, 3],
    items: makeItem({ id: 90041, name: 'Biweekly Odd Episode', number: 20 })
  }),
  makeShow({
    id: 9005,
    name: 'Biweekly Even Show',
    archive_lahmastore_base_url: 'biweekly-even-show',
    day: 3,
    start: '19:00:00',
    end: '20:00:00',
    frequency: 2,
    week: [0, 2],
    items: makeItem({ id: 90051, name: 'Biweekly Even Episode', number: 21 })
  }),

  // 9006 (Sunday, week C) -> 9007 (Monday, week D): week rollover boundary
  // (index = ISO week % 4: Sun 2026-10-18 is W42 = C, Mon 2026-10-19 is W43 = D)
  makeShow({
    id: 9006,
    name: 'Sunday Night Week C Show',
    archive_lahmastore_base_url: 'sunday-night-week-c-show',
    day: 7,
    start: '22:00:00',
    end: '23:59:00',
    frequency: 1,
    week: [2],
    items: makeItem({ id: 90061, name: 'Sunday Night Episode', number: 5 })
  }),
  makeShow({
    id: 9007,
    name: 'Monday Morning Week D Show',
    archive_lahmastore_base_url: 'monday-morning-week-d-show',
    day: 1,
    start: '08:00:00',
    end: '09:00:00',
    frequency: 1,
    week: [3],
    items: makeItem({ id: 90071, name: 'Monday Morning Episode', number: 9 })
  }),

  // `items` null: the server sends `[]` for zero episodes; null is kept to test defensive handling
  makeShow({
    id: 9008,
    name: 'No Episode Null Show',
    archive_lahmastore_base_url: 'no-episode-null-show',
    day: 4,
    start: '17:00:00',
    end: '18:00:00',
    frequency: 4,
    week: [0, 1, 2, 3],
    items: null
  }),

  showWithoutItems,

  // inactive: matches week A but must stay hidden by the existing active/off-air filter
  makeShow({
    id: 9010,
    name: 'Inactive Week A Show',
    archive_lahmastore_base_url: 'inactive-week-a-show',
    day: 6,
    start: '16:00:00',
    end: '17:00:00',
    frequency: 1,
    week: [0],
    active: false
  }),

  // empty week array: never scheduled, must not crash filtering
  makeShow({
    id: 9011,
    name: 'Unscheduled Show',
    archive_lahmastore_base_url: 'unscheduled-show',
    day: 6,
    start: '12:00:00',
    end: '13:00:00',
    frequency: 0,
    week: []
  })
]

export default scheduleWeeks
