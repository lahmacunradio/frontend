import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { WEEK_A_ANCHOR, filterShowsForWeek, getCurrentWeekIndex } from '../plugins/fourWeekRotation.js'
import { groupShowsByDay } from '../plugins/mixinCommonMethods.js'
import { scheduleBaseline } from './fixtures/scheduleBaseline.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Week A starts Monday 2026-10-05: 10-05 A, 10-12 B, 10-19 C, 10-26 D
// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const TEST_ANCHOR = '2026-10-05'
const weekAt = iso => getCurrentWeekIndex(new Date(iso), TEST_ANCHOR)
const ids = shows => shows.map(show => show.id)
const groupedIds = groups => groups.map(ids)

describe('getCurrentWeekIndex', () => {
  test('counts whole weeks from the anchor Monday', () => {
    assert.equal(weekAt('2026-10-05T10:00:00Z'), 0) // Mon A
    assert.equal(weekAt('2026-10-11T10:00:00Z'), 0) // Sun A
    assert.equal(weekAt('2026-10-12T10:00:00Z'), 1) // Mon B
    assert.equal(weekAt('2026-10-21T10:00:00Z'), 2) // Wed C
    assert.equal(weekAt('2026-10-28T10:00:00Z'), 3) // Wed D
    assert.equal(weekAt('2026-11-02T10:00:00Z'), 0) // Mon A again
  })

  test('rolls over at Budapest midnight, not UTC midnight (summer time)', () => {
    assert.equal(weekAt('2026-10-18T21:30:00Z'), 1) // Sun 23:30 Budapest
    assert.equal(weekAt('2026-10-18T22:30:00Z'), 2) // Mon 00:30 Budapest, still Sunday in UTC
  })

  test('rolls over at Budapest midnight after the DST change', () => {
    assert.equal(weekAt('2026-10-25T22:30:00Z'), 2) // Sun 23:30 Budapest
    assert.equal(weekAt('2026-10-25T23:30:00Z'), 3) // Mon 00:30 Budapest, still Sunday in UTC
  })

  test('stays aligned a year later, across two DST changes', () => {
    assert.equal(weekAt('2027-10-04T10:00:00Z'), 0) // 52 weeks after the anchor
    assert.equal(weekAt('2027-10-03T21:30:00Z'), 3) // Sun 23:30 Budapest the night before
  })

  test('works for dates before the anchor', () => {
    assert.equal(weekAt('2026-09-28T10:00:00Z'), 3) // Mon, one week before
    assert.equal(weekAt('2026-09-27T10:00:00Z'), 2) // Sun, the week before that

    for (let day = 1; day <= 400; day++) {
      const index = weekAt(new Date(Date.UTC(2026, 9, 5 - day, 10)).toISOString())
      assert.ok(index >= 0 && index <= 3, `day -${day} gave ${index}`)
    }
  })

  test('defaults to now and the configured anchor', () => {
    const now = '2026-10-14T10:00:00Z'
    const expected = getCurrentWeekIndex(new Date(now), WEEK_A_ANCHOR)

    assert.equal(withFixedNow(now, () => getCurrentWeekIndex()), expected)
  })

  test('configured anchor is a Monday', () => {
    assert.equal(new Date(`${WEEK_A_ANCHOR}T12:00:00Z`).getUTCDay(), 1)
  })
})

describe('filterShowsForWeek', () => {
  test('keeps shows whose week array contains the index', () => {
    assert.deepEqual(ids(filterShowsForWeek(scheduleWeeks, 0)), [9001, 9002, 9005, 9008, 9010])
    assert.deepEqual(ids(filterShowsForWeek(scheduleWeeks, 1)), [9001, 9003, 9004, 9008])
    assert.deepEqual(ids(filterShowsForWeek(scheduleWeeks, 2)), [9001, 9005, 9006, 9008, 9009])
    assert.deepEqual(ids(filterShowsForWeek(scheduleWeeks, 3)), [9001, 9004, 9007, 9008])
  })

  test('drops shows with an empty or missing week array', () => {
    for (const week of [0, 1, 2, 3]) {
      assert.ok(!ids(filterShowsForWeek(scheduleWeeks, week)).includes(9011))
    }
    assert.deepEqual(filterShowsForWeek(scheduleBaseline, 0), [])
  })

  test('does not mutate its input', () => {
    const before = ids(scheduleWeeks)
    filterShowsForWeek(scheduleWeeks, 2)

    assert.deepEqual(ids(scheduleWeeks), before)
  })

  test('Sunday -> Monday rollover swaps week C for week D shows', () => {
    const sunday = ids(filterShowsForWeek(scheduleWeeks, weekAt('2026-10-25T22:30:00Z')))
    const monday = ids(filterShowsForWeek(scheduleWeeks, weekAt('2026-10-25T23:30:00Z')))

    assert.ok(sunday.includes(9006) && !sunday.includes(9007))
    assert.ok(monday.includes(9007) && !monday.includes(9006))
  })
})

describe('old vs new: shows airing every week', () => {
  test('filtering by any week, then grouping, matches the pre-4-week grouping', () => {
    const everyWeek = scheduleBaseline.map(show => ({ ...show, week: [0, 1, 2, 3] }))

    withFixedNow('2026-10-12T10:00:00Z', () => {
      const before = groupedIds(groupShowsByDay(scheduleBaseline))
      for (const week of [0, 1, 2, 3]) {
        assert.deepEqual(groupedIds(groupShowsByDay(filterShowsForWeek(everyWeek, week))), before, `week ${week}`)
      }
    })
  })
})
