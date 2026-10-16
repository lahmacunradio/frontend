import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { buildRollingSchedule } from '../plugins/rollingSchedule.js'
import { groupShowsByDay } from '../plugins/mixinCommonMethods.js'
import { makeShow } from './fixtures/factories.js'
import { scheduleBaseline } from './fixtures/scheduleBaseline.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Same test anchor as fourWeekRotation.test.js: A = 10-05, B = 10-12, C = 10-19, D = 10-26
const ANCHOR = '2026-10-05'

const build = (iso, shows = scheduleWeeks) => buildRollingSchedule(shows, new Date(iso), ANCHOR)
const ids = day => day.shows.map(show => show.id)
const byDate = (schedule, date) => schedule.find(day => day.date === date)

describe('buildRollingSchedule', () => {
  test('7 days starting today, each with its own date, weekday and week', () => {
    const schedule = build('2026-10-16T10:00:00Z') // Friday, week B

    assert.deepEqual(schedule.map(day => day.date), [
      '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'
    ])
    assert.deepEqual(schedule.map(day => day.day), [5, 6, 7, 1, 2, 3, 4])
    assert.deepEqual(schedule.map(day => day.weekIndex), [1, 1, 1, 2, 2, 2, 2])
  })

  test('days after Sunday use the next week, not today\'s', () => {
    const schedule = build('2026-10-09T10:00:00Z') // Friday, week A
    const tuesday = byDate(schedule, '2026-10-13') // week B

    assert.deepEqual(ids(tuesday), [9003])
  })

  test('Sunday week C -> Monday week D, across the DST change', () => {
    const schedule = build('2026-10-24T10:00:00Z') // Saturday, week C

    assert.deepEqual(ids(byDate(schedule, '2026-10-25')), [9006])
    assert.deepEqual(ids(byDate(schedule, '2026-10-26')), [9007, 9001])
  })

  test('today rolls over at Budapest midnight, not UTC', () => {
    const [today] = build('2026-10-25T23:30:00Z') // UTC Sunday, Budapest Monday 00:30

    assert.equal(today.date, '2026-10-26')
    assert.equal(today.day, 1)
    assert.equal(today.weekIndex, 3)
  })

  test('sorts each day by start time', () => {
    const shows = [
      makeShow({ id: 1, day: 1, start: '20:00:00', week: [0] }),
      makeShow({ id: 2, day: 1, start: '08:00:00', week: [0] }),
      makeShow({ id: 3, day: 1, start: '12:30:00', week: [0] })
    ]
    const [monday] = build('2026-10-05T10:00:00Z', shows)

    assert.deepEqual(ids(monday), [2, 3, 1])
  })

  test('hides inactive, off-air and never-scheduled shows', () => {
    const listed = build('2026-10-05T10:00:00Z').flatMap(ids) // Monday, week A

    assert.ok(!listed.includes(9010), 'inactive')
    assert.ok(!listed.includes(9011), 'week: []')

    const offAir = makeShow({ id: 1, archive_lahmastore_base_url: 'off-air', week: [0] })
    assert.deepEqual(build('2026-10-05T10:00:00Z', [offAir]).flatMap(ids), [])
  })

  test('current behaviour: a show with day 0 is not listed', () => {
    const dayZero = makeShow({ id: 1, day: 0, week: [0, 1, 2, 3] })

    assert.deepEqual(build('2026-10-05T10:00:00Z', [dayZero]).flatMap(ids), [])
  })

  test('does not mutate the input', () => {
    const input = structuredClone(scheduleWeeks)
    build('2026-10-16T10:00:00Z', input)

    assert.deepEqual(input, scheduleWeeks)
  })

  test('defaults to the current time', () => {
    const [today] = withFixedNow('2026-10-16T10:00:00Z', () => buildRollingSchedule(scheduleWeeks, undefined, ANCHOR))

    assert.equal(today.date, '2026-10-16')
  })

  // Old vs new rule from step 1b: shows airing every week must be listed exactly as before
  test('every-week shows: same days and order as the old groupShowsByDay, for every weekday', () => {
    const everyWeek = scheduleBaseline.map(show => ({ ...show, week: [0, 1, 2, 3] }))

    for (let date = 12; date <= 18; date++) {
      const now = `2026-10-${date}T10:00:00Z`
      const before = withFixedNow(now, () => groupShowsByDay(scheduleBaseline)).map(day => day.map(show => show.id))

      assert.deepEqual(build(now, everyWeek).map(ids), before, now)
    }
  })
})
