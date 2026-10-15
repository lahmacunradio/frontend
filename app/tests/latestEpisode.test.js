import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getLatestEpisode,
  latestEpisodeDescription,
  latestEpisodeLink,
  latestEpisodeTitle
} from '../plugins/latestEpisode.js'
import { makeItem, makeShow } from './fixtures/factories.js'
import { scheduleWeeks } from './fixtures/scheduleWeeks.js'

const fixtureShow = id => scheduleWeeks.find(show => show.id === id)

const withEpisode = makeShow({
  name: 'Show Name',
  description: 'Show description',
  archive_lahmastore_base_url: 'show-name',
  items: makeItem({ name: 'Episode 12', name_slug: 'episode_12', description: 'Episode description' })
})

// All shapes that mean "no episode": `[]` is what the server sends (verified on DEV 2026-10-14),
// `null`, a missing key and `{}` are defensive.
const withoutEpisode = {
  'empty array': makeShow({ name: 'Show Name', description: 'Show description', archive_lahmastore_base_url: 'show-name', items: [] }),
  'empty object': makeShow({ name: 'Show Name', description: 'Show description', archive_lahmastore_base_url: 'show-name', items: {} }),
  'null (fixture 9008)': fixtureShow(9008),
  'missing key (fixture 9009)': fixtureShow(9009)
}

describe('getLatestEpisode', () => {
  test('returns the embedded episode object', () => {
    assert.equal(getLatestEpisode(withEpisode), withEpisode.items)
  })

  for (const [shape, show] of Object.entries(withoutEpisode)) {
    test(`returns null when items is ${shape}`, () => {
      assert.equal(getLatestEpisode(show), null)
    })
  }
})

describe('latestEpisodeTitle', () => {
  test('uses the episode name', () => {
    assert.equal(latestEpisodeTitle(withEpisode), 'Episode 12')
  })

  test('falls back to the show name when the episode has no name', () => {
    assert.equal(latestEpisodeTitle(makeShow({ name: 'Show Name', items: makeItem({ name: '' }) })), 'Show Name')
  })

  for (const [shape, show] of Object.entries(withoutEpisode)) {
    test(`falls back to the show name when items is ${shape}`, () => {
      assert.equal(latestEpisodeTitle(show), show.name)
    })
  }
})

describe('latestEpisodeLink', () => {
  test('links to the episode page', () => {
    assert.equal(latestEpisodeLink(withEpisode), '/shows/show-name/episode_12')
  })

  for (const [shape, show] of Object.entries(withoutEpisode)) {
    test(`links to the show page when items is ${shape}`, () => {
      assert.equal(latestEpisodeLink(show), '/shows/' + show.archive_lahmastore_base_url)
    })
  }
})

describe('latestEpisodeDescription', () => {
  test('uses the episode description', () => {
    assert.equal(latestEpisodeDescription(withEpisode), 'Episode description')
  })

  test('falls back to the show description when the episode has none', () => {
    const show = makeShow({ description: 'Show description', items: makeItem({ description: null }) })
    assert.equal(latestEpisodeDescription(show), 'Show description')
  })

  for (const [shape, show] of Object.entries(withoutEpisode)) {
    test(`falls back to the show description when items is ${shape}`, () => {
      assert.equal(latestEpisodeDescription(show), show.description)
    })
  }
})
