// Latest episode of a show from GET {arcsiShowsBaseURL}/all_schedule.
// The server already picks it (newest archived episode aired more than a day ago) and sends it
// as `items`: a single object, or `[]` when the show has none. `null` / missing / `{}` are handled defensively.
// Plain module, not a Nuxt plugin: import it directly, don't register it in nuxt.config.js.

// Only an object with an `id` counts as an episode; `[]` and `{}` have none.
export function getLatestEpisode (show) {
  const episode = show.items
  return episode?.id ? episode : null
}

export function latestEpisodeTitle (show) {
  return getLatestEpisode(show)?.name || show.name
}

export function latestEpisodeLink (show) {
  const showLink = '/shows/' + show.archive_lahmastore_base_url
  const episodeSlug = getLatestEpisode(show)?.name_slug
  return episodeSlug ? `${showLink}/${episodeSlug}` : showLink
}

export function latestEpisodeDescription (show) {
  return getLatestEpisode(show)?.description || show.description
}
