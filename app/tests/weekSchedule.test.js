import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { WEEKS_AHEAD, WEEKS_BACK, buildWeekSchedule, getDefaultDayIndex, getWeekPage } from '../plugins/weekSchedule.js'
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
  const now = new Date('2026-10-20T10:00:00Z') // Tuesday, W43

  test('offset 0 is the current week', () => {
    assert.deepEqual(getWeekPage(0, now), { offset: 0, monday: '2026-10-19', hasPrevious: true, hasNext: true })
  })

  test('pages week by week, across New Year', () => {
    assert.equal(getWeekPage(1, now).monday, '2026-10-26')
    assert.equal(getWeekPage(-1, now).monday, '2026-10-12')
    assert.equal(getWeekPage(10, now).monday, '2026-12-28') // W53
    assert.equal(getWeekPage(11, now).monday, '2027-01-04') // 2027-W01
  })

  test('stops 52 weeks back and 52 weeks ahead', () => {
    assert.equal(WEEKS_BACK, 52)
    assert.equal(WEEKS_AHEAD, 52)
    assert.deepEqual(getWeekPage(52, now), { offset: 52, monday: '2027-10-18', hasPrevious: true, hasNext: false }) // 2027-W42
    assert.deepEqual(getWeekPage(-52, now), { offset: -52, monday: '2025-10-20', hasPrevious: false, hasNext: true }) // 2025-W43
  })

  test('clamps offsets outside the window', () => {
    assert.deepEqual(getWeekPage(53, now), getWeekPage(52, now))
    assert.deepEqual(getWeekPage(-100, now), getWeekPage(-52, now))
  })

  test('the current week rolls over at Budapest midnight, not UTC', () => {
    assert.equal(getWeekPage(0, new Date('2026-10-18T21:30:00Z')).monday, '2026-10-12') // Sun 23:30 Budapest
    assert.equal(getWeekPage(0, new Date('2026-10-18T22:30:00Z')).monday, '2026-10-19') // Mon 00:30, UTC Sunday
  })

  test('defaults to the current week and the current time', () => {
    assert.equal(withFixedNow('2026-10-20T10:00:00Z', () => getWeekPage()).monday, '2026-10-19')
  })
})

describe('getDefaultDayIndex', () => {
  const week = build('2026-10-19')

  test('today if the week contains it', () => {
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-19T10:00:00Z')), 0) // Monday
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-22T10:00:00Z')), 3) // Thursday
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-25T21:30:00Z')), 6) // Sun 22:30 Budapest
  })

  test('Monday for any other week', () => {
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-28T10:00:00Z')), 0)
    assert.equal(getDefaultDayIndex(build('2026-10-26'), new Date('2026-10-22T10:00:00Z')), 0)
  })

  test('uses the Budapest date', () => {
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-25T23:30:00Z')), 0) // Mon 00:30 Budapest = next week; UTC Sunday would give 6
    assert.equal(getDefaultDayIndex(week, new Date('2026-10-20T22:30:00Z')), 2) // Wed 00:30 Budapest, UTC Tuesday
  })

  test('defaults to now', () => {
    assert.equal(withFixedNow('2026-10-21T10:00:00Z', () => getDefaultDayIndex(week)), 2)
  })
})
