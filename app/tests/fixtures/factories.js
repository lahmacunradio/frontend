// Builders shaped like one entry of GET {arcsiShowsBaseURL}/all_schedule (DEV, verified 2026-10-13).
// No default `week`: the pre-4-week UI never reads it, so fixtures add it only when it matters.

export const makeItem = overrides => ({
  archived: true,
  description: 'Fixture episode',
  download_count: 0,
  id: 1,
  image_url: 'https://media.lahmacun.hu/fixture/episode.jpeg',
  name: 'Fixture Episode',
  name_slug: 'fixture_episode',
  number: 1,
  play_date: '2026-09-01',
  play_file_name: 'fixture-episode.mp3',
  ...overrides
})

export const makeShow = overrides => ({
  active: true,
  archive_lahmastore_base_url: 'fixture-show',
  cover_image_url: 'https://media.lahmacun.hu/fixture/cover.jpeg',
  day: 1,
  description: 'Fixture show',
  end: '19:00:00',
  frequency: 4,
  id: 0,
  items: makeItem(),
  language: 'en_en',
  name: 'Fixture Show',
  playlist_name: 'Fixture show',
  start: '18:00:00',
  ...overrides
})
