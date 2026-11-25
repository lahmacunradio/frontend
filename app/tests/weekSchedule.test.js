import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { WEEKS_AHEAD, WEEKS_BACK, buildWeekSchedule, canBeOnAir, followToday, getDefaultDayIndex, getWeekPage, stepWeek } from '../plugins/weekSchedule.js'
import { groupShowsByDay } from '../plugins/mixinCommonMethods.js'
import { makeShow } from './fixtures/factories.js'
import { scheduleBaseline } from './fixtures/scheduleBaseline.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Index = ISO week % 4: W40 (09-28) A, W41 (10-05) B, W42 (10-12) C, W43 (10-19) D
// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const ids = day => day.shows.map(show => show.id)
const build = (isoDate, shows = scheduleWeeks) => buildWeekSchedule(shows, isoDate)

describe('buildWeekSchedule', () => {
  test('Monday..Sunday of the week containing the date', () => {
    const week = build('2026-10-21') // Wednesday

    assert.equal(week.monday, '2026-10-19')
    assert.deepEqual(week.days.map(day => day.date), [
      '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'
    ])
    assert.deepEqual(week.days.map(day => day.day), [1, 2, 3, 4, 5, 6, 7])
    assert.equal(week.isoYear, 2026)
    assert.equal(week.isoWeek, 43)
    assert.equal(week.weekIndex, 3)
  })

  test('every day of the page uses the page\'s rotation week', () => {
    assert.deepEqual(build('2026-10-19').days.map(ids), [[9007, 9001], [], [9004], [9008], [], [], []]) // D
    assert.deepEqual(build('2026-10-12').days.map(ids), [[9001], [], [9005], [9008], [9009], [], [9006]]) // C
  })

  test('same slot, different weeks: only that week\'s show', () => {
    assert.deepEqual(ids(build('2026-09-29').days[1]), [9002]) // Tue, week A
    assert.deepEqual(ids(build('2026-10-06').days[1]), [9003]) // Tue, week B
  })

  test('a week across New Year: ISO week 53 of 2026', () => {
    const week = build('2027-01-01')

    assert.equal(week.monday, '2026-12-28')
    assert.equal(week.days[6].date, '2027-01-03')
    assert.equal(week.isoYear, 2026)
    assert.equal(week.isoWeek, 53)
    assert.equal(week.weekIndex, 1)
  })

  test('sorts each day by start time', () => {
    const shows = [
      makeShow({ id: 1, day: 1, start: '20:00:00', week: [0] }),
      makeShow({ id: 2, day: 1, start: '08:00:00', week: [0] }),
      makeShow({ id: 3, day: 1, start: '12:30:00', week: [0] })
    ]

    assert.deepEqual(ids(build('2026-09-28', shows).days[0]), [2, 3, 1])
  })

  test('hides inactive, off-air and never-scheduled shows', () => {
    const listed = build('2026-09-28').days.flatMap(ids) // week A

    assert.ok(!listed.includes(9010), 'inactive')
    assert.ok(!listed.includes(9011), 'week: []')

    const offAir = makeShow({ id: 1, archive_lahmastore_base_url: 'off-air', week: [0] })
    assert.deepEqual(build('2026-09-28', [offAir]).days.flatMap(ids), [])
  })

  test('current behaviour: a show with day 0 is not listed', () => {
    const dayZero = makeShow({ id: 1, day: 0, week: [0, 1, 2, 3] })

    assert.deepEqual(build('2026-09-28', [dayZero]).days.flatMap(ids), [])
  })

  test('does not mutate the input', () => {
    const input = structuredClone(scheduleWeeks)
    build('2026-10-19', input)

    assert.deepEqual(input, scheduleWeeks)
  })

  // Old vs new rule from step 1b: shows airing every week must be listed exactly as before.
  // The old grouping starts today, so on a Monday it gives Monday..Sunday.
  test('every-week shows: same days and order as the old groupShowsByDay on a Monday', () => {
    const everyWeek = scheduleBaseline.map(show => ({ ...show, week: [0, 1, 2, 3] }))

    for (const monday of ['2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19']) {
      const before = withFixedNow(`${monday}T10:00:00Z`, () => groupShowsByDay(scheduleBaseline)).map(day => day.map(show => show.id))

      assert.deepEqual(build(monday, everyWeek).days.map(ids), before, monday)
    }
  })
})

describe('getWeekPage', () => {
  const today = '2026-10-20' // Tuesday, W43

  test('today\'s week is offset 0', () => {
    assert.deepEqual(getWeekPage('2026-10-19', today), { monday: '2026-10-19', offset: 0, hasPrevious: true, hasNext: true })
  })

  test('offset counts weeks, across New Year', () => {
    assert.equal(getWeekPage('2026-10-26', today).offset, 1)
    assert.equal(getWeekPage('2026-10-12', today).offset, -1)
    assert.equal(getWeekPage('2026-12-28', today).offset, 10) // W53
    assert.equal(getWeekPage('2027-01-04', today).offset, 11) // 2027-W01
  })

  test('the window ends 52 weeks back and 52 weeks ahead', () => {
    assert.equal(WEEKS_BACK, 52)
    assert.equal(WEEKS_AHEAD, 52)
    assert.deepEqual(getWeekPage('2027-10-18', today), { monday: '2027-10-18', offset: 52, hasPrevious: true, hasNext: false }) // 2027-W42
    assert.deepEqual(getWeekPage('2025-10-20', today), { monday: '2025-10-20', offset: -52, hasPrevious: false, hasNext: true }) // 2025-W43
  })

  // A user on the oldest week when the week rolls over
  test('a week that fell out of the window can only page back in', () => {
    assert.deepEqual(getWeekPage('2025-10-20', '2026-10-26'), { monday: '2025-10-20', offset: -53, hasPrevious: false, hasNext: true })
  })
})

