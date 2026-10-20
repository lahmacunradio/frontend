import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { addDays, getIsoWeek, getIsoWeekday, getMonday } from '../plugins/calendarDate.js'

// Expected ISO weeks taken from Python's date.isocalendar()

describe('addDays', () => {
  test('moves across month and year ends, both directions', () => {
    assert.equal(addDays('2026-10-31', 1), '2026-11-01')
    assert.equal(addDays('2026-12-28', 7), '2027-01-04')
    assert.equal(addDays('2027-01-04', -7), '2026-12-28')
    assert.equal(addDays('2028-02-28', 1), '2028-02-29') // leap year
  })

  test('is not affected by the DST change', () => {
    assert.equal(addDays('2026-10-25', 1), '2026-10-26')
    assert.equal(addDays('2026-03-29', 1), '2026-03-30')
  })
})

describe('getIsoWeekday', () => {
  test('1 = Monday .. 7 = Sunday', () => {
    assert.equal(getIsoWeekday('2026-10-19'), 1)
    assert.equal(getIsoWeekday('2026-10-22'), 4)
    assert.equal(getIsoWeekday('2026-10-25'), 7)
    assert.equal(getIsoWeekday('1970-01-01'), 4)
    assert.equal(getIsoWeekday('1969-12-28'), 7) // before the epoch
  })
})

describe('getMonday', () => {
  test('returns the Monday of the Monday..Sunday week', () => {
    assert.equal(getMonday('2026-10-19'), '2026-10-19')
    assert.equal(getMonday('2026-10-25'), '2026-10-19') // Sunday belongs to the week before
    assert.equal(getMonday('2027-01-01'), '2026-12-28')
  })
})

describe('getIsoWeek', () => {
  const week = (year, w) => ({ year, week: w })

  test('mid-year weeks', () => {
    assert.deepEqual(getIsoWeek('2026-10-19'), week(2026, 43)) // Monday
    assert.deepEqual(getIsoWeek('2026-10-25'), week(2026, 43)) // Sunday, same week
    assert.deepEqual(getIsoWeek('2026-10-26'), week(2026, 44))
  })

  test('week year differs from the calendar year around New Year', () => {
    assert.deepEqual(getIsoWeek('2025-12-29'), week(2026, 1))
    assert.deepEqual(getIsoWeek('2026-01-01'), week(2026, 1))
    assert.deepEqual(getIsoWeek('2027-01-01'), week(2026, 53))
    assert.deepEqual(getIsoWeek('2027-01-03'), week(2026, 53))
    assert.deepEqual(getIsoWeek('2027-01-04'), week(2027, 1))
    assert.deepEqual(getIsoWeek('2028-01-02'), week(2027, 52))
    assert.deepEqual(getIsoWeek('2028-01-03'), week(2028, 1))
    assert.deepEqual(getIsoWeek('2024-12-30'), week(2025, 1))
  })

  test('53-week years 2000..2040 match the reference list', () => {
    const fiftyThree = []
    for (let year = 2000; year <= 2040; year++) {
      if (getIsoWeek(`${year}-12-28`).week === 53) fiftyThree.push(year) // Dec 28 is always in the last week
    }
    assert.deepEqual(fiftyThree, [2004, 2009, 2015, 2020, 2026, 2032, 2037])
  })

  test('weeks change only on Mondays and count up by one, restarting at 1', () => {
    let previous = getIsoWeek('1999-12-27')
    for (let date = '1999-12-28'; date < '2041-01-01'; date = addDays(date, 1)) {
      const current = getIsoWeek(date)
      if (getIsoWeekday(date) !== 1) {
        assert.deepEqual(current, previous, date)
      } else if (current.week === 1) {
        assert.ok(previous.week === 52 || previous.week === 53, date)
        assert.equal(current.year, previous.year + 1, date)
      } else {
        assert.deepEqual(current, { year: previous.year, week: previous.week + 1 }, date)
      }
      previous = current
    }
  })
})
