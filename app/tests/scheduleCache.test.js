import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { ERROR, LOADING, needsFetch, weekIndexesToRefresh } from '../plugins/scheduleCache.js'

// 2026-10-19 = W43 -> 3 (D), 2026-10-26 = W44 -> 0 (A)
const W43_MONDAY = '2026-10-19'
const W44_MONDAY = '2026-10-26'

describe('needsFetch', () => {
  test('a week never requested is fetched', () => {
    assert.equal(needsFetch({}, {}, 2), true)
  })

  test('a loaded week is not fetched again', () => {
    assert.equal(needsFetch({ 2: [] }, {}, 2), false)
  })

  test('a week on its way is not requested twice', () => {
    assert.equal(needsFetch({}, { 2: LOADING }, 2), false)
  })

  test('a failed week without data is retried', () => {
    assert.equal(needsFetch({}, { 2: ERROR }, 2), true)
  })

  test('a week whose refresh failed keeps its stale data, no extra fetch', () => {
    assert.equal(needsFetch({ 2: [] }, { 2: ERROR }, 2), false)
  })

  // Store keys survive SSR serialization as strings
  test('works with string keys', () => {
    assert.equal(needsFetch(JSON.parse('{"2":[]}'), {}, 2), false)
  })
})

describe('weekIndexesToRefresh', () => {
  test('nothing loaded: only today\'s week', () => {
    assert.deepEqual(weekIndexesToRefresh({}, {}, W43_MONDAY), [3])
  })

  test('today\'s week plus every loaded week, once each, ascending', () => {
    assert.deepEqual(weekIndexesToRefresh({ 3: [], 1: [], 0: [] }, {}, W43_MONDAY), [0, 1, 3])
  })

  test('after the rollover the new week is included before it was ever loaded', () => {
    assert.deepEqual(weekIndexesToRefresh({ 3: [] }, {}, W44_MONDAY), [0, 3])
  })

  test('a failed week is retried', () => {
    assert.deepEqual(weekIndexesToRefresh({}, { 3: ERROR }, W43_MONDAY), [3])
  })

  test('in-flight weeks are skipped', () => {
    assert.deepEqual(weekIndexesToRefresh({ 1: [] }, { 1: LOADING, 3: LOADING }, W43_MONDAY), [])
  })

  // 2026-W53 and 2027-W01 are both index 1 (B)
  test('W53 and the next W01 map to the same entry', () => {
    assert.deepEqual(weekIndexesToRefresh({ 1: [] }, {}, '2027-01-04'), [1])
  })

  test('no today yet: loaded weeks only', () => {
    assert.deepEqual(weekIndexesToRefresh({ 2: [] }, {}, ''), [2])
  })

  test('does not mutate its input', () => {
    const shows = { 1: [] }
    const status = { 1: ERROR }
    weekIndexesToRefresh(shows, status, W43_MONDAY)

    assert.deepEqual(shows, { 1: [] })
    assert.deepEqual(status, { 1: ERROR })
  })
})
