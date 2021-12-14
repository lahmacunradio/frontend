import { arcsiServerURL, newsURL } from '~/constants'

export const state = () => ({
  arcsiShows: {},
  newsList: {},
  arcsiEpisodes: null,
  aboutUs: null
})

export const actions = {
  async nuxtServerInit ({ state }, { $sentry, error }) {
    await this.$axios.get(arcsiServerURL)
      .then((res) => {
        state.arcsiShows = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Post not found' })
      })
    await this.$axios.get(newsURL)
      .then((res) => {
        state.newsList = res.data
      })
      .catch((e) => {
        $sentry.captureException(e)
        error({ statusCode: 404, message: 'Latest news not found' })
      })
  }
}
