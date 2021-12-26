import { arcsiServerURL } from '~/constants'

export const state = () => ({
  arcsiShows: {},
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
        error({ statusCode: 404, message: 'Latest news not found' })
      })
  }
}
