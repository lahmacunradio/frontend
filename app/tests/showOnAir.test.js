import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { findShowOnAir } from '../plugins/showOnAir.js'
import { filterShowsForWeek, getCurrentWeekIndex } from '../plugins/fourWeekRotation.js'
import { getCurrentTimeHourCET, groupShowsByDay } from '../plugins/mixinCommonMethods.js'
import { makeShow } from './fixtures/factories.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Week A starts Monday 2026-10-05: 10-05 A, 10-12 B, 10-19 C, 10-26 D
// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const TEST_ANCHOR = '2026-10-05'

// Same steps as RadioPlayer.vue's checkNowPlaying time fallback
const showOnAirAt = (iso, shows = scheduleWeeks) => withFixedNow(iso, () => {
  const weekShows = filterShowsForWeek(shows, getCurrentWeekIndex(new Date(), TEST_ANCHOR))
  return findShowOnAir(groupShowsByDay(weekShows)[0], getCurrentTimeHourCET())
})

const day = (...slots) => slots.map(([start, end], i) => makeShow({ id: i + 1, start, end }))

describe('findShowOnAir with the week filter', () => {
  test('two shows in the same slot: only the current week\'s one is on air', () => {
    assert.equal(showOnAirAt('2026-10-06T18:30:00Z').id, 9002) // Tue 20:30, week A
    assert.equal(showOnAirAt('2026-10-13T18:30:00Z').id, 9003) // Tue 20:30, week B
  })

  test('without the week filter, the slot always resolves to the same show (the bug step 5 fixes)', () => {
    const unfiltered = iso => withFixedNow(iso, () => findShowOnAir(groupShowsByDay(scheduleWeeks)[0], getCurrentTimeHourCET()))
    assert.equal(unfiltered('2026-10-06T18:30:00Z').id, 9002) // week A
    assert.equal(unfiltered('2026-10-13T18:30:00Z').id, 9002) // week B, still 9002
  })

  test('complementary biweekly pair alternates by week', () => {
    assert.equal(showOnAirAt('2026-10-07T17:30:00Z').id, 9005) // Wed 19:30, week A
    assert.equal(showOnAirAt('2026-10-14T17:30:00Z').id, 9004) // Wed 19:30, week B
  })
})

describe('findShowOnAir', () => {
  test('returns the show whose hours include the current hour', () => {
    assert.equal(findShowOnAir(day(['08:00:00', '09:00:00'], ['10:00:00', '12:00:00']), '11').id, 2)
  })

  test('returns null for an empty day', () => {
    assert.equal(findShowOnAir([], '11'), null)
  })

  test('current behaviour: no match returns the last show of the day', () => {
    assert.equal(findShowOnAir(day(['08:00:00', '09:00:00'], ['10:00:00', '11:00:00']), '15').id, 2)
  })

  test('current behaviour: end hour is inclusive, so at 19:xx the 18-19 show wins over 19-20', () => {
    assert.equal(findShowOnAir(day(['18:00:00', '19:00:00'], ['19:00:00', '20:00:00']), '19').id, 1)
  })

  test('current behaviour: at Budapest midnight the hour is "24", so a 00:00 show never matches', () => {
    const hour = withFixedNow('2026-10-13T22:30:00Z', getCurrentTimeHourCET) // Wed 00:30 Budapest
    assert.equal(hour, '24')
    assert.equal(findShowOnAir(day(['00:00:00', '01:00:00'], ['22:00:00', '23:00:00']), hour).id, 2)
  })
})
