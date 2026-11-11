import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { getBudapestDate, getBudapestWeekday } from '../plugins/budapestTime.js'
import { withFixedNow } from './helpers/fixedClock.js'

// Budapest is UTC+2 until 2026-10-25 03:00, UTC+1 after
const at = iso => new Date(iso)

describe('getBudapestDate', () => {
  test('returns the Budapest calendar date as YYYY-MM-DD', () => {
    assert.equal(getBudapestDate(at('2026-10-12T10:00:00Z')), '2026-10-12')
    assert.equal(getBudapestDate(at('2026-03-05T10:00:00Z')), '2026-03-05') // zero-padded
  })

  test('rolls over at Budapest midnight, before and after the DST change', () => {
    assert.equal(getBudapestDate(at('2026-10-18T21:30:00Z')), '2026-10-18') // Sun 23:30 CEST
    assert.equal(getBudapestDate(at('2026-10-18T22:30:00Z')), '2026-10-19') // Mon 00:30 CEST
    assert.equal(getBudapestDate(at('2026-10-25T22:30:00Z')), '2026-10-25') // Sun 23:30 CET
    assert.equal(getBudapestDate(at('2026-10-25T23:30:00Z')), '2026-10-26') // Mon 00:30 CET
  })

  test('rolls over the year', () => {
    assert.equal(getBudapestDate(at('2026-12-31T23:30:00Z')), '2027-01-01')
  })

  test('defaults to now', () => {
    assert.equal(withFixedNow('2026-10-12T10:00:00Z', () => getBudapestDate()), '2026-10-12')
  })
})

describe('getBudapestWeekday', () => {
  test('returns JS weekday, 0 = Sunday', () => {
    assert.equal(getBudapestWeekday(at('2026-10-18T10:00:00Z')), 0)
    assert.equal(getBudapestWeekday(at('2026-10-12T10:00:00Z')), 1)
    assert.equal(getBudapestWeekday(at('2026-10-17T10:00:00Z')), 6)
  })

  test('rolls over at Budapest midnight, not UTC midnight', () => {
    assert.equal(getBudapestWeekday(at('2026-10-25T22:30:00Z')), 0) // Sun 23:30 Budapest
    assert.equal(getBudapestWeekday(at('2026-10-25T23:30:00Z')), 1) // Mon 00:30 Budapest
  })

  test('defaults to now', () => {
    assert.equal(withFixedNow('2026-10-14T10:00:00Z', () => getBudapestWeekday()), 3)
  })
})