describe('stepWeek', () => {
  const today = '2026-10-20'

  test('one week forward and back, across New Year', () => {
    assert.equal(stepWeek('2026-10-19', 1, today), '2026-10-26')
    assert.equal(stepWeek('2026-10-19', -1, today), '2026-10-12')
    assert.equal(stepWeek('2026-12-28', 1, today), '2027-01-04') // W53 -> 2027-W01
  })

  test('stays inside the window', () => {
    assert.equal(stepWeek('2027-10-18', 1, today), '2027-10-18')
    assert.equal(stepWeek('2025-10-20', -1, today), '2025-10-20')
    assert.equal(stepWeek('2026-10-19', 100, today), '2027-10-18')
  })

  test('from outside the window, the next step lands back on its edge', () => {
    assert.equal(stepWeek('2025-10-20', 1, '2026-10-26'), '2025-10-27') // offset -53 -> -52
  })
})

describe('getDefaultDayIndex', () => {
  const week = build('2026-10-19')

  test('today if the week contains it', () => {
    assert.equal(getDefaultDayIndex(week, '2026-10-19'), 0)
    assert.equal(getDefaultDayIndex(week, '2026-10-22'), 3)
    assert.equal(getDefaultDayIndex(week, '2026-10-25'), 6)
  })

  test('Monday for any other week', () => {
    assert.equal(getDefaultDayIndex(week, '2026-10-28'), 0)
    assert.equal(getDefaultDayIndex(build('2026-10-26'), '2026-10-22'), 0)
  })
})

describe('followToday', () => {
  // W43: Mon 2026-10-19 .. Sun 10-25. W44 starts 10-26.
  test('nothing changes when today doesn\'t move', () => {
    const page = { monday: '2026-10-19', selectedDay: 3 }
    assert.deepEqual(followToday(page, '2026-10-21', '2026-10-21'), page)
  })

  test('current week, today\'s tab open: the tab moves to the new today', () => {
    assert.deepEqual(followToday({ monday: '2026-10-19', selectedDay: 1 }, '2026-10-20', '2026-10-21'), { monday: '2026-10-19', selectedDay: 2 })
  })

  test('current week, another tab open: the tab stays', () => {
    assert.deepEqual(followToday({ monday: '2026-10-19', selectedDay: 4 }, '2026-10-20', '2026-10-21'), { monday: '2026-10-19', selectedDay: 4 })
  })

  test('Sunday -> Monday on Sunday\'s tab: next week, Monday\'s tab', () => {
    assert.deepEqual(followToday({ monday: '2026-10-19', selectedDay: 6 }, '2026-10-25', '2026-10-26'), { monday: '2026-10-26', selectedDay: 0 })
  })

  test('Sunday -> Monday on another tab: next week, same weekday', () => {
    assert.deepEqual(followToday({ monday: '2026-10-19', selectedDay: 3 }, '2026-10-25', '2026-10-26'), { monday: '2026-10-26', selectedDay: 3 })
  })

  test('a paged week stays put, also across the rollover', () => {
    const page = { monday: '2026-11-02', selectedDay: 6 }
    assert.deepEqual(followToday(page, '2026-10-25', '2026-10-26'), page)
    assert.deepEqual(followToday(page, '2026-10-20', '2026-10-21'), page)
  })

  // Tab hidden over several days: lands on the real today, not one day later
  test('a jump of several days lands on the new today', () => {
    assert.deepEqual(followToday({ monday: '2026-10-19', selectedDay: 4 }, '2026-10-23', '2026-10-28'), { monday: '2026-10-26', selectedDay: 2 })
  })

  test('no previous today: unchanged', () => {
    const page = { monday: '2026-10-19', selectedDay: 2 }
    assert.deepEqual(followToday(page, '', '2026-10-21'), page)
  })
})

describe('canBeOnAir', () => {
  const evening = makeShow({ start: '18:00:00', end: '19:00:00' })
  const lateNight = makeShow({ start: '23:00:00', end: '01:00:00' })
  const untilMidnight = makeShow({ start: '23:00:00', end: '00:00:00' }) // PROD show 220

  test('any show on today\'s tab', () => {
    assert.equal(canBeOnAir(evening, '2026-10-20', '2026-10-20'), true)
    assert.equal(canBeOnAir(lateNight, '2026-10-20', '2026-10-20'), true)
  })

  test('yesterday\'s tab only for a show running past midnight', () => {
    assert.equal(canBeOnAir(lateNight, '2026-10-19', '2026-10-20'), true)
    assert.equal(canBeOnAir(untilMidnight, '2026-10-19', '2026-10-20'), true)
    assert.equal(canBeOnAir(evening, '2026-10-19', '2026-10-20'), false)
  })

  // e.g. a 24-hour takeover, 12:00 to 12:00 the next day
  test('end equal to start counts as running past midnight', () => {
    assert.equal(canBeOnAir(makeShow({ start: '12:00:00', end: '12:00:00' }), '2026-10-19', '2026-10-20'), true)
  })

  test('never two days back or on a future day', () => {
    assert.equal(canBeOnAir(lateNight, '2026-10-18', '2026-10-20'), false)
    assert.equal(canBeOnAir(lateNight, '2026-10-21', '2026-10-20'), false)
  })

  // Sunday's show sits in the previous week (and here, the previous year) once Monday starts
  test('across the week boundary and New Year', () => {
    assert.equal(canBeOnAir(lateNight, '2026-10-25', '2026-10-26'), true)
    assert.equal(canBeOnAir(lateNight, '2026-12-31', '2027-01-01'), true)
  })
})
