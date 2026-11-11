import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { WEEK_INDEXES, filterShowsForWeek, getCurrentWeekIndex, getWeekIndex, getWeekLetter, mergeWeeklySchedules } from '../plugins/fourWeekRotation.js'
import { groupShowsByDay } from '../plugins/mixinCommonMethods.js'
import { scheduleBaseline } from './fixtures/scheduleBaseline.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Index = ISO week % 4: W41 (10-05) B, W42 (10-12) C, W43 (10-19) D, W44 (10-26) A
// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const weekAt = iso => getCurrentWeekIndex(new Date(iso))
const ids = shows => shows.map(show => show.id)
const groupedIds = groups => groups.map(ids)

describe('getWeekLetter', () => {
  test('maps week index 0..3 to A..D', () => {
    assert.deepEqual(WEEK_INDEXES.map(getWeekLetter), ['A', 'B', 'C', 'D'])
  })

  test('W43 2026 is D', () => {
    assert.equal(getWeekLetter(getWeekIndex('2026-10-19')), 'D')
  })
})

describe('getWeekIndex', () => {
  test('is the ISO week number % 4', () => {
    assert.equal(getWeekIndex('2026-09-28'), 0) // W40
    assert.equal(getWeekIndex('2026-10-05'), 1) // W41
    assert.equal(getWeekIndex('2026-10-14'), 2) // W42
    assert.equal(getWeekIndex('2026-10-19'), 3) // W43, Monday
    assert.equal(getWeekIndex('2026-10-25'), 3) // W43, Sunday
    assert.equal(getWeekIndex('2026-10-26'), 0) // W44
  })

  test('53-week year: W53 and the next W01 are both B, like arcsi', () => {
    assert.equal(getWeekIndex('2026-12-21'), 0) // W52
    assert.equal(getWeekIndex('2026-12-28'), 1) // W53
    assert.equal(getWeekIndex('2027-01-03'), 1) // W53, Sunday
    assert.equal(getWeekIndex('2027-01-04'), 1) // 2027-W01
    assert.equal(getWeekIndex('2027-01-11'), 2) // 2027-W02
  })

  test('52-week year: W52 -> W01 continues the cycle', () => {
    assert.equal(getWeekIndex('2027-12-27'), 0) // W52
    assert.equal(getWeekIndex('2028-01-03'), 1) // 2028-W01
  })
})

describe('getCurrentWeekIndex', () => {
  test('rolls over at Budapest midnight, not UTC midnight (summer time)', () => {
    assert.equal(weekAt('2026-10-18T21:30:00Z'), 2) // Sun 23:30 Budapest, W42
    assert.equal(weekAt('2026-10-18T22:30:00Z'), 3) // Mon 00:30 Budapest, still Sunday in UTC
  })

  test('rolls over at Budapest midnight after the DST change', () => {
    assert.equal(weekAt('2026-10-25T22:30:00Z'), 3) // Sun 23:30 Budapest, W43
    assert.equal(weekAt('2026-10-25T23:30:00Z'), 0) // Mon 00:30 Budapest, still Sunday in UTC
  })

  test('rolls over at Budapest midnight into W53', () => {
    assert.equal(weekAt('2026-12-27T22:30:00Z'), 0) // Sun 23:30 Budapest, W52
    assert.equal(weekAt('2026-12-27T23:30:00Z'), 1) // Mon 00:30 Budapest, W53
  })

  test('always 0..3, also for past dates', () => {
    for (let day = 0; day <= 800; day++) {
      const index = weekAt(new Date(Date.UTC(2025, 0, 1 + day, 10)).toISOString())
      assert.ok(index >= 0 && index <= 3, `day ${day} gave ${index}`)
    }
  })

  test('defaults to now', () => {
    assert.equal(withFixedNow('2026-10-14T10:00:00Z', () => getCurrentWeekIndex()), 2)
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
    const sunday = ids(filterShowsForWeek(scheduleWeeks, weekAt('2026-10-18T21:30:00Z')))
    const monday = ids(filterShowsForWeek(scheduleWeeks, weekAt('2026-10-18T22:30:00Z')))

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

describe('mergeWeeklySchedules', () => {
  // What GET all_schedule?week=N answers, per arcsi source
  const responses = WEEK_INDEXES.map(week => filterShowsForWeek(scheduleWeeks, week))

  test('keeps each show once, in order of first appearance', () => {
    assert.deepEqual(
      ids(mergeWeeklySchedules(responses)),
      [9001, 9002, 9005, 9008, 9010, 9003, 9004, 9006, 9009, 9007]
    )
  })

  // Order differs from the response; grouping sorts by day and start anyway
  test('filtering the merged list gives back each week\'s shows', () => {
    const sortedIds = shows => ids(shows).sort()
    const merged = mergeWeeklySchedules(responses)
    for (const week of WEEK_INDEXES) {
      assert.deepEqual(sortedIds(filterShowsForWeek(merged, week)), sortedIds(responses[week]), `week ${week}`)
    }
  })

  test('4 identical responses (DEV today) merge into one copy', () => {
    const everyWeek = scheduleBaseline.map(show => ({ ...show, week: [0, 1, 2, 3] }))

    assert.deepEqual(ids(mergeWeeklySchedules([everyWeek, everyWeek, everyWeek, everyWeek])), ids(everyWeek))
  })

  test('handles empty responses', () => {
    assert.deepEqual(mergeWeeklySchedules([]), [])
    assert.deepEqual(mergeWeeklySchedules([[], [], [], []]), [])
  })

  test('does not mutate its input', () => {
    const before = responses.map(ids)
    mergeWeeklySchedules(responses)

    assert.deepEqual(responses.map(ids), before)
  })
})
