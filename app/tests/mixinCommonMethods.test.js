// Characterization tests: lock in what the current (pre-4-week) helpers do,
// so the migration can be checked against them. Green before any change.

import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { getTodayDateCET, getTodayNumeric, groupShowsByDay, showFrequency } from '../plugins/mixinCommonMethods.js'
import { scheduleBaseline } from './fixtures/scheduleBaseline.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

const ids = groups => groups.map(day => day.map(show => show.id))

// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const MONDAY_NOON = '2026-10-12T10:00:00Z'
const TUESDAY_NOON = '2026-10-13T10:00:00Z'
const WEDNESDAY_NOON = '2026-10-14T10:00:00Z'
const SUNDAY_NOON = '2026-10-18T10:00:00Z'

describe('getTodayNumeric', () => {
  test('returns JS weekday (0 = Sunday) in Budapest time', () => {
    assert.equal(withFixedNow(MONDAY_NOON, getTodayNumeric), 1)
    assert.equal(withFixedNow(WEDNESDAY_NOON, getTodayNumeric), 3)
    assert.equal(withFixedNow(SUNDAY_NOON, getTodayNumeric), 0)
  })

  test('rolls over at Budapest midnight, not UTC midnight (summer time)', () => {
    assert.equal(withFixedNow('2026-10-18T21:30:00Z', getTodayNumeric), 0) // Sun 23:30 Budapest
    assert.equal(withFixedNow('2026-10-18T22:30:00Z', getTodayNumeric), 1) // Mon 00:30 Budapest, still Sunday in UTC
  })

  test('rolls over at Budapest midnight after the DST change', () => {
    assert.equal(withFixedNow('2026-10-25T22:30:00Z', getTodayNumeric), 0) // Sun 23:30 Budapest
    assert.equal(withFixedNow('2026-10-25T23:30:00Z', getTodayNumeric), 1) // Mon 00:30 Budapest
  })
})

describe('getTodayDateCET', () => {
  test('returns the Budapest calendar date as YYYY-MM-DD', () => {
    assert.equal(withFixedNow(MONDAY_NOON, getTodayDateCET), '2026-10-12')
  })

  test('rolls over at Budapest midnight, not UTC midnight', () => {
    assert.equal(withFixedNow('2026-10-18T21:30:00Z', getTodayDateCET), '2026-10-18') // Sun 23:30 Budapest
    assert.equal(withFixedNow('2026-10-18T22:30:00Z', getTodayDateCET), '2026-10-19') // Mon 00:30 Budapest
    assert.equal(withFixedNow('2026-12-31T23:30:00Z', getTodayDateCET), '2027-01-01') // year rollover
  })
})

describe('groupShowsByDay', () => {
  test('groups by day, today first, sorted by start, hiding inactive and off-air', () => {
    const groups = withFixedNow(MONDAY_NOON, () => groupShowsByDay(scheduleBaseline))

    assert.deepEqual(ids(groups), [
      [8002, 8001], // Mon
      [8003], // Tue (8010 inactive)
      [8004], // Wed (8011 off-air)
      [8012, 8005], // Thu
      [8006], // Fri
      [8007], // Sat
      [8009, 8008] // Sun
    ])
  })

  test('rotates so today is first: Wednesday', () => {
    const groups = withFixedNow(WEDNESDAY_NOON, () => groupShowsByDay(scheduleBaseline))

    assert.deepEqual(ids(groups), [
      [8004], [8012, 8005], [8006], [8007], [8009, 8008], [8002, 8001], [8003]
    ])
  })

  test('rotates so today is first: Sunday (getTodayNumeric 0 -> day 7)', () => {
    const groups = withFixedNow(SUNDAY_NOON, () => groupShowsByDay(scheduleBaseline))

    assert.deepEqual(ids(groups), [
      [8009, 8008], [8002, 8001], [8003], [8004], [8012, 8005], [8006], [8007]
    ])
  })

  test('uses the Budapest day when UTC is still Sunday', () => {
    const groups = withFixedNow('2026-10-18T22:30:00Z', () => groupShowsByDay(scheduleBaseline))

    assert.deepEqual(ids(groups)[0], [8002, 8001])
  })

  test('does not mutate its input', () => {
    const before = scheduleBaseline.map(show => show.id)
    withFixedNow(MONDAY_NOON, () => groupShowsByDay(scheduleBaseline))

    assert.deepEqual(scheduleBaseline.map(show => show.id), before)
  })

  test('ignores the week field: week filtering must happen before grouping', () => {
    const groups = withFixedNow(TUESDAY_NOON, () => groupShowsByDay(scheduleWeeks))

    // 9002 is week A only, 9003 week B only, same Tuesday 20:00 slot: both show up today
    assert.deepEqual(ids(groups)[0], [9002, 9003])
  })
})

describe('showFrequency', () => {
  test('maps new episodes per month to a label', () => {
    assert.equal(showFrequency(1), 'New episode monthly')
    assert.equal(showFrequency(2), 'New episode every second week')
    assert.equal(showFrequency(3), 'New episode weekly')
    assert.equal(showFrequency(4), 'New episode weekly')
  })

  test('falls back to "Not defined" for 0 and missing values', () => {
    assert.equal(showFrequency(0), 'Not defined')
    assert.equal(showFrequency(undefined), 'Not defined')
  })
})
